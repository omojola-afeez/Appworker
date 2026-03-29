# Supabase Database Setup

This guide walks through creating the required tables and Row Level Security (RLS) policies in your Supabase project so that user signup and profile creation work correctly.

## Prerequisites

- A Supabase project with the URL and anon key configured in your environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).
- Access to the **SQL Editor** in the Supabase dashboard.

---

## Step 1 — Create the `profiles` table

Run the following SQL in the Supabase SQL Editor:

```sql
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text not null,
  user_type   text not null check (user_type in ('apprentice', 'employer')),
  phone       text,
  location    text not null,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
```

---

## Step 2 — Create the `apprentice_profiles` table

```sql
create table if not exists public.apprentice_profiles (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  skills            text[]   not null default '{}',
  experience_years  integer  not null default 0,
  hourly_rate       numeric  not null default 0,
  contract_rate     numeric  not null default 0,
  bio               text     not null default '',
  portfolio_links   text[]   not null default '{}',
  availability      text     not null default 'available'
                      check (availability in ('available', 'busy', 'unavailable')),
  rating            numeric  not null default 0,
  total_reviews     integer  not null default 0,
  total_jobs        integer  not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
```

---

## Step 3 — Enable Row Level Security

RLS must be enabled on both tables, then explicit policies must be added to allow authenticated users to read and write their own rows.

```sql
-- Enable RLS
alter table public.profiles          enable row level security;
alter table public.apprentice_profiles enable row level security;

-- profiles: users can read and write only their own row
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- apprentice_profiles: users can read and write only their own row
create policy "Users can view their own apprentice profile"
  on public.apprentice_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert their own apprentice profile"
  on public.apprentice_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own apprentice profile"
  on public.apprentice_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

---

## Step 4 — Allow public read access for browsing (optional)

The employer browse-apprentices feature needs to read other users' profiles. Add these policies if you want that to work:

```sql
-- Any authenticated user can read all profiles (for browsing)
create policy "Authenticated users can view all profiles"
  on public.profiles for select
  using (auth.role() = 'authenticated');

-- Any authenticated user can view all apprentice profiles (for browsing)
create policy "Authenticated users can view all apprentice profiles"
  on public.apprentice_profiles for select
  using (auth.role() = 'authenticated');
```

> **Note:** If you add the broader read policies in Step 4, you can drop the narrower `select` policies from Step 3 to avoid redundancy.

---

## Step 5 — Automatic `updated_at` timestamp (optional but recommended)

```sql
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger set_apprentice_profiles_updated_at
  before update on public.apprentice_profiles
  for each row execute procedure public.handle_updated_at();
```

---

## Troubleshooting

| Error message | Likely cause | Fix |
|---|---|---|
| `relation "profiles" does not exist` | Table was never created | Run Step 1 |
| `relation "apprentice_profiles" does not exist` | Table was never created | Run Step 2 |
| `new row violates row-level security policy` | RLS enabled but no insert policy | Run Step 3 |
| `permission denied for table profiles` | RLS not configured correctly | Re-run Step 3 |
| `violates foreign key constraint` | `profiles` row missing before `apprentice_profiles` insert | Ensure Step 1 insert succeeds first |

If signup still fails after running these migrations, check the browser console — the error message will now include the specific Supabase error and which table caused the failure.
