-- 001_initial_schema.sql
create extension if not exists "pgcrypto";

-- Table creation
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

create or replace trigger advisories_set_updated_at
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

-- Seed Data Setup: Dummy User
insert into auth.users (id, email, raw_app_meta_data, raw_user_meta_data, aud, role)
values (
    '00000000-0000-0000-0000-000000000000',
    'seed.farmer@agriadvise.com',
    '{"provider":"email","providers":["email"]}',
    '{}',
    'authenticated',
    'authenticated'
)
on conflict (id) do nothing;

-- Seed Data Setup: Advisories
insert into public.advisories (
    id,
    user_id,
    farm_name,
    country,
    state,
    district,
    soil_type,
    soil_ph,
    land_area,
    land_unit,
    season,
    average_temperature,
    rainfall,
    water_availability,
    irrigation_method,
    previous_crop,
    farming_goal,
    preferred_crop_category,
    additional_observations,
    ai_response,
    created_at,
    updated_at
)
values (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'Green Valley Farm',
    'India',
    'Telangana',
    'Medak',
    'loamy',
    6.50,
    2.50,
    'acres',
    'Kharif',
    28.50,
    'moderate',
    'moderate',
    'drip',
    'Groundnut',
    'profit',
    'vegetables',
    'Looking for high-yield market options.',
    '{
      "summary": "The land profile is highly suited for vegetable cultivation during the Kharif season, particularly crops requiring loamy soils and drip irrigation.",
      "overallAssessment": "The loamy soil with pH 6.5 and moderate water supply provides a versatile environment for high-value commercial vegetables.",
      "recommendedCrops": [
        {
          "cropName": "Tomato (Hybrid varieties)",
          "suitabilityScore": 92,
          "suitabilityLevel": "excellent",
          "whyRecommended": [
            "Matches loamy soil structure perfectly",
            "pH of 6.5 is in the optimal range (6.0 - 6.8)",
            "Drip irrigation prevents foliage dampness, reducing disease risk"
          ],
          "soilSuitability": {
            "assessment": "Optimal loamy soil depth and drainage",
            "pHCompatibility": "Highly compatible (6.5 pH matches the required 6.0-6.8 target)"
          },
          "climateSuitability": {
            "assessment": "28.5 °C temperature range is suitable for pollination",
            "temperatureCompatibility": "Temperature range (20-30°C) is highly suitable",
            "rainfallCompatibility": "Moderate rainfall is handled well with good loamy drainage"
          },
          "waterRequirement": "moderate",
          "irrigationGuidance": "Maintain consistent drip cycles to prevent blossom end rot.",
          "estimatedGrowingDuration": "90 - 110 days",
          "cultivationGuidance": [
            "Prepare raised beds for water drainage",
            "Stake plants early to support heavy hybrid yields",
            "Mulch with straw or plastic sheets to conserve moisture"
          ],
          "fertilizerGuidance": [
            "Apply nitrogen-rich compost at transplanting",
            "Add potash during flowering for fruit firmness",
            "Supplement calcium if blossom-end rot is detected"
          ],
          "pestAndDiseaseRisks": [
            "Late blight during humid periods",
            "Fruit borer attacks"
          ],
          "majorRisks": [
            "Fungal infection from unexpected excess rainfall",
            "Market price fluctuations due to over-supply"
          ],
          "sustainabilityNotes": [
            "Excellent rotation choice after groundnut (nitrogen fixer)",
            "Do not follow tomatoes with other solanaceous crops (e.g., eggplants, peppers)"
          ],
          "confidence": "high"
        }
      ],
      "generalRecommendations": [
        "Procure certified disease-resistant seeds.",
        "Test irrigation water salinity."
      ],
      "informationGaps": [],
      "professionalVerificationNeeded": [
        "Consult local department of agriculture for localized pest warnings."
      ],
      "disclaimer": "This advisory is AI-generated for informational guidance. Verify with local agronomists."
    }'::jsonb,
    now() - interval '2 days',
    now() - interval '2 days'
)
on conflict (id) do nothing;
