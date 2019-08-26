import Plugin from '@akashaproject/ui-plugin-events';
import AppLoader from '@akashaproject/ui-plugin-loader';
import initSdk from './sdk-init';

const sdk: any = initSdk();
const app = new AppLoader({
  rootNodeId: 'root',
});
// here you can rename different modules before passing them to the plugins
// it also enables dynamic build of dependencies
// ex: [['commons', obj1],['entries', obj2]] becomes at plugin level {commons: obj1, entries: obj2}
const commonModule = ['commons', sdk.modules.commons];
app.registerPlugin(Plugin, { activeWhen: { path: '/events' } }, [commonModule]).then(() => {
  app.start();
});
