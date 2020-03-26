import { Accordion, AccordionPanel, Box, Text } from 'grommet';
import * as React from 'react';
import { IconLink } from '../../Buttons';
import { AppIcon, Icon } from '../../Icon/index';
import { TextIcon } from '../../TextIcon/index';
import { IApp, ISidebarProps } from './sidebar';
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
    onClickOption,
    onClickSearch,
    onClickCloseSidebar,
    searchLabel,
    appCenterLabel,
  } = props;

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

  // @TODO: use route params to determine active app/option
  React.useEffect(() => {
    const firstAppData = { ...installedApps[0], index: 0 };
    setCurrentAppData(firstAppData);
    setActiveOption(firstAppData.options[0]);
  }, []);

  const [activeOption, setActiveOption] = React.useState(currentAppData.options[0]);

  const handleAppIconClick = (app: IApp, index: number) => () => {
    const appData = { ...app, index };
    setCurrentAppData(appData);
  };

  const handleActiveBorder: any = (index: number) => {
    if (index === currentAppData.index) {
      return { color: 'accent', size: '2px', side: 'left' };
    }
    return { color: 'background', size: '2px', side: 'left' };
  };

  const handleOptionClick = (option: string) => () => {
    setActiveOption(option);
    onClickOption(option);
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
          <Icon type="close" default={true} onClick={onClickCloseSidebar} clickable={true} />
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
            {installedApps.map((app, index) => (
              <AccordionPanel
                onClick={handleAppIconClick(app, index)}
                label={
                  <Box
                    pad={{ horizontal: 'small' }}
                    margin={{ vertical: 'xsmall' }}
                    border={handleActiveBorder(index)}
                    gap="xsmall"
                    direction="row"
                    align="center"
                  >
                    <StyledAppIconWrapper active={index === currentAppData.index}>
                      <AppIcon placeholderIconType="app" appImg={app.image} size="md" />
                    </StyledAppIconWrapper>
                    <Text>{app.name}</Text>
                  </Box>
                }
                key={index}
              >
                <StyledAppOptionBox direction="column" pad={{ vertical: 'small', left: '1.75em' }}>
                  {app.options.map((option, idx) => (
                    <IconLink
                      label={option}
                      key={idx}
                      onClick={handleOptionClick(option)}
                      size="medium"
                      margin={{ vertical: 'xsmall' }}
                      active={option === activeOption}
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
