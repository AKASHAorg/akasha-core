import React from 'react';
import DS from '@akashaorg/design-system';

import { StyledIcon, StyledText } from '../styles';

const { Box, BasicCardBox, Checkbox } = DS;

export interface BaseOption {
  titleLabel: string;
  onChevronLeftClick: () => void;
}

export interface IPrivacyOption extends BaseOption {
  essentialCookiesLabel: string;
  essentialCookiesInfo1: string;
  essentialCookiesInfo2: string;
  essentialCookiesInfo3: string;
  trackingAnalyticsLabel: string;
  trackingAnalyticsInfo1: string;
  trackingAnalyticsInfo2: string;
  trackingAnalyticsLinkLabel: string;
  privacyPolicyLabel: string;
  checkedTracking: boolean;
  cookieType: string;
  onTrackingOptionChange: (ev: React.SyntheticEvent) => void;
}

const PrivacyOption: React.FC<IPrivacyOption> = props => {
  const {
    titleLabel,
    essentialCookiesLabel,
    essentialCookiesInfo1,
    essentialCookiesInfo2,
    essentialCookiesInfo3,
    trackingAnalyticsLabel,
    trackingAnalyticsInfo1,
    trackingAnalyticsInfo2,
    trackingAnalyticsLinkLabel,
    privacyPolicyLabel,
    checkedTracking,
    cookieType,
    onTrackingOptionChange,
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
          <StyledText weight="bold" size="large">
            {essentialCookiesLabel}
          </StyledText>
        </Box>
        <Box
          pad={{ top: 'medium', horizontal: 'medium', bottom: 'xlarge' }}
          justify="center"
          align="start"
          border={{ side: 'bottom', color: 'lightBorder' }}
        >
          <StyledText>
            {essentialCookiesInfo1}
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
            {essentialCookiesInfo2}
          </StyledText>
          <StyledText>{essentialCookiesInfo3}</StyledText>
        </Box>
        <Box
          direction="row"
          pad="medium"
          justify="between"
          align="center"
          border={{ side: 'bottom', color: 'lightBorder' }}
        >
          <StyledText weight="bold" size="large">
            {trackingAnalyticsLabel}
          </StyledText>
          <Checkbox
            checked={checkedTracking}
            onChange={onTrackingOptionChange}
            toggle={true}
            disabled={!cookieType}
          />
        </Box>
        <Box
          pad={{ top: 'medium', horizontal: 'medium', bottom: 'xlarge' }}
          justify="center"
          align="start"
        >
          <StyledText>
            {trackingAnalyticsInfo1}
            <StyledText
              color="accentText"
              style={{ cursor: 'pointer' }}
              onClick={() =>
                window.open('https://matomo.org', 'Matomo', '_blank noopener noreferrer')
              }
            >
              Matomo
            </StyledText>
            {trackingAnalyticsInfo2}
            <StyledText
              color="accentText"
              style={{ cursor: 'pointer' }}
              onClick={() =>
                window.open(
                  'https://forum.akasha.org/t/implementing-analytics-on-ethereum-world-an-open-discussion-on-the-rationale-and-your-choices/100',
                  'Akasha Forum',
                  '_blank noopener noreferrer',
                )
              }
            >
              {trackingAnalyticsLinkLabel}
            </StyledText>
          </StyledText>
        </Box>
      </BasicCardBox>
    </Box>
  );
};

export default PrivacyOption;
