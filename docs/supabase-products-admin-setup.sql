-- Artizan Lemn - admin products CRUD setup
-- Ruleaza acest script in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.catalog_products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  slug text not null unique,
  category text not null,
  short_description text not null,
  full_description text not null,
  featured_image text not null,
  gallery text[] not null default '{}',
  tags text[] not null default '{}',
  wood_types text[] not null default '{}',
  finishes text[] not null default '{}',
  suitable_for text[] not null default '{}',
  is_featured boolean not null default false,
  status text not null default 'draft'
);

create index if not exists catalog_products_status_idx
  on public.catalog_products (status);

create index if not exists catalog_products_updated_at_idx
  on public.catalog_products (updated_at desc);

create or replace function public.set_catalog_products_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_catalog_products_updated_at on public.catalog_products;
create trigger trg_catalog_products_updated_at
before update on public.catalog_products
for each row
execute function public.set_catalog_products_updated_at();

alter table public.catalog_products enable row level security;
