import { FormNext } from 'grommet-icons';
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

type StackEntry = { label: string; route?: string; fullRoute?: string; name: string };

const StyledText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledLink = styled(StyledText)`
  color: ${({ theme }) => theme.colors.grey};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.accentText};
  }
`;

const StyledBackIcon = styled(Icon)`
  & * {
    stroke: ${({ theme }) => theme.colors.btnAccentColor};
  }
`;

const stackLimit = 4;
const BreadcrumbNavigation: React.FC<RootExtensionProps> = props => {
  const {
    worldConfig: { defaultApps },
  } = props;

  const [routeData, setRouteData] = React.useState(null);
  const [canNavigateBack, setCanNavigateBack] = React.useState(false);
  const [isNavigatingDeep, setIsNavigatingDeep] = React.useState(false);
  const [oldApp, setOldApp] = React.useState<any>();

  const currentLocation = useLocation();

  const [stack, setStack] = React.useState<StackEntry[]>([]);

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

  const matchingApp = allApps.find(app => currentLocation.pathname.includes(app.name));

  const routing = props.plugins['@akashaorg/app-routing']?.routing;

  React.useEffect(
    function navigationEventListener() {
      const controller = new AbortController();
      const signal = controller.signal;
      window.addEventListener(
        'single-spa:before-routing-event',
        (evt: CustomEvent) => {
          const url = new URL(evt.detail.newUrl as string);
          const newUrl: string = url.origin + url.pathname;
          const newMatchingApp = allApps.find(app => newUrl.includes(app.name));

          const url2 = new URL(evt.detail.oldUrl as string);
          const oldUrl: string = url2.origin + url2.pathname;
          const oldMatchingApp = allApps.find(app => oldUrl.includes(app.name));

          const matchingSubRoute = newMatchingApp?.subRoutes.find(subRoute =>
            newUrl.includes(subRoute.route),
          );

          if (
            !newUrl.includes(stack[0]?.name) ||
            (!!matchingApp && !matchingApp.navRoutes) ||
            location.pathname === matchingApp?.navRoutes.defaultRoute ||
            location.pathname === `/${matchingApp?.name}${matchingSubRoute?.route}`
          ) {
            const newStack = [
              {
                label: newMatchingApp?.label,
                route: newMatchingApp?.navRoutes?.defaultRoute ?? '/',
                name: newMatchingApp?.name,
              },
            ];
            if (matchingSubRoute) {
              newStack.push({
                label: matchingSubRoute.label,
                route: matchingSubRoute.route,
                name: newMatchingApp?.name,
              });
            }

            if (
              !!oldMatchingApp &&
              !!newMatchingApp &&
              oldMatchingApp?.name !== newMatchingApp?.name
            ) {
              setCanNavigateBack(true);
              setOldApp(oldMatchingApp);
            }

            setIsNavigatingDeep(false);
            setStack(newStack);
          }

          if (
            !!newMatchingApp &&
            !!newMatchingApp.navRoutes &&
            !newUrl.includes(matchingSubRoute?.route) &&
            !newUrl.includes(newMatchingApp.navRoutes.defaultRoute)
          ) {
            const newRoute = Object.entries<string>(newMatchingApp.navRoutes).find(([, route]) =>
              newUrl.includes(route),
            );
            const newEntry: StackEntry = {
              label: newRoute[0],
              fullRoute: newUrl,
              name: matchingApp.name,
            };
            setBackButtonActive(true);
            setStack(oldStack => {
              const indexOfRepeatedEntry = stack.findIndex(entry => entry.fullRoute === newUrl);
              const newStack = [...oldStack, newEntry];
              if (indexOfRepeatedEntry !== -1) {
                newStack.splice(indexOfRepeatedEntry, 1);
              }
              return newStack;
            });
          }
        },
        { signal },
      );
      return () => {
        controller.abort();
      };
    },
    [allApps, stack],
  );

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

  const isBackButtonActive = canNavigateBack || isNavigatingDeep;

  const handleNavigation = (appName: string, route?: string, fullRoute?: string) => {
    // console.log({ appName, route, fullRoute });
    if (route) {
      routing.navigateTo({
        appName,
        getNavigationUrl: () => route,
      });
    } else {
      setStack(oldStack => {
        const newStack = oldStack.slice(
          0,
          stack.findIndex(entry => entry.fullRoute === fullRoute),
        );
        return newStack;
      });
      singleSpa.navigateToUrl(fullRoute);
    }
  };

  if (!matchingApp) return null;
  return (
    <>
      <Box direction="row" align="stretch">
        <BasicCardBox
          onClick={
            backButtonActive
              ? () =>
                  handleNavigation(
                    matchingApp.name,
                    stack[stack.length - 2].route,
                    stack[stack.length - 2].fullRoute,
                  )
              : undefined
          }
          pad="medium"
          margin={{ bottom: 'xsmall', right: 'xsmall' }}
          width="auto !important"
          align="center"
          direction="row"
        >
          {backButtonActive ? (
            <StyledBackIcon type="arrowLeft" size="sm" />
          ) : (
            <Icon type={matchingApp.logo.value ?? 'akasha'} size="sm" />
          )}
        </BasicCardBox>
        <BasicCardBox pad="medium" margin={{ bottom: 'xsmall' }}>
          <Box as="span" direction="row" align="center">
            {[
              stack[0],
              ...(stack.length - 1 === 0
                ? [undefined]
                : stack.slice(-Math.min(stack.length - 1, stackLimit - 1))),
            ]
              .filter(entry => !!entry)
              .map(({ label, route, fullRoute }, index, { length }) => (
                <React.Fragment key={(route || fullRoute) + index}>
                  {index !== 0 && <FormNext size="20px" />}
                  {index === length - 1 ? (
                    <Text size="xlarge" weight="bold">
                      {label}
                    </Text>
                  ) : (
                    <StyledLink
                      onClick={() => handleNavigation(matchingApp.name, route, fullRoute)}
                      size="xlarge"
                      weight="bold"
                    >
                      {label}
                    </StyledLink>
                  )}
                </React.Fragment>
              ))}
          </Box>
        </BasicCardBox>
      </Box>
    </>
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
