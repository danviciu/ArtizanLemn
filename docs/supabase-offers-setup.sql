-- Artizan Lemn - offers module setup
-- Ruleaza acest script in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid references public.inquiries(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  offer_number text not null unique,
  version integer not null default 1,
  client_name text not null,
  client_phone text,
  project_title text not null,
  category_slug text,
  currency text not null default 'RON',
  subtotal numeric(12, 2) not null default 0,
  discount_value numeric(12, 2) not null default 0,
  tva_value numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  valid_until date,
  estimated_execution_days integer,
  payment_terms text,
  warranty_months integer,
  internal_notes text,
  legal_clauses_snapshot jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  constraint offers_status_chk
    check (status in ('draft', 'trimisa', 'acceptata', 'respinsa', 'expirata'))
);

alter table public.offers
  add column if not exists client_phone text;

create table if not exists public.offer_items (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.offers(id) on delete cascade,
  line_no integer not null,
  item_type text not null default 'produs',
  title text not null,
  description text,
  category_slug text,
  reference_product_slug text,
  wood_type text,
  finish text,
  qty numeric(10, 2) not null default 1,
  unit text not null default 'buc',
  unit_price numeric(12, 2) not null default 0,
  line_total numeric(12, 2) not null default 0,
  complexity_factor numeric(6, 2) not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists offer_items_offer_line_unique
  on public.offer_items (offer_id, line_no);

create table if not exists public.offer_revisions (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.offers(id) on delete cascade,
  version integer not null,
  change_reason text,
  snapshot jsonb not null default '{}'::jsonb,
  created_by text,
  created_at timestamptz not null default now()
);

create table if not exists public.offer_activity_log (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.offers(id) on delete cascade,
  action text not null,
  from_status text,
  to_status text,
  actor text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists offers_status_idx on public.offers (status);
create index if not exists offers_updated_at_idx on public.offers (updated_at desc);
create index if not exists offers_inquiry_id_idx on public.offers (inquiry_id);
create index if not exists offer_items_offer_id_idx on public.offer_items (offer_id);
create index if not exists offer_revisions_offer_id_idx on public.offer_revisions (offer_id);
create index if not exists offer_activity_offer_id_idx on public.offer_activity_log (offer_id);

create or replace function public.set_offers_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_offers_updated_at on public.offers;
create trigger trg_offers_updated_at
before update on public.offers
for each row
execute function public.set_offers_updated_at();

create or replace function public.set_offer_items_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_offer_items_updated_at on public.offer_items;
create trigger trg_offer_items_updated_at
before update on public.offer_items
for each row
execute function public.set_offer_items_updated_at();

alter table public.offers enable row level security;
alter table public.offer_items enable row level security;
alter table public.offer_revisions enable row level security;
alter table public.offer_activity_log enable row level security;
