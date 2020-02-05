import { Box } from 'grommet';
import * as React from 'react';
import { AppIcon, Icon } from '../../Icon/index';
import { AppMenuPopover } from '../../Popovers/index';
import { IApp } from './sidebar';
import {
  StyledAppsContainer,
  StyledBottomDiv,
  StyledHiddenScrollContainer,
} from './styled-sidebar';

export interface IAppsSectionProps {
  installedApps?: IApp[];
  onClickAddApp: () => void;
  aboutLabel: string;
  feedLabel: string;
  collectionsLabel: string;
}

const AppsSection: React.FC<IAppsSectionProps> = props => {
  const { aboutLabel, feedLabel, collectionsLabel, installedApps, onClickAddApp } = props;

  const [appPopoverOpen, setAppPopoverOpen] = React.useState(false);
  const [currentAppData, setCurrentAppData] = React.useState<{
    name: string;
    ethAddress: string;
    image?: string;
    index: number;
  }>({
    name: '',
    ethAddress: '',
    image: '',
    index: 0,
  });

  const popoversRef: React.Ref<any> = React.useRef(installedApps?.map(() => React.createRef()));

  const handleAppIconClick = (app: IApp, index: number) => () => {
    setAppPopoverOpen(true);
    const appData = { ...app, index };
    setCurrentAppData(appData);
  };

  return (
    <Box align="center" pad="xsmall" justify="between" fill={true}>
      <StyledAppsContainer>
        <StyledHiddenScrollContainer>
          {installedApps &&
            installedApps.map((app, index) => (
              <Box pad="xxsmall" key={index}>
                <AppIcon
                  placeholderIconType="app"
                  ref={popoversRef.current[index]}
                  appImg={app.image}
                  onClick={handleAppIconClick(app, index)}
                />
              </Box>
            ))}
        </StyledHiddenScrollContainer>
      </StyledAppsContainer>
      {appPopoverOpen && popoversRef.current && currentAppData && (
        <AppMenuPopover
          target={popoversRef.current[currentAppData.index].current}
          closePopover={() => {
            setAppPopoverOpen(false);
          }}
          appData={currentAppData}
          aboutLabel={aboutLabel}
          feedLabel={feedLabel}
          collectionsLabel={collectionsLabel}
        />
      )}
      <StyledBottomDiv>
        <Icon type="plusGrey" onClick={onClickAddApp} clickable={true} />
      </StyledBottomDiv>
    </Box>
  );
};

export { AppsSection };
