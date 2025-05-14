import React, { Suspense, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { EventTypes, MenuItemAreaType, IMenuItem, UIEventData } from '@akashaorg/typings/lib/ui';
import {
  filterEvents,
  useAccordion,
  useAkashaStore,
  useDismissedCard,
  useRootComponentProps,
} from '@akashaorg/ui-core-hooks';
import Link from '@akashaorg/design-system-core/lib/components/Link';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import ErrorBoundary from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import {
  Discord,
  Github,
  Telegram,
  Twitter,
} from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import ListSidebarApps from './list-sidebar-apps';
import SidebarCTACard from './cta-card';
import SidebarHeader from './sidebar-header';
import FallbackHeader from './fallback-header';
import * as Shadcn from '@akashaorg/ui/lib/components/sidebar';

const SidebarComponent: React.FC<unknown> = () => {
  const {
    logger,
    uiEvents,
    worldConfig: { defaultApps, socialLinks },
    getCorePlugins,
  } = useRootComponentProps();
  const {
    data: { authenticatedDID, isAuthenticating },
    authenticationStore,
  } = useAkashaStore();
  const { t } = useTranslation('ui-widget-sidebar');
  const routing = getCorePlugins().routing;
  const routeData = useSyncExternalStore(routing.subscribe, routing.getSnapshot);
  const [activeOption, setActiveOption] = useState<IMenuItem | null>(null);
  const [clickedOptions, setClickedOptions] = useState<
    {
      name: string;
      route: IMenuItem;
    }[]
  >([]);
  const isLoggedIn = !!authenticatedDID;
  const { activeAccordionId, setActiveAccordionId, handleAccordionClick } = useAccordion();
  const [dismissed, dismissCard] = useDismissedCard('@akashaorg/ui-widget-sidebar_cta-card');
  const { setOpen, openMobile, setOpenMobile, toggleSidebar, isMobile } = Shadcn.useSidebar();

  useEffect(() => {
    const eventsSub = uiEvents
      .pipe(filterEvents([EventTypes.ShowSidebar, EventTypes.HideSidebar]))
      .subscribe({
        next: (eventInfo: UIEventData) => {
          switch (eventInfo.event) {
            case EventTypes.ShowSidebar:
              if (isMobile) {
                setOpenMobile(true);
              } else {
                setOpen(true);
              }
              break;
            case EventTypes.HideSidebar:
              if (isMobile) {
                setOpenMobile(false);
              } else {
                setOpen(false);
              }
              break;
            default:
              break;
          }
        },
      });
    return () => {
      if (eventsSub) {
        eventsSub.unsubscribe();
      }
    };
  }, [openMobile, setOpenMobile, toggleSidebar, uiEvents, isMobile, setOpen]);

  // make sure that topBar button state is synced with mobile sidebar
  useEffect(() => {
    if (isMobile && !openMobile) {
      uiEvents.next({
        event: EventTypes.HideSidebar,
      });
    }
  }, [isMobile, openMobile, uiEvents]);

  // sort according to worldConfig index
  const worldApps = useMemo(() => {
    return routeData?.byArea[MenuItemAreaType.AppArea]?.sort((a, b) => {
      if (defaultApps.indexOf(a.name) < defaultApps.indexOf(b.name)) {
        return -1;
      } else if (defaultApps.indexOf(a.name) > defaultApps.indexOf(b.name)) {
        return 1;
      }
      return 0;
    });
  }, [defaultApps, routeData]);
  const userInstalledApps = useMemo(() => {
    return routeData.byArea[MenuItemAreaType.UserAppArea];
  }, [routeData]);
  const handleNavigation = (appName: string, route: string) => {
    routing?.navigateTo({
      appName,
      getNavigationUrl: () => route,
    });
  };
  const handleProfileAvatarClick = (id: string) => {
    if (!id) {
      return;
    }
    routing?.navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: routes => `${routes.rootRoute}/${id}`,
    });
    if (isMobile) {
      handleSidebarClose();
    }
  };
  const handleClickExplore = () => {
    routing?.navigateTo({
      appName: '@akashaorg/app-extensions',
      getNavigationUrl: routes => routes.explore,
    });
    if (isMobile) {
      handleSidebarClose();
    }
  };
  const handleSidebarClose = () => {
    // emit HideSidebar event to trigger corresponding action in associated widgets
    uiEvents.next({
      event: EventTypes.HideSidebar,
    });
  };
  function handleLoginClick() {
    handleNavigation('@akashaorg/app-auth-ewa', '/');
    if (isMobile) {
      handleSidebarClose();
    }
  }
  function handleLogout() {
    authenticationStore.logout();
  }
  const handleLogoutClick = () => {
    handleLogout();
  };
  const handleAppIconClick = (menuItem: IMenuItem) => {
    if (menuItem.subRoutes && menuItem.subRoutes.length === 0) {
      setActiveOption(null);
      handleNavigation(menuItem.name, menuItem.route);
      if (isMobile) {
        handleSidebarClose();
      }
    }
  };
  const handleOptionClick = (menuItem: IMenuItem, subrouteMenuItem: IMenuItem) => {
    setClickedOptions(oldClickedOptions => [
      ...oldClickedOptions,
      {
        name: menuItem.name,
        route: subrouteMenuItem,
      },
    ]);
    setActiveOption(subrouteMenuItem);
    handleNavigation(menuItem.name, subrouteMenuItem.route);
    if (isMobile) {
      handleSidebarClose();
    }
  };
  const handleBackNavEvent = () => {
    const matchedRoute = clickedOptions.find(option =>
      location.pathname.includes(`${option.name}${option.route?.route}`),
    );
    if (matchedRoute) setActiveOption(matchedRoute.route);
    else setActiveOption(null);
  };
  useEffect(() => {
    window.addEventListener('popstate', handleBackNavEvent);
    return () => window.removeEventListener('popstate', handleBackNavEvent);
  });

  const outlineStyle = 'h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark';
  const solidStyle = 'h-5 w-5 [&>*]:fill-secondaryLight dark:[&>*]:fill-secondaryDark';

  /**
   * this assigns the corresponding icons to the social links from root components
   */
  const modSocialLinks = socialLinks?.map(el => {
    if (el.icon === 'Github')
      return {
        ...el,
        icon: <Github className={outlineStyle} />,
      };
    if (el.icon === 'Discord')
      return {
        ...el,
        icon: <Discord className={solidStyle} />,
      };
    if (el.icon === 'Telegram')
      return {
        ...el,
        icon: <Telegram className={solidStyle} />,
      };
    if (el.icon === 'Twitter')
      return {
        ...el,
        icon: <Twitter className={solidStyle} />,
      };
  });
  return (
    <ErrorBoundary
      errorObj={{
        type: 'script-error',
        title: t('Error in sidebar widget'),
      }}
      logger={logger}
    >
      <Shadcn.Sidebar>
        <Card className="p-0 rounded-r-2xl xl:rounded-2xl max-h-screen xl:max-h-[calc(100vh-20px) h-full xl:h-fit">
          <Shadcn.SidebarHeader>
            <Suspense
              fallback={
                <FallbackHeader authenticatedDID={authenticatedDID} isLoggedIn={isLoggedIn} />
              }
            >
              <SidebarHeader
                authenticatedDID={authenticatedDID}
                connectLabel={t('Connect')}
                cancelLabel={t('Cancel')}
                isLoggedIn={isLoggedIn}
                logoutClickHandler={handleLogoutClick}
                loginClickHandler={handleLoginClick}
                isAuthenticating={isAuthenticating}
                handleProfileAvatarClick={handleProfileAvatarClick}
              />
            </Suspense>
          </Shadcn.SidebarHeader>
          <Shadcn.SidebarContent>
            {/*
          this container will grow up to a max height of 68vh, 32vh currently accounts for the height of other sections and paddings. Adjust accordingly, if necessary.
        */}
            <Stack direction="column" className="overflow-auto">
              {/* container for world apps */}
              {worldApps?.length > 0 && (
                <ListSidebarApps
                  list={worldApps}
                  activeAccordionId={activeAccordionId}
                  activeOption={activeOption}
                  setActiveAccordionId={setActiveAccordionId}
                  handleAccordionClick={handleAccordionClick}
                  onOptionClick={handleOptionClick}
                  onClickMenuItem={handleAppIconClick}
                />
              )}
              {/* container for user-installed apps */}
              {userInstalledApps?.length > 0 && (
                <ListSidebarApps
                  list={userInstalledApps}
                  activeAccordionId={activeAccordionId}
                  activeOption={activeOption}
                  setActiveAccordionId={setActiveAccordionId}
                  handleAccordionClick={handleAccordionClick}
                  hasBorderTop={true}
                  onOptionClick={handleOptionClick}
                  onClickMenuItem={handleAppIconClick}
                />
              )}
            </Stack>
            {!dismissed && (
              <SidebarCTACard onClickCTAButton={handleClickExplore} onDismissCard={dismissCard} />
            )}
            {modSocialLinks?.length > 0 && (
              <Stack className="px-8 py-4 border-t-1 border-grey9 dark:border-grey3">
                <Typography variant="p">{t('Get in touch')}</Typography>
                <Stack direction="row" spacing={4} className="w-fit h-fit mt-6">
                  {modSocialLinks?.map((socialLink, idx) => (
                    <Link key={idx} to={socialLink.link} target="_blank">
                      <Button
                        icon={socialLink.icon}
                        solidIcon={idx > 0}
                        variant="primary"
                        greyBg={true}
                        iconOnly={true}
                      />
                    </Link>
                  ))}
                </Stack>
              </Stack>
            )}
          </Shadcn.SidebarContent>
          <Shadcn.SidebarFooter />
        </Card>
      </Shadcn.Sidebar>
    </ErrorBoundary>
  );
};
export default SidebarComponent;
