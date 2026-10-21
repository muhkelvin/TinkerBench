-- Migration: 20261021000000_init_schema.sql
-- PRD Tinkerbench Labs v1.2: Schema, Constraints, Functions, RLS & Storage

-- 1. Helper function for updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 2. Table: projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null,
  problem text,
  content text,
  features jsonb not null default '[]'::jsonb,
  limitations text,
  tech_stack text[] not null default '{}'::text[],
  tags text[] not null default '{}'::text[],
  maturity text not null check (maturity in ('concept', 'production', 'prototype', 'demo', 'beta')),
  publication_status text not null default 'draft' check (publication_status in ('draft', 'published', 'archived')),
  project_type text not null check (project_type in ('web_app', 'pwa', 'saas', 'ecommerce', 'landing_page', 'portfolio', 'customizable', 'saas_candidate')),
  cover_path text,
  cover_alt text,
  gallery jsonb not null default '[]'::jsonb,
  build_log jsonb not null default '[]'::jsonb,
  demo_url text check (demo_url is null or demo_url ~* '^https://'),
  source_url text check (source_url is null or source_url ~* '^https://'),
  is_featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint check_project_cover_alt check (cover_path is null or (cover_alt is not null and length(trim(cover_alt)) > 0)),
  constraint check_project_features_array check (jsonb_typeof(features) = 'array'),
  constraint check_project_gallery_array check (jsonb_typeof(gallery) = 'array'),
  constraint check_project_build_log_array check (jsonb_typeof(build_log) = 'array')
);

-- Trigger updated_at on projects
drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.handle_updated_at();

-- 3. Table: posts
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  tags text[] not null default '{}'::text[],
  cover_path text,
  cover_alt text,
  publication_status text not null default 'draft' check (publication_status in ('draft', 'published', 'archived')),
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint check_post_cover_alt check (cover_path is null or (cover_alt is not null and length(trim(cover_alt)) > 0))
);

-- Trigger updated_at on posts
drop trigger if exists set_posts_updated_at on public.posts;
create trigger set_posts_updated_at
before update on public.posts
for each row execute function public.handle_updated_at();

-- 4. Table: post_projects (many-to-many relationship)
create table if not exists public.post_projects (
  post_id uuid not null references public.posts(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  primary key (post_id, project_id)
);

-- 5. Table: admins
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- 6. Indexes
create index if not exists idx_projects_publication on public.projects(publication_status, published_at desc);
create index if not exists idx_posts_publication on public.posts(publication_status, published_at desc);
create index if not exists idx_post_projects_project_id on public.post_projects(project_id);
create index if not exists idx_projects_tags on public.projects using gin(tags);
create index if not exists idx_posts_tags on public.posts using gin(tags);

-- 7. Security Definer Function: is_admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select auth.uid() is not null
     and exists (
       select 1
       from public.admins
       where user_id = (select auth.uid())
     );
$$;

-- Secure is_admin permissions
alter function public.is_admin() owner to postgres;
revoke all on function public.is_admin() from public;
revoke all on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated;

-- 8. Enable Row Level Security (RLS) on all public tables
alter table public.projects enable row level security;
alter table public.posts enable row level security;
alter table public.post_projects enable row level security;
alter table public.admins enable row level security;

-- 9. RLS Policies: projects
drop policy if exists "public read published projects" on public.projects;
create policy "public read published projects"
  on public.projects for select
  to anon, authenticated
  using (publication_status = 'published');

drop policy if exists "admin read all projects" on public.projects;
create policy "admin read all projects"
  on public.projects for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admin write projects" on public.projects;
create policy "admin write projects"
  on public.projects for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 10. RLS Policies: posts
drop policy if exists "public read published posts" on public.posts;
create policy "public read published posts"
  on public.posts for select
  to anon, authenticated
  using (publication_status = 'published');

drop policy if exists "admin read all posts" on public.posts;
create policy "admin read all posts"
  on public.posts for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admin write posts" on public.posts;
create policy "admin write posts"
  on public.posts for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 11. RLS Policies: post_projects
drop policy if exists "public read post_projects" on public.post_projects;
create policy "public read post_projects"
  on public.post_projects for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.posts p
      where p.id = post_projects.post_id and p.publication_status = 'published'
    )
    and exists (
      select 1 from public.projects pr
      where pr.id = post_projects.project_id and pr.publication_status = 'published'
    )
  );

drop policy if exists "admin write post_projects" on public.post_projects;
create policy "admin write post_projects"
  on public.post_projects for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Note: No select/write policies on public.admins for anon/authenticated,
-- managed strictly through SQL editor or internal administrative scripts.

-- 12. Storage Bucket setup & policies
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  5242880, -- 5 MB limit
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

-- Storage RLS
drop policy if exists "public read media bucket" on storage.objects;
create policy "public read media bucket"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

drop policy if exists "admin insert media bucket" on storage.objects;
create policy "admin insert media bucket"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "admin update media bucket" on storage.objects;
create policy "admin update media bucket"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "admin delete media bucket" on storage.objects;
create policy "admin delete media bucket"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and public.is_admin());

