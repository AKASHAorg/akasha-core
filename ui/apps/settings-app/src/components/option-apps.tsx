import React from 'react';
import DS from '@akashaproject/design-system';
import { StyledIcon, StyledText } from '../styles';
import { IAppsOption } from '../interfaces';

const { Box, Checkbox } = DS;

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
    OnChevronLeftClick,
  } = props;

  return (
    <>
      <Box
        direction="row"
        pad="medium"
        align="center"
        border={{ side: 'bottom', color: 'lightBorder' }}
      >
        <StyledIcon type="chevronLeft" onClick={OnChevronLeftClick} />
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
          <Checkbox checked={checkedDataAnalytics} onChange={onDataAnalyticsChange} toggle={true} />
        </Box>
      </Box>
      <Box
        pad={{ top: 'medium', horizontal: 'medium', bottom: 'large' }}
        justify="center"
        align="start"
        border={{ side: 'bottom', color: 'lightBorder' }}
      >
        <StyledText>{dataAnalyticsinfo}</StyledText>
      </Box>
    </>
  );
};

export default AppsOption;
