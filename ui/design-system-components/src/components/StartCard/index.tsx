import * as React from 'react';
import { tw } from '@twind/core';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Button from '@akashaorg/design-system-core/lib/components/Button';
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
      <div className={tw(`flex justify-center w-full`)}>
        {!!title && <Text variant="h5">{title}</Text>}
        {!!subtitle && <Text variant="subtitle1">{subtitle}</Text>}
      </div>
      {showMainArea && (
        <div className={tw(`w-full px-4 ${hideMainAreaOnMobile && 'hidden'}`)}>
          {!!image && (
            <img alt={image} className={tw('max-w-[1/2] mx-auto py-3 pr-2')} src={image} />
          )}
          {!!icon && icon}
          <Text variant="h6" align="center">
            {heading}
          </Text>
          <Text variant="body1" align="center" customStyle="pt-3 px-8">
            {description}
          </Text>
          {onClickCTA && (
            <div className={tw(`p-4 flex items-center justify-end`)}>
              <Button variant="primary" label={CTALabel} onClick={onClickCTA} />
            </div>
          )}
        </div>
      )}
      {showSecondaryArea && <Text color="grey1">{secondaryDescription}</Text>}
    </Card>
  );
};

export default StartCard;
