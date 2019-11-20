// import FeedPlugin from '@akashaproject/ui-plugin-feed';
import ProfilePlugin from '@akashaproject/ui-plugin-profile';
import LayoutWidget from '@akashaproject/ui-widget-layout';
import SidebarWidget from '@akashaproject/ui-widget-sidebar';
import TopBarWidget from '@akashaproject/ui-widget-topbar';
import initSdk from './sdk-init';

const plugins = [
  {
    app: ProfilePlugin,
    sdkModules: [],
  },
];
const widgets = [
  {
    app: SidebarWidget,
    config: { slot: LayoutWidget.sidebarSlotId },
  },
  {
    app: TopBarWidget,
    config: { slot: LayoutWidget.topbarSlotId },
  },
];
const appConfig = {
  rootNodeId: 'root',
  layout: LayoutWidget,
};
const sdk: any = initSdk(appConfig, { plugins, widgets });
// tslint:disable-next-line:no-console
console.log('SDK object', sdk);
