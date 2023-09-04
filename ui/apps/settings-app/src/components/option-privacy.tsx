import React from 'react';

import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
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
      <Stack customStyle="px-4">
        {/* essential cookies */}
        <Stack customStyle="py-4 border(b-1 solid grey8)">
          <Stack justify="between" align="center" customStyle="mb-2">
            <Text weight="bold">{essentialCookiesLabel}</Text>

            {/* always checked and cannot be toggled */}
            <Toggle checked={true} disabled={true} />
          </Stack>

          <Text>
            {essentialCookiesInfo1}
            <Text customStyle="inline-block" as="span" weight="bold">
              {worldLabel}
            </Text>
            {essentialCookiesInfo2}
            <Button plain={true} onClick={onPrivacyPolicyClick}>
              <Text
                customStyle="inline-block cursor-pointer"
                as="span"
                weight="bold"
                color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
              >
                {privacyPolicyLabel}
              </Text>
            </Button>
            {essentialCookiesInfo3}
            {essentialCookiesInfo4}
          </Text>
        </Stack>

        {/* tracking analytics */}
        <Stack customStyle="py-4">
          <Stack justify="between" align="center" customStyle="mb-2">
            <Text weight="bold">{trackingAnalyticsLabel}</Text>

            <Toggle
              checked={checkedTracking}
              onChange={onTrackingOptionChange}
              disabled={!cookieType}
            />
          </Stack>

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
                color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
              >
                {matomoLabel}
              </Text>
            </Anchor>
            {trackingAnalyticsInfo3}
            <Anchor href={ctaUrl}>
              <Text as="span" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
                {ctaLabel}
              </Text>
            </Anchor>
            {trackingAnalyticsInfo4}
          </Text>
        </Stack>
      </Stack>
    </PageLayout>
  );
};

export default PrivacyOption;
