// ── 결정적 PRNG (mulberry32) ──
// 같은 시드 → 같은 난수 시퀀스. 페이지 새로고침해도 동일한 데이터.
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

/** 날짜 문자열 → 정수 해시 (PRNG 시드용) */
function dateToSeed(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash + dateStr.charCodeAt(i)) | 0;
  }
  return hash;
}

/** 시드 기반 정수 랜덤 (min 이상 max 이하) */
function randInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/** 시드 기반 소수 랜덤 (소수점 1자리) */
function randFloat1(rng, min, max) {
  return Math.round((rng() * (max - min) + min) * 10) / 10;
}

// ── KST "오늘" 계산 ──
export function getKstToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date());
}

/** YYYY-MM-DD에서 n일 전 날짜 */
export function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// ── 플레어 판정 ──
// sin 웨이브 기반 ~11일 주기. 임계값 초과 시 플레어.
function isFlareDay(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z');
  // 2026-01-01 기준 dayIndex
  const epoch = Date.UTC(2026, 0, 1);
  const dayIndex = Math.round((d.getTime() - epoch) / 86_400_000);
  return Math.sin(dayIndex * 0.55) > 0.85;
}

// ── 증상 템플릿 ──
const TEMPLATES_MILD = [
  { desc: '속이 좀 더부룩하지만 약 먹고 나니 나아졌어요.', cat: 'SYM-05' },
  { desc: '식후에 신물이 올라왔지만 30분 정도 후에 가라앉았습니다.', cat: 'SYM-05' },
  { desc: '오늘은 컨디션이 괜찮은 편이에요. 약간 더부룩한 정도입니다.', cat: 'SYM-05' },
  { desc: '트림이 자주 나고 목에 이물감이 조금 있습니다.', cat: 'SYM-07' },
  { desc: '아침에 속이 불편했는데 따뜻한 물 마시니 나아졌습니다.', cat: 'SYM-05' },
];

const TEMPLATES_MODERATE = [
  { desc: '새벽에 가슴 통증으로 잠에서 깼습니다. 상체를 세우면 조금 나아집니다.', cat: 'SYM-05' },
  { desc: '명치 부위 통증이 2시간째 지속 중입니다. 약을 먹었지만 아직 효과가 없습니다.', cat: 'SYM-05' },
  { desc: '갑자기 어지럽고 가슴이 두근거려서 잠시 앉아 있었습니다.', cat: 'SYM-12' },
  { desc: '속이 울렁거리면서 식은땀이 났습니다. 스트레스가 원인인 것 같습니다.', cat: 'SYM-05' },
  { desc: '밤새 역류 때문에 잠을 설쳤습니다. 수면 자세를 바꿔봐도 안 됩니다.', cat: 'SYM-05' },
];

const TEMPLATES_SEVERE = [
  { desc: '명치 통증이 등까지 퍼지고 3시간 넘게 지속 중입니다. 진통제도 효과 없습니다.', cat: 'SYM-05' },
  { desc: '하루 종일 구역감과 속쓰림이 반복됩니다. 물만 마셔도 역류가 올라옵니다.', cat: 'SYM-05' },
  { desc: '새벽 3시에 극심한 가슴 통증으로 깨서 응급실을 고민했습니다.', cat: 'SYM-05' },
  { desc: '어지러움과 심박 이상이 반복됩니다. 불안해서 아무것도 할 수가 없습니다.', cat: 'SYM-12' },
  { desc: '식사를 거의 못 하고 있습니다. 먹으면 바로 역류가 시작됩니다.', cat: 'SYM-05' },
];

// 증상 발생 시각 후보 (HH:MM:SS)
const TIME_SLOTS = ['03:20:00', '04:15:00', '08:40:00', '13:45:00', '15:30:00', '18:00:00', '21:00:00'];

// ── 바이탈 생성 ──
export function generateDayVitals(dateStr) {
  const rng = mulberry32(dateToSeed('v' + dateStr));
  const flare = isFlareDay(dateStr);

  return {
    recorded_at: `${dateStr}T08:00:00+09:00`,
    heart_rate_bpm: flare ? randInt(rng, 85, 94) : randInt(rng, 71, 82),
    bp_systolic: flare ? randInt(rng, 126, 134) : randInt(rng, 110, 122),
    bp_diastolic: flare ? randInt(rng, 80, 88) : randInt(rng, 70, 78),
    sleep_hours: flare ? randFloat1(rng, 3.5, 5.0) : randFloat1(rng, 5.5, 7.5),
    step_count: flare ? randInt(rng, 3000, 5500) : randInt(rng, 6000, 11000),
    body_temp_c: flare ? randFloat1(rng, 36.6, 36.8) : randFloat1(rng, 36.3, 36.6),
    spo2_percent: flare ? randInt(rng, 96, 97) : randInt(rng, 97, 99),
    source_platform: 'APPLE_HEALTH',
  };
}

// ── 증상 생성 ──
export function generateDaySymptom(dateStr, index) {
  const rng = mulberry32(dateToSeed('s' + dateStr));
  const flare = isFlareDay(dateStr);

  // 발생 확률: 정상 40%, 플레어 80%
  if (rng() > (flare ? 0.8 : 0.4)) return null;

  const severity = flare ? randInt(rng, 3, 4) : randInt(rng, 1, 2);

  let pool;
  if (severity <= 2) pool = TEMPLATES_MILD;
  else if (severity === 3) pool = TEMPLATES_MODERATE;
  else pool = TEMPLATES_SEVERE;

  const template = pool[randInt(rng, 0, pool.length - 1)];
  const time = TIME_SLOTS[randInt(rng, 0, TIME_SLOTS.length - 1)];
  const locationTypes = ['HOME', 'WORK', 'OUTSIDE'];

  return {
    symptom_id: `sym_gen_${index.toString().padStart(3, '0')}`,
    description: template.desc,
    voice_transcript: null,
    photo_urls: [],
    occurred_at: `${dateStr}T${time}+09:00`,
    severity,
    category_code: template.cat,
    location_type: locationTypes[randInt(rng, 0, 2)],
    location_gps: null,
  };
}

// ── Public API ──

/**
 * 최근 days일간 바이탈 데이터를 생성한다.
 * 반환 형태는 07_vitals_wearable.json과 동일.
 */
export function generateVitals(days = 30) {
  const today = getKstToday();
  const records = [];
  for (let i = days - 1; i >= 0; i--) {
    records.push(generateDayVitals(addDays(today, -i)));
  }
  return { patient_id: 'pat_yoon_001', health_platform: records };
}

/**
 * 최근 days일간 증상 기록을 생성한다.
 * 반환 형태는 03_symptom_records.json과 동일.
 */
export function generateSymptoms(days = 30) {
  const today = getKstToday();
  const records = [];
  let idx = 1;
  for (let i = days - 1; i >= 0; i--) {
    const sym = generateDaySymptom(addDays(today, -i), idx);
    if (sym) {
      records.push(sym);
      idx++;
    }
  }
  return { patient_id: 'pat_yoon_001', symptom_records: records };
}

/**
 * 오늘 기준 대시보드 스냅샷을 생성한다.
 * 반환 형태는 08_home_dashboard.json과 동일.
 */
export function generateDashboard() {
  const today = getKstToday();
  const vitals = generateDayVitals(today);
  const symptoms = generateSymptoms(7);
  const recentRecords = symptoms.symptom_records;
  const last = recentRecords.length > 0 ? recentRecords[recentRecords.length - 1] : null;

  // 최근 7일 평균 심각도
  const avgSeverity =
    recentRecords.length > 0
      ? Math.round((recentRecords.reduce((sum, r) => sum + r.severity, 0) / recentRecords.length) * 10) / 10
      : 0;

  // 추세 판정
  let trend = 'stable';
  if (recentRecords.length >= 2) {
    const half = Math.floor(recentRecords.length / 2);
    const firstHalf = recentRecords.slice(0, half);
    const secondHalf = recentRecords.slice(half);
    const avg1 = firstHalf.reduce((s, r) => s + r.severity, 0) / firstHalf.length;
    const avg2 = secondHalf.reduce((s, r) => s + r.severity, 0) / secondHalf.length;
    if (avg2 - avg1 > 0.5) trend = 'worsening';
    else if (avg1 - avg2 > 0.5) trend = 'improving';
  }

  return {
    patient_id: 'pat_yoon_001',
    snapshot_at: `${today}T18:30:00+09:00`,
    greeting: '윤서진님, 오늘도 건강한 하루 보내세요.',
    recent_symptoms_summary: {
      last_7_days_count: recentRecords.length,
      avg_severity: avgSeverity,
      trend,
      most_recent: last
        ? {
            symptom_id: last.symptom_id,
            occurred_at: last.occurred_at,
            severity: last.severity,
            description_preview: last.description.length > 30
              ? last.description.slice(0, 30) + '...'
              : last.description,
          }
        : null,
    },
    // 방법 B: 의사 의견은 DB에서만 제공. 생성기에는 포함하지 않음.
    last_visit_result: null,
    vitals_today: {
      heart_rate_bpm: vitals.heart_rate_bpm,
      bp_systolic: vitals.bp_systolic,
      bp_diastolic: vitals.bp_diastolic,
      sleep_hours: vitals.sleep_hours,
      step_count: vitals.step_count,
      source_platform: 'APPLE_HEALTH',
    },
  };
}
