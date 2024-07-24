import singleSpa from 'single-spa';
import { ActivityFn, LayoutConfig } from './app-loader';
import { IMenuItem } from './sidebar-menu-items';
import { IRootComponentProps } from './root-component';
import { ContentBlockConfig } from './editor-blocks';
import { ExtensionInterface } from './extension-point';
import { Profile } from './profile';

/**
 * Enum defining extension types
 **/
export enum ExtensionTypes {
  APP = 'App',
  WIDGET = 'Widget',
  PLUGIN = 'Plugin',
  NONE = 'None',
}

/**
 * Enum defining extension status for an extension developer
 **/
export enum ExtensionStatus {
  Draft = 'Draft',
  Pending = 'Pending',
  Published = 'Published',
}

/**
 * Type defining extension image types
 **/
export type ExtensionImageType = 'logo-image' | 'cover-image';

/**
 * Enum defining events related to loading and unloading of an app
 **/
export const enum AppEvents {
  RegisterApplication = 'register-application',
}

/**
 * Type defining metadata info about an extension
 **/
export type ExtensionManifest = {
  id?: string | null;
  name: string;
  version: string;
  integrationType: string;
  sources?: Array<string> | null;
  integrationID: string;
  author: string;
  enabled: boolean;
  createdAt?: number | null;
  links?: {
    publicRepository?: string | null;
    documentation?: string | null;
    detailedDescription?: string | null;
  } | null;
  manifestData: {
    mainFile: string;
    license?: string | null;
    keywords?: Array<string | null> | null;
    description?: string | null;
    displayName?: string | null;
  };
};

/**
 * Type defining info about developer of an extension
 */
export type Developer = {
  profileId: Profile['did']['id'];
} & Pick<Profile, 'avatar' | 'name'>;

/**
 * Type defining app registration event
 **/
export type AppRegisterEvent = {
  event: AppEvents.RegisterApplication;
  data: { config: IAppConfig; manifest: ExtensionManifest };
};

/**
 * Type defining app name
 **/
export type AppName = string;

/**
 * Interface defining configuration object for loading an app
 **/
export interface IAppConfig {
  /**
   * Optional property.
   * When defined, it overrides the default functionality
   * of loading based on application name
   * @example
   * Given the appName = `@akashaorg/some-app-name`
   * The default functionality is to match against a route which starts with `/@akashaorg/some-app-name`
   * By specifying the activeWhen property we can specify other pathname on which this app/widget will load
   *
   * ```
   * activeWhen: (location, singleSpaPathToActiveWhen) => {
   *         return singleSpaPathToActiveWhen('/@akashaorg/other-app-name')(location)
   * }
   * ```
   *
   * This functionality is most useful for widgets.
   */
  activeWhen?: ActivityFn;
  /**
   * The id of the html element that this app will mount in
   * The applications and widgets have a predefined slots provided by the
   * layout widget. In this case, the slot names are passed to the register function args as
   * `registrationOptions.layoutConfig.applicationSlotId` and `registrationOptions.layoutConfig.widgetSlotId`
   * Note: widgets that are provided by apps should use the `rootWidgetSlotId`.
   **/
  mountsIn: string;

  /**
   * routes that are defined here can be used
   * by other apps for navigation
   */
  routes?: {
    [key: string]: string;
  };
  loadingFn: () => Promise<singleSpa.LifeCycles<IRootComponentProps>>;
  /**
   * The content of a Beam (aka. post) is a list of 1 or more contentBlocks.
   * These are provided by the apps and should have 2 versions:
   *  - one for the editor (to insert the data)
   *  - one for the reader (to render the data)
   *  More info in the documentation.
   */
  contentBlocks?: ContentBlockConfig[];
  extensions?: ExtensionInterface[];
  /**
   * A simple mapping of the extensions exposed by this app.
   * Can be used to target a specific app's extension
   * Note that this is optional
   */
  extensionsMap?: LayoutConfig;
  /**
   * Keywords that defines this widget.
   * Useful for filtering through integrations
   * @deprecated - define it in app manifest (package.json)
   */
  tags?: string[];
  /**
   * Namespace used by the app for i18next
   */
  i18nNamespace?: string[];
  /**
   * This property is used by the sidebar widget to construct the menu
   */
  menuItems: IMenuItem | IMenuItem[];
}
