import React from 'react';
import { tw } from '@twind/core';
import routes, { RESULTS } from '../../routes';
import { RootComponentProps, ModalNavigationOptions, Profile } from '@akashaorg/typings/ui';
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
  loggedProfileData: Profile;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
}

const SettingsPage: React.FC<ISettingsPageProps> = props => {
  const { t } = useTranslation('app-search');
  const { plugins } = props;

  // for displaying feedback messages
  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState('success');

  const [showFeedback, setShowFeedback] = React.useState(false);

  if (showFeedback) {
    setTimeout(() => {
      setShowFeedback(false);
    }, 3000);
  }

  const [showNsfwContent, setShowNsfwContent] = React.useState(false);

  // check if show NSFW option has already been set
  React.useEffect(() => {
    if (window.localStorage) {
      setShowNsfwContent(JSON.parse(localStorage.getItem('searchApp-showNsfwContent')));
    }
  }, []);

  //for the button, disabled when no change made, enabled when there's an change
  const [updateButtonDisabled, setUpdateButtonDisabled] = React.useState(true);

  const showNSFWChangeHandler = () => {
    setShowNsfwContent(!showNsfwContent);
  };

  const navigateTo = plugins['@akashaorg/app-routing']?.routing.navigateTo;

  const goToSearchPage = () => {
    return navigateTo?.({
      appName: '@akashaorg/app-search',
      getNavigationUrl: () => routes[RESULTS],
    });
  };

  // detects if user changes any of the setting options and then enable the Update button
  React.useEffect(() => {
    setUpdateButtonDisabled(!updateButtonDisabled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNsfwContent]);

  const cancelHandler = () => {
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
      setTimeout(() => {
        goToSearchPage();
      }, 3000);
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
          <Toggle checked={showNsfwContent} onChange={showNSFWChangeHandler} size="large" />
        </Box>
        <Text variant="footnotes2" color={{ light: 'grey7', dark: 'grey6' }}>
          <>
            {t(
              'If you enable NSFW content, any sensitive content will show up in your search results when you lookup anything.',
            )}
          </>
        </Text>
        <div className={tw('w-full flex justify-end space-x-4 pr-2 pb-2 pt-32')}>
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
