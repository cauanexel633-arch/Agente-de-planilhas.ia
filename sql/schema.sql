-- Rode no SQL Editor do Supabase
create table if not exists public.usuarios (
  id uuid default gen_random_uuid() primary null,
  email text unique not null,
  nome text,
  codigo_unico text unique not null,
  avatar_url text,
  created_at timestamp with time zone default now()
);
alter table public.usuarios enable row level security;
create policy "Leitura própria" on public.usuarios for select using (auth.email() = email);
