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

import { Select, TopNavigation } from '@cloudscape-design/components';
import { useLocalStorage } from 'pages/common/use-local-storage';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ANALYTICS_INFO_KEY,
  EN_TEXT,
  LANGUAGE_ITEMS,
  PROJECT_CONFIG_JSON,
  ZH_LANGUAGE_LIST,
  ZH_TEXT,
} from 'ts/const';
import HeaderSwitchSpaceModal from './SwitchSpaceModal';

interface IHeaderProps {
  user: any;
  signOut: any;
}

const AnalyticsHeader: React.FC<IHeaderProps> = (props: IHeaderProps) => {
  const { t, i18n } = useTranslation();
  const { user, signOut } = props;
  const [displayName, setDisplayName] = useState('');
  const [fullLogoutUrl, setFullLogoutUrl] = useState('');
  const [switchProjectVisible, setSwitchProjectVisible] = useState(false);
  const [selectedOption, setSelectedOption] = React.useState<any>({
    label: 'Option 1',
    value: '1',
  });
  const [analyticsInfo, setAnalyticsInfo] = useLocalStorage(
    ANALYTICS_INFO_KEY,
    {
      projectId: '',
      projectName: '',
      appId: '',
      appName: '',
    }
  );

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    setDisplayName(
      user?.profile?.email ||
        user?.profile?.name ||
        user?.profile?.preferred_username ||
        user?.profile?.nickname ||
        user?.profile?.sub ||
        ''
    );
  }, [user]);

  useEffect(() => {
    if (ZH_LANGUAGE_LIST.includes(i18n.language)) {
      changeLanguage('zh');
    }
    const configJSONObj: ConfigType = localStorage.getItem(PROJECT_CONFIG_JSON)
      ? JSON.parse(localStorage.getItem(PROJECT_CONFIG_JSON) || '')
      : {};
    if (configJSONObj.oidc_logout_url) {
      const redirectUrl = configJSONObj.oidc_redirect_url.replace(
        '/signin',
        ''
      );
      const queryParams = new URLSearchParams({
        client_id: configJSONObj.oidc_client_id,
        id_token_hint: user.id_token,
        logout_uri: redirectUrl,
        redirect_uri: redirectUrl,
        post_logout_redirect_uri: redirectUrl,
      });
      const logoutUrl = new URL(configJSONObj.oidc_logout_url);
      logoutUrl.search = queryParams.toString();
      setFullLogoutUrl(decodeURIComponent(logoutUrl.toString()));
    }
  }, []);

  return (
    <header id="h">
      <TopNavigation
        identity={{
          href: '/analytics',
          title: t('header.solution') ?? '',
        }}
        search={
          <>
            <Select
              selectedOption={selectedOption}
              onChange={({ detail }) =>
                setSelectedOption(detail.selectedOption)
              }
              options={[
                {
                  label: 'Group 1',
                  options: [
                    { label: 'Option 1', value: '1' },
                    { label: 'Option 2', value: '2' },
                    { label: 'Option 3', value: '3' },
                  ],
                },
                {
                  label: 'Group 2 (disabled)',
                  disabled: true,
                  options: [
                    { label: 'Option 4', value: '4' },
                    { label: 'Option 5', value: '5' },
                  ],
                },
              ]}
            />
          </>
        }
        utilities={[
          {
            type: 'button',
            variant: 'link',
            text: `${analyticsInfo?.projectName} / ${analyticsInfo.appName}`,
          },
          {
            type: 'button',
            variant: 'primary-button',
            text: t('header.switchSpace') ?? '',
            onClick: () => {
              setSwitchProjectVisible(true);
            },
          },

          {
            type: 'button',
            text: 'Analytics Documentation',
            href: 'https://aws.amazon.com/solutions/',
            external: true,
          },
          {
            type: 'menu-dropdown',
            text: ZH_LANGUAGE_LIST.includes(i18n.language) ? ZH_TEXT : EN_TEXT,
            title: 'Language',
            ariaLabel: 'settings',
            onItemClick: (item) => {
              changeLanguage(item.detail.id);
            },
            items:
              i18n.language === 'zh'
                ? [...LANGUAGE_ITEMS].reverse()
                : LANGUAGE_ITEMS,
          },
          {
            type: 'menu-dropdown',
            text: displayName,
            description: displayName,
            iconName: 'user-profile',
            onItemClick: (item) => {
              if (item.detail.id === 'signout') {
                if (fullLogoutUrl) {
                  signOut?.();
                  window.location.href = fullLogoutUrl;
                }
                signOut?.();
              }
            },
            items: [{ id: 'signout', text: t('header.signOut') || '' }],
          },
        ]}
        i18nStrings={{
          searchIconAriaLabel: t('header.search') || '',
          searchDismissIconAriaLabel: t('header.closeSearch') || '',
          overflowMenuTriggerText: t('header.more') || '',
          overflowMenuTitleText: t('header.all') || '',
          overflowMenuBackIconAriaLabel: t('header.back') || '',
          overflowMenuDismissIconAriaLabel: t('header.closeMenu') || '',
        }}
      />
      <HeaderSwitchSpaceModal
        visible={switchProjectVisible}
        disableClose={false}
        setSwitchProjectVisible={setSwitchProjectVisible}
        setAnalyticsInfo={setAnalyticsInfo}
      />
    </header>
  );
};

export default AnalyticsHeader;