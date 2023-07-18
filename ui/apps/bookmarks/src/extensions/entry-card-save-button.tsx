import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import { RootExtensionProps, EntityTypes, AnalyticsCategories } from '@akashaorg/typings/ui';
import {
  useDeleteBookmark,
  useGetBookmarks,
  useGetLogin,
  useSaveBookmark,
  withProviders,
  useAnalytics,
} from '@akashaorg/ui-awf-hooks';
import { I18nextProvider } from 'react-i18next';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';

const EntryCardSaveButton = (props: RootExtensionProps) => {
  const { extensionData } = props;
  const loggedUserReq = useGetLogin();
  const bookmarkReq = useGetBookmarks(loggedUserReq.data?.id, loggedUserReq.isSuccess);
  const bookmarkCreate = useSaveBookmark();
  const bookmarkDelete = useDeleteBookmark();
  const [analyticsActions] = useAnalytics();

  const isBookmarked = React.useMemo(() => {
    return bookmarkReq.data?.some(
      (bookmark: { itemId: string; itemType: EntityTypes }) =>
        bookmark.itemId === extensionData.itemId,
    );
  }, [bookmarkReq.data, extensionData]);

  const handleEntryBookmark = () => {
    const { itemId, itemType } = extensionData;
    if (loggedUserReq.isSuccess && loggedUserReq.data.ethAddress) {
      if (isBookmarked) {
        analyticsActions.trackEvent({
          category: AnalyticsCategories.POST,
          action: 'Beam Bookmark Removed',
        });
        bookmarkDelete.mutate(itemId);
      }
      if (!isBookmarked) {
        analyticsActions.trackEvent({
          category: AnalyticsCategories.POST,
          action: 'Beam Bookmarked',
        });
        bookmarkCreate.mutate({ entryId: itemId, itemType: itemType });
      }
    } else {
      props.navigateToModal({ name: 'login' });
    }
  };

  return (
    <Box customStyle={'flex items-center'}>
      <button onClick={handleEntryBookmark}>
        <Icon
          type="BookmarkIcon"
          accentColor={true}
          customStyle={isBookmarked && `[&>*]:fill-secondaryLight dark:[&>*]:fill-secondaryDark`}
        />
      </button>
    </Box>
  );
};

const BookmarkButtonWrapper = (props: RootExtensionProps) => (
  <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
    <EntryCardSaveButton {...props} />
  </I18nextProvider>
);

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient: ReactDOM,
  rootComponent: withProviders(BookmarkButtonWrapper),
  errorBoundary: (err, errorInfo, props: RootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo}`);
    }

    return <Icon type="ExclamationCircleIcon" />;
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
