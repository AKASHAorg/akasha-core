import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import DS from '@akashaproject/design-system';
import { RootExtensionProps } from '@akashaproject/ui-awf-typings';
import {
  useDeleteBookmark,
  useGetBookmarks,
  useGetLogin,
  useSaveBookmark,
  withProviders,
  useAnalytics,
  ThemeWrapper,
} from '@akashaproject/ui-awf-hooks';
import { ItemTypes } from '@akashaproject/ui-awf-typings/lib/app-loader';
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
      (bookmark: { entryId: string; entryType: ItemTypes }) =>
        bookmark.entryId === extensionData.entryId,
    );
  }, [bookmarkReq.data, extensionData]);

  const handleEntryBookmark = () => {
    const { entryId, entryType } = extensionData;
    if (loggedUserReq.isSuccess && loggedUserReq.data.ethAddress) {
      if (isBookmarked) {
        bookmarkDelete.mutate(entryId);
      }
      if (!isBookmarked) {
        analyticsActions.trackEvent({
          category: 'Post',
          action: 'Bookmark',
        });
        bookmarkCreate.mutate({ entryId, itemType: entryType });
      }
    } else {
      props.navigateToModal({ name: 'login' });
    }
  };

  return (
    <BookmarkButton
      label={isBookmarked ? t('Saved') : t('Save')}
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
  <I18nextProvider i18n={props.plugins?.translation?.i18n}>
    <EntryCardSaveButton {...props} />
  </I18nextProvider>
);

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(BookmarkButtonWrapper),
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
