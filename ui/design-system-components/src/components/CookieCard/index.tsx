import React from 'react';

import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type CookieCardProps = {
  titleLabel: string;
  paragraphOneLabel: string;
  paragraphTwo: {
    ctaLabel: string;
    analyticsLabel: string;
    analyticsURL: string;
    middleParagraphLabeL: string;
    lastParagraphLabel: string;
    settingsLabel: string;
    onSettingsClick: () => void;
  };
  paragraphThree: { ctaLabel: string; urlLabel: string; url: string };
  onlyEssentialLabel: string;
  acceptAllLabel: string;
  onClickAcceptAll: () => void;
  onClickOnlyEssential: () => void;
};

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
    <Card elevation="1" radius={20} padding={'p-4'}>
      <Stack direction="column" spacing="gap-y-1">
        <Text variant="h6">{titleLabel}</Text>

        <Text variant="body2">{paragraphOneLabel}</Text>

        <Text variant="body2">
          {paragraphTwo.ctaLabel}

          <Anchor href={paragraphTwo.analyticsURL}>{paragraphTwo.analyticsLabel}</Anchor>

          {paragraphTwo.middleParagraphLabeL}

          <Anchor onClick={paragraphTwo.onSettingsClick}>{paragraphTwo.settingsLabel}</Anchor>

          {paragraphTwo.lastParagraphLabel}
        </Text>

        <Text variant="body2">
          {paragraphThree.ctaLabel}{' '}
          <Anchor href={paragraphThree.url}>{paragraphThree.urlLabel}</Anchor>
        </Text>

        <Stack direction="row" spacing="gap-x-4" customStyle="ml-auto mt-auto">
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
