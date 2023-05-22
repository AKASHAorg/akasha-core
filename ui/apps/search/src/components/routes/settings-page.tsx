import React from 'react';
import { tw } from '@twind/core';
import { LoginState } from '@akashaorg/ui-awf-hooks';
import routes, { RESULTS } from '../../routes';
import { RootComponentProps, ModalNavigationOptions } from '@akashaorg/typings/ui';
import { useTranslation } from 'react-i18next';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Snackbar, { SnackBarType } from '@akashaorg/design-system-core/lib/components/Snackbar';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Toggle from '@akashaorg/design-system-core/lib/components/Toggle';

interface ISettingsPageProps extends RootComponentProps {
  onError?: (err: Error) => void;
  loginState: LoginState;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
}

const SettingsPage: React.FC<ISettingsPageProps> = props => {
  const { t } = useTranslation('app-notifications');
  const { plugins } = props;

  const [selected, setSelected] = React.useState(true);

  // for displaying feedback messages
  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState('success');

  const [showFeedback, setShowFeedback] = React.useState(false);

  if (showFeedback) {
    setTimeout(() => {
      setShowFeedback(false);
    }, 6000);
  }

  const [showNsfwContent, setShowNsfwContent] = React.useState(false);

  // check if snooze notification option has already been set
  React.useEffect(() => {
    if (window.localStorage) {
      setShowNsfwContent(JSON.parse(localStorage.getItem('searchApp-showNsfwContent')));
    }
  }, []);

  //for the button, disabled when no change made, enabled when there's an change
  const [updateButtonDisabled, setUpdateButtonDisabled] = React.useState(true);

  const snoozeChangeHandler = () => {
    setShowNsfwContent(!showNsfwContent);
  };

  const navigateTo = plugins['@akashaorg/app-routing']?.routing.navigateTo;

  const goToSearchPage = () => {
    // navigate to final step or go back to notifications page depending whether it's the first time accessing the app or not
    return navigateTo?.({
      appName: '@akashaorg/app-search',
      getNavigationUrl: () => routes[RESULTS],
    });
  };

  // detects if user changes any of the setting options and then enable the Update button
  React.useEffect(() => {
    setUpdateButtonDisabled(!updateButtonDisabled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, showNsfwContent]);

  const cancelHandler = () => {
    // navigate to final step
    goToSearchPage();
  };

  const confirmHandler = () => {
    try {
      if (window.localStorage) {
        if (showNsfwContent && !localStorage.getItem('searchApp-showNsfwContent')) {
          localStorage.setItem('searchApp-showNsfwContent', JSON.stringify(true));
        }

        if (!showNsfwContent && localStorage.getItem('searchApp-showNsfwContent')) {
          localStorage.removeItem('searchApp-showNsfwContent');
        }
        setMessage('Search settings updated successfully');
      }

      // disable the button again after saving preferences
      setUpdateButtonDisabled(true);

      // navigate to search page
      goToSearchPage();
    } catch (error) {
      setMessage('Something went wrong. Retry');
      setMessageType('error');
    }
    setShowFeedback(true);
  };

  return (
    <>
      <Card
        direction="row"
        elevation={'1'}
        radius={16}
        padding={{ x: 8, y: 8 }}
        customStyle="h-full md:h-min space-y-4"
      >
        <Text variant="h5" align="center">
          {t('Search Settings')}
        </Text>

        <Divider customStyle="my-2" />
        <Box customStyle="flex justify-between">
          <Text variant="h6">
            <>{t('Show NSFW Content')}</>
          </Text>
          <Toggle checked={showNsfwContent} onChange={snoozeChangeHandler} size="large" />
        </Box>
        <Text variant="footnotes2">
          <>
            {t(
              'If you enable NSFW content, any sensitive content will show up in your search results when you lookup anything.',
            )}
          </>
        </Text>
        <div className={tw('w-full flex justify-end space-x-4 pr-2 pb-2 mt-16')}>
          <Button
            variant="text"
            label={t('Cancel')}
            color="secondaryLight dark:secondaryDark"
            onClick={cancelHandler}
          />
          <Button
            variant="primary"
            label={t('Update')}
            onClick={confirmHandler}
            disabled={updateButtonDisabled}
          />
        </div>
      </Card>
      {showFeedback && (
        <div className={tw('-mt-12 md:mt-4 z-50 w-full')}>
          <Snackbar
            title={t('{{notificationMessage}}', { notificationMessage: message })}
            type={messageType as SnackBarType}
            handleDismiss={() => setShowFeedback(false)}
          />
        </div>
      )}
    </>
  );
};
export default SettingsPage;
