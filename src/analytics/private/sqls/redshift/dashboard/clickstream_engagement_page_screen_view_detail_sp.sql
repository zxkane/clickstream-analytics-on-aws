CREATE OR REPLACE PROCEDURE {{database_name}}.{{schema}}.{{spName}} (day date, timezone varchar) 
 LANGUAGE plpgsql
AS $$ 
DECLARE 

BEGIN

    DELETE FROM {{database_name}}.{{schema}}.{{viewName}} where event_date = day;

    INSERT INTO {{database_name}}.{{schema}}.{{viewName}} (
        event_date,
        platform,
        aggregation_type,
        aggregation_dim,
        user_id,
        user_engagement_time_minutes,
        event_id
    )
    select 
      day::date as event_date,
      platform,
      'Page Title' as aggregation_type,
      page_view_page_title as aggregation_dim,
      merged_user_id,
      page_view_engagement_time_msec::double precision/1000/60 as user_engagement_time_minutes,
      event_id
    from {{database_name}}.{{schema}}.{{baseView}}
    where 
      DATE_TRUNC('day', CONVERT_TIMEZONE(timezone, event_timestamp)) = day
      and event_name = '_page_view'
    ;

    INSERT INTO {{database_name}}.{{schema}}.{{viewName}} (
        event_date,
        platform,
        aggregation_type,
        aggregation_dim,
        user_id,
        user_engagement_time_minutes,
        event_id
    )
    select 
      day::date as event_date,
      platform,
      'Page URL Path' as aggregation_type,
      page_view_page_url_path as aggregation_dim,
      merged_user_id,
      page_view_engagement_time_msec::double precision/1000/60 as user_engagement_time_minutes,
      event_id
    from {{database_name}}.{{schema}}.{{baseView}}
    where 
      DATE_TRUNC('day', CONVERT_TIMEZONE(timezone, event_timestamp)) = day
      and event_name = '_page_view'
    ;

    INSERT INTO {{database_name}}.{{schema}}.{{viewName}} (
        event_date,
        platform,
        aggregation_type,
        aggregation_dim,
        user_id,
        user_engagement_time_minutes,
        event_id
    )
    select 
      day::date as event_date,
      platform,
      'Screen Name' as aggregation_type,
      screen_view_screen_name as aggregation_dim,
      merged_user_id,
      screen_view_engagement_time_msec::double precision/1000/60 as user_engagement_time_minutes,
      event_id
    from {{database_name}}.{{schema}}.{{baseView}}
    where 
      DATE_TRUNC('day', CONVERT_TIMEZONE(timezone, event_timestamp)) = day
      and event_name = '_screen_view'
    ;

    INSERT INTO {{database_name}}.{{schema}}.{{viewName}} (
        event_date,
        platform,
        aggregation_type,
        aggregation_dim,
        user_id,
        user_engagement_time_minutes,
        event_id
    )
    select 
      day::date as event_date,
      platform,
      'Screen Class' as aggregation_type,
      screen_view_screen_id as aggregation_dim,
      merged_user_id,
      screen_view_engagement_time_msec::double precision/1000/60 as user_engagement_time_minutes,
      event_id
    from {{database_name}}.{{schema}}.{{baseView}}
    where 
      DATE_TRUNC('day', CONVERT_TIMEZONE(timezone, event_timestamp)) = day
      and event_name = '_screen_view'
    ;

EXCEPTION WHEN OTHERS THEN
    call {{database_name}}.{{schema}}.sp_clickstream_log('{{viewName}}', 'error', 'error message:' || SQLERRM);
    RAISE INFO 'error message: %', SQLERRM;
END;      
$$
;
