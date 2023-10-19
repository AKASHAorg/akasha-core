import { ActivityFn } from './app-loader';
import { IMenuItem } from './menu-items';
import singleSpa from 'single-spa';
import { RootComponentProps } from './root-component';
import { ContentBlockExtensionInterface } from './editor-blocks';
import { ExtensionInterface } from './extensions';
import { IntegrationReleaseInfoFragmentFragment } from '../sdk/graphql-operation-types';

export const enum AppEvents {
  RegisterApplication = 'register-application',
}

export type AppRegisterEvent = {
  event: AppEvents.RegisterApplication;
  data: { config: IAppConfig; manifest: IntegrationReleaseInfoFragmentFragment };
};
export type InstalledAppStorePlugin = {
  getInstalledApps: () => {
    config: IAppConfig;
    manifest: IntegrationReleaseInfoFragmentFragment;
  }[];
};
export type Extensions = { [key: string]: string } & {
  /**
   * load modals inside this node
   */
  modalSlotId?: string;
  /**
   * main app and plugin area
   */
  pluginSlotId?: string;
  /**
   * load root widgets inside this node
   * do not use this for app defined widgets
   */
  rootWidgetSlotId?: string;
  /**
   * topbar loading node
   */
  topbarSlotId?: string;
  /**
   * load app defined widgets into this node
   */
  widgetSlotId?: string;

  /**
   * cookie widget slot
   */
  cookieWidgetSlotId?: string;
  /**
   * sidebar area slot
   */
  sidebarSlotId?: string;
  /*
   * Mode for hiding the widget area
   * @warning: In the future, this will be deprecated
   */
  focusedPluginSlotId?: string;
  /**
   * snackbar notification slot
   */
  snackbarNotifSlotId?: string;
};

export type AppName = string;

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
   * The id of the html element
   * that this app will mount in
   **/
  mountsIn: string;

  /**
   * routes that are defined here can be used
   * by other apps for navigation
   */
  routes?: {
    [key: string]: string;
  };
  loadingFn: () => Promise<singleSpa.LifeCycles<RootComponentProps>>;
  /**
   * @TODO: add docs
   */
  contentBlocks?: ContentBlockExtensionInterface[];
  extensions?: ExtensionInterface[];
  /**
   * A simple mapping of the extensions exposed by this app.
   * Can be used to target a specific app's extension
   * Note that this is optional
   */
  extensionsMap?: Extensions;
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
   * Only used for topbar.
   * @deprecated - use extension points
   */
  menuItems: IMenuItem | IMenuItem[];
}
