import 'systemjs-webpack-interop/auto-public-path';
// these hooks should remain
export * from './dummy-hooks';
export * from './use-root-props';
export * from './use-global-login';
export * from './use-analytics';
export * as constants from './constants';
export * from './utils/provider-hoc';
export * from './utils/generic-utils';
export * from './utils/entry-utils';
export * from './utils/media-utils';

// to be removed or filtered
import useReasons from './use-reasons';
import { hasOwn } from './utils/has-own';
import { useQueryListener, useMutationListener, useMutationsListener } from './use-query-listener';

import {
  useCheckNewNotifications,
  useFetchNotifications,
  useMarkAsRead,
} from './use-notifications';
import {
  useNetworkState,
  useCurrentNetwork,
  useRequiredNetwork,
  switchToRequiredNetwork,
  useNetworkChangeListener,
} from './use-network-state';

export * from './use-login.new';
import { useLegalDoc } from './use-legal';
import { useEntryNavigation } from './use-navigation';
import { disconnectProvider, useInjectedProvider } from './use-injected-provider';
import { useIsValidToken } from './use-invite-token-validation';
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
import { usePlaformHealthCheck } from './use-health-check';
import {
  useValidateMessage,
  useAddDevKeyFromMessage,
  useGetDevKeys,
  useDeleteDevKey,
  useSignMessage,
  useVerifySignature,
} from './use-dev-profile';
import { useDismissedCard } from './use-dismissed-card';
import useModerationCategory from './use-moderation-categories';
import { useValidDid } from './use-valid-did';

export {
  hasOwn,
  useReasons,
  // use-query-listener
  useQueryListener,
  useMutationListener,
  useMutationsListener,
  // use-notifications
  useCheckNewNotifications,
  useFetchNotifications,
  useMarkAsRead,
  // use-network
  useNetworkState,
  useCurrentNetwork,
  useNetworkChangeListener,
  useRequiredNetwork,
  switchToRequiredNetwork,
  // use-navigation
  useEntryNavigation,
  // use-legal
  useLegalDoc,
  // use-injected-provider
  useInjectedProvider,
  disconnectProvider,
  // use-invite-token-validation
  useIsValidToken,
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
  usePlaformHealthCheck,
  useValidateMessage,
  useAddDevKeyFromMessage,
  useGetDevKeys,
  useDeleteDevKey,
  useSignMessage,
  useVerifySignature,
  // use-dismissed-card
  useDismissedCard,
  useModerationCategory,
  useValidDid,
};
