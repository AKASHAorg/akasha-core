import { APP_EVENTS } from '@akashaorg/typings/lib/sdk';
import { IntegrationReleaseInfoFragmentFragment } from '@akashaorg/typings/lib/sdk/graphql-operation-types';
import {
  ModalNavigationOptions,
  WorldConfig,
  IAppConfig,
  UIEventData,
  EventTypes,
  PluginConf,
  IntegrationRegistrationOptions,
  EventDataTypes,
} from '@akashaorg/typings/lib/ui';
import {
  Observable,
  distinctUntilChanged,
  mergeScan,
  shareReplay,
  ReplaySubject,
  pluck,
  of,
  catchError,
} from 'rxjs';
import { getEvents, ObservedEventNames } from './events';
import * as singleSpa from 'single-spa';
import getSDK from '@akashaorg/awf-sdk';

export interface LoaderState {
  modalRequest: ModalNavigationOptions | null;
  enableIntegrationRequest: string;
  disableIntegrationRequest: string;
  user: { waitForAuth: boolean; ethAddress: string };
  /**
   * Integration cofiguration.
   * This is the return value of the `<module>.register()` function.
   */
  integrationConfigs: Map<string, IAppConfig & { name: string }>;
  integrationsByMountPoint: Map<string, (IAppConfig & { name: string })[]>;
  /*
   * Generic Integration manifest data from registry
   * @Todo: fix my type ...
   */
  manifests: IntegrationReleaseInfoFragmentFragment[];
  layoutConfig: IAppConfig;
  /**
   * SystemJS imported modules
   * @param key - name of the application
   * @param value - SystemJS Module - all exported functions of an app.
   */
  modules: Map<
    string,
    {
      register?: (opts: IntegrationRegistrationOptions) => IAppConfig;
      initialize?: (opts: Partial<IntegrationRegistrationOptions>) => Promise<void> | void;
      getPlugin?: (
        opts: Omit<IntegrationRegistrationOptions, 'layoutConfig'> & {
          encodeAppName: (name: string) => string;
          decodeAppName: (name: string) => string;
        },
      ) => Promise<PluginConf>;
    }
  >;

  /**
   * When an extension point mounts, it will fire an event with the name of the
   * extension point and some additional data.
   * Here we are storing currently mounted extension points.
   * @param key - name of the extension point
   * @param value - extensionPoint's data {@link UIEventData.data}
   */
  mountedExtPoints: Map<string, EventDataTypes>;

  /**
   * Identifier of the app that will be uninstalled
   */
  uninstallAppRequest: { name: string };
  /*
   * True when the url does not match any of the installed apps.
   */
  appNotInstalled: boolean;
  /*
   * keep single-spa's state in sink
   *
   */
  spaEvents: { eventName: ObservedEventNames; detail: singleSpa.SingleSpaCustomEventDetail };

  // plugins that are provided by apps
  plugins: PluginConf;
  layoutReady: boolean;

  // extension points that must be unmounted
  unmountingExtensionPoints: IntegrationReleaseInfoFragmentFragment[];
}

// export to be used in tests
export const defaultInitialState: LoaderState = {
  // activeModal: { name: null },
  modalRequest: { name: null },
  enableIntegrationRequest: null,
  disableIntegrationRequest: null,
  user: { waitForAuth: false, ethAddress: null },
  integrationConfigs: new Map(),
  integrationsByMountPoint: new Map(),
  manifests: [],
  layoutConfig: null,
  modules: new Map(),
  mountedExtPoints: new Map(),
  uninstallAppRequest: null,
  appNotInstalled: false,
  spaEvents: null,
  plugins: {},
  layoutReady: false,
  unmountingExtensionPoints: [],
};

type GetStateSlice = <K extends keyof LoaderState>(
  key: K,
) => (state: Observable<LoaderState>) => Observable<LoaderState[K]>;

export const getStateSlice: GetStateSlice = key => obs$ =>
  obs$.pipe(pluck(key), distinctUntilChanged());

// /*
//  * Initialize the state from initialState
//  */
export interface MergedEventDataTypes {
  event?: EventTypes & APP_EVENTS.REMOVED & APP_EVENTS.INFO_READY;
  data?: UIEventData['data'] & IntegrationReleaseInfoFragmentFragment;
}

export const initState = (
  worldConfig: WorldConfig,
  globalChannel: ReplaySubject<unknown>,
  initialState?: LoaderState,
): Observable<LoaderState> => {
  const logger = getSDK().services.log.create('AppLoader-State');
  return getEvents(globalChannel /* , worldConfig */).pipe(
    mergeScan<Partial<LoaderState> & MergedEventDataTypes, LoaderState>((state, newData) => {
      switch (newData.event) {
        case EventTypes.ExtensionPointMount:
          const extPoints = new Map(state.mountedExtPoints);
          extPoints.set(newData.data.name, newData.data as EventDataTypes);
          return of({
            ...state,
            mountedExtPoints: extPoints,
          });
        case EventTypes.ExtensionPointUnmount:
          return of({
            ...state,
            unmountingExtensionPoints: state.unmountingExtensionPoints.concat(newData.data),
          });
        case APP_EVENTS.INFO_READY:
          const manifests = state.manifests.slice();
          if (worldConfig.registryOverrides.find(override => override.name === newData.data.name)) {
            return of({
              ...state,
              manifests: [
                ...manifests,
                worldConfig.registryOverrides.find(override => override.name === newData.data.name),
              ],
            });
          }
          if (!manifests.find(el => el.name === newData.data.name)) {
            manifests.push(newData.data);
          }
          return of({
            ...state,
            manifests,
          });
        case APP_EVENTS.REMOVED:
          return of({
            ...state,
            uninstallAppRequest: newData.data,
          });
        default:
          return of({
            ...state,
            ...newData,
          });
      }
    }, initialState ?? defaultInitialState),
    catchError(err => {
      logger.error(`[state]: ${err.message ?? JSON.stringify(err)}`);
      return of(defaultInitialState);
    }),
    shareReplay(1),
  );
};
