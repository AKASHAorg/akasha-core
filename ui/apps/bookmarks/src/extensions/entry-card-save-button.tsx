import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import DS from '@akashaproject/design-system';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import {
  useDeleteBookmark,
  useGetBookmarks,
  useGetLogin,
  useSaveBookmark,
  withProviders,
  useAnalytics,
} from '@akashaproject/ui-awf-hooks';
import { ItemTypes } from '@akashaproject/ui-awf-typings/lib/app-loader';
import Icon from '@akashaproject/design-system/lib/components/Icon';

const { styled, TextIcon, ThemeSelector, lightTheme, darkTheme } = DS;

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

const EntryCardSaveButton = (props: RootComponentProps) => {
  const { extensionData } = props;
  const loggedUserReq = useGetLogin();
  const bookmarkReq = useGetBookmarks(loggedUserReq.data.ethAddress, loggedUserReq.data.isReady);
  const bookmarkCreate = useSaveBookmark();
  const bookmarkDelete = useDeleteBookmark();
  const [analyticsActions] = useAnalytics();

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
      label={isBookmarked ? 'Saved' : 'Save'}
      iconType="bookmark"
      iconSize="sm"
      fontSize="large"
      onClick={handleEntryBookmark}
      isBookmarked={isBookmarked}
      clickable={true}
    />
  );
};

const BookmarkButtonWrapper = (props: RootComponentProps) => <EntryCardSaveButton {...props} />;

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(BookmarkButtonWrapper),
  errorBoundary: (err, errorInfo, props: RootComponentProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo}`);
    }

    return (
      <ThemeSelector
        availableThemes={[lightTheme, darkTheme]}
        settings={{ activeTheme: 'LightTheme' }}
      >
        <Icon type="error" size="sm" />
      </ThemeSelector>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
