CREATE TABLE public.app_task_states (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, task_id)
);
GRANT SELECT, INSERT, DELETE ON public.app_task_states TO authenticated;
GRANT ALL ON public.app_task_states TO service_role;
ALTER TABLE public.app_task_states ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own task states read" ON public.app_task_states FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "own task states write" ON public.app_task_states FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "own task states clear" ON public.app_task_states FOR DELETE TO authenticated USING (user_id = auth.uid());