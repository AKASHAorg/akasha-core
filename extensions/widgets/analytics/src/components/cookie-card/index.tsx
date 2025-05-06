import React from 'react';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
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
  paragraphThree: {
    introLabel: string;
    ctaLabel: string;
    onPrivacyClick: () => void;
  };
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
        <Typography variant="h6">{titleLabel}</Typography>

        <Stack spacing={1}>
          <Typography variant="sm">{paragraphOneLabel}</Typography>

          <Typography variant="sm">
            {paragraphTwo.introLabel}

            <Button variant="link" asChild>
              <a rel="noreferrer" href={paragraphTwo.analyticsURL} className="p-0 h-min">
                {paragraphTwo.analyticsLabel}
              </a>
            </Button>

            {paragraphTwo.middleParagraphLabeL}

            <Button variant="link" onClick={paragraphTwo.onSettingsClick} className="p-0 h-min">
              {paragraphTwo.settingsLabel}
            </Button>

            {paragraphTwo.lastParagraphLabel}
          </Typography>

          <Typography variant="sm">
            {paragraphThree.introLabel}{' '}
            <Button variant="link" onClick={paragraphThree.onPrivacyClick} className="p-0 h-min">
              {paragraphThree.ctaLabel}
            </Button>
          </Typography>
        </Stack>

        <Stack direction="row" spacing={4} className="mt-4" justifyContent="end">
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
