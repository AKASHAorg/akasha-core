import FeedPlugin from '@akashaproject/ui-plugin-feed';
import AppLoader from '@akashaproject/ui-plugin-loader';
import ProfilePlugin from '@akashaproject/ui-plugin-profile';
import LayoutWidget from '@akashaproject/ui-widget-layout';
import SidebarWidget from '@akashaproject/ui-widget-sidebar';
import TopBarWidget from '@akashaproject/ui-widget-topbar';
import initSdk from './sdk-init';

const sdk: any = initSdk();
const app = new AppLoader({
  rootNodeId: 'root',
  layout: LayoutWidget,
});

// here you can rename different modules before passing them to the plugins
// it also enables dynamic build of dependencies
// ex: [['commons', obj1],['entries', obj2]] becomes at plugin level {commons: obj1, entries: obj2}
const commonModule = ['commons', sdk.modules.commons];
const promises: void[] = [
  app.registerPlugin(FeedPlugin, null, [commonModule]),
  app.registerPlugin(ProfilePlugin, null, [commonModule]),
  app.registerWidget(SidebarWidget, { slot: LayoutWidget.sidebarSlotId }, []),
  app.registerWidget(TopBarWidget, { slot: LayoutWidget.topbarSlotId }, []),
];
Promise.all(promises).then(() => app.start());
