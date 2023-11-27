import * as React from 'react';
import { tw } from '@twind/core';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { XMarkIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type LoginCTACardProps = {
  onWriteToUsLabelClick?: () => void;
  title: string;
  subtitle: string;
  beforeLinkLabel: string;
  afterLinkLabel: string;
  writeToUsLabel: string;
  disclaimerLabel?: string;
  writeToUsUrl: string;
  image?: React.ReactElement;
  publicImgPath?: string;
  onCloseIconClick?: () => void;
};
const LoginCTACard: React.FC<LoginCTACardProps> = props => {
  const {
    image,
    title,
    subtitle,
    beforeLinkLabel,
    afterLinkLabel,
    writeToUsLabel,
    disclaimerLabel,
    writeToUsUrl,
    publicImgPath = '/images',
    onWriteToUsLabelClick,
    onCloseIconClick,
  } = props;
  return (
    <Card accentBorder={true}>
      {image}
      <div className={tw(`flex flex-row items-start justify-between`)}>
        <div className={tw(`flex flex-col-reverse md:flex-row items-center justify-between`)}>
          <div className={tw(`flex flex-col md:w-1/2 gap-1`)}>
            <Text variant="h6">{title}</Text>
            <Text>{subtitle}</Text>
            <Text>
              {beforeLinkLabel}
              <a
                className={tw(`text(secondaryLight dark:secondaryDark) no-underline`)}
                onClick={onWriteToUsLabelClick}
                href={writeToUsUrl}
              >
                {writeToUsLabel}
              </a>

              {afterLinkLabel}
            </Text>
            <Text>{disclaimerLabel}</Text>
          </div>
          <div className={tw(`md:w-[43%] md:pr-2 mb-2 md:mb-0`)}>
            <img
              alt="login widget illustration"
              className={tw(`flex self-center w-[60%] md:(self-auto w-full) object-contain`)}
              src={`${publicImgPath}/login-widget-illustration.webp`}
            />
          </div>
        </div>
        <button onClick={onCloseIconClick}>
          <Icon icon={<XMarkIcon />} size="sm" data-testid="close-icon-alpha-notification" />
        </button>
      </div>
    </Card>
  );
};

export default LoginCTACard;
