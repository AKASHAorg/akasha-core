import { Box, Text } from 'grommet';
import * as React from 'react';
import { IconLink } from '../../Buttons';
import { AppIcon, Icon } from '../../Icon/index';
import { AppMenuPopover } from '../../Popovers/index';
import {
  SecondarySidebarBox,
  SecondarySidebarContentWrapper,
  SidebarBox,
  StyledAppIconWrapper,
  StyledBorderBox,
  StyledBottomDiv,
  StyledHiddenScrollContainer,
  StyledVerticalPad,
} from './styled-sidebar';
import { UserSection } from './user-section';

export interface ISidebarProps {
  ethAddress: string;
  avatarImage?: string;
  notifications?: INotification[];
  installedApps: IApp[];
  onClickOption: (option: string) => void;
  onClickAddApp: () => void;
  onClickSearch: () => void;
  onClickCloseSidebar: () => void;
  searchLabel: string;
  appCenterLabel: string;
}

export interface IApp {
  name: string;
  image?: string;
  ethAddress: string;
  options: string[];
}

export interface INotification {
  ethAddress: string;
  user?: string;
  userAvatar?: string;
  time: string;
  action: string;
}

const Sidebar: React.FC<ISidebarProps> = props => {
  const {
    avatarImage,
    ethAddress,
    notifications,
    installedApps,
    onClickAddApp,
    onClickOption,
    onClickSearch,
  } = props;

  const popoversRef: React.Ref<any> = React.useRef(installedApps?.map(() => React.createRef()));

  const initialAppData = {
    name: '',
    ethAddress: '',
    image: '',
    options: [],
    index: -1,
  };

  const [appPopoverOpen, setAppPopoverOpen] = React.useState(false);
  const [hoveredAppData, setHoveredAppData] = React.useState<{
    name: string;
    ethAddress: string;
    image?: string;
    options: string[];
    index: number;
  }>(initialAppData);

  const [currentAppData, setCurrentAppData] = React.useState<{
    name: string;
    ethAddress: string;
    image?: string;
    options: string[];
    index: number;
  }>(initialAppData);

  const [activeOption, setActiveOption] = React.useState(currentAppData.options[0]);

  // @TODO: use route params to determine active app/option
  React.useEffect(() => {
    const firstAppData = { ...installedApps[0], index: 0 };
    setCurrentAppData(firstAppData);
    setActiveOption(firstAppData.options[0]);
  }, []);

  const handleAppIconClick = (app: IApp, index: number) => () => {
    const appData = { ...app, index };
    setCurrentAppData(appData);
    setHoveredAppData(appData);
  };

  const handleOptionClick = (option: string) => () => {
    setActiveOption(option);
    onClickOption(option);
  };

  const handlePopoverOptionClick = (option: string) => {
    setCurrentAppData(hoveredAppData);
    setHoveredAppData(initialAppData);
    setActiveOption(option);
  };

  const handleMouseEnter = (app: IApp, index: number) => () => {
    const appData = { ...app, index };
    setHoveredAppData(appData);
    setAppPopoverOpen(true);
  };

  const handleClosePopover = () => {
    setAppPopoverOpen(false);
    setHoveredAppData(initialAppData);
  };

  return (
    <Box fill="vertical" direction="row">
      <SidebarBox
        direction="column"
        align="center"
        border={{
          color: 'border',
          size: 'xsmall',
          style: 'solid',
          side: 'right',
        }}
      >
        <UserSection
          avatarImage={avatarImage}
          ethAddress={ethAddress}
          notifications={notifications}
          onClickSearch={onClickSearch}
        />
        <Box align="center" justify="between" fill={true}>
          <StyledHiddenScrollContainer>
            {installedApps.map((app, index) => (
              <StyledVerticalPad key={index}>
                <StyledBorderBox
                  fill="horizontal"
                  align="center"
                  active={index === currentAppData.index}
                  hovered={index === hoveredAppData.index}
                  ref={popoversRef.current[index]}
                >
                  <StyledAppIconWrapper
                    active={index === currentAppData.index}
                    hovered={index === hoveredAppData.index}
                    onMouseEnter={handleMouseEnter(app, index)}
                  >
                    <AppIcon
                      placeholderIconType="app"
                      appImg={app.image}
                      onClick={handleAppIconClick(app, index)}
                      size="md"
                    />
                  </StyledAppIconWrapper>
                </StyledBorderBox>
              </StyledVerticalPad>
            ))}
          </StyledHiddenScrollContainer>
          {appPopoverOpen && popoversRef.current && hoveredAppData && (
            <AppMenuPopover
              target={popoversRef.current[hoveredAppData.index].current}
              closePopover={handleClosePopover}
              appData={hoveredAppData}
              onClickOption={handlePopoverOptionClick}
            />
          )}
          <StyledBottomDiv>
            <Icon type="plusGrey" onClick={onClickAddApp} clickable={true} size="md" />
          </StyledBottomDiv>
        </Box>
      </SidebarBox>
      <SecondarySidebarBox
        fill="vertical"
        direction="column"
        align="center"
        border={{
          color: 'border',
          size: 'xsmall',
          style: 'solid',
          side: 'right',
        }}
      >
        <SecondarySidebarContentWrapper>
          <Box
            pad={{ vertical: 'small', horizontal: 'none' }}
            fill="horizontal"
            border={{ color: 'border', size: '1px', side: 'bottom' }}
            gap="xsmall"
            direction="row"
            align="center"
          >
            <AppIcon placeholderIconType="app" size="md" appImg={currentAppData.image} />
            <Text size="large">{currentAppData.name}</Text>
          </Box>
          <Box pad="none">
            {currentAppData.options?.map((option, index) => (
              <Box pad={{ vertical: 'xsmall' }} key={index}>
                <IconLink
                  label={option}
                  onClick={handleOptionClick(option)}
                  active={option === activeOption}
                />
              </Box>
            ))}
          </Box>
        </SecondarySidebarContentWrapper>
      </SecondarySidebarBox>
    </Box>
  );
};

export { Sidebar };
