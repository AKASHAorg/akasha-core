import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';
import { useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Separator } from '@akashaorg/ui/lib/components/separator';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import Toggle from '@akashaorg/design-system-core/lib/components/Toggle';
import routes, { RESULTS } from '../../routes';
const SettingsPage: React.FC = () => {
  const { t } = useTranslation('app-search');
  const { getCorePlugins, uiEvents } = useRootComponentProps();
  const _uiEvents = useRef(uiEvents);
  const [showNsfwContent, setShowNsfwContent] = React.useState(false);

  // check if show NSFW option has already been set
  React.useEffect(() => {
    if (window.localStorage) {
      setShowNsfwContent(Boolean(JSON.parse(localStorage.getItem('searchApp-showNsfwContent'))));
    }
  }, []);

  //for the button, disabled when no change made, enabled when there's an change
  const [updateButtonDisabled, setUpdateButtonDisabled] = React.useState(true);
  const showNSFWChangeHandler = () => {
    setShowNsfwContent(!showNsfwContent);
  };
  const navigateTo = getCorePlugins().routing.navigateTo;
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
        _uiEvents.current.next({
          event: NotificationEvents.ShowNotification,
          data: {
            type: NotificationTypes.Success,
            title: 'Search settings updated successfully',
          },
        });
      }

      // disable the button again after saving preferences
      setUpdateButtonDisabled(true);

      // navigate to search page
      setTimeout(() => {
        goToSearchPage();
      }, 3000);
    } catch (error) {
      _uiEvents.current.next({
        event: NotificationEvents.ShowNotification,
        data: {
          type: NotificationTypes.Error,
          title: 'Something went wrong. Retry',
        },
      });
    }
  };
  return (
    <Card className="p-2 h-full md:h-min space-y-4 flex flex-col rounded-[1.25rem]">
      <Typography variant="h5" className="text-center">
        {t('Search Settings')}
      </Typography>

      <Separator className="my-2" />
      <Stack justifyContent="between" direction="row">
        <Typography variant="h6">
          <>{t('Show NSFW Content')}</>
        </Typography>
        <Toggle checked={showNsfwContent} onChange={showNSFWChangeHandler} size="small" />
      </Stack>
      <Typography variant="xs" className="font-medium text-grey7 dark:text-grey6">
        {t(
          'If you enable NSFW content, any sensitive content will show up in your search results when you lookup anything.',
        )}
      </Typography>
      <Stack direction="row" justifyContent="end" spacing={4} className="w-full pr-2 pb-2 pt-32">
        <Button
          variant="link"
          onClick={cancelHandler}
          className="secondaryLight dark:secondaryDark"
        >
          {t('Cancel')}
        </Button>
        <Button onClick={confirmHandler} disabled={updateButtonDisabled}>
          {t('Update')}
        </Button>
      </Stack>
    </Card>
  );
};
export default SettingsPage;
