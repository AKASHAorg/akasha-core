import * as React from 'react';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { tw } from '@twind/core';

export interface StartProps {
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
}

const StartCard: React.FC<StartProps> = ({
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
}: StartProps) => {
  return (
    <BasicCardBox noBorderRadius={noBorderRadius} customStyle="p-4 gap-1">
      <div className={tw(`flex flex-start w-full`)}>
        {!!title && <Text variant="h1">{title}</Text>}
        {!!subtitle && <Text variant="subtitle1">{subtitle}</Text>}
      </div>
      {showMainArea && (
        <div className={tw(`w-full px-4 ${hideMainAreaOnMobile && 'hidden'}`)}>
          {!!image && <img className={tw(`max-w-1/2 mx-auto py-3 pr-2`)} src={image} />}
          {!!icon && icon}
          <Text variant="h1" align="center">
            {heading}
          </Text>
          <Text variant="h4" align="center" customStyle="pt-3 px-8">
            {description}
          </Text>
          {onClickCTA && (
            <div className={tw(`p-4 flex items-center justify-items-center`)}>
              <Button variant="primary" label={CTALabel} onClick={onClickCTA} />
            </div>
          )}
        </div>
      )}
      {showSecondaryArea && <Text color="grey">{secondaryDescription}</Text>}
    </BasicCardBox>
  );
};

export default StartCard;
