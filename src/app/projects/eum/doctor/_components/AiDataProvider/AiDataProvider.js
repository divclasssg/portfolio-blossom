'use client';

import { useState, useEffect } from 'react';
import AiBriefing from '../AiBriefing/AiBriefing';
import AiSuggestions from '../AiSuggestions/AiSuggestions';
import AiWarningBanner from '../AiWarningBanner/AiWarningBanner';
import { AiIcon } from '../../../_components/icons';
import styles from './AiDataProvider.module.scss';

// 파이프라인 5단계에 대응하는 프로그레시브 로딩 단계
// 각 단계는 약 8초 간격으로 전환 (총 90초 타임아웃 커버)
const LOADING_STEPS = [
    { message: '증상 기록을 분석하고 있습니다...', progress: 15, estimate: '약 30초 남음' },
    { message: '관련 질환을 검색하고 있습니다...', progress: 40, estimate: '약 20초 남음' },
    { message: '임상 근거를 확인하고 있습니다...', progress: 65, estimate: '약 15초 남음' },
    { message: '분석 보고서를 작성하고 있습니다...', progress: 85, estimate: '거의 완료' },
];
const MSG_INTERVAL_MS = 8000;

/**
 * AI 파이프라인 데이터 프로바이더
 * - initialBriefing/initialSuggestions 제공 시: DB 캐시 결과 즉시 표시 (파이프라인 재호출 없음)
 * - 미제공 시: /api/eum/pipeline 호출, 프로그레시브 로딩 메시지
 * - 실패: fallback 정적 JSON으로 AI 섹션 렌더링
 */
export default function AiDataProvider({
    fallbackBriefing,
    fallbackSuggestions,
    warnings,
    initialBriefing = null, // Supabase에서 미리 로드한 브리핑 (있으면 파이프라인 스킵)
    initialSuggestions = null,
    patientId = null,
}) {
    const [briefing, setBriefing] = useState(initialBriefing);
    const [suggestions, setSuggestions] = useState(initialSuggestions);
    const [isLoading, setIsLoading] = useState(!initialBriefing);
    const [msgIdx, setMsgIdx] = useState(0);

    useEffect(() => {
        // DB 캐시 결과가 있으면 파이프라인 재호출 없음
        if (initialBriefing) return;

        // 프로그레시브 단계 순환
        const interval = setInterval(() => {
            setMsgIdx((i) => Math.min(i + 1, LOADING_STEPS.length - 1));
        }, MSG_INTERVAL_MS);

        // Pre-warming: Modal 컨테이너 wake-up (fire-and-forget)
        fetch('/api/eum/warmup').catch(() => {});

        // /api/eum/pipeline 호출
        fetch('/api/eum/pipeline', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ patientId }),
        })
            .then((res) => {
                if (!res.ok) throw new Error(`Pipeline error: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setBriefing(data.briefing || fallbackBriefing);
                setSuggestions(data.suggestions || fallbackSuggestions);
            })
            .catch((e) => {
                console.error('[AiDataProvider] Pipeline failed, using fallback:', e.message);
                setBriefing(fallbackBriefing);
                setSuggestions(fallbackSuggestions);
            })
            .finally(() => {
                clearInterval(interval);
                setIsLoading(false);
            });

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) {
        const step = LOADING_STEPS[msgIdx];

        return (
            <div className={styles['loading-wrapper']} role="status" aria-live="polite">
                <div
                    className={styles['progress-bar-track']}
                    role="progressbar"
                    aria-valuenow={step.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    <div
                        className={styles['progress-bar-fill']}
                        style={{ width: `${step.progress}%` }}
                    />
                </div>
                <div className={styles['progress-info']}>
                    <span className={styles['progress-percent']}>{step.progress}%</span>
                    <span className={styles['progress-estimate']}>{step.estimate}</span>
                </div>
                <p className={styles['loading-message']}>{step.message}</p>
            </div>
        );
    }

    const activeBriefing = briefing || fallbackBriefing;
    const activeSuggestions = suggestions || fallbackSuggestions;

    return (
        <section className="section">
            <div className="section-content">
                <div className="section-header">
                    <AiIcon size={24} />
                    <h2 className="section-title">AI Analysis</h2>
                </div>

                <AiBriefing briefing={activeBriefing} />

                <AiSuggestions
                    suggestions={activeSuggestions.suggestions}
                    modelVersion={activeSuggestions.model_version}
                />

                {/* AI 경고 — 닫기 불가, 영구 노출 */}
                <div className={styles['warnings-area']}>
                    <AiWarningBanner warnings={warnings} />
                </div>
            </div>
        </section>
    );
}
