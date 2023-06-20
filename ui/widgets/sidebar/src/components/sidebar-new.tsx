import React, { useEffect, useState } from 'react';

import { IMenuItem, Profile } from '@akashaorg/typings/ui';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import { ButtonProps } from '@akashaorg/design-system-core/lib/components/Button/types';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import ListSidebarApps from './list-sidebar-apps';

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
  loggedProfileData?: Omit<Profile, 'followers' | 'did'> & { did: { id: string } };
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
  menuItem: React.ReactElement;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaButtonLabel: string;
  footerLabel: string;
  footerIcons: { name: ButtonProps['icon']; link: string }[];
  onLoginClick?: () => void;
}

const Sidebar: React.FC<ISidebarProps> = props => {
  const {
    userInstalledApps,
    worldApps,
    allMenuItems,
    currentRoute,
    loggedProfileData,
    activeApps,
    title,
    subtitle,
    ctaText,
    ctaButtonLabel,
    footerLabel,
    footerIcons,

    onSidebarClose,
    onClickMenuItem,
    onLoginClick,
  } = props;

  const [currentAppData, setCurrentAppData] = useState<IMenuItem | null>(null);
  const [activeOption, setActiveOption] = useState<IMenuItem | null>(null);

  useEffect(() => {
    if (allMenuItems && currentRoute) {
      const path = currentRoute.split('/').slice(3);
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

  return (
    <BasicCardBox
      customStyle="w-[19.5rem] max-w-[19.5rem] max-h-[calc(100vh-20px)]"
      round="rounded-r-2xl xl:rounded-2xl"
      pad="p-0"
    >
      <Box customStyle="flex flex-row p-4 border-b-1 border(grey9 dark:grey3)">
        <Box customStyle="w-fit h-fit mr-2">
          <Avatar
            profileId={loggedProfileData?.did?.id}
            avatar={loggedProfileData?.avatar?.default.src}
          />
        </Box>
        <Box customStyle="w-fit">
          <Text customStyle="font-bold">{title}</Text>
          <Text variant="footnotes2" customStyle="text-grey5">
            {subtitle}
          </Text>
        </Box>
        <Box customStyle="w-fit h-fit ml-6 self-end">
          <Button icon="BoltIcon" variant="primary" iconOnly={true} onClick={onLoginClick} />
        </Box>
      </Box>
      {/*
          this container will grow up to a max height of 68vh, 32vh currently accounts for the height of other sections and paddings. Adjust accordingly, if necessary.
        */}
      <Box customStyle="flex flex-col max-h-[68vh] overflow-auto">
        {/* container for world apps */}
        {worldApps?.length > 0 && (
          <ListSidebarApps
            list={worldApps}
            activeOption={activeOption}
            onOptionClick={handleOptionClick}
            onClickMenuItem={handleAppIconClick}
          />
        )}
        {/* container for user-installed apps */}
        {userInstalledApps?.length > 0 && (
          <ListSidebarApps
            list={userInstalledApps}
            activeOption={activeOption}
            hasBorderTop={true}
            onOptionClick={handleOptionClick}
            onClickMenuItem={handleAppIconClick}
          />
        )}
      </Box>
      <Box customStyle="flex flex-col px-8 py-4 bg-grey9 dark:bg-grey3">
        <Text variant="footnotes2" customStyle="text-grey5">
          {ctaText}
        </Text>
        <Box customStyle="w-fit h-fit mt-6">
          <Button label={ctaButtonLabel} variant="primary" />
        </Box>
      </Box>
      <Box customStyle="flex flex-col px-8 py-4">
        <Text variant="footnotes2" customStyle="text-grey5">
          {footerLabel}
        </Text>
        <Box customStyle="flex w-fit h-fit mt-6">
          {footerIcons.map((icon, idx) => (
            <Box key={icon.name + idx} customStyle="mr-4">
              <a href={icon.link} target="_blank" rel="noreferrer noopener">
                <Button icon={icon.name} variant="primary" greyBg={true} iconOnly={true} />
              </a>
            </Box>
          ))}
        </Box>
      </Box>
    </BasicCardBox>
  );
};
export default Sidebar;
