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

package software.aws.solution.clickstream.sensors;

import software.aws.solution.clickstream.exception.ExecuteTransformerException;
import software.aws.solution.clickstream.transformer.BaseThirdPartyTransformer;
import software.aws.solution.clickstream.transformer.TransformConfig;
import software.aws.solution.clickstream.transformer.TransformerNameEnum;
import software.aws.solution.clickstream.udfconverter.DatasetConverter;

import static software.aws.solution.clickstream.transformer.TransformerNameEnum.SENSORS_DATA;

public class SensorsDataTransformerV2 extends BaseThirdPartyTransformer {
    private TransformConfig transformConfig;

    @Override
    public TransformerNameEnum getName() {
        return SENSORS_DATA;
    }

    @Override
    public DatasetConverter getDatasetTransformer() {
        if (this.transformConfig == null) {
            throw new ExecuteTransformerException("Transform config is not set");
        }
        return new SensorsDataConverterV2(this.transformConfig.getAppRuleConfig());
    }

    @Override
    public void config(final TransformConfig transformConfig) {
        this.transformConfig = transformConfig;
    }
}
