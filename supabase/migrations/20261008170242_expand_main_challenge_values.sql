alter table public.checkins
  drop constraint if exists checkins_main_challenge_value;

alter table public.checkins
  add constraint checkins_main_challenge_value
    check (main_challenge is null or main_challenge in (
      'Hunger',
      'Cravings',
      'Low energy',
      'Low motivation',
      'Boredom',
      'Social event',
      'Stress',
      'Time',
      'Injury',
      'Other'
    ));
