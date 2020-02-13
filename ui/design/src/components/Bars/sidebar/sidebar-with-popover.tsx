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
  StyledAppsContainer,
  StyledBottomDiv,
  StyledHiddenScrollContainer,
} from './styled-sidebar';
import { UserSection } from './user-section';

export interface ISidebarProps {
  ethAddress: string;
  avatarImage?: string;
  notifications?: INotification[];
  installedApps: IApp[];
  onClickOption: (option: string) => void;
  onClickAddApp: () => void;
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

const SidebarWithPopover: React.FC<ISidebarProps> = props => {
  const {
    avatarImage,
    ethAddress,
    notifications,
    installedApps,
    onClickAddApp,
    onClickOption,
  } = props;

  const [appPopoverOpen, setAppPopoverOpen] = React.useState(false);
  const [clickedAppData, setClickedAppData] = React.useState<{
    name: string;
    ethAddress: string;
    image?: string;
    options: string[];
    index: number;
  }>({
    name: '',
    ethAddress: '',
    image: '',
    options: [],
    index: 0,
  });
  const [currentAppData, setCurrentAppData] = React.useState<{
    name: string;
    ethAddress: string;
    image?: string;
    options: string[];
    index: number;
  }>({
    name: '',
    ethAddress: '',
    image: '',
    options: [],
    index: 0,
  });

  React.useEffect(() => {
    const firstAppData = { ...installedApps[0], index: 0 };
    setCurrentAppData(firstAppData);
  }, [installedApps]);

  const [activeOption, setActiveOption] = React.useState(currentAppData.options[0]);

  const handleOptionClick = (option: string) => () => {
    setActiveOption(option);
    onClickOption(option);
  };

  const popoversRef: React.Ref<any> = React.useRef(installedApps?.map(() => React.createRef()));

  const handleAppIconClick = (app: IApp, index: number) => () => {
    setAppPopoverOpen(true);
    const appData = { ...app, index };
    setClickedAppData(appData);
  };

  const handlePopoverOptionClick = (option: string) => {
    console.log('current: ', currentAppData, 'clicked: ', clickedAppData);
    setCurrentAppData(clickedAppData);
    setActiveOption(option);
  };

  const handleActiveBorder: any = (index: number) => {
    if (index === currentAppData.index) {
      return { color: 'accent', size: '2px', side: 'left' };
    }
    return { color: 'background', size: '2px', side: 'left' };
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
        />
        <Box align="center" pad="xsmall" justify="between" fill={true}>
          <StyledAppsContainer>
            <StyledHiddenScrollContainer>
              {installedApps.map((app, index) => (
                <Box pad={{ vertical: 'small' }} key={index}>
                  <Box pad={{ horizontal: '0.8em' }} border={handleActiveBorder(index)}>
                    <StyledAppIconWrapper active={index === currentAppData.index}>
                      <AppIcon
                        placeholderIconType="app"
                        ref={popoversRef.current[index]}
                        appImg={app.image}
                        onClick={handleAppIconClick(app, index)}
                        size="md"
                      />
                    </StyledAppIconWrapper>
                  </Box>
                </Box>
              ))}
            </StyledHiddenScrollContainer>
          </StyledAppsContainer>
          {appPopoverOpen && popoversRef.current && clickedAppData && (
            <AppMenuPopover
              target={popoversRef.current[clickedAppData.index].current}
              closePopover={() => {
                setAppPopoverOpen(false);
              }}
              appData={clickedAppData}
              onClickOption={handlePopoverOptionClick}
            />
          )}
          <StyledBottomDiv>
            <Icon type="plusGrey" onClick={onClickAddApp} clickable={true} />
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

export { SidebarWithPopover };
