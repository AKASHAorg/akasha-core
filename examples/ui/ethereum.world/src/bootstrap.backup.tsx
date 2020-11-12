(async function bootstrap(System) {
  await System.import('react');
  await System.import('react-dom');
  // await System.import('single-spa');
  // await System.import('single-spa-react');
  await System.import('rxjs');
  // await System.import('@akashaproject/design-system/main.js');
  const { default: initSDK } = await System.import('@akashaproject/sdk');
  const layoutApp = await System.import('@widget/ethereum-world-layout/app');
  const AKASHAApp = await System.import('@app/AKASHA');
  console.log(layoutApp, 'the layout');

  const appConfig = {
    // where to mount the ui
    rootNodeId: 'root',
    // main layout (shell)
    layout: layoutApp.application,
    // define an app that will load at root '/' path
    rootLoadedApp: AKASHAApp.application,
    System: System,
  };
  const world = initSDK({
    config: appConfig,
    initialApps: {
      plugins: [],
      widgets: [],
    },
  });
  // @ts-ignore
})(window.System);
