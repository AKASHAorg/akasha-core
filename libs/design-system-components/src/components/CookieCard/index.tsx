import React from 'react';

import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
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
    <Card className="p-4">
      <Stack direction="column" spacing={2}>
        <Text variant="h6">{titleLabel}</Text>

        <Stack spacing={1}>
          <Text variant="body2">{paragraphOneLabel}</Text>

          <Text variant="body2">
            {paragraphTwo.introLabel}

            <Button variant="link" asChild>
              <a rel="noreferrer" href={paragraphTwo.analyticsURL}>
                {paragraphTwo.analyticsLabel}
              </a>
            </Button>

            {paragraphTwo.middleParagraphLabeL}

            <Button variant="link" onClick={paragraphTwo.onSettingsClick}>
              {paragraphTwo.settingsLabel}
            </Button>

            {paragraphTwo.lastParagraphLabel}
          </Text>

          <Text variant="body2">
            {paragraphThree.introLabel}{' '}
            <Button variant="link" onClick={paragraphThree.onPrivacyClick}>
              {paragraphThree.ctaLabel}
            </Button>
          </Text>
        </Stack>

        <Stack direction="row" spacing={4} className="mt-4 ml-auto">
          <Button variant="link" onClick={onClickOnlyEssential}>
            {onlyEssentialLabel}
          </Button>

          <Button onClick={onClickAcceptAll} className="w-44">
            {acceptAllLabel}
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};

export default CookieCard;
