-- TrackFlow Database Schema
-- Run this in psql: \i server/db/schema.sql

CREATE DATABASE trackflow;
\c trackflow;

CREATE TABLE users (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR(100) NOT NULL,
  email     VARCHAR(150) UNIQUE NOT NULL,
  password  VARCHAR(255) NOT NULL,
  initials  VARCHAR(4),
  color     VARCHAR(7) DEFAULT '#185FA5',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE issues (
  id          SERIAL PRIMARY KEY,
  key         VARCHAR(20) UNIQUE NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  type        VARCHAR(20) CHECK (type IN ('Bug','Feature','Task','Story')) DEFAULT 'Task',
  priority    VARCHAR(20) CHECK (priority IN ('Critical','High','Medium','Low')) DEFAULT 'Medium',
  status      VARCHAR(20) CHECK (status IN ('todo','inprogress','review','done')) DEFAULT 'todo',
  assignee_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  reporter_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE comments (
  id         SERIAL PRIMARY KEY,
  issue_id   INTEGER REFERENCES issues(id) ON DELETE CASCADE,
  author_id  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at on issues
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON issues
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Seed data
INSERT INTO users (name, email, password, initials, color) VALUES
  ('Alex Kim',   'alex@trackflow.dev',   '$2a$10$placeholder', 'AK', '#185FA5'),
  ('Sara Chen',  'sara@trackflow.dev',   '$2a$10$placeholder', 'SC', '#3C3489'),
  ('Marcus R.',  'marcus@trackflow.dev', '$2a$10$placeholder', 'MR', '#854F0B'),
  ('Priya S.',   'priya@trackflow.dev',  '$2a$10$placeholder', 'PS', '#3B6D11');

INSERT INTO issues (key, title, description, type, priority, status, assignee_id, reporter_id) VALUES
  ('TK-1','Login page throws 500 on empty password','Server returns 500 instead of 400 on empty password submission.','Bug','Critical','todo',1,2),
  ('TK-2','Add dark mode toggle to settings','Users have requested a dark mode option that persists in localStorage.','Feature','High','todo',3,1),
  ('TK-3','Kanban board drag-and-drop','Implement smooth drag and drop between columns with live status updates.','Task','High','inprogress',1,1),
  ('TK-4','Dashboard loads slowly on mobile','FCP exceeds 4s on 3G. Audit bundle size and lazy-load components.','Bug','Medium','inprogress',2,3),
  ('TK-5','CSV export for issue list','Allow users to export filtered issues as CSV with all visible columns.','Feature','Medium','review',4,2),
  ('TK-6','Write unit tests for auth module','Auth module has 0% test coverage. Cover login, logout, session refresh.','Task','Low','review',2,1),
  ('TK-7','Set up CI/CD pipeline','Configure GitHub Actions for automated testing and staging deploys.','Story','High','done',3,1),
  ('TK-8','Fix broken image uploads','S3 bucket policy incorrectly configured. Updated IAM permissions.','Bug','High','done',4,3);
