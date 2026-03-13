-- 이음 Supabase 스키마
-- Supabase 대시보드 > SQL Editor 에서 실행

-- 환자 프로필
CREATE TABLE IF NOT EXISTS patients (
  id                  TEXT PRIMARY KEY,           -- pat_yoon_001
  name                TEXT NOT NULL,
  birth_date          DATE NOT NULL,
  gender              TEXT NOT NULL,
  height_cm           NUMERIC,
  weight_kg           NUMERIC,
  chronic_conditions  JSONB DEFAULT '[]',         -- [{name, icd_code, diagnosed_at, status}]
  medications         JSONB DEFAULT '[]',         -- [{name, dose, frequency, purpose}]
  allergies           JSONB DEFAULT '[]',         -- [{allergen, reaction, severity}]
  blood_type          TEXT,                       -- 'A+', 'A-', 'B+', ... '모름'
  phone               TEXT,                       -- 010-XXXX-XXXX
  consent_privacy     BOOLEAN DEFAULT FALSE,
  consent_terms       BOOLEAN DEFAULT FALSE,
  consent_sensitive   BOOLEAN DEFAULT FALSE,
  consent_location    BOOLEAN DEFAULT FALSE,
  consent_marketing   BOOLEAN DEFAULT FALSE,
  consent_research    BOOLEAN DEFAULT FALSE,
  consent_improvement BOOLEAN DEFAULT FALSE,
  consent_mydata      BOOLEAN DEFAULT FALSE,
  consent_overseas    BOOLEAN DEFAULT FALSE,
  wearable_device     TEXT,                       -- 'apple', 'galaxy', null
  onboarded_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 진료 세션 (환자↔의사 연결)
CREATE TABLE IF NOT EXISTS sessions (
  id               TEXT PRIMARY KEY,              -- ses_007
  patient_id       TEXT REFERENCES patients(id),
  doctor_id        TEXT NOT NULL,                 -- doc_park_001
  referral_from    JSONB,                         -- {doctor_name, hospital, reason, date}
  chief_complaint  JSONB,                         -- {patient_text, symptom_count, symptom_period}
  status           TEXT DEFAULT 'active',         -- active, completed, waiting, expired, cancelled_by_patient
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 증상 기록
CREATE TABLE IF NOT EXISTS symptom_records (
  id              SERIAL PRIMARY KEY,
  symptom_id      TEXT UNIQUE NOT NULL,           -- sym_001...
  patient_id      TEXT REFERENCES patients(id),
  session_id      TEXT REFERENCES sessions(id),
  description     TEXT,
  voice_transcript TEXT,
  occurred_at     TIMESTAMPTZ NOT NULL,
  severity        SMALLINT NOT NULL CHECK (severity BETWEEN 1 AND 4),
  category_code   TEXT NOT NULL,                  -- SYM-05, SYM-07, SYM-12
  location_type   TEXT DEFAULT 'HOME',            -- HOME, WORK, OUTSIDE
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 채팅 메시지
CREATE TABLE IF NOT EXISTS chat_messages (
  id              SERIAL PRIMARY KEY,
  patient_id      TEXT REFERENCES patients(id),
  session_id      TEXT REFERENCES sessions(id),
  role            TEXT NOT NULL,                  -- user, assistant
  content         TEXT NOT NULL,
  metadata        JSONB,                          -- {showSeverityChips, completed, symptomRecord}
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- AI 분석 결과
CREATE TABLE IF NOT EXISTS ai_results (
  id                  SERIAL PRIMARY KEY,
  session_id          TEXT REFERENCES sessions(id),
  result_type         TEXT NOT NULL,              -- briefing, suggestions
  model_version       TEXT,
  content             JSONB NOT NULL,             -- 전체 AI 출력
  generation_time_ms  INTEGER,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_symptom_records_patient ON symptom_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_symptom_records_session ON symptom_records(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_results_session ON ai_results(session_id, result_type);
