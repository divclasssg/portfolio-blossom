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
  patient_id       TEXT REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id        TEXT NOT NULL,                 -- doc_park_001
  referral_from    JSONB,                         -- {doctor_name, hospital, reason, date}
  chief_complaint  JSONB,                         -- {patient_text, symptom_count, symptom_period}
  status           TEXT DEFAULT 'active',         -- active, completed, waiting, expired, cancelled_by_patient
  completed_at     TIMESTAMPTZ,
  transmitted_at   TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 증상 기록
CREATE TABLE IF NOT EXISTS symptom_records (
  id              SERIAL PRIMARY KEY,
  symptom_id      TEXT UNIQUE NOT NULL,           -- sym_001...
  patient_id      TEXT REFERENCES patients(id) ON DELETE CASCADE,
  session_id      TEXT REFERENCES sessions(id) ON DELETE CASCADE,
  description     TEXT,
  voice_transcript TEXT,
  occurred_at     TIMESTAMPTZ NOT NULL,
  severity        SMALLINT NOT NULL CHECK (severity BETWEEN 1 AND 4),
  category_code   TEXT NOT NULL,                  -- SYM-01~SYM-12 (01전신, 02근골격, 03신경, 05소화기, 07호흡기, 08심리, 09피부, 12심혈관/자율)
  location_type   TEXT DEFAULT 'HOME',            -- HOME, WORK, OUTSIDE
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 채팅 메시지
CREATE TABLE IF NOT EXISTS chat_messages (
  id              SERIAL PRIMARY KEY,
  patient_id      TEXT REFERENCES patients(id) ON DELETE CASCADE,
  session_id      TEXT REFERENCES sessions(id) ON DELETE CASCADE,
  role            TEXT NOT NULL,                  -- user, assistant
  content         TEXT NOT NULL,
  metadata        JSONB,                          -- {showSeverityChips, completed, symptomRecord}
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- AI 분석 결과
CREATE TABLE IF NOT EXISTS ai_results (
  id                  SERIAL PRIMARY KEY,
  session_id          TEXT REFERENCES sessions(id) ON DELETE CASCADE,
  result_type         TEXT NOT NULL,              -- briefing, suggestions
  model_version       TEXT,
  content             JSONB NOT NULL,             -- 전체 AI 출력
  generation_time_ms  INTEGER,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 진료 결과 (의사 전송 → 환자 조회)
CREATE TABLE IF NOT EXISTS consultation_results (
  id              SERIAL PRIMARY KEY,
  session_id      TEXT UNIQUE REFERENCES sessions(id) ON DELETE CASCADE,
  doctor_id       TEXT NOT NULL,
  doctor_name     TEXT NOT NULL,
  hospital_name   TEXT,
  diagnosis_name  TEXT,
  content         JSONB NOT NULL,       -- 07_result_package.json 전체 구조
  transmitted_at  TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_symptom_records_patient ON symptom_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_symptom_records_session ON symptom_records(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_results_session ON ai_results(session_id, result_type);
CREATE INDEX IF NOT EXISTS idx_consultation_results_session ON consultation_results(session_id);

-- ── sessions 컬럼 추가 마이그레이션 (1회 실행) ─────────────────
-- ALTER TABLE sessions ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
-- ALTER TABLE sessions ADD COLUMN IF NOT EXISTS transmitted_at TIMESTAMPTZ;

-- ── 기존 테이블 마이그레이션 (1회 실행) ────────────────────────
-- Supabase SQL Editor에서 아래를 실행하여 기존 FK에 ON DELETE CASCADE 추가
--
-- ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_patient_id_fkey;
-- ALTER TABLE sessions ADD CONSTRAINT sessions_patient_id_fkey
--   FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE;
--
-- ALTER TABLE symptom_records DROP CONSTRAINT IF EXISTS symptom_records_patient_id_fkey;
-- ALTER TABLE symptom_records ADD CONSTRAINT symptom_records_patient_id_fkey
--   FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE;
--
-- ALTER TABLE symptom_records DROP CONSTRAINT IF EXISTS symptom_records_session_id_fkey;
-- ALTER TABLE symptom_records ADD CONSTRAINT symptom_records_session_id_fkey
--   FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE;
--
-- ALTER TABLE chat_messages DROP CONSTRAINT IF EXISTS chat_messages_patient_id_fkey;
-- ALTER TABLE chat_messages ADD CONSTRAINT chat_messages_patient_id_fkey
--   FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE;
--
-- ALTER TABLE chat_messages DROP CONSTRAINT IF EXISTS chat_messages_session_id_fkey;
-- ALTER TABLE chat_messages ADD CONSTRAINT chat_messages_session_id_fkey
--   FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE;
--
-- ALTER TABLE ai_results DROP CONSTRAINT IF EXISTS ai_results_session_id_fkey;
-- ALTER TABLE ai_results ADD CONSTRAINT ai_results_session_id_fkey
--   FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE;
