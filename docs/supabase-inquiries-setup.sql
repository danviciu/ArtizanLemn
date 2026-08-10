-- Artizan Lemn - inquiry flow setup
-- Ruleaza acest script in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text not null,
  project_title text not null,
  description text not null,
  dimensions text,
  room_type text,
  budget text,
  deadline_note text,
  additional_notes text,
  attachments jsonb not null default '[]'::jsonb,
  status text not null default 'nou'
);

create index if not exists inquiries_created_at_idx
  on public.inquiries (created_at desc);

create index if not exists inquiries_status_idx
  on public.inquiries (status);

alter table public.inquiries enable row level security;

-- Rate limit persistent pentru endpointul /api/inquiries.
create table if not exists public.inquiry_rate_limits (
  bucket_key text primary key,
  ip_hash text not null,
  window_start timestamptz not null,
  request_count integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists inquiry_rate_limits_window_start_idx
  on public.inquiry_rate_limits (window_start desc);

alter table public.inquiry_rate_limits enable row level security;

-- Bucket public pentru fisierele de inspiratie.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'inquiry-attachments',
  'inquiry-attachments',
  true,
  10485760,
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
