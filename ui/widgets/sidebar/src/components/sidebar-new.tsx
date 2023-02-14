import React from 'react';
import { tw } from '@twind/core';

import { IMenuItem } from '@akashaorg/typings/ui';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Button, { IButtonProps } from '@akashaorg/design-system-core/lib/components/Button';
import Accordion from '@akashaorg/design-system-core/lib/components/Accordion';

import MenuItemLabel from './menu-item-label';
import MenuSubItems from './menu-sub-items';

export interface ISidebarProps {
  worldAppsTitleLabel: string;
  poweredByLabel: string;
  userInstalledAppsTitleLabel: string;
  userInstalledApps: IMenuItem[];
  exploreButtonLabel: string;
  worldApps: IMenuItem[];
  allMenuItems: IMenuItem[];
  activeApps?: string[];
  currentRoute?: string;
  isLoggedIn: boolean;
  hasNewNotifs?: boolean;
  loadingUserInstalledApps: boolean;
  versionURL?: string;
  versionLabel?: string;
  // handlers
  onBrandClick?: () => void;
  onSidebarClose: () => void;
  onClickMenuItem: (appName: string, route: string) => void;
  onClickExplore: () => void;
  // viewport size
  size?: string;
  className?: string;
  menuItem: React.ReactElement;

  guestTitle: string;
  guestSubtitle: string;
  ctaText: string;
  ctaButtonLabel: string;
  footerLabel: string;
  footerIcons: { name: IButtonProps['icon']; link: string }[];
}

const guestEthAddress = '0x00000000000000000000000000000';

const titleText = 'text-sm font-bold';

const subtitleText = 'text-xs text-grey5';

const Sidebar: React.FC<ISidebarProps> = props => {
  const {
    userInstalledApps,
    worldApps,
    allMenuItems,
    currentRoute,
    activeApps,

    guestTitle,
    guestSubtitle,
    ctaText,
    ctaButtonLabel,
    footerLabel,
    footerIcons,

    onSidebarClose,
    onClickMenuItem,
  } = props;

  const [currentAppData, setCurrentAppData] = React.useState<IMenuItem | null>(null);
  const [activeOption, setActiveOption] = React.useState<IMenuItem | null>(null);

  React.useEffect(() => {
    if (allMenuItems && currentRoute) {
      const [, , , ...path] = currentRoute.split('/');

      const activeApp = allMenuItems.find(menuItem => activeApps?.includes?.(menuItem.name));
      if (activeApp && activeApp.index !== currentAppData?.index) {
        setCurrentAppData(activeApp);
      }
      // set the subroute
      if (path.length && currentRoute !== activeOption?.route) {
        const currentOption = activeApp?.subRoutes?.find(
          menuItem => menuItem.route === `/${path.join('/')}`,
        );
        if (currentOption && currentOption.index !== activeOption?.index) {
          setActiveOption(currentOption);
        }
      }
    }
  }, [currentRoute, allMenuItems, currentAppData, activeOption, activeApps]);

  const handleAppIconClick = (menuItem: IMenuItem, isMobile?: boolean) => {
    if (menuItem.subRoutes && menuItem.subRoutes.length === 0) {
      // if the current app has no subroutes, set as active and redirect to its route
      setCurrentAppData(menuItem);
      setActiveOption(null);
      onClickMenuItem(menuItem.name, menuItem.route);
      if (isMobile) {
        onSidebarClose();
      }
    }
  };

  const handleOptionClick = (
    menuItem: IMenuItem,
    subrouteMenuItem: IMenuItem,
    isMobile?: boolean,
  ) => {
    setCurrentAppData(menuItem);
    setActiveOption(subrouteMenuItem);
    onClickMenuItem(menuItem.name, subrouteMenuItem.route);
    if (isMobile) {
      onSidebarClose();
    }
  };

  const listApps = (list: IMenuItem[], hasBorderTop = false) => (
    <div className={tw(`flex flex-col px-4 py-2 ${hasBorderTop ? 'border-t-1 border-grey8' : ''}`)}>
      {list?.map((app, idx) => (
        <React.Fragment key={app.label + idx}>
          {app.subRoutes.length > 0 ? (
            <Accordion
              titleNode={<MenuItemLabel menuItem={app} isActive={false} />}
              contentNode={
                <MenuSubItems
                  menuItem={app}
                  activeOption={activeOption}
                  onOptionClick={handleOptionClick}
                />
              }
            />
          ) : (
            <div className={tw('p-2 cursor-pointer')}>
              <MenuItemLabel menuItem={app} isActive={false} onClickMenuItem={handleAppIconClick} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div
      className={tw(
        'max-w-[19.5rem] w-[19.5rem] max-h-[calc(100vh - 20px)] bg-white dark:bg-grey2 border-1 border-grey8 dark:border-none rounded-2xl',
      )}
    >
      <div className={tw('flex flex-row p-4 border-b-1 border-grey8')}>
        <div className={tw('w-fit h-fit mr-2')}>
          <Avatar ethAddress={guestEthAddress} src={{ url: 'https://placebeard.it/360x360' }} />
        </div>
        <div className={tw('w-fit')}>
          <p className={tw(titleText)}>{guestTitle}</p>
          <p className={tw(subtitleText)}>{guestSubtitle}</p>
        </div>
        <div className={tw('w-fit h-fit ml-6 self-end')}>
          <Button icon="BoltIcon" primary={true} iconOnly={true} />
        </div>
      </div>

      {/*
          this container will grow up to a max height of 100vh-345px.
          [345px] currently accounts for the height of other sections and paddings. Adjust accordingly, if necessary.
        */}
      <div className={tw('flex flex-col max-h-[calc(100vh - 345px)] overflow-auto')}>
        {/* container for world apps */}
        {worldApps?.length > 0 && listApps(worldApps)}

        {/* container for user-installed apps */}
        {userInstalledApps?.length > 0 && listApps(userInstalledApps, true)}
      </div>

      <div className={tw('flex flex-col px-8 py-4 bg-grey9 dark:bg-grey3')}>
        <p className={tw(subtitleText)}>{ctaText}</p>
        <div className={tw('w-fit h-fit mt-6')}>
          <Button label={ctaButtonLabel} primary={true} />
        </div>
      </div>

      <div className={tw('flex flex-col px-8 py-4')}>
        <p className={tw(subtitleText)}>{footerLabel}</p>
        <div className={tw('flex w-fit h-fit mt-6')}>
          {footerIcons.map((icon, idx) => (
            <div key={icon.name + idx} className={tw('mr-4')}>
              <a href={icon.link} target="_blank" rel="noreferrer noopener">
                <Button icon={icon.name} greyBg={true} primary={true} iconOnly={true} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
