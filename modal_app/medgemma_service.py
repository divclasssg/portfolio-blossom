"""
이음 AI 파이프라인 — Stage 4: MedGemma 임상 랭킹 서비스
Modal serverless GPU로 배포 (scale-to-zero)

배포 전 필요:
  1. HuggingFace MedGemma 접근 승인 (https://huggingface.co/google/medgemma-4b-it)
  2. Modal 계정 설정:
       pip install modal
       modal setup
  3. HuggingFace 토큰 설정:
       modal secret create huggingface HF_TOKEN=hf_...
  4. 배포:
       modal deploy modal_app/medgemma_service.py
     → 출력된 URL을 .env.local의 MODAL_ENDPOINT_URL에 기입

예시 요청:
  POST {MODAL_ENDPOINT_URL}
  Content-Type: application/json
  { "candidates": [...], "patient_data": {...} }

  POST {MODAL_ENDPOINT_URL}
  { "warmup": true }   # pre-warming 전용
"""

import modal
import json
from typing import Any

# ── 모델 다운로드 함수 (run_function은 lambda 불가 — named function 필요) ──
def download_model():
    from huggingface_hub import snapshot_download
    snapshot_download(
        repo_id="google/medgemma-4b-it",
        local_dir="/model",
    )


# ── 이미지 정의 ────────────────────────────────────────────────
# 모델은 이미지 빌드 시 다운로드 → 콜드 스타트 최소화
image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(
        "torch>=2.2.0",
        "transformers>=4.40.0",
        "accelerate>=0.27.0",
        "huggingface_hub>=0.22.0",
        "bitsandbytes>=0.43.0",  # 4-bit 양자화
        "fastapi[standard]",
    )
    .run_function(
        download_model,
        secrets=[modal.Secret.from_name("huggingface")],
    )
)

app = modal.App("eum-medgemma", image=image)

# ── 시스템 프롬프트 ─────────────────────────────────────────────
SYSTEM_PROMPT = """You are a clinical AI assistant for differential diagnosis ranking.
Given patient data and ICD-11 candidate diseases, rank the top 5 candidates based on:
1. Evidence from symptom records
2. Clinical history and wearable data
3. Known disease patterns and epidemiology

Respond in JSON only. Language: Korean for disease names and notes."""

# ── MedGemma 클래스 ─────────────────────────────────────────────
@app.cls(
    gpu="T4",          # T4: 비용 효율적 (A10G로 업그레이드 가능)
    scaledown_window=300,  # 5분 비활성 후 scale-to-zero
    secrets=[modal.Secret.from_name("huggingface")],
)
class MedGemmaRanker:
    @modal.enter()
    def load_model(self):
        """컨테이너 시작 시 1회 모델 로드"""
        import torch
        from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig

        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_use_double_quant=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.bfloat16,
        )

        self.tokenizer = AutoTokenizer.from_pretrained("/model")
        self.model = AutoModelForCausalLM.from_pretrained(
            "/model",
            quantization_config=bnb_config,
            device_map="auto",
        )
        self.model.eval()
        print("[MedGemma] Model loaded successfully")

    @modal.web_endpoint(method="POST")
    def rank(self, body: dict[str, Any]) -> dict:
        """
        임상 랭킹 엔드포인트

        Input: { candidates: [...], patient_data: {...} }
        Output: { suggestions: [{rank, disease_name, icd_code, evidence_symptoms, confidence, clinical_note}, ...] }

        warmup 요청: { warmup: true } → 즉시 { status: "ready" } 반환
        """
        import torch
        import re

        # Pre-warming 요청 처리
        if body.get("warmup"):
            return {"status": "ready"}

        candidates = body.get("candidates", [])
        patient_data = body.get("patient_data", {})

        if not candidates:
            return {"suggestions": [], "error": "no candidates"}

        # 프롬프트 구성
        prompt = f"""{SYSTEM_PROMPT}

Patient Data:
{json.dumps(patient_data, ensure_ascii=False, indent=2)}

ICD-11 Candidate Diseases:
{json.dumps(candidates, ensure_ascii=False, indent=2)}

Rank the top 5 candidates. Return JSON:
{{
  "suggestions": [
    {{
      "rank": 1,
      "disease_name": "질환명 (한국어)",
      "icd_code": "ICD코드",
      "evidence_symptoms": ["근거 증상 1", "근거 증상 2"],
      "confidence": "high|medium|low",
      "clinical_note": "임상 소견 (한국어)"
    }}
  ]
}}"""

        # Tokenize
        inputs = self.tokenizer(
            prompt,
            return_tensors="pt",
            truncation=True,
            max_length=4096,
        ).to("cuda")

        # Generate
        with torch.inference_mode():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=1024,
                temperature=0.1,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id,
            )

        # Decode — 입력 토큰 제외
        generated = self.tokenizer.decode(
            outputs[0][inputs["input_ids"].shape[1]:],
            skip_special_tokens=True,
        )

        # JSON 추출
        # 모델 출력에서 JSON 객체 추출 (첫 { ~ 마지막 })
        json_match = re.search(r"\{.*\}", generated, re.DOTALL)
        if not json_match:
            return {"suggestions": [], "error": "failed to parse JSON from model output", "raw": generated[:500]}

        try:
            result = json.loads(json_match.group())
            # model_version 추가
            result["model_version"] = "MedGemma 4B"
            return result
        except json.JSONDecodeError as e:
            return {"suggestions": [], "error": f"JSON decode error: {e}", "raw": generated[:500]}
