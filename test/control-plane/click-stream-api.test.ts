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

import { TestEnv } from './test-utils';

describe('Click Stream Api ALB deploy Construct Test', () => {

  test('DynamoDB table', () => {
    const { template } = TestEnv.newALBApiStack();

    template.hasResourceProperties('AWS::DynamoDB::Table', {
      KeySchema: [
        {
          AttributeName: 'name',
          KeyType: 'HASH',
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'name',
          AttributeType: 'S',
        },
      ],
      BillingMode: 'PAY_PER_REQUEST',
      PointInTimeRecoverySpecification: {
        PointInTimeRecoveryEnabled: true,
      },
      SSESpecification: {
        SSEEnabled: true,
      },
    });
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      KeySchema: [
        {
          AttributeName: 'id',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'type',
          KeyType: 'RANGE',
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'id',
          AttributeType: 'S',
        },
        {
          AttributeName: 'type',
          AttributeType: 'S',
        },
        {
          AttributeName: 'prefix',
          AttributeType: 'S',
        },
        {
          AttributeName: 'createAt',
          AttributeType: 'N',
        },
      ],
      BillingMode: 'PAY_PER_REQUEST',
      GlobalSecondaryIndexes: [
        {
          IndexName: 'prefix-time-index',
          KeySchema: [
            {
              AttributeName: 'prefix',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'createAt',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
      ],
      PointInTimeRecoverySpecification: {
        PointInTimeRecoveryEnabled: true,
      },
      SSESpecification: {
        SSEEnabled: true,
      },
      TimeToLiveSpecification: {
        AttributeName: 'ttl',
        Enabled: true,
      },
    });
  });

  test('Api lambda Function', () => {
    const { template } = TestEnv.newALBApiStack();

    template.hasResourceProperties('AWS::Lambda::Function', {
      Architectures: [
        'x86_64',
      ],
      Description: 'Lambda function for api of solution Click Stream Analytics on AWS',
      Environment: {
        Variables: {
          CLICK_STREAM_TABLE_NAME: {
            Ref: 'testClickStreamALBApiClickstreamMetadataA721B303',
          },
          DICTIONARY_TABLE_NAME: {
            Ref: 'testClickStreamALBApiClickstreamDictionary0A1156B6',
          },
          AWS_ACCOUNT_ID: {
            Ref: 'AWS::AccountId',
          },
          LOG_LEVEL: 'WARN',
        },
      },
      MemorySize: 512,
      PackageType: 'Image',
      ReservedConcurrentExecutions: 3,
      Timeout: 30,
      VpcConfig: {
        SecurityGroupIds: [
          {
            'Fn::GetAtt': [
              'testClickStreamALBApiClickStreamApiFunctionSGC830FA60',
              'GroupId',
            ],
          },
        ],
        SubnetIds: [
          'subnet-33333333333333333',
          'subnet-44444444444444444',
        ],
      },
    });
    template.hasResource('AWS::Lambda::Function', {
      DependsOn: [
        'apifunceni59253B5A',
        'testClickStreamALBApiClickStreamApiFunctionRoleDefaultPolicyD977CF6D',
        'testClickStreamALBApiClickStreamApiFunctionRoleAE8AB92D',
      ],
    });

    template.hasResourceProperties('AWS::Lambda::Function', {
      Environment: {
        Variables: {
          LOG_LEVEL: 'WARN',
          POWERTOOLS_SERVICE_NAME: 'ClickStreamAnalyticsOnAWS',
        },
      },
    });

    template.hasResourceProperties('AWS::Lambda::Function', {
      Architectures: [
        'arm64',
      ],
      Description: 'Lambda function for dictionary init of solution Click Stream Analytics on AWS',
      Runtime: 'nodejs18.x',
    });
    template.hasResourceProperties('AWS::Lambda::Function', {
      Architectures: [
        'arm64',
      ],
      Description: 'Lambda function for state machine callback of solution Clickstream Analytics on AWS',
      Runtime: 'nodejs18.x',
    });
    template.hasResourceProperties('AWS::Lambda::Function', {
      Architectures: [
        'x86_64',
      ],
      PackageType: 'Image',
      Description: 'Lambda function for api of solution Click Stream Analytics on AWS',
    });

  });

  test('Api lambda Function in GCR', () => {
    const { template } = TestEnv.newALBApiStack(true);

    template.hasResourceProperties('AWS::Lambda::Function', {
      Architectures: [
        'x86_64',
      ],
      Description: 'Lambda function for dictionary init of solution Click Stream Analytics on AWS',
      Runtime: 'nodejs16.x',
    });
    template.hasResourceProperties('AWS::Lambda::Function', {
      Architectures: [
        'x86_64',
      ],
      Description: 'Lambda function for state machine callback of solution Clickstream Analytics on AWS',
      Runtime: 'nodejs16.x',
    });
    template.hasResourceProperties('AWS::Lambda::Function', {
      Architectures: [
        'x86_64',
      ],
      Description: 'Lambda function for api of solution Click Stream Analytics on AWS',
    });
  });

  test('IAM Resource for Api Lambda', () => {
    const { template } = TestEnv.newALBApiStack();

    // Creates the function's execution role...
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'lambda.amazonaws.com',
            },
          },
        ],
      },
    });
  });

  test('Check SecurityGroup', () => {
    const { template } = TestEnv.newALBApiStack();

    template.hasResourceProperties('AWS::EC2::SecurityGroup', {
      GroupDescription: 'apiTestStack/testClickStreamALBApi/ClickStreamApiFunctionSG',
      SecurityGroupEgress: [
        {
          CidrIp: '0.0.0.0/0',
          Description: 'Allow all outbound traffic by default',
          IpProtocol: '-1',
        },
      ],
      VpcId: 'vpc-11111111111111111',
    });

    template.hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
      IpProtocol: 'tcp',
      Description: 'allow all traffic from application load balancer',
      GroupId: {
        'Fn::GetAtt': [
          'testClickStreamALBApiClickStreamApiFunctionSGC830FA60',
          'GroupId',
        ],
      },
      SourceSecurityGroupId: {
        'Fn::GetAtt': [
          'testsg872EB48A',
          'GroupId',
        ],
      },
    });


  });

  test('Policy', () => {
    const { template } = TestEnv.newALBApiStack();

    // DicInitCustomResourceFunctionRoleDefaultPolicy
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'dynamodb:BatchGetItem',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:ConditionCheckItem',
              'dynamodb:BatchWriteItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'testClickStreamALBApiClickstreamDictionary0A1156B6',
                  'Arn',
                ],
              },
              {
                Ref: 'AWS::NoValue',
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'testClickStreamALBApiBatchInsertDDBCustomResourceDicInitCustomResourceFunctionRoleDefaultPolicyE1ACA4DE',
    });

    // StateMachineCallbackFunctionRoleDefaultPolicy
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'xray:PutTraceSegments',
              'xray:PutTelemetryRecords',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
          {
            Action: [
              'dynamodb:BatchGetItem',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:ConditionCheckItem',
              'dynamodb:BatchWriteItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'testClickStreamALBApiClickstreamMetadataA721B303',
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        'testClickStreamALBApiClickstreamMetadataA721B303',
                        'Arn',
                      ],
                    },
                    '/index/*',
                  ],
                ],
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'testClickStreamALBApiStackActionStateMachineCallbackFunctionRoleDefaultPolicyFE05CE8A',
    });

    // StateMachineRoleDefaultPolicy
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'logs:CreateLogDelivery',
              'logs:GetLogDelivery',
              'logs:UpdateLogDelivery',
              'logs:DeleteLogDelivery',
              'logs:ListLogDeliveries',
              'logs:PutResourcePolicy',
              'logs:DescribeResourcePolicies',
              'logs:DescribeLogGroups',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
          {
            Action: [
              'xray:PutTraceSegments',
              'xray:PutTelemetryRecords',
              'xray:GetSamplingRules',
              'xray:GetSamplingTargets',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
          {
            Action: 'cloudformation:createStack',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':cloudformation:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':stack/clickstream-*',
                ],
              ],
            },
          },
          {
            Action: 'cloudformation:describeStacks',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':cloudformation:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':*',
                ],
              ],
            },
          },
          {
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'testClickStreamALBApiStackActionStateMachineCallbackFunction19A0F5E1',
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        'testClickStreamALBApiStackActionStateMachineCallbackFunction19A0F5E1',
                        'Arn',
                      ],
                    },
                    ':*',
                  ],
                ],
              },
            ],
          },
          {
            Action: 'cloudformation:deleteStack',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':cloudformation:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':stack/clickstream-*',
                ],
              ],
            },
          },
          {
            Action: 'cloudformation:updateStack',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':cloudformation:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':stack/clickstream-*',
                ],
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'testClickStreamALBApiStackActionStateMachineRoleDefaultPolicy2F163742',
    });

    // SMCloudformationPolicy
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'iam:PassRole',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'testClickStreamALBApiStackActionStateMachineSFNCreateStackRole228C93B6',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'testClickStreamALBApiStackActionStateMachineSMCloudformationPolicyF657B988',
    });

    // ApiFunctionRoleDefaultPolicy
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'dynamodb:BatchGetItem',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:ConditionCheckItem',
              'dynamodb:BatchWriteItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'testClickStreamALBApiClickstreamDictionary0A1156B6',
                  'Arn',
                ],
              },
              {
                Ref: 'AWS::NoValue',
              },
            ],
          },
          {
            Action: [
              'dynamodb:BatchGetItem',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:ConditionCheckItem',
              'dynamodb:BatchWriteItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'testClickStreamALBApiClickstreamMetadataA721B303',
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        'testClickStreamALBApiClickstreamMetadataA721B303',
                        'Arn',
                      ],
                    },
                    '/index/*',
                  ],
                ],
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'testClickStreamALBApiClickStreamApiFunctionRoleDefaultPolicyD977CF6D',
    });

    // ApiStepFunctionPolicy
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'states:StartExecution',
            Effect: 'Allow',
            Resource: {
              Ref: 'testClickStreamALBApiStackActionStateMachineD1557E17',
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'testClickStreamALBApiClickStreamApiStepFunctionPolicy71DA1626',
    });

    // ApiAWSSdkPolicy
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'kafka:ListClustersV2',
              'kafka:ListClusters',
              's3:ListAllMyBuckets',
              'ec2:DescribeVpcs',
              'redshift:DescribeClusters',
              'account:ListRegions',
              's3:ListBucket',
              'quicksight:ListUsers',
              'ec2:DescribeSubnets',
              'ec2:DescribeRouteTables',
              's3:GetBucketLocation',
              'route53:ListHostedZones',
              'athena:ListWorkGroups',
              'iam:ListRoles',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'testClickStreamALBApiClickStreamApiAWSSdkPolicy48F56187',
    });

  });

  test('LogGroup', () => {
    const { template } = TestEnv.newALBApiStack();

    template.hasResourceProperties('AWS::Logs::LogGroup', {
      KmsKeyId: {
        'Fn::GetAtt': [
          'testClickStreamALBApiStackActionStateMachineLogGroupKmsKeyE240FB96',
          'Arn',
        ],
      },
      LogGroupName: {
        'Fn::Join': [
          '',
          [
            '/aws/vendedlogs/states/Clickstream/StackActionLogGroup-',
            {
              'Fn::Select': [
                0,
                {
                  'Fn::Split': [
                    '-',
                    {
                      'Fn::Select': [
                        2,
                        {
                          'Fn::Split': [
                            '/',
                            {
                              Ref: 'AWS::StackId',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        ],
      },
      RetentionInDays: 180,
    });
  });

  test('Custom Resource', () => {
    const { template } = TestEnv.newALBApiStack();

    template.hasResourceProperties('AWS::CloudFormation::CustomResource', {
      ServiceToken: {
        'Fn::GetAtt': [
          'testClickStreamALBApiBatchInsertDDBCustomResourceDicInitCustomResourceProviderframeworkonEventFB731F8E',
          'Arn',
        ],
      },
      tableName: {
        Ref: 'testClickStreamALBApiClickstreamDictionary0A1156B6',
      },
    });

    template.hasResourceProperties('AWS::Lambda::Function', {
      Architectures: [
        'arm64',
      ],
      Description: 'Lambda function for dictionary init of solution Click Stream Analytics on AWS',
      Environment: {
        Variables: {
          POWERTOOLS_SERVICE_NAME: 'ClickStreamAnalyticsOnAWS',
          POWERTOOLS_LOGGER_SAMPLE_RATE: '0.5',
          POWERTOOLS_LOGGER_LOG_EVENT: 'true',
          LOG_LEVEL: 'WARN',
          AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        },
      },
      Handler: 'index.handler',
      MemorySize: 256,
      Runtime: 'nodejs18.x',
      Timeout: 30,
    });

    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'lambda.amazonaws.com',
            },
          },
        ],
        Version: '2012-10-17',
      },
      Policies: [
        {
          PolicyDocument: {
            Statement: [
              {
                Action: 'dynamodb:BatchWriteItem',
                Effect: 'Allow',
                Resource: {
                  'Fn::GetAtt': [
                    'testClickStreamALBApiClickstreamDictionary0A1156B6',
                    'Arn',
                  ],
                },
              },
            ],
            Version: '2012-10-17',
          },
          PolicyName: 'ddb',
        },
      ],
    });

  });

  test('State Machine', () => {
    const { template } = TestEnv.newALBApiStack();

    template.hasResourceProperties('AWS::StepFunctions::StateMachine', {
      DefinitionString: {
        'Fn::Join': [
          '',
          [
            '{"StartAt":"Action","States":{"Action":{"Type":"Choice","Choices":[{"Variable":"$.Input.Action","StringEquals":"Create","Next":"CreateStack"},{"Variable":"$.Input.Action","StringEquals":"Delete","Next":"DeleteStack"},{"Variable":"$.Input.Action","StringEquals":"Update","Next":"UpdateStack"}]},"CreateStack":{"Next":"Wait 15 Seconds","Type":"Task","ResultPath":"$.Result.Stacks[0]","Resource":"arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::aws-sdk:cloudformation:createStack","Parameters":{"StackName.$":"$.Input.StackName","TemplateURL.$":"$.Input.TemplateURL","Parameters.$":"$.Input.Parameters","RoleARN":"',
            {
              'Fn::GetAtt': [
                'testClickStreamALBApiStackActionStateMachineSFNCreateStackRole228C93B6',
                'Arn',
              ],
            },
            '","Capabilities":["CAPABILITY_IAM"]}},"Wait 15 Seconds":{"Type":"Wait","Seconds":15,"Next":"DescribeStacksByResult"},"Create in progress?":{"Type":"Choice","Choices":[{"Variable":"$.Result.Stacks[0].StackStatus","StringMatches":"*_IN_PROGRESS","Next":"Wait 15 Seconds"}],"Default":"Save Stack Runtime"},"DescribeStacksByResult":{"Next":"Create in progress?","Type":"Task","ResultPath":"$.Result","Resource":"arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::aws-sdk:cloudformation:describeStacks","Parameters":{"StackName.$":"$.Result.Stacks[0].StackId"}},"Save Stack Runtime":{"End":true,"Retry":[{"ErrorEquals":["Lambda.ServiceException","Lambda.AWSLambdaException","Lambda.SdkClientException"],"IntervalSeconds":2,"MaxAttempts":6,"BackoffRate":2}],"Type":"Task","OutputPath":"$.Payload","Resource":"arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::lambda:invoke","Parameters":{"FunctionName":"',
            {
              'Fn::GetAtt': [
                'testClickStreamALBApiStackActionStateMachineCallbackFunction19A0F5E1',
                'Arn',
              ],
            },
            '","Payload.$":"$"}},"DeleteStack":{"Next":"Wait 15 Seconds Too","Type":"Task","ResultPath":null,"Resource":"arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::aws-sdk:cloudformation:deleteStack","Parameters":{"StackName.$":"$.Input.StackName"}},"Wait 15 Seconds Too":{"Type":"Wait","Seconds":15,"Next":"DescribeStacksByName"},"UpdateStack":{"Next":"Wait 15 Seconds Too","Type":"Task","ResultPath":null,"Resource":"arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::aws-sdk:cloudformation:updateStack","Parameters":{"StackName.$":"$.Input.StackName","TemplateURL.$":"$.Input.TemplateURL","Parameters.$":"$.Input.Parameters","Capabilities":["CAPABILITY_IAM"]}},"Update in progress?":{"Type":"Choice","Choices":[{"Variable":"$.Result.Stacks[0].StackStatus","StringMatches":"*_IN_PROGRESS","Next":"Wait 15 Seconds Too"}],"Default":"Save Stack Runtime"},"DescribeStacksByName":{"Next":"Update in progress?","Type":"Task","ResultPath":"$.Result","Resource":"arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::aws-sdk:cloudformation:describeStacks","Parameters":{"StackName.$":"$.Input.StackName"}}},"TimeoutSeconds":1800}',
          ],
        ],
      },
      LoggingConfiguration: {
        Destinations: [
          {
            CloudWatchLogsLogGroup: {
              LogGroupArn: {
                'Fn::GetAtt': [
                  'testClickStreamALBApiStackActionStateMachineLogGroupDE72356F',
                  'Arn',
                ],
              },
            },
          },
        ],
        Level: 'ALL',
      },
    });
  });

});

describe('Click Stream Api Cloudfront deploy Construct Test', () => {

  test('DynamoDB table', () => {
    const { template } = TestEnv.newCloudfrontApiStack();

    template.hasResourceProperties('AWS::DynamoDB::Table', {
      KeySchema: [
        {
          AttributeName: 'name',
          KeyType: 'HASH',
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'name',
          AttributeType: 'S',
        },
      ],
      BillingMode: 'PAY_PER_REQUEST',
      PointInTimeRecoverySpecification: {
        PointInTimeRecoveryEnabled: true,
      },
      SSESpecification: {
        SSEEnabled: true,
      },
    });
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      KeySchema: [
        {
          AttributeName: 'id',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'type',
          KeyType: 'RANGE',
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'id',
          AttributeType: 'S',
        },
        {
          AttributeName: 'type',
          AttributeType: 'S',
        },
        {
          AttributeName: 'prefix',
          AttributeType: 'S',
        },
        {
          AttributeName: 'createAt',
          AttributeType: 'N',
        },
      ],
      BillingMode: 'PAY_PER_REQUEST',
      GlobalSecondaryIndexes: [
        {
          IndexName: 'prefix-time-index',
          KeySchema: [
            {
              AttributeName: 'prefix',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'createAt',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
      ],
      PointInTimeRecoverySpecification: {
        PointInTimeRecoveryEnabled: true,
      },
      SSESpecification: {
        SSEEnabled: true,
      },
      TimeToLiveSpecification: {
        AttributeName: 'ttl',
        Enabled: true,
      },
    });
  });

  test('Api lambda Function', () => {
    const { template } = TestEnv.newCloudfrontApiStack();

    template.hasResourceProperties('AWS::Lambda::Function', {
      Architectures: [
        'x86_64',
      ],
      Description: 'Lambda function for api of solution Click Stream Analytics on AWS',
      Environment: {
        Variables: {
          CLICK_STREAM_TABLE_NAME: {
            Ref: 'testClickStreamCloudfrontApiClickstreamMetadata11A455BB',
          },
          DICTIONARY_TABLE_NAME: {
            Ref: 'testClickStreamCloudfrontApiClickstreamDictionaryB094D60B',
          },
        },
      },
      MemorySize: 512,
      PackageType: 'Image',
      ReservedConcurrentExecutions: 3,
      Timeout: 30,
    });
    template.hasResource('AWS::Lambda::Function', {
      DependsOn: [
        'apifunceni59253B5A',
        'testClickStreamCloudfrontApiClickStreamApiFunctionRoleDefaultPolicy64431738',
        'testClickStreamCloudfrontApiClickStreamApiFunctionRoleFDC21CDD',
      ],
    });

    template.hasResourceProperties('AWS::Lambda::Function', {
      Architectures: [
        'arm64',
      ],
      Description: 'Lambda function for dictionary init of solution Click Stream Analytics on AWS',
      Runtime: 'nodejs18.x',
    });
    template.hasResourceProperties('AWS::Lambda::Function', {
      Architectures: [
        'arm64',
      ],
      Description: 'Lambda function for state machine callback of solution Clickstream Analytics on AWS',
      Runtime: 'nodejs18.x',
    });
    template.hasResourceProperties('AWS::Lambda::Function', {
      Architectures: [
        'x86_64',
      ],
      PackageType: 'Image',
      Description: 'Lambda function for api of solution Click Stream Analytics on AWS',
    });

  });

  test('Api lambda Function in GCR', () => {
    const { template } = TestEnv.newALBApiStack(true);

    template.hasResourceProperties('AWS::Lambda::Function', {
      Architectures: [
        'x86_64',
      ],
      Description: 'Lambda function for dictionary init of solution Click Stream Analytics on AWS',
      Runtime: 'nodejs16.x',
    });
    template.hasResourceProperties('AWS::Lambda::Function', {
      Architectures: [
        'x86_64',
      ],
      Description: 'Lambda function for state machine callback of solution Clickstream Analytics on AWS',
      Runtime: 'nodejs16.x',
    });
    template.hasResourceProperties('AWS::Lambda::Function', {
      Architectures: [
        'x86_64',
      ],
      Description: 'Lambda function for api of solution Click Stream Analytics on AWS',
    });

  });

  test('IAM Resource for Api Lambda', () => {
    const { template } = TestEnv.newCloudfrontApiStack();

    // Creates the function's execution role...
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'lambda.amazonaws.com',
            },
          },
        ],
      },
    });
  });

  test('Policy', () => {
    const { template } = TestEnv.newALBApiStack();

    // DicInitCustomResourceFunctionRoleDefaultPolicy
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'dynamodb:BatchGetItem',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:ConditionCheckItem',
              'dynamodb:BatchWriteItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'testClickStreamALBApiClickstreamDictionary0A1156B6',
                  'Arn',
                ],
              },
              {
                Ref: 'AWS::NoValue',
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'testClickStreamALBApiBatchInsertDDBCustomResourceDicInitCustomResourceFunctionRoleDefaultPolicyE1ACA4DE',
    });

    // StateMachineCallbackFunctionRoleDefaultPolicy
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'xray:PutTraceSegments',
              'xray:PutTelemetryRecords',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
          {
            Action: [
              'dynamodb:BatchGetItem',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:ConditionCheckItem',
              'dynamodb:BatchWriteItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'testClickStreamALBApiClickstreamMetadataA721B303',
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        'testClickStreamALBApiClickstreamMetadataA721B303',
                        'Arn',
                      ],
                    },
                    '/index/*',
                  ],
                ],
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'testClickStreamALBApiStackActionStateMachineCallbackFunctionRoleDefaultPolicyFE05CE8A',
    });

    // StateMachineRoleDefaultPolicy
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'logs:CreateLogDelivery',
              'logs:GetLogDelivery',
              'logs:UpdateLogDelivery',
              'logs:DeleteLogDelivery',
              'logs:ListLogDeliveries',
              'logs:PutResourcePolicy',
              'logs:DescribeResourcePolicies',
              'logs:DescribeLogGroups',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
          {
            Action: [
              'xray:PutTraceSegments',
              'xray:PutTelemetryRecords',
              'xray:GetSamplingRules',
              'xray:GetSamplingTargets',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
          {
            Action: 'cloudformation:createStack',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':cloudformation:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':stack/clickstream-*',
                ],
              ],
            },
          },
          {
            Action: 'cloudformation:describeStacks',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':cloudformation:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':*',
                ],
              ],
            },
          },
          {
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'testClickStreamALBApiStackActionStateMachineCallbackFunction19A0F5E1',
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        'testClickStreamALBApiStackActionStateMachineCallbackFunction19A0F5E1',
                        'Arn',
                      ],
                    },
                    ':*',
                  ],
                ],
              },
            ],
          },
          {
            Action: 'cloudformation:deleteStack',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':cloudformation:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':stack/clickstream-*',
                ],
              ],
            },
          },
          {
            Action: 'cloudformation:updateStack',
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':cloudformation:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':stack/clickstream-*',
                ],
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'testClickStreamALBApiStackActionStateMachineRoleDefaultPolicy2F163742',
    });

    // SMCloudformationPolicy
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'iam:PassRole',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'testClickStreamALBApiStackActionStateMachineSFNCreateStackRole228C93B6',
                'Arn',
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'testClickStreamALBApiStackActionStateMachineSMCloudformationPolicyF657B988',
    });

    // ApiFunctionRoleDefaultPolicy
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'dynamodb:BatchGetItem',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:ConditionCheckItem',
              'dynamodb:BatchWriteItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'testClickStreamALBApiClickstreamDictionary0A1156B6',
                  'Arn',
                ],
              },
              {
                Ref: 'AWS::NoValue',
              },
            ],
          },
          {
            Action: [
              'dynamodb:BatchGetItem',
              'dynamodb:GetRecords',
              'dynamodb:GetShardIterator',
              'dynamodb:Query',
              'dynamodb:GetItem',
              'dynamodb:Scan',
              'dynamodb:ConditionCheckItem',
              'dynamodb:BatchWriteItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
              'dynamodb:DescribeTable',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  'testClickStreamALBApiClickstreamMetadataA721B303',
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        'testClickStreamALBApiClickstreamMetadataA721B303',
                        'Arn',
                      ],
                    },
                    '/index/*',
                  ],
                ],
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'testClickStreamALBApiClickStreamApiFunctionRoleDefaultPolicyD977CF6D',
    });

    // ApiStepFunctionPolicy
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'states:StartExecution',
            Effect: 'Allow',
            Resource: {
              Ref: 'testClickStreamALBApiStackActionStateMachineD1557E17',
            },
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'testClickStreamALBApiClickStreamApiStepFunctionPolicy71DA1626',
    });

    // ApiAWSSdkPolicy
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'kafka:ListClustersV2',
              'kafka:ListClusters',
              's3:ListAllMyBuckets',
              'ec2:DescribeVpcs',
              'redshift:DescribeClusters',
              'account:ListRegions',
              's3:ListBucket',
              'quicksight:ListUsers',
              'ec2:DescribeSubnets',
              'ec2:DescribeRouteTables',
              's3:GetBucketLocation',
              'route53:ListHostedZones',
              'athena:ListWorkGroups',
              'iam:ListRoles',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
      PolicyName: 'testClickStreamALBApiClickStreamApiAWSSdkPolicy48F56187',
    });

  });

  test('ApiGateway', () => {
    const { template } = TestEnv.newCloudfrontApiStack();
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'ANY',
      ResourceId: {
        Ref: 'testClickStreamCloudfrontApiClickStreamApiproxyF7B82220',
      },
      RestApiId: {
        Ref: 'testClickStreamCloudfrontApiClickStreamApi77242134',
      },
      AuthorizationType: 'NONE',
      Integration: {
        IntegrationHttpMethod: 'POST',
        Type: 'AWS_PROXY',
        Uri: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':apigateway:',
              {
                Ref: 'AWS::Region',
              },
              ':lambda:path/2015-03-31/functions/',
              {
                'Fn::GetAtt': [
                  'testClickStreamCloudfrontApiClickStreamApiFunction25FEE34E',
                  'Arn',
                ],
              },
              '/invocations',
            ],
          ],
        },
      },
    });
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'ANY',
      ResourceId: {
        'Fn::GetAtt': [
          'testClickStreamCloudfrontApiClickStreamApi77242134',
          'RootResourceId',
        ],
      },
      RestApiId: {
        Ref: 'testClickStreamCloudfrontApiClickStreamApi77242134',
      },
      AuthorizationType: 'NONE',
      Integration: {
        IntegrationHttpMethod: 'POST',
        Type: 'AWS_PROXY',
        Uri: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':apigateway:',
              {
                Ref: 'AWS::Region',
              },
              ':lambda:path/2015-03-31/functions/',
              {
                'Fn::GetAtt': [
                  'testClickStreamCloudfrontApiClickStreamApiFunction25FEE34E',
                  'Arn',
                ],
              },
              '/invocations',
            ],
          ],
        },
      },
    });
    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      EndpointConfiguration: {
        Types: [
          'REGIONAL',
        ],
      },
      Name: 'ClickStreamApi',
    });
    template.hasResourceProperties('AWS::ApiGateway::Deployment', {
      RestApiId: {
        Ref: 'testClickStreamCloudfrontApiClickStreamApi77242134',
      },
      Description: 'Automatically created by the RestApi construct',
    });
    template.hasResource('AWS::ApiGateway::Deployment', {
      DependsOn: [
        'testClickStreamCloudfrontApiClickStreamApiproxyANY2AD1F4B4',
        'testClickStreamCloudfrontApiClickStreamApiproxyF7B82220',
        'testClickStreamCloudfrontApiClickStreamApiANY34E982F9',
      ],
    });
    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      RestApiId: {
        Ref: 'testClickStreamCloudfrontApiClickStreamApi77242134',
      },
      AccessLogSetting: {
        DestinationArn: {
          'Fn::GetAtt': [
            'testClickStreamCloudfrontApiLogGroupA3049296',
            'Arn',
          ],
        },
        Format: '$context.identity.sourceIp $context.identity.caller $context.identity.user [$context.requestTime] "$context.httpMethod $context.resourcePath $context.protocol" $context.status $context.responseLength $context.requestId',
      },
      DeploymentId: {
        Ref: 'testClickStreamCloudfrontApiClickStreamApiDeploymentD81E884Ac2c12fc874966dd173da874f67d1251b',
      },
      MethodSettings: [
        {
          DataTraceEnabled: false,
          HttpMethod: '*',
          LoggingLevel: 'ERROR',
          MetricsEnabled: true,
          ResourcePath: '/*',
        },
      ],
      StageName: 'api',
      TracingEnabled: true,
    });
    template.hasResourceProperties('AWS::ApiGateway::UsagePlan', {
      ApiStages: [
        {
          ApiId: {
            Ref: 'testClickStreamCloudfrontApiClickStreamApi77242134',
          },
          Stage: {
            Ref: 'testClickStreamCloudfrontApiClickStreamApiDeploymentStageapiE3BAC942',
          },
          Throttle: {},
        },
      ],
      Throttle: {
        BurstLimit: 100,
        RateLimit: 50,
      },
    });
  });

  test('LogGroup', () => {
    const { template } = TestEnv.newALBApiStack();

    template.hasResourceProperties('AWS::Logs::LogGroup', {
      KmsKeyId: {
        'Fn::GetAtt': [
          'testClickStreamALBApiStackActionStateMachineLogGroupKmsKeyE240FB96',
          'Arn',
        ],
      },
      LogGroupName: {
        'Fn::Join': [
          '',
          [
            '/aws/vendedlogs/states/Clickstream/StackActionLogGroup-',
            {
              'Fn::Select': [
                0,
                {
                  'Fn::Split': [
                    '-',
                    {
                      'Fn::Select': [
                        2,
                        {
                          'Fn::Split': [
                            '/',
                            {
                              Ref: 'AWS::StackId',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        ],
      },
      RetentionInDays: 180,
    });
  });

  test('State Machine', () => {
    const { template } = TestEnv.newALBApiStack();

    template.hasResourceProperties('AWS::StepFunctions::StateMachine', {
      DefinitionString: {
        'Fn::Join': [
          '',
          [
            '{"StartAt":"Action","States":{"Action":{"Type":"Choice","Choices":[{"Variable":"$.Input.Action","StringEquals":"Create","Next":"CreateStack"},{"Variable":"$.Input.Action","StringEquals":"Delete","Next":"DeleteStack"},{"Variable":"$.Input.Action","StringEquals":"Update","Next":"UpdateStack"}]},"CreateStack":{"Next":"Wait 15 Seconds","Type":"Task","ResultPath":"$.Result.Stacks[0]","Resource":"arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::aws-sdk:cloudformation:createStack","Parameters":{"StackName.$":"$.Input.StackName","TemplateURL.$":"$.Input.TemplateURL","Parameters.$":"$.Input.Parameters","RoleARN":"',
            {
              'Fn::GetAtt': [
                'testClickStreamALBApiStackActionStateMachineSFNCreateStackRole228C93B6',
                'Arn',
              ],
            },
            '","Capabilities":["CAPABILITY_IAM"]}},"Wait 15 Seconds":{"Type":"Wait","Seconds":15,"Next":"DescribeStacksByResult"},"Create in progress?":{"Type":"Choice","Choices":[{"Variable":"$.Result.Stacks[0].StackStatus","StringMatches":"*_IN_PROGRESS","Next":"Wait 15 Seconds"}],"Default":"Save Stack Runtime"},"DescribeStacksByResult":{"Next":"Create in progress?","Type":"Task","ResultPath":"$.Result","Resource":"arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::aws-sdk:cloudformation:describeStacks","Parameters":{"StackName.$":"$.Result.Stacks[0].StackId"}},"Save Stack Runtime":{"End":true,"Retry":[{"ErrorEquals":["Lambda.ServiceException","Lambda.AWSLambdaException","Lambda.SdkClientException"],"IntervalSeconds":2,"MaxAttempts":6,"BackoffRate":2}],"Type":"Task","OutputPath":"$.Payload","Resource":"arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::lambda:invoke","Parameters":{"FunctionName":"',
            {
              'Fn::GetAtt': [
                'testClickStreamALBApiStackActionStateMachineCallbackFunction19A0F5E1',
                'Arn',
              ],
            },
            '","Payload.$":"$"}},"DeleteStack":{"Next":"Wait 15 Seconds Too","Type":"Task","ResultPath":null,"Resource":"arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::aws-sdk:cloudformation:deleteStack","Parameters":{"StackName.$":"$.Input.StackName"}},"Wait 15 Seconds Too":{"Type":"Wait","Seconds":15,"Next":"DescribeStacksByName"},"UpdateStack":{"Next":"Wait 15 Seconds Too","Type":"Task","ResultPath":null,"Resource":"arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::aws-sdk:cloudformation:updateStack","Parameters":{"StackName.$":"$.Input.StackName","TemplateURL.$":"$.Input.TemplateURL","Parameters.$":"$.Input.Parameters","Capabilities":["CAPABILITY_IAM"]}},"Update in progress?":{"Type":"Choice","Choices":[{"Variable":"$.Result.Stacks[0].StackStatus","StringMatches":"*_IN_PROGRESS","Next":"Wait 15 Seconds Too"}],"Default":"Save Stack Runtime"},"DescribeStacksByName":{"Next":"Update in progress?","Type":"Task","ResultPath":"$.Result","Resource":"arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':states:::aws-sdk:cloudformation:describeStacks","Parameters":{"StackName.$":"$.Input.StackName"}}},"TimeoutSeconds":1800}',
          ],
        ],
      },
      LoggingConfiguration: {
        Destinations: [
          {
            CloudWatchLogsLogGroup: {
              LogGroupArn: {
                'Fn::GetAtt': [
                  'testClickStreamALBApiStackActionStateMachineLogGroupDE72356F',
                  'Arn',
                ],
              },
            },
          },
        ],
        Level: 'ALL',
      },
    });
  });

}); //end test suite