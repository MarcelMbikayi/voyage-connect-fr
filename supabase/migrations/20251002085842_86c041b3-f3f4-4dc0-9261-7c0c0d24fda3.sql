-- Remove the overly permissive "System can manage sessions" policy
-- This policy allowed public access to all session data with USING condition 'true'
-- Edge functions use service role key which bypasses RLS, so this policy is not needed
DROP POLICY IF EXISTS "System can manage sessions" ON public.user_sessions;