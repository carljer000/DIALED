alter table public.checkins
  add column if not exists energy_level smallint,
  add column if not exists hunger_level smallint,
  add column if not exists sleep_quality smallint,
  add column if not exists training_status text,
  add column if not exists main_challenge text,
  add column if not exists daily_win text not null default '',
  add column if not exists reflection_prompt text not null default '';

alter table public.checkins
  add constraint checkins_energy_level_range
    check (energy_level is null or energy_level between 1 and 5),
  add constraint checkins_hunger_level_range
    check (hunger_level is null or hunger_level between 1 and 5),
  add constraint checkins_sleep_quality_range
    check (sleep_quality is null or sleep_quality between 1 and 5),
  add constraint checkins_training_status_value
    check (training_status is null or training_status in ('Rest day', 'Completed', 'Missed')),
  add constraint checkins_main_challenge_value
    check (main_challenge is null or main_challenge in (
      'Hunger', 'Low energy', 'Social event', 'Stress', 'Time', 'Injury', 'Other'
    ));

comment on column public.checkins.energy_level is 'Optional perceived energy score from 1 (low) to 5 (high).';
comment on column public.checkins.hunger_level is 'Optional perceived hunger or cravings score from 1 (low) to 5 (high).';
comment on column public.checkins.sleep_quality is 'Optional perceived sleep-quality score from 1 (poor) to 5 (great).';
comment on column public.checkins.reflection_prompt is 'Prompt displayed when the reflection note was written.';
