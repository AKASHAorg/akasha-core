import * as React from 'react';
import { Box, Text, Tabs } from 'grommet';
import { IntegrationInfo } from '@akashaproject/ui-awf-typings';
import Icon from '../Icon';
import SubtitleTextIcon from '../SubtitleTextIcon';
import { TextLine } from '../VirtualList/placeholders/entry-card-placeholder';
import { StyledTab } from '../AppInfoWidgetCard/styled-widget-cards';
import { WidgetAreaCardBox } from '../EntryCard/basic-card-box';
import ErrorLoader from '../ErrorLoader';

export interface ICWidgetCardProps {
  className?: string;

  worldApps: IntegrationInfo[];
  installedApps: IntegrationInfo[];
  // labels
  titleLabel: string;
  worldAppsLabel: string;
  installedAppsLabel: string;
  noWorldAppsLabel: string;
  noInstalledAppsLabel: string;
  noInstalledAppsSubLabel: string;
  // loading status
  isLoadingWorldApps?: boolean;
  isLoadingInstalledApps?: boolean;
  // handlers
  onClickWorldApp: (id: string) => void;
  onClickInstalledApp: (id: string) => void;
  onActiveTabChange?: (tabIdx: number) => void;
}

const ICWidgetCard: React.FC<ICWidgetCardProps> = props => {
  const {
    className,
    titleLabel,
    worldAppsLabel,
    installedAppsLabel,
    worldApps,
    installedApps,
    noWorldAppsLabel,
    noInstalledAppsLabel,
    noInstalledAppsSubLabel,
    isLoadingWorldApps,
    isLoadingInstalledApps,
    onClickWorldApp,
    onClickInstalledApp,
    onActiveTabChange,
  } = props;

  const handleTabChange = (tabIdx: number) => {
    if (onActiveTabChange) {
      onActiveTabChange(tabIdx);
    }
  };

  return (
    <WidgetAreaCardBox className={className}>
      <Box pad="medium" gap="medium">
        <Text weight="bold" size="large">
          {titleLabel}
        </Text>
      </Box>
      <Tabs onActive={handleTabChange}>
        <StyledTab title={worldAppsLabel}>
          <Box>
            {worldApps && worldApps.length === 0 && !isLoadingWorldApps && (
              <Box pad="medium" align="center" justify="center">
                <Text>{noWorldAppsLabel}</Text>
              </Box>
            )}
            {worldApps &&
              worldApps.length === 0 &&
              isLoadingWorldApps &&
              Array.from({ length: 4 }, (_el, index: number) => (
                <Box key={index} direction="row" justify="between" align="center">
                  <Box gap="xxsmall">
                    <TextLine title="tagName" animated={false} width="140px" />
                    <TextLine title="tagName" animated={false} width="80px" />
                  </Box>
                  <TextLine title="tagName" animated={false} width="7rem" height="2rem" />
                </Box>
              ))}
            {worldApps &&
              worldApps.length !== 0 &&
              worldApps.slice(0, 4).map((app, index) => (
                <Box
                  key={index}
                  direction="row"
                  justify="between"
                  border={index !== 3 ? { side: 'bottom' } : null}
                  pad={{ horizontal: 'medium', vertical: 'small' }}
                >
                  <Box direction="row">
                    <Box width="100%" pad="none" align="start">
                      <SubtitleTextIcon
                        onClick={() => onClickWorldApp(app.id)}
                        label={app.name}
                        subtitle={`@${app.id}`}
                        labelSize="large"
                        gap="xxsmall"
                        maxWidth="10rem"
                        iconType="integrationAppLarge"
                        plainIcon={true}
                        backgroundColor={true}
                      />
                    </Box>
                  </Box>
                  <Box justify="center">
                    <Icon type="checkSimple" size="sm" accentColor />
                  </Box>
                </Box>
              ))}
          </Box>
        </StyledTab>
        <StyledTab title={installedAppsLabel}>
          <Box>
            {installedApps && installedApps.length === 0 && !isLoadingInstalledApps && (
              <Box pad="medium" align="center" justify="center">
                <ErrorLoader
                  type="no-login"
                  title={noInstalledAppsLabel}
                  details={noInstalledAppsSubLabel}
                  noBorder={true}
                />
              </Box>
            )}
            {installedApps &&
              installedApps.length === 0 &&
              isLoadingInstalledApps &&
              Array.from({ length: 4 }, (_el, index: number) => (
                <Box key={index} direction="row" justify="between" align="center">
                  <Box gap="xxsmall">
                    <TextLine title="tagName" animated={false} width="140px" />
                    <TextLine title="tagName" animated={false} width="80px" />
                  </Box>
                  <TextLine title="tagName" animated={false} width="7rem" height="2rem" />
                </Box>
              ))}
            {installedApps &&
              installedApps.length !== 0 &&
              installedApps.slice(0, 4).map((app, index) => (
                <Box
                  key={index}
                  direction="row"
                  justify="between"
                  border={index !== 3 ? { side: 'bottom' } : null}
                  pad={{ horizontal: 'medium', vertical: 'small' }}
                >
                  <Box direction="row">
                    <Box width="100%" pad="none" align="start">
                      <SubtitleTextIcon
                        onClick={() => onClickInstalledApp(app.id)}
                        label={app.name}
                        subtitle={`@${app.id}`}
                        labelSize="large"
                        gap="xxsmall"
                        maxWidth="10rem"
                        iconType="integrationAppLarge"
                        plainIcon={true}
                        backgroundColor={true}
                      />
                    </Box>
                  </Box>
                  <Box justify="center">
                    <Icon type="checkSimple" size="sm" accentColor />
                  </Box>
                </Box>
              ))}
          </Box>
        </StyledTab>
      </Tabs>
    </WidgetAreaCardBox>
  );
};

ICWidgetCard.defaultProps = {
  titleLabel: 'My Apps',
  worldAppsLabel: 'World Apps',
  installedAppsLabel: 'Installed',
  noWorldAppsLabel: 'No World Apps. Please check later',
  noInstalledAppsLabel: 'No Installed Apps. Please install an app',
};

export default ICWidgetCard;
