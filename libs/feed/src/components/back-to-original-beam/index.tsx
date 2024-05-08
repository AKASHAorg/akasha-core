import React from 'react';
import { ArrowLongLeftIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Button from '@akashaorg/design-system-core/lib/components/Button';

type BackToOriginalBeamProps = {
  label: string;
  onClick: () => void;
};

const BackToOriginalBeam: React.FC<BackToOriginalBeamProps> = props => {
  const { label, onClick } = props;
  return (
    <Card
      radius={{ top: 16 }}
      background={{ light: 'grey9/60', dark: 'grey3' }}
      elevation="none"
      padding="p-4"
    >
      <Stack direction="row" spacing="gap-x-2">
        <Button
          variant="text"
          icon={<ArrowLongLeftIcon />}
          iconDirection="left"
          label={label}
          onClick={onClick}
        />
      </Stack>
    </Card>
  );
};

export default BackToOriginalBeam;
