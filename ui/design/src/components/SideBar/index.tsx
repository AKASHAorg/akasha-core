import * as React from 'react';
import { Accordion, Box, Text } from 'grommet';
import { isMobileOnly } from 'react-device-detect';

import { IMenuItem } from '@akashaproject/ui-awf-typings/lib/app-loader';

import { MenuAppButton } from './menu-app-button';
import SectionTitle from './section-title';
import Skeleton from './skeleton';

import Icon from '../Icon';
import { ModalRenderer } from '../SignInModal/modal-renderer';
import { ModalContainer } from '../SignInModal/fullscreen-modal-container';

import {
  StyledHiddenScrollContainer,
  StyledAccordionPanel,
  StyledButton,
  StyledFooter,
} from './styled-sidebar';
import { StyledOverlay } from '../TopBar/styled-topbar';

export interface ISidebarProps {
  worldAppsTitleLabel: string;
  poweredByLabel: string;
  userInstalledAppsTitleLabel: string;
  userInstalledApps: IMenuItem[];
  exploreButtonLabel: string;
  worldApps: IMenuItem[];
  allMenuItems: IMenuItem[];
  currentRoute?: string;
  isLoggedIn: boolean;
  loadingUserInstalledApps: boolean;
  sidebarVisible: boolean;
  closeModal: () => void;
  onClickMenuItem: (appName: string, route: string) => void;
  onClickExplore: () => void;
  // viewport size
  size?: string;
  className?: string;
  modalSlotId: string;
}

const Sidebar: React.FC<ISidebarProps> = props => {
  const {
    worldAppsTitleLabel,
    poweredByLabel,
    userInstalledAppsTitleLabel,
    userInstalledApps,
    exploreButtonLabel,
    allMenuItems,
    worldApps,
    currentRoute,
    isLoggedIn,
    loadingUserInstalledApps,
    size,
    className,
    modalSlotId,
    sidebarVisible,
    closeModal,
    onClickMenuItem,
    onClickExplore,
  } = props;

  const [currentAppData, setCurrentAppData] = React.useState<IMenuItem | null>(null);
  const [activeOption, setActiveOption] = React.useState<IMenuItem | null>(null);

  React.useEffect(() => {
    if (allMenuItems && currentRoute) {
      const splitUrl = currentRoute.split('/');
      const route = splitUrl[1] ? `/${splitUrl[1]}` : '/';

      const activeApp = allMenuItems.find(menuItem => menuItem.route === route);
      if (activeApp && activeApp.index !== currentAppData?.index) {
        setCurrentAppData(activeApp);
      }

      // set the subroute
      if (splitUrl[2] && currentRoute !== activeOption?.route) {
        const currentOption = activeApp?.subRoutes?.find(
          menuItem => menuItem.route === currentRoute,
        );
        if (currentOption && currentOption.index !== activeOption?.index) {
          setActiveOption(currentOption);
        }
      }
    }
  }, [currentRoute, allMenuItems, currentAppData, activeOption]);

  const handleAppIconClick = (menuItem: IMenuItem) => () => {
    if (menuItem.subRoutes && menuItem.subRoutes.length === 0) {
      // if the current app has no subroutes, set as active and redirect to its route
      setCurrentAppData(menuItem);
      setActiveOption(null);
      onClickMenuItem(menuItem.name, menuItem.route);
      if (isMobileOnly) {
        // close modal after click on mobile
        closeModal();
      }
    }
  };
  const handleOptionClick = (menuItem: IMenuItem, subrouteMenuItem: IMenuItem) => () => {
    setCurrentAppData(menuItem);
    setActiveOption(subrouteMenuItem);
    onClickMenuItem(menuItem.name, subrouteMenuItem.route);
    if (isMobileOnly) {
      closeModal();
    }
  };

  const handleExploreClick = () => {
    onClickExplore();
  };

  const renderMenuItem = (menuItem: IMenuItem, index: number) => {
    const active = menuItem.label === currentAppData?.label;
    return (
      <StyledAccordionPanel
        size={size}
        key={index}
        hasChevron={menuItem.subRoutes?.length > 0}
        onClick={handleAppIconClick(menuItem)}
        label={
          <Box margin={{ vertical: 'small', left: 'medium' }} direction="row" align="center">
            <MenuAppButton menuItem={menuItem} active={active} />
            <Text
              size="large"
              margin={{ left: 'small' }}
              style={{
                width: '200px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {menuItem.label}
            </Text>
          </Box>
        }
      >
        {menuItem.subRoutes && menuItem.subRoutes.length > 0 && (
          <Box pad={{ horizontal: 'medium' }}>
            <Box direction="column" justify="evenly" margin={{ left: 'medium' }}>
              {menuItem.subRoutes.map((subRouteMenuItem, idx) => (
                <Box
                  key={idx + subRouteMenuItem.label}
                  pad={{ vertical: 'large', left: 'large' }}
                  border={{
                    size: 'medium',
                    color: subRouteMenuItem.route === activeOption?.route ? 'accent' : 'border',
                    side: 'left',
                  }}
                  onClick={handleOptionClick(menuItem, subRouteMenuItem)}
                >
                  <Text
                    size="large"
                    color={
                      subRouteMenuItem.route === activeOption?.route ? 'accent' : 'primaryText'
                    }
                  >
                    {subRouteMenuItem.label}
                  </Text>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </StyledAccordionPanel>
    );
  };

  const renderSidebarOverlay = () => (
    <ModalRenderer slotId={modalSlotId}>
      <ModalContainer
        onModalClose={closeModal}
        style={{ alignItems: 'flex-start' }}
        animation={{
          type: 'slideRight',
          duration: 250,
          delay: 0,
        }}
      >
        <StyledOverlay border={{ style: 'solid', size: '1px', color: 'border', side: 'left' }}>
          <Box
            pad={{
              horizontal: 'small',
              bottom: 'small',
              top: 'large',
            }}
          >
            <Box direction="row" justify="end" align="center">
              <Icon type="close" onClick={closeModal} />
            </Box>

            {renderSidebarContents()}
          </Box>
        </StyledOverlay>
      </ModalContainer>
    </ModalRenderer>
  );

  const renderSidebarContents = () => (
    <Box
      direction="column"
      elevation="shadow"
      className={className}
      style={{ position: 'relative' }}
    >
      <StyledHiddenScrollContainer>
        {worldApps?.length > 0 && (
          <Box pad={{ top: 'medium', bottom: 'small' }} align="start">
            <SectionTitle titleLabel={worldAppsTitleLabel} subtitleLabel={poweredByLabel} />
            <Accordion multiple={true}>{worldApps?.map(renderMenuItem)}</Accordion>
          </Box>
        )}
        {isLoggedIn && loadingUserInstalledApps && (
          <Box
            pad={{ top: 'medium', bottom: 'small' }}
            align="start"
            border={{ size: '1px', color: 'border', side: 'top' }}
          >
            <SectionTitle titleLabel={userInstalledAppsTitleLabel} />
            <Skeleton count={5} />
          </Box>
        )}
        {isLoggedIn && userInstalledApps?.length > 0 && (
          <Box
            pad={{ top: 'medium', bottom: 'small' }}
            align="start"
            border={{ size: '1px', color: 'border', side: 'top' }}
          >
            <SectionTitle titleLabel={userInstalledAppsTitleLabel} />
            <Accordion multiple={true}>{userInstalledApps?.map(renderMenuItem)}</Accordion>
          </Box>
        )}
      </StyledHiddenScrollContainer>

      {isLoggedIn && (
        <StyledFooter>
          <StyledButton
            margin="small"
            label={
              <Box direction="row" align="center" justify="center" margin={{ vertical: ' xlarge' }}>
                <Icon type="explore" size="md" plain={true} style={{ marginRight: '0.75rem' }} />
                <Text color="accentText" size="large">
                  {exploreButtonLabel}
                </Text>
              </Box>
            }
            onClick={handleExploreClick}
          />
        </StyledFooter>
      )}
    </Box>
  );

  return <>{isMobileOnly && sidebarVisible ? renderSidebarOverlay() : renderSidebarContents()}</>;
};

export default Sidebar;
