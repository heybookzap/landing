ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS monthly_revenue INTEGER,
  ADD COLUMN IF NOT EXISTS weekly_hours NUMERIC(5, 1),
  ADD COLUMN IF NOT EXISTS hourly_value INTEGER,
  ADD COLUMN IF NOT EXISTS onboarded_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS raw_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sliced BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  task_type TEXT NOT NULL DEFAULT 'research',
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  time_slot SMALLINT NOT NULL CHECK (time_slot BETWEEN 0 AND 23),
  duration_minutes SMALLINT NOT NULL DEFAULT 2,
  difficulty SMALLINT NOT NULL DEFAULT 3 CHECK (difficulty BETWEEN 1 AND 5),
  feedback_score SMALLINT CHECK (feedback_score BETWEEN 1 AND 5),
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  assigned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES missions(id) ON DELETE SET NULL,
  condition TEXT NOT NULL CHECK (condition IN ('tired', 'normal', 'good')),
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  time_slot SMALLINT NOT NULL CHECK (time_slot BETWEEN 0 AND 23),
  task_type TEXT NOT NULL,
  difficulty_rating SMALLINT CHECK (difficulty_rating BETWEEN 1 AND 5),
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE raw_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_raw_tasks_select" ON raw_tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_own_raw_tasks_insert" ON raw_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_own_missions_select" ON missions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_own_missions_update" ON missions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "users_own_sessions_all" ON sessions
  FOR ALL USING (auth.uid() = user_id);
