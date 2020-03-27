import { Accordion, AccordionPanel, Box, Text } from 'grommet';
import * as React from 'react';
import { IconLink } from '../../Buttons';
import { AppIcon, Icon } from '../../Icon/index';
import { TextIcon } from '../../TextIcon/index';
import { ISidebarProps } from './sidebar';
import { IMenuItem } from '@akashaproject/ui-awf-typings/lib/app-loader';
import {
  StyledAppIconWrapper,
  StyledAppOptionBox,
  StyledHiddenScrollContainer,
  StyledMobileFooterBox,
  StyledMobileHeaderBox,
} from './styled-sidebar';

const SidebarMobile: React.FC<ISidebarProps> = props => {
  const {
    installedApps,
    onClickAddApp,
    onClickMenuItem,
    onClickSearch,
    onClickCloseSidebar,
    searchLabel,
    appCenterLabel,
  } = props;

  const [currentAppData, setCurrentAppData] = React.useState<IMenuItem | null>(null);

  // @TODO: use route params to determine active app/option
  React.useEffect(() => {
    if (installedApps) {
      setCurrentAppData(installedApps[0]);
    }
  }, []);

  const [activeOption, setActiveOption] = React.useState('');

  const handleAppIconClick = (menuItem: IMenuItem) => () => {
    setCurrentAppData(menuItem);
  };

  const handleActiveBorder: any = (index: number) => {
    if (index === currentAppData?.index) {
      return { color: 'accent', size: '2px', side: 'left' };
    }
    return { color: 'background', size: '2px', side: 'left' };
  };

  const handleOptionClick = (menuItem: IMenuItem) => () => {
    setActiveOption(menuItem.label);
    onClickMenuItem(menuItem.route);
  };

  return (
    <Box fill={true} direction="column">
      <StyledMobileHeaderBox
        margin={{ horizontal: 'small' }}
        border={{
          color: 'border',
          size: 'xsmall',
          style: 'solid',
          side: 'bottom',
        }}
      >
        <Box align="end" pad={{ vertical: 'xsmall' }}>
          <Icon type="close" primaryColor={true} onClick={onClickCloseSidebar} clickable={true} />
        </Box>
        <Box align="start" pad={{ bottom: 'xsmall' }}>
          <TextIcon
            label={searchLabel}
            iconType="search"
            clickable={true}
            onClick={onClickSearch}
          />
        </Box>
      </StyledMobileHeaderBox>
      <Box align="center" fill={true}>
        <StyledHiddenScrollContainer>
          <Accordion>
            {installedApps?.map((menuItem, index) => (
              <AccordionPanel
                onClick={handleAppIconClick(menuItem)}
                label={
                  <Box
                    pad={{ horizontal: 'small' }}
                    margin={{ vertical: 'xsmall' }}
                    border={handleActiveBorder(index)}
                    gap="xsmall"
                    direction="row"
                    align="center"
                  >
                    <StyledAppIconWrapper active={index === currentAppData?.index}>
                      <AppIcon placeholderIconType="app" appImg={menuItem.logo} size="md" />
                    </StyledAppIconWrapper>
                    <Text>{menuItem.label}</Text>
                  </Box>
                }
                key={index}
              >
                <StyledAppOptionBox direction="column" pad={{ vertical: 'small', left: '1.75em' }}>
                  {menuItem.subRoutes?.map(subRouteMenuItem => (
                    <IconLink
                      label={subRouteMenuItem.label}
                      key={subRouteMenuItem.index}
                      onClick={handleOptionClick(subRouteMenuItem)}
                      size="medium"
                      margin={{ vertical: 'xsmall' }}
                      active={subRouteMenuItem.label === activeOption}
                    />
                  ))}
                </StyledAppOptionBox>
              </AccordionPanel>
            ))}
          </Accordion>
        </StyledHiddenScrollContainer>
      </Box>
      <StyledMobileFooterBox
        margin={{ horizontal: 'small' }}
        border={{
          color: 'border',
          size: 'xsmall',
          style: 'solid',
          side: 'top',
        }}
        justify="center"
      >
        <Box justify="start" pad={{ vertical: 'small' }}>
          <TextIcon label={appCenterLabel} iconType="plusGrey" onClick={onClickAddApp} size="md" />
        </Box>
      </StyledMobileFooterBox>
    </Box>
  );
};

export { SidebarMobile };
