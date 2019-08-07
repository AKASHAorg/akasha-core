import Plugin from '@akashaproject/ui-plugin-events';
import AppLoader from '@akashaproject/ui-plugin-loader';

const app = new AppLoader({});

app.registerPlugin(Plugin, { activeWhen: { path: '/events' } });
app.start();
