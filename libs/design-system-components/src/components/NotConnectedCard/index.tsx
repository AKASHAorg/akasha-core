import React from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type NotConnectedCardProps = {
  publicImgPath?: string;
  assetExtension?: string;
  assetName?: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  dataTestId?: string;
  onButtonClick: () => void;
};

const NotConnnectedCard: React.FC<NotConnectedCardProps> = props => {
  const {
    publicImgPath = '/images',
    assetExtension = 'webp',
    assetName = 'not-connected',
    title,
    subtitle,
    buttonLabel,
    dataTestId = 'not-connected-card',
    onButtonClick,
  } = props;

  return (
    <Card radius={16} padding="p-4" dataTestId={dataTestId}>
      <Stack spacing="gap-y-4" justify="center" align="center" customStyle="mb-32">
        <Image src={`${publicImgPath}/${assetName}.${assetExtension}`} customStyle="w-44 h-44" />
        <Stack spacing="gap-y-2">
          <Text variant="h6" align="center">
            {title}
          </Text>
          <Text variant="footnotes2" align="center" color={{ light: 'black', dark: 'grey6' }}>
            {subtitle}
          </Text>
        </Stack>
      </Stack>
      <Stack direction="row" fullWidth justify="end">
        <Button variant="primary" label={buttonLabel} onClick={onButtonClick} />
      </Stack>
    </Card>
  );
};

export default NotConnnectedCard;
