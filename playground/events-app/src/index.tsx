import Plugin from '@akashaproject/ui-plugin-events';
import AppLoader from '@akashaproject/ui-plugin-loader';
import initSdk from './sdk-init';

const sdk: any = initSdk();
const app = new AppLoader({
  rootNodeId: 'root'
});

app.registerPlugin(Plugin, { activeWhen: { path: '/events' } }, [sdk.modules.common]);

app.start();
