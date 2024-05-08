import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOMClient from 'react-dom/client';
import { RootExtensionProps, EntityTypes, AnalyticsCategories } from '@akashaorg/typings/lib/ui';
import {
  withProviders,
  useAnalytics,
  useRootComponentProps,
  useAkashaStore,
} from '@akashaorg/ui-awf-hooks';
import { I18nextProvider } from 'react-i18next';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import {
  BookmarkIcon,
  ExclamationCircleIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

type CardSaveButtonExtensionData = {
  itemId: string;
  itemType: EntityTypes;
};
const EntryCardSaveButton = (props: RootExtensionProps<CardSaveButtonExtensionData>) => {
  const { extensionData } = props;
  const {
    data: { authenticatedDID },
  } = useAkashaStore();
  const isLoggedIn = !!authenticatedDID;
  const bookmarkReq = null;
  const bookmarkCreate = null;
  const bookmarkDelete = null;
  const [analyticsActions] = useAnalytics();

  const isBookmarked = React.useMemo(() => {
    return bookmarkReq.data?.some(
      (bookmark: { itemId: string; itemType: EntityTypes }) =>
        bookmark.itemId === extensionData.itemId,
    );
  }, [bookmarkReq.data, extensionData]);

  const handleEntryBookmark = () => {
    const { itemId, itemType } = extensionData;
    if (isLoggedIn) {
      if (isBookmarked) {
        analyticsActions.trackEvent({
          category: AnalyticsCategories.BEAM,
          action: 'Beam Bookmark Removed',
        });
        bookmarkDelete.mutate(itemId);
      }
      if (!isBookmarked) {
        analyticsActions.trackEvent({
          category: AnalyticsCategories.BEAM,
          action: 'Beam Bookmarked',
        });
        bookmarkCreate.mutate({ entryId: itemId, itemType: itemType });
      }
    } else {
      props.navigateToModal({ name: 'login' });
    }
  };

  return (
    <Stack align="center">
      <Button onClick={handleEntryBookmark} plain>
        <Icon
          icon={<BookmarkIcon />}
          accentColor={true}
          customStyle={isBookmarked && `[&>*]:fill-secondaryLight dark:[&>*]:fill-secondaryDark`}
        />
      </Button>
    </Stack>
  );
};

const BookmarkButtonWrapper = (props: RootExtensionProps<CardSaveButtonExtensionData>) => {
  const { getTranslationPlugin } = useRootComponentProps();
  return (
    <I18nextProvider i18n={getTranslationPlugin().i18n}>
      <EntryCardSaveButton {...props} />
    </I18nextProvider>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: withProviders(BookmarkButtonWrapper),
  errorBoundary: (err, errorInfo, props: RootExtensionProps<CardSaveButtonExtensionData>) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo}`);
    }

    return <Icon icon={<ExclamationCircleIcon />} />;
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
