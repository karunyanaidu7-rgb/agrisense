-- 001_create_advisories.sql
create extension if not exists "pgcrypto";

create table public.advisories (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,

    farm_name text not null,
    country text not null,
    state text not null,
    district text not null,

    soil_type text not null,
    soil_ph numeric(4,2),

    land_area numeric(12,2) not null,
    land_unit text not null,

    season text not null,
    average_temperature numeric(5,2),
    rainfall text not null,

    water_availability text not null,
    irrigation_method text not null,

    previous_crop text,
    farming_goal text not null,
    preferred_crop_category text not null,
    additional_observations text,

    ai_response jsonb not null,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint soil_ph_range
        check (soil_ph is null or (soil_ph >= 0 and soil_ph <= 14)),

    constraint land_area_positive
        check (land_area > 0),

    constraint ai_response_is_object
        check (jsonb_typeof(ai_response) = 'object')
);

create index advisories_user_id_idx
    on public.advisories(user_id);

create index advisories_created_at_idx
    on public.advisories(created_at desc);

create index advisories_user_created_idx
    on public.advisories(user_id, created_at desc);

-- Auto-update updated_at timestamp trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger advisories_set_updated_at
before update on public.advisories
for each row
execute function public.set_updated_at();

-- Enable Row Level Security
alter table public.advisories enable row level security;

-- RLS Policies
create policy "Users can view their own advisories"
on public.advisories
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can create their own advisories"
on public.advisories
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own advisories"
on public.advisories
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own advisories"
on public.advisories
for delete
to authenticated
using (auth.uid() = user_id);
