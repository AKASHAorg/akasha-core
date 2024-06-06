import React from 'react';

import Link from '@akashaorg/design-system-core/lib/components/Link';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type CookieCardProps = {
  titleLabel: string;
  paragraphOneLabel: string;
  paragraphTwo: {
    introLabel: string;
    analyticsLabel: string;
    analyticsURL: string;
    middleParagraphLabeL: string;
    lastParagraphLabel: string;
    settingsLabel: string;
    onSettingsClick: () => void;
  };
  paragraphThree: { introLabel: string; ctaLabel: string; onPrivacyClick: () => void };
  onlyEssentialLabel: string;
  acceptAllLabel: string;
  onClickAcceptAll: () => void;
  onClickOnlyEssential: () => void;
};

/**
 * Component used to display the platform cookie policy info, used in the cookie widget
 * @param titleLabel - title of the cookie carda
 * @param paragraphOneLabel - first paragraph data
 * @param paragraphTwo - second paragraph data, contains also @param onSettingsClick - handler
for redirecting to the settings page
 * @param paragraphThree - third paragraph data, contains also @param onPrivacyClick - handler
for redirecting to the privacy policy 
 * @param onClickAcceptAll - handler to accept all cookie settings
 * @param onClickOnlyEssential - handler to accept only essential cookie settings
 */
const CookieCard: React.FC<CookieCardProps> = props => {
  const {
    titleLabel,
    paragraphOneLabel,
    paragraphTwo,
    paragraphThree,
    onlyEssentialLabel,
    acceptAllLabel,
    onClickAcceptAll,
    onClickOnlyEssential,
  } = props;

  return (
    <Card elevation="3" radius={20} padding={'p-4'}>
      <Stack direction="column" spacing="gap-y-2">
        <Text variant="h6">{titleLabel}</Text>

        <Stack spacing="gap-y-1">
          <Text variant="body2">{paragraphOneLabel}</Text>

          <Text variant="body2">
            {paragraphTwo.introLabel}

            <Link target="_blank" to={paragraphTwo.analyticsURL}>
              {paragraphTwo.analyticsLabel}
            </Link>

            {paragraphTwo.middleParagraphLabeL}

            <Button plain={true} onClick={paragraphTwo.onSettingsClick}>
              <Text
                as="span"
                variant="body2"
                color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                align="center"
              >
                {paragraphTwo.settingsLabel}
              </Text>
            </Button>

            {paragraphTwo.lastParagraphLabel}
          </Text>

          <Text variant="body2">
            {paragraphThree.introLabel}{' '}
            <Button plain={true} onClick={paragraphThree.onPrivacyClick}>
              <Text
                as="span"
                variant="body2"
                color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                align="center"
              >
                {paragraphThree.ctaLabel}
              </Text>
            </Button>
          </Text>
        </Stack>

        <Stack direction="row" spacing="gap-x-4" customStyle="mt-4 ml-auto">
          <Button variant="text" label={onlyEssentialLabel} onClick={onClickOnlyEssential} />

          <Button
            variant="primary"
            label={acceptAllLabel}
            customStyle="w-44"
            onClick={onClickAcceptAll}
          />
        </Stack>
      </Stack>
    </Card>
  );
};

export default CookieCard;
