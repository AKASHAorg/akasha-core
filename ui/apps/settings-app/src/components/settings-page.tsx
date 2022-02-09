import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { COOKIE_CONSENT_NAME, CookieConsentTypes } from '@akashaproject/ui-awf-hooks';

import PrivacyOption from './option-privacy';
import AppsOption from './option-apps';
import { ISettingsItem, SettingsOption } from '../interfaces';
import { settingsItems } from '../utils/settings-items';
import AppearanceOption from './option-appearance';

const { Box, BasicCardBox, Icon, Text } = DS;

const SettingsPage: React.FC<RootComponentProps> = () => {
  const { t } = useTranslation();

  const [activeOption, setActiveOption] = React.useState<SettingsOption>('Settings');
  const [theme, setTheme] = React.useState<string>('Light Theme');
  const cookieType = window.localStorage.getItem(COOKIE_CONSENT_NAME);
  const [checkedTracking, setCheckedTracking] = React.useState(
    cookieType === CookieConsentTypes.ALL,
  );
  const [checkedAutoUpdates, setCheckedAutoUpdates] = React.useState<boolean>(false);
  const [checkedDataAnalytics, setCheckedDataAnalytics] = React.useState<boolean>(false);

  const handleSettingsOptionClick = (option: SettingsOption) => () => setActiveOption(option);

  const handleChevronLeftClick = () => setActiveOption('Settings');

  const handleTrackingOptionChange = event => {
    setCheckedTracking(event.target.checked);
    if (cookieType) {
      if (event.target.checked) {
        if (cookieType === CookieConsentTypes.ESSENTIAL) {
          window.localStorage.setItem(COOKIE_CONSENT_NAME, CookieConsentTypes.ALL);
          if (window['_paq']) {
            window['_paq'].push(['forgetUserOptOut']);
          }
        }
      } else {
        window.localStorage.setItem(COOKIE_CONSENT_NAME, CookieConsentTypes.ESSENTIAL);
        if (window['_paq']) {
          window['_paq'].push(['optUserOut']);
        }
      }
    }
  };

  const handleAutoUpdatesChange = event => {
    setCheckedAutoUpdates(event.target.checked);
    // @TODO: handle auto updates subscription
  };

  const handleDataAnalyticsChange = event => {
    setCheckedDataAnalytics(event.target.checked);
    // @TODO: handle data analytics subscription
  };

  const handleThemeSelect = event => {
    setTheme(event.target.value);
    // @TODO: handle theme select
  };

  return (
    <Box direction="column" gap="small">
      <BasicCardBox>
        {activeOption === 'Settings' && (
          <>
            <Box
              pad="medium"
              justify="center"
              align="center"
              border={{ side: 'bottom', color: 'border' }}
            >
              <Text weight="bold" size="large">{`${t('Settings')}`}</Text>
            </Box>
            {settingsItems.map((item: ISettingsItem, idx: number) => (
              <Box
                key={`${idx}${item.label}`}
                direction="row"
                pad="medium"
                justify={item.isSubheading ? 'start' : 'between'}
                align="center"
                border={idx !== settingsItems.length - 1 && { side: 'bottom', color: 'border' }}
                onClick={
                  item.clickable ? handleSettingsOptionClick(item.label as SettingsOption) : null
                }
              >
                <Text
                  weight={item.isSubheading ? 'bold' : 'normal'}
                  size="large"
                  margin={item.isSubheading && { vertical: 'medium' }}
                >
                  {`${t(item.label)}`}
                </Text>
                {!item.isSubheading && <Icon type="chevronRight" />}
              </Box>
            ))}
          </>
        )}
        {activeOption === 'Privacy' && (
          <PrivacyOption
            titleLabel={t('Privacy')}
            essentialCookiesLabel={t('Essential Cookies')}
            essentialCookiesInfo={t(
              'The collection and processing of these data are carried out for the purpose of enabling the use of our App (establishing a connection), ensuring system security and stability over the long term and optimising our internet presence as well as for internal statistical purposes. It is within our legitimate interest to process such data to offer you a well-functioning App. You can find out more by going to our ',
            )}
            trackingAnalyticsLabel={t('Tracking and Analytics')}
            trackingAnalyticsInfoIntro={t('We use ')}
            trackingAnalyticsInfo={t(
              " an open source analytics platform that will help us improve Ethereum World. As we respect your privacy, rest assured that we don't store personal identifiable information (PPI).",
            )}
            privacyPolicyLabel={t('Privacy Policy')}
            checkedTracking={checkedTracking}
            cookieType={cookieType}
            onTrackingOptionChange={handleTrackingOptionChange}
            OnChevronLeftClick={handleChevronLeftClick}
          />
        )}

        {activeOption === 'Apps' && (
          <AppsOption
            titleLabel={t('Apps')}
            autoUpdatesLabel={t('Automatic Updates')}
            autoUpdatesInfo={t(
              'Ensure you have all the latest version of your dapps, widgets & plugins. ',
            )}
            dataAnalyticsLabel={t('Data & Analytics')}
            dataAnalyticsinfo={t(
              'We track usage data and report any bugs or issues, by activting data will be able to report any issues one app usage.',
            )}
            checkedAutoUpdates={checkedAutoUpdates}
            checkedDataAnalytics={checkedDataAnalytics}
            onAutoUpdatesChange={handleAutoUpdatesChange}
            onDataAnalyticsChange={handleDataAnalyticsChange}
            OnChevronLeftClick={handleChevronLeftClick}
          />
        )}

        {activeOption === 'Appearance' && (
          <AppearanceOption
            titleLabel="Appearance"
            appThemeLabel={t('App Theme')}
            appThemeInfo={t("Choose your preference for the Ethereum World's theme")}
            theme={theme}
            onThemeSelect={handleThemeSelect}
            OnChevronLeftClick={handleChevronLeftClick}
          />
        )}
      </BasicCardBox>
    </Box>
  );
};

export default SettingsPage;
