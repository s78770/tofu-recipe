-- 두부 레시피 전용 Supabase 프로젝트에서만 실행하세요.
create table if not exists public.tofu_records (team_id text not null default 'main', kind text not null check (kind in ('recipes','batches','notes')), id text not null, data jsonb not null, updated_by text, updated_at timestamptz not null default now(), primary key (team_id,kind,id));
alter table public.tofu_records enable row level security;
create policy "tofu authenticated access" on public.tofu_records for all to authenticated using (true) with check (true);
alter table public.tofu_records replica identity full;
