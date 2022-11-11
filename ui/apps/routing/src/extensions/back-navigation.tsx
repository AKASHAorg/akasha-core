import { FormPrevious } from 'grommet-icons';
import singleSpaReact from 'single-spa-react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { RootExtensionProps } from '@akashaorg/typings/ui';
import DS from '@akashaorg/design-system';
import { withProviders, ThemeWrapper } from '@akashaorg/ui-awf-hooks';
import { I18nextProvider } from 'react-i18next';
import * as singleSpa from 'single-spa';
import { useLocation } from 'react-router-dom';
import { MenuItemAreaType } from '@akashaorg/typings/ui';
import { BrowserRouter as Router } from 'react-router-dom';

const { Icon, BasicCardBox, Box, Text, styled } = DS;

const StyledText = styled(Text)`
  display: flex;
  flex-grow: 1;
  justify-content: center;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledCardBox = styled(BasicCardBox)`
  max-width: 100vw;
`;

const BreadcrumbNavigation: React.FC<RootExtensionProps> = props => {
  const {
    worldConfig: { defaultApps },
  } = props;

  const [routeData, setRouteData] = React.useState(null);
  const isNavigatingBackRef = React.useRef(false);
  const historyCount = React.useRef(0);

  const currentLocation = useLocation();

  const worldApps = React.useMemo(() => {
    return routeData?.[MenuItemAreaType.AppArea]?.sort(
      (a: { name: string }, b: { name: string }) => {
        if (defaultApps.indexOf(a.name) < defaultApps.indexOf(b.name)) {
          return -1;
        } else if (defaultApps.indexOf(a.name) > defaultApps.indexOf(b.name)) {
          return 1;
        }
        return 0;
      },
    );
  }, [defaultApps, routeData]);

  const userInstalledApps = routeData?.[MenuItemAreaType.UserAppArea];

  const allApps = React.useMemo(() => {
    return [...(worldApps || []), ...(userInstalledApps || [])];
  }, [worldApps, userInstalledApps]);

  const routing = props.plugins['@akashaorg/app-routing']?.routing;

  React.useEffect(function navigationEventListener() {
    const controller = new AbortController();
    const signal = controller.signal;
    window.addEventListener(
      'single-spa:before-routing-event',
      (evt: CustomEvent) => {
        const url = new URL(evt.detail.newUrl as string);
        const newUrl: string = url.origin + url.pathname;

        const url2 = new URL(evt.detail.oldUrl as string);
        const oldUrl: string = url2.origin + url2.pathname;

        if (isNavigatingBackRef.current) {
          isNavigatingBackRef.current = false;
          historyCount.current = historyCount.current - 1;
        } else if (newUrl !== oldUrl) {
          historyCount.current++;
        }
      },
      { signal },
    );
    return () => {
      controller.abort();
    };
  }, []);

  React.useEffect(
    function routingSubscription() {
      let sub;
      if (routing) {
        sub = routing.routeObserver.subscribe({
          next: routeData => {
            setRouteData({ ...routeData.byArea });
          },
        });
      }
      return () => {
        if (sub) {
          sub.unsubscribe();
        }
      };
    },
    [routing],
  );

  const handleLogoNavigation = () => {
    routing.navigateTo({
      appName: matchingApp?.name,
      getNavigationUrl: () => '/',
    });
  };

  const handleBackClick = () => {
    if (historyCount.current > 0) {
      isNavigatingBackRef.current = true;
      history.back();
    }
  };

  const matchingApp = allApps.find(app => currentLocation.pathname.includes(app.name));

  if (!matchingApp) return null;

  const matchingRouteName = matchingApp.navRoutes
    ? Object.entries<string>(matchingApp.navRoutes).find(([, route]) =>
        currentLocation.pathname.includes(route),
      )?.[0]
    : matchingApp.label;

  return (
    <Box direction="row" align="stretch">
      <StyledCardBox
        onClick={handleLogoNavigation}
        pad="medium"
        margin={{ bottom: 'xsmall', right: 'xsmall' }}
        width="auto !important"
        align="center"
        direction="row"
      >
        <Icon type={matchingApp.logo.value ?? 'akasha'} size="sm" />
      </StyledCardBox>
      <BasicCardBox pad="medium" margin={{ bottom: 'xsmall' }} direction="row" align="center">
        <Box onClick={handleBackClick} width="24px">
          <FormPrevious size="sm" />
        </Box>
        <StyledText size="xlarge" weight="bold">
          {matchingRouteName}
        </StyledText>
      </BasicCardBox>
    </Box>
  );
};

const Wrapper: React.FC<RootExtensionProps> = props => {
  return (
    <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
      <Router>
        <BreadcrumbNavigation {...props} />
      </Router>
    </I18nextProvider>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(Wrapper),
  renderType: 'createRoot',
  errorBoundary: (err, errorInfo, props: RootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo}`);
    }
    return (
      <ThemeWrapper {...props}>
        <Icon type="error" size="sm" />
      </ThemeWrapper>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;
export const mount = reactLifecycles.mount;
export const unmount = reactLifecycles.unmount;
