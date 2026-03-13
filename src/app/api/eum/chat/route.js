/**
 * POST /api/eum/chat — GPT-4o mini SSE 스트리밍 대화
 * 환자와 AI가 대화하며 증상을 구조화 수집
 *
 * 스트리밍 프로토콜:
 *   data: {"type":"token","content":"..."} — 텍스트 토큰
 *   data: {"type":"meta","showSeverityChips":true} — UI 제어
 *   data: {"type":"done","completed":false} — 응답 완료 (대화 계속)
 *   data: {"type":"done","completed":true,"symptomRecord":{...}} — 수집 완료
 */

import OpenAI from 'openai';
import { getSupabaseClient } from '../_lib/supabase';

export const maxDuration = 60;

// 중괄호 깊이 카운팅으로 중첩 JSON 안전 추출
function extractJsonTag(content, tagName) {
  const prefix = `[${tagName}:`;
  const startIdx = content.indexOf(prefix);
  if (startIdx === -1) return null;

  let depth = 0;
  const jsonStart = startIdx + prefix.length;
  for (let i = jsonStart; i < content.length; i++) {
    if (content[i] === '{') depth++;
    else if (content[i] === '}') depth--;
    if (depth === 0) {
      try {
        return JSON.parse(content.slice(jsonStart, i + 1));
      } catch {
        console.warn(`[chat/route] ${tagName} 태그 JSON 파싱 실패:`, content.slice(jsonStart, i + 1));
        return null;
      }
    }
  }
  console.warn(`[chat/route] ${tagName} 태그 닫힘 없음:`, content.slice(startIdx, startIdx + 100));
  return null;
}

const SYSTEM_PROMPT = `당신은 이음(Eum) 의료 앱의 증상 수집 어시스턴트입니다.
환자가 현재 느끼는 증상을 자연스러운 대화로 수집합니다.

목표: 다음 4가지 정보를 단계적으로 수집합니다.
1. 증상 설명 (어떤 증상인지)
2. 심각도 (1~4단계)
3. 언제 시작됐는지
4. 어디서 발생했는지 (HOME/WORK/OUTSIDE)

규칙:
- 한국어로 대화합니다.
- 대화체, 차분하고 중립적인 톤 사용 ("~해요", "~군요" 형식)
- "진단", "확진" 표현 금지. "참고", "관련 가능성"으로 대체
- 한 번에 한 가지 질문만 합니다
- 심각도를 물을 때: "증상이 어느 정도인지 선택해 주세요" 라고 안내하고 showSeverityChips 신호 발송
- 4가지 정보가 모두 수집되면 completed: true와 구조화된 symptomRecord를 반환

심각도 기준 (환자에게 설명할 때):
1단계: 일상생활에 지장 없음
2단계: 신경 쓰이지만 일상 가능
3단계: 일상생활에 지장 있음
4단계: 매우 심해서 즉각 대처 필요

응답 형식:
- 일반 대화: 텍스트만 반환
- 심각도 질문 시: 텍스트 끝에 JSON 태그 추가 → [META:{"showSeverityChips":true}]
- 수집 완료 시: 텍스트 끝에 JSON 태그 추가 → [DONE:{"completed":true,"symptomRecord":{"description":"...","severity":N,"occurredAt":"ISO8601","locationType":"HOME|WORK|OUTSIDE","categoryCode":"SYM-05|SYM-07|SYM-12"}}]
  categoryCode: SYM-05(소화기), SYM-07(호흡기/이비인후), SYM-12(신경계/심혈관)`;

export async function POST(request) {
  const { messages, patientId, sessionId } = await request.json();

  if (!patientId || !sessionId) {
    return new Response('patientId and sessionId are required', { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return new Response('OPENAI_API_KEY not configured', { status: 500 });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // SSE 스트림 생성
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          stream: true,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages,
          ],
        });

        let fullContent = '';
        // 태그는 여러 토큰에 걸쳐 분할될 수 있으므로 '[' 이후 버퍼링
        let pending = '';

        for await (const chunk of completion) {
          const token = chunk.choices[0]?.delta?.content;
          if (!token) continue;

          fullContent += token;
          pending += token;

          // pending에서 안전한 부분(태그 아닌 부분)을 클라이언트에 전송
          while (pending.length > 0) {
            const bracketIdx = pending.indexOf('[');

            if (bracketIdx === -1) {
              // '[' 없음 — 전체 전송
              send({ type: 'token', content: pending });
              pending = '';
              break;
            }

            if (bracketIdx > 0) {
              // '[' 이전 부분은 안전하게 전송
              send({ type: 'token', content: pending.slice(0, bracketIdx) });
              pending = pending.slice(bracketIdx);
            }

            // pending이 '['로 시작하는 상태
            const closingIdx = pending.indexOf(']');
            if (closingIdx === -1) {
              // 아직 태그 닫힘 없음 — 더 기다림
              break;
            }

            const potentialTag = pending.slice(0, closingIdx + 1);
            if (potentialTag.startsWith('[META:') || potentialTag.startsWith('[DONE:')) {
              // 태그 확인 — 전송하지 않고 소비
              pending = pending.slice(closingIdx + 1);
            } else {
              // 태그가 아닌 '[...]' — 그대로 전송
              send({ type: 'token', content: potentialTag });
              pending = pending.slice(closingIdx + 1);
            }
          }
        }

        // 남은 pending 처리 (태그가 아닌 경우만 전송)
        if (pending && !pending.startsWith('[META:') && !pending.startsWith('[DONE:')) {
          send({ type: 'token', content: pending });
        }

        // 스트리밍 완료 후 태그 파싱 (중첩 JSON 안전 파서 사용)
        const metaParsed = extractJsonTag(fullContent, 'META');
        const doneParsed = extractJsonTag(fullContent, 'DONE');

        const assistantText = fullContent
          .replace(/\[META:.*?\]/gs, '')
          .replace(/\[DONE:.*?\]/gs, '')
          .trim();

        // meta 신호 전송 (심각도 칩 표시)
        if (metaParsed) {
          send({ type: 'meta', ...metaParsed });
        }

        // done 신호 전송
        let donePayload = { type: 'done', completed: false };
        if (doneParsed) {
          donePayload = { type: 'done', ...doneParsed };
        } else {
          console.warn('[chat/route] DONE 태그 미발견. fullContent 끝:', fullContent.slice(-200));
        }
        console.log('[chat/route] donePayload:', JSON.stringify(donePayload));
        send(donePayload);

        // 메시지 DB 저장 (비동기, 스트림 응답 차단 안 함)
        saveMessages({ patientId, sessionId, userMessages: messages, assistantText, donePayload });

      } catch (err) {
        console.error('[chat/route] 스트리밍 오류:', err.message);
        send({ type: 'error', message: err.message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

// 채팅 메시지 Supabase 저장
async function saveMessages({ patientId, sessionId, userMessages, assistantText, donePayload }) {
  try {
    const supabase = getSupabaseClient();
    const rows = [];

    // 마지막 사용자 메시지만 저장 (이전 메시지는 이미 저장됨)
    const lastUser = userMessages.at(-1);
    if (lastUser?.role === 'user') {
      rows.push({
        patient_id: patientId,
        session_id: sessionId,
        role: 'user',
        content: lastUser.content,
      });
    }

    // AI 응답 저장
    rows.push({
      patient_id: patientId,
      session_id: sessionId,
      role: 'assistant',
      content: assistantText,
      metadata: donePayload.completed
        ? { completed: true, symptomRecord: donePayload.symptomRecord }
        : null,
    });

    await supabase.from('chat_messages').insert(rows);
  } catch (err) {
    console.warn('[chat/route] 메시지 저장 실패:', err.message);
  }
}
