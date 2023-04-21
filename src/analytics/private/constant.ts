/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

export enum RedshiftMode {
  PROVISIONED='Provisioned',
  SERVERLESS='Serverless',
  NEW_SERVERLESS='New_Serverless',
}

export enum JobStatus {
  JOB_NEW = 'NEW',
  JOB_ENQUEUE = 'ENQUEUE',
  JOB_PROCESSING = 'PROCESSING',
}

export const DYNAMODB_TABLE_INDEX_NAME = 'status_timestamp_index';

export const REDSHIFT_ODS_TABLE_NAME = 'ods_events';
export const REDSHIFT_DUPLICATE_DATE_INTERVAL = 3; // Days

export const SP_UPSERT_USERS = 'sp_upsert_users';