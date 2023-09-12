import 'systemjs-webpack-interop/auto-public-path';
import routes, { BEAM, FEED, MY_FEED, PROFILE_FEED, REFLECT, TAGS } from './routes';
import {
  EventTypes,
  IAppConfig,
  IntegrationRegistrationOptions,
  LogoTypeSource,
  MenuItemAreaType,
  MenuItemType,
  RootComponentProps,
} from '@akashaorg/typings/lib/ui';
import { BlockAction, EditorBlockInterface } from '@akashaorg/typings/lib/ui/editor-blocks';
import { filter } from 'rxjs';

/**
 * Initialization of the integration is optional.
 * It is called before all `register` calls but after all `getPlugin`;
 * @example Initialization an integration and triggerin of a notification
 * ```
 * export const initialize: (opts: IntegrationInitOptions) => void = opts => {
 *  const notificationPlugin: any = opts.plugins["@akashaorg/app-notifications"].notification;
 *  if (notificationPlugin) {
 *   notificationPlugin.listenLogin(
 *     (userData: { ethAddress: string; filAddress: string; pubKey: string }) => {
 *       // user is now logged in,
 *       // we can fetch some notification data for eth address (or pubKey)
 *       // then trigger a notification
 *       notificationPlugin.notify('test_notif_domain', { message: 'This is a notification' });
 *     },
 *   );
 *  }
 * };
 * ```
 */

export const register: (opts: IntegrationRegistrationOptions) => IAppConfig = opts => ({
  loadingFn: () => import('./components'),
  mountsIn: opts.layoutConfig?.pluginSlotId,

  /**
   * routes that are defined here can be used by
   * other apps to navigate
   */
  routes: {
    defaultRoute: routes[FEED],
    [MY_FEED]: routes[MY_FEED],
    [PROFILE_FEED]: routes[PROFILE_FEED],
    [BEAM]: routes[BEAM],
    [TAGS]: routes[TAGS],
    [REFLECT]: routes[REFLECT],
  },
  title: 'AKASHA World',
  logo: { type: LogoTypeSource.ICON, value: 'antenna' },
  i18nNamespace: ['app-akasha-integration', 'ui-lib-feed'],
  menuItems: {
    label: 'Antenna',
    type: MenuItemType.App,
    logo: { type: LogoTypeSource.ICON, value: 'antenna' },
    area: [MenuItemAreaType.AppArea],
    subRoutes: [
      {
        label: 'General',
        index: 0,
        route: routes[FEED],
        type: MenuItemType.Internal,
      },
      {
        label: MY_FEED,
        index: 1,
        route: routes[MY_FEED],
        type: MenuItemType.Internal,
      },
    ],
  },
  editorBlocks: [
    {
      name: 'slate-block',
      icon: 'Bars3BottomLeftIcon',
      displayName: 'Slate text block',
      eventMap: {
        publish: `slate-block/${BlockAction.PUBLISH}`,
        update: `slate-block/${BlockAction.UPDATE}`,
        validate: `slate-block/${BlockAction.VALIDATE}`,
      },
    },
  ],
  extends: (matcher, loader) => {
    matcher({
      'entry-remove-confirmation': loader(() => import('./extensions/entry-remove-modal')),
      'slate-block_*': loader(() => import('./extensions/slate-block')),
      'entry-card-edit-button_*': loader(() => import('./extensions/entry-edit-button')),
      'beam-editor_*': loader(() => import('./extensions/beam-editor')),
    });
  },
});

class EditorBlocksPlugin {
  static readonly editorBlocks: EditorBlockInterface[] = [];
  static observe = (uiEvents: RootComponentProps['uiEvents']) => {
    const filterEvent = (eventType: EventTypes) => {
      return filter(
        (eventData: { event: string }) =>
          eventData && eventData.hasOwnProperty('event') && eventData.event === eventType,
      );
    };
    uiEvents.pipe(filterEvent(EventTypes.RegisterEditorBlock)).subscribe({
      next: (evData: { event: EventTypes.RegisterEditorBlock; data: EditorBlockInterface[] }) => {
        if (!evData.data) {
          console.log('event =>', evData);
          return;
        }
        for (const block of evData.data) {
          if (EditorBlocksPlugin.editorBlocks.some(b => b.name === block.name)) {
            return;
          }
          EditorBlocksPlugin.editorBlocks.push(block);
        }
      },
    });
  };
  static getAllBlocks = () => {
    return EditorBlocksPlugin.editorBlocks;
  };
}

export const getPlugin = async (
  props: RootComponentProps & {
    encodeAppName: (name: string) => string;
    decodeAppName: (name: string) => string;
  },
) => {
  EditorBlocksPlugin.observe(props.uiEvents);
  return {
    editorBlocks: {
      getAll: EditorBlocksPlugin.getAllBlocks,
    },
  };
};
