import { APP_EVENTS } from '@akashaorg/typings/sdk';
import {
  ModalNavigationOptions,
  ILoaderConfig,
  IAppConfig,
  BaseIntegrationInfo,
  UIEventData,
  EventTypes,
  IntegrationModule,
  PluginConf,
} from '@akashaorg/typings/ui';
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
   */
  manifests: BaseIntegrationInfo[];
  layoutConfig: IAppConfig;
  /**
   * SystemJS imported modules
   * @param key - name of the application
   * @param value - SystemJS Module - all exported functions of an app.
   */
  modules: Map<string, IntegrationModule>;

  /**
   * When an extension point mounts, it will fire an event with the name of the
   * extension point and some additional data.
   * Here we are storing currently mounted extension points.
   * @param key - name of the extension point
   * @param value - extensionPoint's data {@link UIEventData.data}
   */
  mountedExtPoints: Map<string, UIEventData['data']>;

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
  unmountingExtensionPoints: ({ name: string } & BaseIntegrationInfo)[];
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

/*
 * Initialize the state from from initialState
 */
interface EventDataTypes {
  event?: EventTypes & APP_EVENTS.REMOVED & APP_EVENTS.INFO_READY;
  data?: UIEventData['data'] & ({ name: string } & BaseIntegrationInfo);
}

export const initState = (
  worldConfig: ILoaderConfig,
  globalChannel: ReplaySubject<unknown>,
  initialState?: LoaderState,
): Observable<LoaderState> => {
  const logger = getSDK().services.log.create('AppLoader-State');
  return getEvents(globalChannel /* , worldConfig */).pipe(
    mergeScan<Partial<LoaderState> & EventDataTypes, LoaderState>((state, newData) => {
      switch (newData.event) {
        case EventTypes.ExtensionPointMount:
          const extPoints = new Map(state.mountedExtPoints);
          extPoints.set(newData.data.name, newData.data);
          return of({
            ...state,
            mountedExtPoints: extPoints,
          });
        // case EventTypes.ExtensionPointUnmount:
        //   return of({
        //     ...state,
        //     unmountingExtensionPoints: state.unmountingExtensionPoints.concat(newData.data),
        //   });
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
