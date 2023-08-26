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
export * from './use-login.new';
export { hasOwn } from './utils/has-own';
export { useQueryListener, useMutationListener, useMutationsListener } from './use-query-listener';
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
export { disconnectProvider, useInjectedProvider } from './use-injected-provider';
// the following hooks needs refactor/reimplementation
import {
  useCheckNewNotifications,
  useFetchNotifications,
  useMarkAsRead,
} from './use-notifications';

// hooks to be removed or filtered
import {
  useGetIntegrationInfo,
  useGetAllIntegrationReleaseIds,
  useGetAllIntegrationsIds,
  useGetIntegrationId,
  useGetIntegrationReleaseId,
  useGetIntegrationReleaseInfo,
  useGetIntegrationsReleaseInfo,
  useGetIntegrationsCount,
  useGetIntegrationsInfo,
  useGetLatestReleaseInfo,
} from './use-integration-registry';
import {
  useGetAllInstalledApps,
  useGetAppConfig,
  useInstallApp,
  useUninstallApp,
} from './use-app-settings';
import {
  useValidateMessage,
  useAddDevKeyFromMessage,
  useGetDevKeys,
  useDeleteDevKey,
  useSignMessage,
  useVerifySignature,
} from './use-dev-profile';
import useModerationCategory from './use-moderation-categories';

export {
  // use-notifications
  useCheckNewNotifications,
  useFetchNotifications,
  useMarkAsRead,
  // use-integration-registry
  useGetIntegrationInfo,
  useGetAllIntegrationReleaseIds,
  useGetAllIntegrationsIds,
  useGetIntegrationId,
  useGetIntegrationReleaseId,
  useGetIntegrationReleaseInfo,
  useGetIntegrationsReleaseInfo,
  useGetIntegrationsCount,
  useGetIntegrationsInfo,
  useGetLatestReleaseInfo,
  // use-app-settings
  useGetAllInstalledApps,
  useGetAppConfig,
  useInstallApp,
  useUninstallApp,
  useValidateMessage,
  useAddDevKeyFromMessage,
  useGetDevKeys,
  useDeleteDevKey,
  useSignMessage,
  useVerifySignature,
  useModerationCategory,
};
