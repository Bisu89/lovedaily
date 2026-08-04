-- Single aggregate query backing the /admin dashboard. Kept in Postgres
-- (not computed app-side) so it's one round trip and the source of truth
-- lives next to the data it summarizes.
create or replace function public.admin_dashboard_stats () returns table (
  total_users bigint,
  dau bigint,
  wau bigint,
  mau bigint,
  returning_users bigint,
  avg_generations_per_user numeric,
  most_used_feature text,
  most_active_country text,
  most_active_language text
) language sql security definer as $$
  select
    (select count(*) from public.profiles) as total_users,
    (select count(distinct user_id) from public.ai_requests where created_at >= now() - interval '1 day') as dau,
    (select count(distinct user_id) from public.ai_requests where created_at >= now() - interval '7 days') as wau,
    (select count(distinct user_id) from public.ai_requests where created_at >= now() - interval '30 days') as mau,
    (select count(*) from public.user_usage_stats where active_days > 1) as returning_users,
    (select coalesce(avg(total_generations), 0) from public.user_usage_stats) as avg_generations_per_user,
    (select template_id from public.ai_requests group by template_id order by count(*) desc limit 1) as most_used_feature,
    (select country from public.profiles where country is not null group by country order by count(*) desc limit 1) as most_active_country,
    (select language from public.ai_requests where language is not null group by language order by count(*) desc limit 1) as most_active_language;
$$;

grant execute on function public.admin_dashboard_stats () to service_role;
