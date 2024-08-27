import type AppLoader from '../index';
import getSDK from '@akashaorg/core-sdk';
import { AUTH_EVENTS } from '@akashaorg/typings/lib/sdk';
import { GetAppsByPublisherDidQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { DeepTarget, SystemModuleType } from '../type-utils';
import { IAppConfig } from '@akashaorg/typings/lib/ui';
import { ILogger } from '@akashaorg/typings/lib/sdk/log';

type AkashaAppEdgeNode = DeepTarget<
  GetAppsByPublisherDidQuery,
  ['node', 'akashaAppList', 'edges', 0, 'node']
>;

type ExtensionInstallerOptions = {
  importModule: (extensionData: AppLoader['extensionData'][0]) => Promise<SystemModuleType>;
  getLatestExtensionVersion: (
    appName: string,
    logger?: ILogger,
  ) => Promise<AkashaAppEdgeNode | undefined>;
  initializeExtension: (name: string, module: SystemModuleType) => Promise<void>;
  registerExtension: (name: string, module: SystemModuleType) => IAppConfig & { name: string };
  finalizeInstall: (
    info: AkashaAppEdgeNode,
    extensionModule: SystemModuleType,
    extensionConfig: IAppConfig & { name: string },
  ) => void;
  registerAdditionalResources: (name: string, module: SystemModuleType) => Promise<void>;
};

const statusCodes = {
  error: {
    USER_NOT_CONNECTED: Symbol.for('#user-not-connected'),
    EXTENSION_NOT_FOUND: Symbol.for('#extension_not_found'),
    EXTENSION_FETCH_ERROR: Symbol.for('#extension_fetch_error'),
    EXTENSION_DATA_INVALID: Symbol.for('#extension_data_invalid'),
    EXTENSION_RELEASE_DATA_INVALID: Symbol.for('#extension_release_data_invalid'),
    EXTENSION_IMPORT_ERROR: Symbol.for('#extension_import_error'),
    EXTENSION_INITIALIZATION_FAILED: Symbol.for('#extension_initialization_failed'),
    EXTENSION_REGISTER_RESOURCES_FAILED: Symbol.for('#extension_register_resources_failed'),
    EXTENSION_REGISTRATION_FAILED: Symbol.for('#extension_registration_failed'),
    EXTENSION_INFO_SAVE_FAILED: Symbol.for('#extension_info_save_failed'),
    EXTENSION_FINALIZATION_FAILED: Symbol.for('#extension_finalization_failed'),
  },
  status: {
    FETCHING_EXTENSION_DATA: Symbol.for('#fetching_ext_data'),
    IMPORTING_MODULE: Symbol.for('#importing_module'),
    REGISTERING_RESOURCES: Symbol.for('#registering_resources'),
    REGISTERING_RESOURCES_SUCCESS: Symbol.for('#registering_resources_success'),
    INITIALIZING_EXTENSION: Symbol.for('#initialization'),
    REGISTERING_EXTENSION: Symbol.for('#registering_extension'),
    SAVING_EXTENSION_INFO: Symbol.for('#saving_extension_info'),
    FINALIZING_INSTALL: Symbol.for('#finalizing_install'),
    INSTALL_SUCCESS: Symbol.for('#install_success'),
  },
};

export class ExtensionInstaller {
  readonly #importModule: ExtensionInstallerOptions['importModule'];
  readonly #getLatestExtensionVersion: ExtensionInstallerOptions['getLatestExtensionVersion'];
  readonly #initializeExtension: ExtensionInstallerOptions['initializeExtension'];
  readonly #registerExtension: ExtensionInstallerOptions['registerExtension'];
  readonly #finalizeInstall: ExtensionInstallerOptions['finalizeInstall'];
  readonly #registerAdditionalResources: ExtensionInstallerOptions['registerAdditionalResources'];
  listeners: (({
    currentStatus,
    errorStatus,
  }: {
    currentStatus?: symbol;
    errorStatus?: symbol;
  }) => void)[];
  #sdk: ReturnType<typeof getSDK>;
  #logger: ILogger;
  #extensionName: string;
  #user: { id?: string };
  #extensionInfo?: AkashaAppEdgeNode;
  #extensionModule: SystemModuleType;
  #extensionConfig: IAppConfig & { name: string };

  constructor(options: ExtensionInstallerOptions) {
    this.#importModule = options.importModule;
    this.#getLatestExtensionVersion = options.getLatestExtensionVersion;
    this.#initializeExtension = options.initializeExtension;
    this.#registerExtension = options.registerExtension;
    this.#finalizeInstall = options.finalizeInstall;
    this.#registerAdditionalResources = options.registerAdditionalResources;
    this.listeners = [];
    this.#sdk = getSDK();
    this.#logger = this.#sdk.services.log.create('ExtensionInstaller');
    this.#user = null;
  }

  getStaticStatusCodes() {
    return statusCodes;
  }

  listenAuthEvents() {
    this.#sdk.api.globalChannel.subscribe({
      next: evObj => {
        if (evObj.event === AUTH_EVENTS.SIGN_IN) {
          const userData: { id?: string } = evObj.data;
          if ('id' in userData && userData.hasOwnProperty('id')) {
            this.#user = userData;
          }
        }
        if (evObj.event === AUTH_EVENTS.SIGN_OUT) {
          this.#user = null;
        }
      },
    });
  }

  resetAndCleanup() {
    this.#extensionInfo = undefined;
    this.#extensionModule = undefined;
    this.#extensionConfig = undefined;
    this.listeners = [];
    this.#extensionName = undefined;
  }

  async fetchExtensionStep(extensionID: string): Promise<boolean> {
    this.notifyCurrentStatus(this.getStaticStatusCodes().status.FETCHING_EXTENSION_DATA);
    try {
      const extensionData = await this.#getLatestExtensionVersion(extensionID);
      if (extensionData) {
        this.#extensionInfo = extensionData;
        this.#logger.info('Extension data fetched');
        return true;
      }
      this.notifyErrorStatus(this.getStaticStatusCodes().error.EXTENSION_NOT_FOUND);
      return false;
    } catch (err) {
      this.notifyErrorStatus(this.getStaticStatusCodes().error.EXTENSION_FETCH_ERROR);
      return false;
    }
  }

  async #importModuleStep(): Promise<boolean> {
    this.notifyCurrentStatus(this.getStaticStatusCodes().status.IMPORTING_MODULE);
    try {
      const module = await this.#importModule(this.#extensionInfo);
      if (!module) {
        return false;
      }
      this.#extensionModule = module;
      this.#logger.info('Module imported');
      return true;
    } catch (err) {
      this.notifyErrorStatus(this.getStaticStatusCodes().error.EXTENSION_IMPORT_ERROR);
      return false;
    }
  }
  async retryFromError(errorStatus: symbol) {
    console.log('retrying from error', errorStatus);
    if (!this.#extensionName) {
      return false;
    }
    switch (errorStatus) {
      // start from the beginning
      case this.getStaticStatusCodes().error.EXTENSION_FETCH_ERROR:
      case this.getStaticStatusCodes().error.EXTENSION_IMPORT_ERROR:
        return this.installExtension(this.#extensionName);
      // directly run postInstall
      case this.getStaticStatusCodes().error.EXTENSION_INITIALIZATION_FAILED:
        return this.postInstallExtension();
      // try to remove the extension from db and rerun postInstall
      case this.getStaticStatusCodes().error.EXTENSION_INFO_SAVE_FAILED:
        try {
          await this.#sdk.services.appSettings.uninstall(this.#extensionName);
        } catch (err) {
          // do nothing.
        }
        return this.postInstallExtension();
      case this.getStaticStatusCodes().error.EXTENSION_REGISTER_RESOURCES_FAILED:
        // @todo: cleanup the resources (from the db? through the sdk?) and rerun install
        return this.installExtension(this.#extensionName);
      case this.getStaticStatusCodes().error.EXTENSION_FINALIZATION_FAILED:
        return this.postInstallExtension();
    }
  }
  // the tricky part of cancelling is when the extension reaches the single-spa register.
  // @todo: more cleanups might be necessary on the app-loader
  async cancelInstallation() {
    try {
      await this.#sdk.services.appSettings.uninstall(this.#extensionInfo.name);
    } catch (err) {
      this.#logger.error(err);
    }
    this.resetAndCleanup();
  }

  async postInstallExtension() {
    if (
      this.#extensionModule.initialize &&
      typeof this.#extensionModule.initialize === 'function'
    ) {
      this.notifyCurrentStatus(this.getStaticStatusCodes().status.INITIALIZING_EXTENSION);
      try {
        await this.#initializeExtension(this.#extensionInfo.name, this.#extensionModule);
        this.#logger.info('Extension initialized');
      } catch (err) {
        this.notifyErrorStatus(this.getStaticStatusCodes().error.EXTENSION_INITIALIZATION_FAILED);
        return;
      }
    }

    this.notifyCurrentStatus(this.getStaticStatusCodes().status.REGISTERING_EXTENSION);
    const extConf = this.#registerExtension(this.#extensionInfo.name, this.#extensionModule);
    if (!extConf) {
      this.notifyErrorStatus(this.getStaticStatusCodes().error.EXTENSION_REGISTRATION_FAILED);
      return;
    }
    this.#extensionConfig = extConf;
    this.#logger.info('Extension registered!');
    // at this point we are safe to register it into singleSpa
    // since everything went well we can also store the config into the local db.
    this.notifyCurrentStatus(this.getStaticStatusCodes().status.SAVING_EXTENSION_INFO);
    try {
      await this.#sdk.services.appSettings.install({
        releaseId: this.#extensionInfo.releases.edges[0].node.id,
        appName: this.#extensionInfo.name,
        version: this.#extensionInfo.releases.edges[0].node.version,
        source: this.#extensionInfo.releases.edges[0].node.source,
        applicationType: this.#extensionInfo.applicationType,
      });
    } catch (err) {
      this.#logger.warn(`Looks like the extension was not saved in the database! ${err.message}`);
      this.notifyErrorStatus(this.getStaticStatusCodes().error.EXTENSION_INFO_SAVE_FAILED);
      return;
    }
    this.#logger.info('Extension saved to local db');
    this.notifyCurrentStatus(this.getStaticStatusCodes().status.FINALIZING_INSTALL);
    try {
      this.#finalizeInstall(this.#extensionInfo, this.#extensionModule, this.#extensionConfig);
      this.notifyCurrentStatus(this.getStaticStatusCodes().status.INSTALL_SUCCESS);
      this.#logger.info('Installation completed successfuly');
    } catch (err) {
      this.notifyErrorStatus(this.getStaticStatusCodes().error.EXTENSION_FINALIZATION_FAILED);
      return;
    }
  }

  async installExtension(extensionID: string) {
    if (!this.#user?.id) {
      this.notifyErrorStatus(this.getStaticStatusCodes().error.USER_NOT_CONNECTED);
      return;
    }
    this.#extensionName = extensionID;
    if (!(await this.fetchExtensionStep(extensionID))) {
      return;
    }

    const isExtensionDataValid = validateExtensionData(this.#extensionInfo);
    const isReleaseDataValid = validateReleaseData(this.#extensionInfo.releases.edges);

    if (!isExtensionDataValid) {
      this.notifyErrorStatus(this.getStaticStatusCodes().error.EXTENSION_DATA_INVALID);
      return this.resetAndCleanup();
    }

    if (!isReleaseDataValid) {
      this.notifyErrorStatus(this.getStaticStatusCodes().error.EXTENSION_RELEASE_DATA_INVALID);
      return this.resetAndCleanup();
    }

    if (isExtensionDataValid && isReleaseDataValid) {
      if (!(await this.#importModuleStep())) {
        return;
      }
      // @TODO: We need to register additional resources (like composeDB models) even before initialization.
      if (
        this.#extensionModule.registerResources &&
        typeof this.#extensionModule.registerResources === 'function'
      ) {
        this.notifyCurrentStatus(this.getStaticStatusCodes().status.REGISTERING_RESOURCES);
        try {
          await this.#registerAdditionalResources(this.#extensionInfo.name, this.#extensionModule);
          this.notifyCurrentStatus(
            this.getStaticStatusCodes().status.REGISTERING_RESOURCES_SUCCESS,
          );
        } catch (err) {
          this.notifyErrorStatus(
            this.getStaticStatusCodes().error.EXTENSION_REGISTER_RESOURCES_FAILED,
          );
        }
        // handle signature in the install screen
        return;
      }
      this.#logger.info('---running post install flow----');
      await this.postInstallExtension();
    }
  }

  notifyErrorStatus(
    errorStatus: ReturnType<typeof this.getStaticStatusCodes>['error'][keyof ReturnType<
      typeof this.getStaticStatusCodes
    >['error']],
  ) {
    this.listeners.forEach(listener => {
      listener({
        errorStatus,
      });
    });
  }

  notifyCurrentStatus(
    currentStatus: ReturnType<typeof this.getStaticStatusCodes>['status'][keyof ReturnType<
      typeof this.getStaticStatusCodes
    >['status']],
  ) {
    this.listeners.forEach(listener => {
      listener({
        currentStatus,
      });
    });
  }

  subscribe(cb: ExtensionInstaller['listeners'][0]) {
    this.listeners.push(cb);
    return () => {
      this.listeners.filter(listener => listener !== cb);
    };
  }
}

const validateExtensionData = (_extData: AkashaAppEdgeNode) => {
  return true;
};

const validateReleaseData = (releaseEdges: AkashaAppEdgeNode['releases']['edges']) => {
  return releaseEdges.length;
};
