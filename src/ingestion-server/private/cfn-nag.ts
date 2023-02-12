/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { Stack } from 'aws-cdk-lib';
import { addCfnNagToStack } from '../../common/cfn-nag';


const cfnNagList = [
  {
    paths_endswith: [
      'IngestionServer/clickstream-ingestion-service-ecs-asg/InstanceRole/DefaultPolicy/Resource',
      'IngestionServer/clickstream-ingestion-service-ecs-asg/DrainECSHook/Function/ServiceRole/DefaultPolicy/Resource',
      'IngestionServer/clickstream-ingestion-service-ecs-task-def/ExecutionRole/DefaultPolicy/Resource',
      'IngestionServer/DeleteECSClusterCustomResourceEventHandlerRole/DefaultPolicy/Resource',
      'LogRetention[a-f0-9]+/ServiceRole/DefaultPolicy/Resource',
    ],
    rules_to_suppress: [
      {
        id: 'W12',
        reason: 'Policy is generated by CDK, * resource for read only access',
      },
    ],
  },

  {
    paths_endswith: [
      'IngestionServer/clickstream-ingestion-service-ecs-asg/DrainECSHook/Function/Resource',
      'IngestionServer/DeleteECSClusterCustomResourceProvider/framework-onEvent/Resource',
      'LogRetention[a-f0-9]+/Resource',
    ],
    rules_to_suppress: [
      {
        id: 'W89',
        reason:
          'Lambda functions only for deployment/cloudformation custom resources, no need to be deployed in VPC',
      },

      {
        id: 'W92',
        reason:
          'Lambda functions only for deployment/cloudformation custom resources, no need to set ReservedConcurrentExecutions',
      },
    ],
  },

  {
    paths_endswith: [
      'IngestionServer/clickstream-ingestion-service-ecs-asg/LifecycleHookDrainHook/Topic/Resource',
    ],
    rules_to_suppress: [
      {
        id: 'W47',
        reason:
          'SNS Topic is managed outside of this stack, no need to specify KmsMasterKeyId property',
      },
    ],
  },
];

export function addCfnNagToIngestionServer(stack: Stack) {
  addCfnNagToStack(stack, cfnNagList);
}