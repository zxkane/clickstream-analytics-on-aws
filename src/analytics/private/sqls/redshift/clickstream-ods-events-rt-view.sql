CREATE OR REPLACE VIEW {{schema}}.clickstream_ods_events_rt_view
AS
SELECT 
    event_date,
    event_name,
    event_id,
    event_bundle_sequence_id,
    event_previous_timestamp,
    event_server_timestamp_offset,
    event_timestamp,
    ingest_timestamp,
    event_value_in_usd,
    app_info_app_id,
    app_info_package_id,
    app_info_install_source,
    app_info_version,
    device_id,
    device_mobile_brand_name,
    device_mobile_model_name,
    device_manufacturer,
    device_screen_width,
    device_screen_height,
    device_carrier,
    device_network_type,
    device_operating_system,
    device_operating_system_version,
    ua_browser,
    ua_browser_version,
    ua_os,
    ua_os_version,
    ua_device,
    ua_device_category,
    device_system_language,
    device_time_zone_offset_seconds,
    geo_continent,
    geo_country,
    geo_city,
    geo_metro,
    geo_region,
    geo_sub_continent,
    geo_locale,
    platform,
    project_id,
    traffic_source_name,
    traffic_source_medium,
    traffic_source_source,
    user_first_touch_timestamp,
    user_id,
    user_pseudo_id
FROM {{schema}}.clickstream_ods_events_view
WHERE EXISTS (SELECT 1 FROM {{schema}}.clickstream_ods_events_view LIMIT 1)
UNION ALL
SELECT 
    event_date,
    event_name as event_name,
    event_id as event_id,
    event_bundle_sequence_id:: bigint as event_bundle_sequence_id,
    event_previous_timestamp:: bigint as event_previous_timestamp,
    event_server_timestamp_offset:: bigint as event_server_timestamp_offset,
    event_timestamp as event_timestamp,
    ingest_timestamp as ingest_timestamp,
    event_value_in_usd as event_value_in_usd,
    app_info.app_id:: varchar as app_info_app_id,
    app_info.id:: varchar as app_info_package_id,
    app_info.install_source:: varchar as app_info_install_source,
    app_info.version:: varchar as app_info_version,
    device.vendor_id::varchar as device_id,
    device.mobile_brand_name:: varchar as device_mobile_brand_name,
    device.mobile_model_name:: varchar as device_mobile_model_name,
    device.manufacturer:: varchar as device_manufacturer,
    device.screen_width:: bigint as device_screen_width,
    device.screen_height:: bigint as device_screen_height,
    device.carrier:: varchar as device_carrier,
    device.network_type:: varchar as device_network_type,
    device.operating_system:: varchar as device_operating_system,
    device.operating_system_version:: varchar as device_operating_system_version,
    device.ua_browser:: varchar,
    device.ua_browser_version:: varchar,
    device.ua_os:: varchar,
    device.ua_os_version:: varchar,
    device.ua_device:: varchar,
    device.ua_device_category:: varchar,
    device.system_language:: varchar as device_system_language,
    device.time_zone_offset_seconds:: bigint as device_time_zone_offset_seconds,
    geo.continent:: varchar as geo_continent,
    geo.country:: varchar as geo_country,
    geo.city:: varchar as geo_city,
    geo.metro:: varchar as geo_metro,
    geo.region:: varchar as geo_region,
    geo.sub_continent:: varchar as geo_sub_continent,
    geo.locale:: varchar as geo_locale,
    platform as platform,
    project_id as project_id,
    traffic_source.name:: varchar as traffic_source_name,
    traffic_source.medium:: varchar as traffic_source_medium,
    traffic_source.source:: varchar as traffic_source_source,
    user_first_touch_timestamp as user_first_touch_timestamp,
    user_id as user_id,
    user_pseudo_id
FROM {{schema}}.ods_events e
WHERE e.event_date >= (SELECT max(event_date) FROM {{schema}}.clickstream_ods_events_view)
AND e.event_timestamp > (SELECT max(event_timestamp) FROM {{schema}}.clickstream_ods_events_view)
AND EXISTS (SELECT 1 FROM {{schema}}.clickstream_ods_events_view LIMIT 1)
UNION ALL
SELECT 
    event_date,
    event_name as event_name,
    event_id as event_id,
    event_bundle_sequence_id:: bigint as event_bundle_sequence_id,
    event_previous_timestamp:: bigint as event_previous_timestamp,
    event_server_timestamp_offset:: bigint as event_server_timestamp_offset,
    event_timestamp as event_timestamp,
    ingest_timestamp as ingest_timestamp,
    event_value_in_usd as event_value_in_usd,
    app_info.app_id:: varchar as app_info_app_id,
    app_info.id:: varchar as app_info_package_id,
    app_info.install_source:: varchar as app_info_install_source,
    app_info.version:: varchar as app_info_version,
    device.vendor_id::varchar as device_id,
    device.mobile_brand_name:: varchar as device_mobile_brand_name,
    device.mobile_model_name:: varchar as device_mobile_model_name,
    device.manufacturer:: varchar as device_manufacturer,
    device.screen_width:: bigint as device_screen_width,
    device.screen_height:: bigint as device_screen_height,
    device.carrier:: varchar as device_carrier,
    device.network_type:: varchar as device_network_type,
    device.operating_system:: varchar as device_operating_system,
    device.operating_system_version:: varchar as device_operating_system_version,
    device.ua_browser:: varchar,
    device.ua_browser_version:: varchar,
    device.ua_os:: varchar,
    device.ua_os_version:: varchar,
    device.ua_device:: varchar,
    device.ua_device_category:: varchar,
    device.system_language:: varchar as device_system_language,
    device.time_zone_offset_seconds:: bigint as device_time_zone_offset_seconds,
    geo.continent:: varchar as geo_continent,
    geo.country:: varchar as geo_country,
    geo.city:: varchar as geo_city,
    geo.metro:: varchar as geo_metro,
    geo.region:: varchar as geo_region,
    geo.sub_continent:: varchar as geo_sub_continent,
    geo.locale:: varchar as geo_locale,
    platform as platform,
    project_id as project_id,
    traffic_source.name:: varchar as traffic_source_name,
    traffic_source.medium:: varchar as traffic_source_medium,
    traffic_source.source:: varchar as traffic_source_source,
    user_first_touch_timestamp as user_first_touch_timestamp,
    user_id as user_id,
    user_pseudo_id
FROM {{schema}}.ods_events
WHERE NOT EXISTS (SELECT 1 FROM {{schema}}.clickstream_ods_events_view LIMIT 1);