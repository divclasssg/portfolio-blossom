// 날짜 문자열에서 'YYYY-MM-DD' 부분만 추출
export function toDateKey(isoString) {
    return isoString.slice(0, 10);
}

// 최근 7일 웨어러블 데이터 추출 (날짜순)
export function getLast7Days(wearableHistory) {
    if (!wearableHistory || wearableHistory.length === 0) return [];
    return wearableHistory
        .slice()
        .sort((a, b) => a.recorded_at.localeCompare(b.recorded_at))
        .slice(-7);
}

// 증상 기록에서 날짜별 최대 강도 맵 생성
export function buildSymptomMap(symptomRecords, dateKeys) {
    const map = {};
    if (!symptomRecords) return map;
    const dateSet = new Set(dateKeys);
    for (const record of symptomRecords) {
        const key = toDateKey(record.occurred_at);
        if (!dateSet.has(key)) continue;
        map[key] = Math.max(map[key] ?? 0, record.severity);
    }
    return map;
}

// 인사이트 생성 (우선순위 규칙 기반)
export function generateInsight(last7, vitals, symptomMap) {
    if (last7.length === 0) return null;

    const sleepValues = last7.map((d) => d.sleep_hours);
    const avgSleep = sleepValues.reduce((a, b) => a + b, 0) / sleepValues.length;
    const hrValues = last7.map((d) => d.heart_rate_bpm);
    const avgHr = hrValues.reduce((a, b) => a + b, 0) / hrValues.length;

    // 우선순위 1: 수면 부족일에 증상 발생 비율 ≥ 50%
    const lowSleepDays = last7.filter((d) => d.sleep_hours < 6);
    const symptomOnLowSleep = lowSleepDays.filter((d) => symptomMap[toDateKey(d.recorded_at)]);
    if (lowSleepDays.length >= 2 && symptomOnLowSleep.length / lowSleepDays.length >= 0.5) {
        return '수면이 부족한 날에 증상이 더 자주 나타나고 있어요.';
    }

    // 우선순위 2: 7일 평균 수면 < 6h
    if (avgSleep < 6) {
        return `이번 주 평균 수면이 ${avgSleep.toFixed(1)}시간이에요. 충분한 수면이 컨디션 관리에 도움이 됩니다.`;
    }

    // 우선순위 3: 오늘 심박수 > 7일 평균 + 10
    if (vitals.heart_rate_bpm > avgHr + 10) {
        return '오늘 심박수가 평소보다 높아요. 컨디션을 살펴보세요.';
    }

    // 우선순위 4: 오늘 혈압 높음
    if (vitals.bp_systolic >= 130 || vitals.bp_diastolic >= 85) {
        return '오늘 혈압이 다소 높아요. 편안히 쉬어보세요.';
    }

    // 우선순위 5: 7일 평균 수면 < 7h
    if (avgSleep < 7) {
        return '이번 주 수면이 권장량보다 조금 부족해요.';
    }

    // 우선순위 6: 정상
    return '이번 주 건강 수치가 안정적이에요.';
}
