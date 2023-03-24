import React from 'react';

import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Toggle from '@akashaorg/design-system-core/lib/components/Toggle';

import PageLayout from './base-layout';
import { BaseOption } from './settings-page';

export interface IPrivacyOption extends BaseOption {
  worldLabel: string;
  essentialCookiesLabel: string;
  essentialCookiesInfo1: string;
  privacyPolicyLabel: string;
  essentialCookiesInfo2: string;
  essentialCookiesInfo3: string;
  essentialCookiesInfo4: string;
  trackingAnalyticsLabel: string;
  trackingAnalyticsInfo1: string;
  trackingAnalyticsInfo2: string;
  matomoLabel: string;
  matomoUrl: string;
  trackingAnalyticsInfo3: string;
  trackingAnalyticsInfo4: string;
  ctaLabel: string;
  ctaUrl: string;
  checkedTracking: boolean;
  cookieType: string;
  onPrivacyPolicyClick: () => void;
  onTrackingOptionChange: (ev: React.SyntheticEvent) => void;
}

const PrivacyOption: React.FC<IPrivacyOption> = props => {
  const {
    titleLabel,
    worldLabel,
    essentialCookiesLabel,
    essentialCookiesInfo1,
    essentialCookiesInfo2,
    essentialCookiesInfo3,
    essentialCookiesInfo4,
    trackingAnalyticsLabel,
    trackingAnalyticsInfo1,
    trackingAnalyticsInfo2,
    trackingAnalyticsInfo3,
    trackingAnalyticsInfo4,
    matomoLabel,
    matomoUrl,
    ctaLabel,
    ctaUrl,
    privacyPolicyLabel,
    checkedTracking,
    cookieType,
    onPrivacyPolicyClick,
    onTrackingOptionChange,
  } = props;

  return (
    <PageLayout title={titleLabel}>
      <Box customStyle="px-4">
        {/* essential cookies */}
        <Box customStyle="py-4 border(b-1 solid grey8)">
          <Box customStyle="flex justify-between items-center mb-2">
            <Text weight="bold">{essentialCookiesLabel}</Text>

            {/* always checked and cannot be toggled */}
            <Toggle checked={true} disabled={true} />
          </Box>

          <Text>
            {essentialCookiesInfo1}
            <Text customStyle="inline-block" as="span" weight="bold">
              {worldLabel}
            </Text>
            {essentialCookiesInfo2}
            <span onClick={onPrivacyPolicyClick}>
              <Text
                customStyle="inline-block cursor-pointer"
                as="span"
                weight="bold"
                color={{ light: 'text-secondary-light', dark: 'text-secondary-dark' }}
              >
                {privacyPolicyLabel}
              </Text>
            </span>
            {essentialCookiesInfo3}
            {essentialCookiesInfo4}
          </Text>
        </Box>

        {/* tracking analytics */}
        <Box customStyle="py-4">
          <Box customStyle="flex justify-between items-center mb-2">
            <Text weight="bold">{trackingAnalyticsLabel}</Text>

            <Toggle
              checked={checkedTracking}
              onChange={onTrackingOptionChange}
              disabled={!cookieType}
            />
          </Box>

          <Text>
            {trackingAnalyticsInfo1}
            <Text customStyle="inline-block" as="span" weight="bold">
              {worldLabel}
            </Text>
            {trackingAnalyticsInfo2}
            <Anchor href={matomoUrl}>
              <Text
                as="span"
                weight="bold"
                color={{ light: 'text-secondary-light', dark: 'text-secondary-dark' }}
              >
                {matomoLabel}
              </Text>
            </Anchor>
            {trackingAnalyticsInfo3}
            <Anchor href={ctaUrl}>
              <Text
                as="span"
                color={{ light: 'text-secondary-light', dark: 'text-secondary-dark' }}
              >
                {ctaLabel}
              </Text>
            </Anchor>
            {trackingAnalyticsInfo4}
          </Text>
        </Box>
      </Box>
    </PageLayout>
  );
};

export default PrivacyOption;
