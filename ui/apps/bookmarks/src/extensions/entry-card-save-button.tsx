import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import DS from '@akashaorg/design-system';
import { RootExtensionProps, EntityTypes, AnalyticsCategories } from '@akashaorg/typings/ui';
import {
  useDeleteBookmark,
  useGetBookmarks,
  useGetLogin,
  useSaveBookmark,
  withProviders,
  useAnalytics,
  ThemeWrapper,
} from '@akashaorg/ui-awf-hooks';
import { I18nextProvider, useTranslation } from 'react-i18next';

const { styled, TextIcon, Icon } = DS;

const BookmarkButton = styled(TextIcon)<{ isBookmarked?: boolean }>`
  svg * {
    ${props => {
      if (props.isBookmarked) {
        return `
          fill: ${props.theme.colors.blue};
          stroke: ${props.theme.colors.blue};
        `;
      }
      return '';
    }}
  }
`;

const EntryCardSaveButton = (props: RootExtensionProps) => {
  const { extensionData } = props;
  const loggedUserReq = useGetLogin();
  const bookmarkReq = useGetBookmarks(loggedUserReq.data.ethAddress, loggedUserReq.data.isReady);
  const bookmarkCreate = useSaveBookmark();
  const bookmarkDelete = useDeleteBookmark();
  const [analyticsActions] = useAnalytics();

  const { t } = useTranslation('app-bookmarks');

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
          action: 'Post Bookmark Removed',
        });
        bookmarkDelete.mutate(itemId);
      }
      if (!isBookmarked) {
        analyticsActions.trackEvent({
          category: AnalyticsCategories.POST,
          action: 'Post Bookmarked',
        });
        bookmarkCreate.mutate({ entryId: itemId, itemType: itemType as EntityTypes });
      }
    } else {
      props.navigateToModal({ name: 'login' });
    }
  };

  return (
    <BookmarkButton
      label={extensionData.hideLabel ? '' : isBookmarked ? t('Saved') : t('Save')}
      iconType="bookmark"
      iconSize="sm"
      fontSize="large"
      onClick={handleEntryBookmark}
      isBookmarked={isBookmarked}
      clickable={true}
    />
  );
};

const BookmarkButtonWrapper = (props: RootExtensionProps) => (
  <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
    <EntryCardSaveButton {...props} />
  </I18nextProvider>
);

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(BookmarkButtonWrapper),
  renderType: 'createRoot',
  errorBoundary: (err, errorInfo, props: RootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo}`);
    }

    return (
      <ThemeWrapper {...props}>
        <Icon type="error" size="sm" />
      </ThemeWrapper>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = () => Promise.resolve();
