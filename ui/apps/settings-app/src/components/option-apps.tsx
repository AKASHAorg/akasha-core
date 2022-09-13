import React from 'react';
import DS from '@akashaorg/design-system';
import { StyledIcon, StyledText } from '../styles';
import { BaseOption } from './option-privacy';

const { Box, BasicCardBox, Checkbox } = DS;

export interface IAppsOption extends BaseOption {
  autoUpdatesLabel: string;
  autoUpdatesInfo: string;
  dataAnalyticsLabel: string;
  dataAnalyticsinfo: string;
  checkedAutoUpdates: boolean;
  checkedDataAnalytics: boolean;
  onAutoUpdatesChange: (ev: React.SyntheticEvent) => void;
  onDataAnalyticsChange: (ev: React.SyntheticEvent) => void;
}

const AppsOption: React.FC<IAppsOption> = props => {
  const {
    titleLabel,
    autoUpdatesLabel,
    autoUpdatesInfo,
    dataAnalyticsLabel,
    dataAnalyticsinfo,
    checkedAutoUpdates,
    checkedDataAnalytics,
    onAutoUpdatesChange,
    onDataAnalyticsChange,
    onChevronLeftClick,
  } = props;

  return (
    <Box direction="column" gap="small">
      <BasicCardBox>
        <Box
          direction="row"
          pad="medium"
          align="center"
          border={{ side: 'bottom', color: 'lightBorder' }}
        >
          <StyledIcon type="chevronLeft" onClick={onChevronLeftClick} />
          <StyledText weight="bold" size="large" margin={{ vertical: '0', horizontal: 'auto' }}>
            {titleLabel}
          </StyledText>
        </Box>
        <Box
          direction="row"
          pad="medium"
          justify="between"
          align="center"
          border={{ side: 'bottom', color: 'lightBorder' }}
        >
          <StyledText weight="bold">{autoUpdatesLabel}</StyledText>
          <Box pad={{ top: 'small' }}>
            <Checkbox checked={checkedAutoUpdates} onChange={onAutoUpdatesChange} toggle={true} />
          </Box>
        </Box>
        <Box
          pad={{ top: 'medium', horizontal: 'medium', bottom: 'large' }}
          justify="center"
          align="start"
          border={{ side: 'bottom', color: 'lightBorder' }}
        >
          <StyledText>{autoUpdatesInfo}</StyledText>
        </Box>
        <Box
          direction="row"
          pad="medium"
          justify="between"
          align="center"
          border={{ side: 'bottom', color: 'lightBorder' }}
        >
          <StyledText weight="bold">{dataAnalyticsLabel}</StyledText>
          <Box pad={{ top: 'small' }}>
            <Checkbox
              checked={checkedDataAnalytics}
              onChange={onDataAnalyticsChange}
              toggle={true}
            />
          </Box>
        </Box>
        <Box
          pad={{ top: 'medium', horizontal: 'medium', bottom: 'large' }}
          justify="center"
          align="start"
        >
          <StyledText>{dataAnalyticsinfo}</StyledText>
        </Box>
      </BasicCardBox>
    </Box>
  );
};

export default AppsOption;
