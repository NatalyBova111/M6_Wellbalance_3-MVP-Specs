-- ===========================
-- SEED DATA for WellBalance
-- ===========================

-- Public foods (доступны всем)
insert into public.foods (owner_id, name, brand, serving_unit, serving_qty, calories_per_serving, is_public)
values
  (null, 'Grilled Chicken Breast', 'Generic', 'g', 100, 165, true),
  (null, 'Brown Rice (cooked)', 'Generic', 'g', 100, 112, true),
  (null, 'Avocado', 'Generic', 'g', 100, 160, true)
on conflict do nothing;

-- Optionally: создать демо-профиль (если нужно для тестов)
-- insert into public.profiles (id, username, full_name)
-- values ('00000000-0000-0000-0000-000000000000', 'demo', 'Demo User')
-- on conflict do nothing;
