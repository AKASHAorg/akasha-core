import getSDK from '@akashaproject/awf-sdk';
import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import { IAwfSDK } from '@akashaproject/sdk-typings';
import {
  BaseIntegrationInfo,
  EventTypes,
  ILoaderConfig,
  ISdkConfig,
  ModalNavigationOptions,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import { hideSplash, showSplash } from './splash-screen';
import {
  catchError,
  forkJoin,
  from,
  fromEvent,
  map,
  mapTo,
  mergeMap,
  of,
  partition,
  Subject,
  switchMap,
  tap,
  toArray,
} from 'rxjs';
import qs from 'qs';
// import { getIntegrationInfo } from './registry';

const handleModals = (activeModal: ModalNavigationOptions | null, logger: ILogger) => () => {
  const { search } = window.location;
  const searchObj = qs.parse(search, {
    ignoreQueryPrefix: true,
  }) as { modal: ModalNavigationOptions } | undefined;

  if (activeModal && searchObj.modal) {
    logger.info(`Unmounting modal ${searchObj.modal.name}`);
    return of({
      event: EventTypes.ModalUnmountRequest,
      data: activeModal,
    });
  }
  if (searchObj.modal && (!activeModal || activeModal.name !== searchObj.modal.name)) {
    logger.info(`Mounting modal ${searchObj.modal.name}`);
    return of({
      event: EventTypes.ModalMountRequest,
      data: searchObj.modal,
    });
  }
  return of(null);
};

interface IntegrationRegistryInfo {
  name: string;
  version: string;
}

export default class AppLoader {
  private readonly worldConfig: ILoaderConfig & ISdkConfig;
  private readonly loaderLogger: ILogger;
  private readonly sdk: IAwfSDK;
  private manifests: IntegrationRegistryInfo[];
  private isWatchingEvents: boolean;

  private uiEvents: Subject<unknown>;
  private activeModal: ModalNavigationOptions | null;

  private appConfigs: Map<string, unknown>;
  private widgetConfigs: Map<string, unknown>;
  private extensionConfigs: Map<string, unknown>;
  private widgetConfigsByMountPoint: Map<string, unknown>;
  private appConfigsByMountPoint: Map<string, unknown>;
  private extensionConfigsByMountPoint: Map<string, unknown>;

  constructor(worldConfig: ILoaderConfig & ISdkConfig, sdk: ReturnType<typeof getSDK>) {
    this.worldConfig = worldConfig;
    this.loaderLogger = sdk.services.log.create('app-loader');
    this.sdk = sdk;

    this.uiEvents = new Subject();

    this.manifests = [];

    this.appConfigs = new Map();
    this.widgetConfigs = new Map();
    this.extensionConfigs = new Map();

    this.widgetConfigsByMountPoint = new Map();
    this.appConfigsByMountPoint = new Map();
    this.extensionConfigsByMountPoint = new Map();

    this.activeModal = null;
    this.isWatchingEvents = false;
  }

  private watchEvents() {
    if (this.isWatchingEvents) {
      this.loaderLogger.warn('events already being watched');
      return;
    }

    fromEvent(window, 'sigleSpa:firstMount')
      .pipe(tap(() => hideSplash()))
      .subscribe();

    fromEvent(window, 'sigleSpa:before-routing-event')
      .pipe(
        switchMap(handleModals(this.activeModal, this.loaderLogger)),
        catchError(err => {
          this.loaderLogger.error(err);
          throw new Error(err);
        }),
      )
      .pipe(mapTo(this.uiEvents))
      .subscribe();

    this.isWatchingEvents = true;
  }

  public async start() {
    showSplash();
    this.watchEvents();

    const defaultIntegrations = [
      this.worldConfig.layout,
      this.worldConfig.homepageApp,
      ...this.worldConfig.defaultApps,
      ...this.worldConfig.defaultWidgets,
    ];
    this.getIntegrationsData(defaultIntegrations).subscribe(v => console.log(v, 'package infos'));
  }
  private importIntegration = (manifest: BaseIntegrationInfo) => {
    if (manifest.sources.length === 0) {
      this.loaderLogger.warn(
        `No source path was found for integration ${manifest.name}. Skipping!`,
      );
      return of({
        module: null,
        manifest,
      });
    }
    const source = manifest.sources[0];
    if (manifest.sources.length > 1) {
      this.loaderLogger.warn(
        `Multiple sources found for integration ${manifest.name}. Using ${source}`,
      );
    }

    return from(System.import(source)).pipe(map(mod => ({ manifest, module: mod })));
  };
  private setupIntegration = ({
    manifest,
    module,
  }: {
    manifest: BaseIntegrationInfo;
    module: System.Module;
  }) => {
    if (!module) {
      return of(null);
    }
    if (typeof module.register === 'function') {
      return from(module.register()).pipe(map(config => ({ manifest, module, config })));
    }
  };

  private getIntegrationsData = (integrationNames: string[]) => {
    const [local$, remote$] = partition(
      from(integrationNames),
      integrationName =>
        !!this.worldConfig.registryOverrides.find(int => int.name === integrationName),
    );

    //get package info from remote registry
    const remoteInterations = remote$
      .pipe(map(name => ({ name })))
      .pipe(toArray())
      .pipe(
        mergeMap(integrations =>
          this.sdk.api.icRegistry.getLatestReleaseInfo(integrations).pipe(
            map((resp: any) => {
              if (!resp.data) {
                throw new Error(
                  `Error getting release info from registry!
                    ${resp.error ? resp.error.message : ''}`,
                );
              }
              return resp.data.getLatesReleaseInfo;
            }),
          ),
        ),
      )
      .pipe(toArray());

    //get package info from local registry (overrides)
    const localIntegrations = local$
      .pipe(map(name => this.worldConfig.registryOverrides.find(int => int.name === name)))
      .pipe(toArray());

    return forkJoin([remoteInterations, localIntegrations]).pipe(
      map(([remote, local]) => [...remote, ...local]),
    );
  };
}
