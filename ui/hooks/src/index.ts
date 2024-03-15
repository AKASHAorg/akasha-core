import 'systemjs-webpack-interop/auto-public-path';
// these hooks should remain
export * from './dummy-hooks';
export * from './use-root-props';
export * from './use-global-login';
export * from './use-analytics';
export * from './utils/provider-hoc';
export * from './utils/generic-utils';
export * from './utils/entry-utils';
export * from './utils/media-utils';
export * from './utils/event-utils';
export * from './use-login.new';
export { hasOwn } from './utils/has-own';
export { sortByKey } from './utils/sort-by-key';
export { getFollowList } from './utils/getFollowList';
export { createReactiveVar } from './utils/create-reactive-var';
export {
  useNetworkState,
  useCurrentNetwork,
  useRequiredNetwork,
  switchToRequiredNetwork,
  useNetworkChangeListener,
} from './use-network-state';
export { useEntryNavigation } from './use-navigation';
export { useLegalDoc } from './use-legal';
export { usePlaformHealthCheck } from './use-health-check';
export { useDismissedCard } from './use-dismissed-card';
export { useValidDid } from './use-valid-did';
export { useModerationCategory } from './use-moderation-categories';
export { useAccordion } from './use-accordion';

// the following hooks needs refactor/reimplementation
export {
  useCheckNewNotifications,
  useMarkAsRead,
  useListenForMutationEvents,
} from './use-notifications';

export { useShowFeedback } from './use-show-feedback';
export { useTheme } from './use-theme';
export { useProfileStats } from './use-profile-stats';
export { useSaveSettings, useGetSettings } from './use-settings';
export { useNsfwToggling } from './use-nsfw';
export { useMentions } from './use-mentions';
