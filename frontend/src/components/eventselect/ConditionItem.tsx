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

import {
  Button,
  Input,
  Select,
  SelectProps,
} from '@cloudscape-design/components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExploreAnalyticsOperators, MetadataValueType } from 'ts/explore-types';
import {
  CategoryItemType,
  IConditionItemType,
} from './AnalyticsType';
import EventItem from './EventItem';

interface ConditionItemProps {
  item: IConditionItemType;
  conditionOptions: CategoryItemType[];
  removeConditionItem: () => void;
  changeConditionOperator: (value: SelectProps.Option | null) => void;
  changeCurCategoryOption: (category: SelectProps.Option | null) => void;
  changeConditionValue: (value: any) => void;
}

const ConditionItem: React.FC<ConditionItemProps> = (
  props: ConditionItemProps
) => {
  const { t } = useTranslation();
  const {
    item,
    conditionOptions,
    removeConditionItem,
    changeCurCategoryOption,
    changeConditionOperator,
    changeConditionValue,
  } = props;

  const ANALYTICS_OPERATORS = {
    is_null: { value: ExploreAnalyticsOperators.NULL, label: t('analytics:operators.null') },
    is_not_null: {
      value: ExploreAnalyticsOperators.NOT_NULL,
      label: t('analytics:operators.notNull'),
    },
    equal: { value: ExploreAnalyticsOperators.EQUAL, label: t('analytics:operators.equal') },
    not_equal: { value: ExploreAnalyticsOperators.NOT_EQUAL, label: t('analytics:operators.notEqual') },
    greater_than: {
      value: ExploreAnalyticsOperators.GREATER_THAN,
      label: t('analytics:operators.greaterThan'),
    },
    greater_than_or_equal: {
      value: ExploreAnalyticsOperators.GREATER_THAN_OR_EQUAL,
      label: t('analytics:operators.greaterThanOrEqual'),
    },
    less_than: { value: ExploreAnalyticsOperators.LESS_THAN, label: t('analytics:operators.lessThan') },
    less_than_or_equal: {
      value: ExploreAnalyticsOperators.LESS_THAN_OR_EQUAL,
      label: t('analytics:operators.lessThanOrEqual'),
    },
    in: { value: ExploreAnalyticsOperators.IN, label: t('analytics:operators.in') },
    not_in: { value: ExploreAnalyticsOperators.NOT_IN, label: t('analytics:operators.notIn') },
  };

  const CONDITION_STRING_OPERATORS: SelectProps.Options = [
    ANALYTICS_OPERATORS.is_null,
    ANALYTICS_OPERATORS.is_not_null,
    ANALYTICS_OPERATORS.equal,
    ANALYTICS_OPERATORS.not_equal,
    ANALYTICS_OPERATORS.in,
    ANALYTICS_OPERATORS.not_in,
  ];
  const CONDITION_NUMBER_OPERATORS: SelectProps.Options = [
    ANALYTICS_OPERATORS.is_null,
    ANALYTICS_OPERATORS.is_not_null,
    ANALYTICS_OPERATORS.equal,
    ANALYTICS_OPERATORS.not_equal,
    ANALYTICS_OPERATORS.greater_than,
    ANALYTICS_OPERATORS.greater_than_or_equal,
    ANALYTICS_OPERATORS.less_than,
    ANALYTICS_OPERATORS.less_than_or_equal,
    ANALYTICS_OPERATORS.in,
    ANALYTICS_OPERATORS.not_in,
  ];

  return (
    <div className="cs-analytics-condition-item">
      <div className="condition-event">
        <EventItem
          categoryOption={item.conditionOption}
          changeCurCategoryOption={(item) => {
            changeCurCategoryOption(item);
          }}
          categories={conditionOptions}
        />
      </div>
      <div className="condition-select">
        <Select
          disabled={!item.conditionOption}
          placeholder="Operator"
          selectedOption={item.conditionOperator}
          onChange={(e) => {
            changeConditionOperator(e.detail.selectedOption);
          }}
          options={
            item.conditionOption?.valueType === MetadataValueType.STRING
              ? CONDITION_STRING_OPERATORS
              : CONDITION_NUMBER_OPERATORS
          }
        />
      </div>
      <div className="flex-1">
        {item.conditionOperator?.value !== ANALYTICS_OPERATORS.is_null.value &&
          item.conditionOperator?.value !==
            ANALYTICS_OPERATORS.is_not_null.value && (
            <Input
              disabled={!item.conditionOperator}
              placeholder={
                t('analytics:funnel.conditionValueInputPlaceholder') ?? ''
              }
              value={item.conditionValue}
              onChange={(e) => {
                changeConditionValue(e.detail.value);
              }}
            />
          )}
      </div>
      <div className="remove-item">
        <div className="remove-item-icon">
          <Button
            onClick={() => {
              removeConditionItem();
            }}
            variant="link"
            iconName="close"
          />
        </div>
      </div>
    </div>
  );
};

export default ConditionItem;