import * as React from 'react';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useAnalytics, CookieConsentTypes } from '@akashaproject/ui-awf-hooks';
// import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';

const { Box, BasicCardBox, Text, RadioButtonGroup, Checkbox } = DS;

const SettingsPage: React.FC<RootComponentProps> = () => {
  const { t } = useTranslation();

  const [analytics, analyticsActions] = useAnalytics();

  const [theme, setTheme] = React.useState<string>('Light Theme');
  const [checked, setChecked] = React.useState(analytics.consentType === CookieConsentTypes.ALL);
  const onChange = event => {
    setChecked(event.target.checked);
    if (event.target.checked) {
      if (analytics.cookieBannerDismissed) {
        analyticsActions.optUserIn();
      } else {
        analyticsActions.acceptConsent(CookieConsentTypes.ALL);
      }
    } else {
      analyticsActions.optUserOut();
    }
  };

  return (
    <Box direction="column" gap="small">
      <Text weight="bold" size="large">{`${t('Settings')}`}</Text>
      <BasicCardBox>
        <Box
          pad="medium"
          justify="center"
          align="start"
          border={{ side: 'bottom', color: 'border' }}
        >
          <Text textAlign="start" weight="bold">{`${t('Privacy')}`}</Text>
        </Box>
        <Box margin="medium" justify="center" align="start" gap="xsmall">
          <Text weight="bold">{`${t('Essential Cookies')}`}</Text>
          <div>
            <Text>{`${t(
              'The collection and processing of these data are carried out for the purpose of enabling the use of our App (establishing a connection), ensuring system security and stability over the long term and optimising our internet presence as well as for internal statistical purposes. It is within our legitimate interest to process such data to offer you a well-functioning App. You can find out more by going to our ',
            )}`}</Text>
            <Text
              color="accentText"
              size="medium"
              style={{ cursor: 'pointer' }}
              onClick={() =>
                window.open(
                  `${window.location.protocol}//${window.location.host}/legal/privacy-policy`,
                  'Privacy Policy',
                  '_blank noopener noreferrer',
                )
              }
            >
              {`${t('Privacy Policy')}`}
            </Text>
            <Text>.</Text>
          </div>
        </Box>
        <Box margin="medium" justify="center" align="start" gap="xsmall">
          <Text weight="bold">{`${t('Tracking & Analytics')}`}</Text>
          <Box direction="row" justify="between" align="start">
            <div style={{ maxWidth: '80%' }}>
              <Text>{`${t('We use ')}`}</Text>
              <Text
                color="accentText"
                size="medium"
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  window.open('https://matomo.org', 'Matomo', '_blank noopener noreferrer')
                }
              >
                Matomo,
              </Text>
              <Text>{` ${t(
                " an open source analytics platform that will help us improve Ethereum World. As we respect your privacy, rest assured that we don't store personal identifiable information (PPI).",
              )}`}</Text>
            </div>
            <Box pad={{ top: 'small' }}>
              <Checkbox checked={checked} onChange={onChange} toggle={true} />
            </Box>
          </Box>
        </Box>
      </BasicCardBox>
      <BasicCardBox>
        <Box
          pad="medium"
          justify="center"
          align="start"
          border={{ side: 'bottom', color: 'border' }}
        >
          <Text weight="bold">{`${t('App Theme')}`}</Text>
        </Box>
        <Box margin="medium" justify="center" align="start" gap="small">
          <Text>{`${t("Choose your preference for the Ethereum World's theme")}: `}</Text>
          <RadioButtonGroup
            gap="small"
            name="reasons"
            options={['Dark Theme', 'Light Theme']}
            value={theme}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTheme(event.target.value)}
          />
        </Box>
      </BasicCardBox>
    </Box>
  );
};

export default SettingsPage;
