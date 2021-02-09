import React from 'react';
import DS from '@akashaproject/design-system';

import { StyledIcon, StyledText } from '../styles';
import { IPrivacyOption } from '../interfaces';

const { Box, Checkbox } = DS;

const PrivacyOption: React.FC<IPrivacyOption> = props => {
  const {
    titleLabel,
    essentialCookiesLabel,
    essentialCookiesInfo,
    trackingAnalyticsLabel,
    trackingAnalyticsInfoIntro,
    trackingAnalyticsInfo,
    privacyPolicyLabel,
    checkedTracking,
    cookieType,
    onTrackingOptionChange,
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
        <StyledText weight="bold">{essentialCookiesLabel}</StyledText>
      </Box>
      <Box
        pad={{ top: 'medium', horizontal: 'medium', bottom: 'xlarge' }}
        justify="center"
        align="start"
        border={{ side: 'bottom', color: 'lightBorder' }}
      >
        <StyledText>
          {essentialCookiesInfo}
          <StyledText
            color="accentText"
            style={{ cursor: 'pointer' }}
            onClick={() =>
              window.open(
                `${window.location.protocol}//${window.location.host}/legal/privacy-policy`,
                'Privacy Policy',
                '_blank noopener noreferrer',
              )
            }
          >
            {privacyPolicyLabel}
          </StyledText>
          .
        </StyledText>
      </Box>
      <Box
        direction="row"
        pad="medium"
        justify="between"
        align="center"
        border={{ side: 'bottom', color: 'lightBorder' }}
      >
        <StyledText weight="bold">{trackingAnalyticsLabel}</StyledText>
        <Box pad={{ top: 'small' }}>
          <Checkbox
            checked={checkedTracking}
            onChange={onTrackingOptionChange}
            toggle={true}
            disabled={!cookieType}
          />
        </Box>
      </Box>
      <Box
        pad={{ top: 'medium', horizontal: 'medium', bottom: 'xlarge' }}
        justify="center"
        align="start"
        border={{ side: 'bottom', color: 'lightBorder' }}
      >
        <StyledText>
          {trackingAnalyticsInfoIntro}
          <StyledText
            color="accentText"
            style={{ cursor: 'pointer' }}
            onClick={() =>
              window.open('https://matomo.org', 'Matomo', '_blank noopener noreferrer')
            }
          >
            Matomo,
          </StyledText>
          {trackingAnalyticsInfo}
        </StyledText>
      </Box>
    </>
  );
};

export default PrivacyOption;
