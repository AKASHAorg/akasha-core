import { APP_EVENTS } from '@akashaproject/sdk-typings/lib/interfaces/events';
import {
  ModalNavigationOptions,
  ILoaderConfig,
  IAppConfig,
  BaseIntegrationInfo,
  IntegrationRegistrationOptions,
  UIEventData,
  ExtensionPointDefinition,
  EventTypes,
  IntegrationModule,
  PluginConf,
  IMenuList,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import {
  Observable,
  distinctUntilChanged,
  mergeScan,
  shareReplay,
  ReplaySubject,
  pluck,
  of,
} from 'rxjs';
import { getEvents, ObservedEventNames } from './events';
import * as singleSpa from 'single-spa';
import { RootExtensionProps } from '@akashaproject/ui-awf-typings';
import { handleExtensionPointUnmount } from './extensions';

export interface LoaderState {
  activeModal: ModalNavigationOptions;
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
   * Extension configs provided by an app (appConfig.extends)
   * grouped by it's mount point.
   *
   * Used for matching with an extensionPoint name.
   *
   * @param key - the mount point required by the extension
   * @param value - {@link ExtensionPointDefinition}[]
   */
  extensionsByMountPoint: Map<
    string | ((opts: IntegrationRegistrationOptions) => string),
    ExtensionPointDefinition[]
  >;

  /**
   * Extension configs provided by an app
   * grouped by parent app's `name` (from registry)
   * @param key - parent app's name,
   * @param value - {@link ExtensionPointDefinition}[]
   */

  extensionsByParent: Map<string, ExtensionPointDefinition[]>;

  /**
   * Parcel store for extensions
   * @param extensionParcel - key: string - extensionID (unique),
   *    value: `{ parcel: {@link Parcel}, id: string, parent: string }`;
   */
  extensionParcels: Map<
    string,
    { parcel: singleSpa.Parcel<RootExtensionProps>; id: string; parent: string }[]
  >;
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

  menuItems: IMenuList;
  layoutReady: boolean;
}

// export to be used in tests
export const defaultInitialState: LoaderState = {
  activeModal: { name: null },
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
  extensionsByMountPoint: new Map(),
  extensionsByParent: new Map(),
  extensionParcels: new Map(),
  uninstallAppRequest: null,
  appNotInstalled: false,
  spaEvents: null,
  plugins: {},
  menuItems: { nextIndex: 1, items: [] },
  layoutReady: false,
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
  data?: { name: string } & BaseIntegrationInfo;
}

export const initState = (
  worldConfig: ILoaderConfig,
  globalChannel: ReplaySubject<unknown>,
  initialState?: LoaderState,
): Observable<LoaderState> =>
  getEvents(globalChannel /* , worldConfig */).pipe(
    mergeScan<Partial<LoaderState> & EventDataTypes, LoaderState>((state, newData) => {
      switch (newData.event) {
        case EventTypes.ExtensionPointMount:
          const extPoints = new Map(state.mountedExtPoints);
          extPoints.set(newData.data.name, newData.data);
          return of({
            ...state,
            mountedExtPoints: extPoints,
          });
        case EventTypes.ExtensionPointUnmount:
          return handleExtensionPointUnmount(state, newData.data);
        case APP_EVENTS.INFO_READY:
          const manifests = state.manifests.slice();
          manifests.push(newData.data);
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
    shareReplay(1),
  );
