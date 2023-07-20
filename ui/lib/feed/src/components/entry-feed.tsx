// import * as React from 'react';
// import { ILocale } from '@akashaorg/design-system-core/lib/utils/time';
// import { useEntryNavigation } from '@akashaorg/ui-awf-hooks';
// import { FeedWidgetProps } from './app';
// import EntryRenderer from './entry-renderer';
// import EntryList, {
//   CardListProps,
// } from '@akashaorg/design-system-components/lib/components/EntryList';
//
// const EntryFeed = (props: FeedWidgetProps) => {
//   const {
//     // uiEvents,
//     // removedByAuthorLabel,
//     // removedByMeLabel,
//     // removeEntryLabel,
//     // onEntryRemove,
//     // contentClickable,
//     // parentIsProfilePage,
//     // onEntryFlag,
//     // modalSlotId,
//     navigateTo,
//     navigateToModal,
//     i18n,
//     loggedProfileData,
//     // itemType,
//     hasNextPage,
//     requestStatus,
//     isFetchingNextPage,
//     onLoadMore,
//     pages,
//     itemSpacing,
//     // trackEvent,
//     // accentBorderTop,
//     // replyFragmentItem,
//     // showReplyFragment,
//     // logger,
//     // onLoginModalOpen,
//   } = props;
//   // const handleEntryNavigate = useEntryNavigation(navigateTo);
//
//   // const handleRepost = (_withComment: boolean, entryId: string) => {
//   //   if (!loggedProfileData?.did.id) {
//   //     navigateToModal({ name: 'login' });
//   //   } else {
//   //     navigateTo?.({
//   //       appName: '@akashaorg/app-akasha-integration',
//   //       getNavigationUrl: () => `/feed?repost=${entryId}`,
//   //     });
//   //   }
//   // };
//
//   return (
//     <EntryList
//       onLoadMore={onLoadMore}
//       requestStatus={requestStatus}
//       isFetchingNextPage={isFetchingNextPage}
//       pages={pages}
//       itemSpacing={itemSpacing}
//       hasNextPage={hasNextPage}
//       languageDirection={i18n?.dir() || 'ltr'}
//     >
//       {(cardListProps: CardListProps) => {
//         return cardListProps.items.map(item => {
//           return <>Test</>;
//         });
//       }}
//     </EntryList>
//   );
// };
//
// export default EntryFeed;
