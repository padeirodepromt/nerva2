-- Seed: Core Department (Ash)

insert into "departments" ("id", "key", "name", "description", "realm_id", "config")
values
  ('dept_core', 'core', 'Core (Ash)', 'Prana geral. Operação base sem especialização (Ash).', 'personal', '{}'::jsonb)
on conflict ("key") do nothing;