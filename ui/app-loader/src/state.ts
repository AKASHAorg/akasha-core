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
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import {
  Observable,
  distinctUntilChanged,
  from,
  filter,
  mergeScan,
  shareReplay,
  ReplaySubject,
  pluck,
  of,
  map,
  mergeAll,
} from 'rxjs';
import { getEvents, ObservedEventNames } from './events';
import * as singleSpa from 'single-spa';
import { RootExtensionProps } from '@akashaproject/ui-awf-typings';

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
  modules: Map<string, { register?: (opts: IntegrationRegistrationOptions) => IAppConfig }>;

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
   * @param extensionParcel - key: string - extensionID (unique), value: {@link Parcel}
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
}

const initialState: LoaderState = {
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

export const initState = (worldConfig: ILoaderConfig, globalChannel: ReplaySubject<unknown>) =>
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
          return handleExtensionPointUnmount(state, newData);
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
    }, initialState),
    shareReplay(1),
  );

/*
 * Handle extension point unmount event
 */
const handleExtensionPointUnmount = (
  state: LoaderState,
  eventData: Partial<LoaderState> & EventDataTypes,
) => {
  return from(state.mountedExtPoints)
    .pipe(filter(([name]) => name === eventData.data.name))
    .pipe(
      map(([, data]) => {
        const parcels = state.extensionParcels.get(data.name);
        if (parcels && parcels.length) {
          return of(state.extensionParcels.get(data.name)).pipe(
            filter(parcels => !!parcels && parcels.length > 0),
            map(parcels =>
              from(
                parcels.map(parcelData => {
                  if (parcelData.parcel.getStatus() === singleSpa.MOUNTED) {
                    return parcelData.parcel.unmount();
                  }
                  return Promise.resolve();
                }),
              ),
            ),
            map(() => {
              const remainingParcels = new Map(state.extensionParcels);
              remainingParcels.delete(eventData.data.name);
              return {
                extData: data,
                extensionParcels: remainingParcels,
              };
            }),
          );
        }
        return of({ extData: data, extensionParcels: new Map() });
      }),
      mergeAll(),
      map(res => {
        const { extData, extensionParcels } = res;
        const mountedExtPoints = new Map(state.mountedExtPoints);
        mountedExtPoints.delete(extData.name);
        return {
          ...state,
          extensionParcels,
          mountedExtPoints,
        };
      }),
    );
};
