import React from 'react';
import { tw } from '@twind/core';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type StartCardProps = {
  title?: string;
  subtitle?: string;
  heading: string;
  description: string;
  secondaryDescription?: string;
  image?: string;
  icon?: JSX.Element;
  showMainArea?: boolean;
  hideMainAreaOnMobile?: boolean;
  showSecondaryArea?: boolean;
  noBorderRadius?: boolean;
  onClickCTA?: () => void;
  CTALabel?: string;
};

const StartCard: React.FC<StartCardProps> = ({
  title,
  subtitle,
  heading,
  description,
  secondaryDescription,
  image,
  icon,
  showMainArea = true,
  hideMainAreaOnMobile = true,
  showSecondaryArea,
  noBorderRadius,
  onClickCTA,
  CTALabel,
}: StartCardProps) => {
  return (
    <Card noBorderRadius={noBorderRadius} customStyle="gap-1">
      <Stack direction="row" justify="center" fullWidth={true}>
        {!!title && <Text variant="h5">{title}</Text>}
        {!!subtitle && <Text variant="subtitle1">{subtitle}</Text>}
      </Stack>
      {showMainArea && (
        <Stack
          spacing="gap-y-3"
          fullWidth={true}
          {...(hideMainAreaOnMobile && { customStyle: 'hidden' })}
        >
          {!!image && (
            <img
              loading="lazy"
              alt={image}
              className={tw('max-w-[1/2] mx-auto pr-2')}
              src={image}
            />
          )}
          {!!icon && icon}
          <Text variant="h6" align="center">
            {heading}
          </Text>
          <Text variant="body1" align="center" customStyle=" px-8">
            {description}
          </Text>
          {onClickCTA && (
            <Stack direction="row" align="center" justify="end">
              <Button variant="primary" label={CTALabel} onClick={onClickCTA} />
            </Stack>
          )}
        </Stack>
      )}
      {showSecondaryArea && <Text variant="body1">{secondaryDescription}</Text>}
    </Card>
  );
};

export default StartCard;
