-- This migration adds historical dummy data for users and their sessions.

-- Step 1: Insert 5 dummy users into auth.users.
-- The `handle_new_user` trigger will automatically create corresponding profiles.
-- Note: A dummy password hash is used as this data is for historical tracking, not for login.
INSERT INTO auth.users (id, email, encrypted_password, raw_user_meta_data, email_confirmed_at, created_at, updated_at)
VALUES
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'alice.lola@example.com',
    'dummy-password-hash',
    '{"full_name": "Alice Lola"}',
    NOW(),
    NOW() - INTERVAL '10 day',
    NOW() - INTERVAL '10 day'
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'bob.marley@example.com',
    'dummy-password-hash',
    '{"full_name": "Bob Marley"}',
    NOW(),
    NOW() - INTERVAL '9 day',
    NOW() - INTERVAL '9 day'
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    'charlie.brown@example.com',
    'dummy-password-hash',
    '{"full_name": "Charlie Brown"}',
    NOW(),
    NOW() - INTERVAL '8 day',
    NOW() - INTERVAL '8 day'
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    'david.copperfield@example.com',
    'dummy-password-hash',
    '{"full_name": "David Copperfield"}',
    NOW(),
    NOW() - INTERVAL '7 day',
    NOW() - INTERVAL '7 day'
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
    'eve.online@example.com',
    'dummy-password-hash',
    '{"full_name": "Eve Online"}',
    NOW(),
    NOW() - INTERVAL '6 day',
    NOW() - INTERVAL '6 day'
  );

-- Step 2: Insert 5 corresponding historical sessions into public.user_sessions.
INSERT INTO public.user_sessions (user_id, session_id, user_agent, last_activity, expires_at, is_active, created_at)
VALUES
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'dummy-session-id-1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    NOW() - INTERVAL '10 day',
    (NOW() - INTERVAL '10 day') + INTERVAL '24 hours',
    FALSE,
    NOW() - INTERVAL '10 day'
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'dummy-session-id-2',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
    NOW() - INTERVAL '9 day',
    (NOW() - INTERVAL '9 day') + INTERVAL '24 hours',
    FALSE,
    NOW() - INTERVAL '9 day'
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    'dummy-session-id-3',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    NOW() - INTERVAL '8 day',
    (NOW() - INTERVAL '8 day') + INTERVAL '24 hours',
    FALSE,
    NOW() - INTERVAL '8 day'
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    'dummy-session-id-4',
    'Mozilla/5.0 (Linux; Android 11; SM-G991U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36',
    NOW() - INTERVAL '7 day',
    (NOW() - INTERVAL '7 day') + INTERVAL '24 hours',
    FALSE,
    NOW() - INTERVAL '7 day'
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
    'dummy-session-id-5',
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0',
    NOW() - INTERVAL '6 day',
    (NOW() - INTERVAL '6 day') + INTERVAL '24 hours',
    FALSE,
    NOW() - INTERVAL '6 day'
  );