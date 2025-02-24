import React from 'react';
import { ArrowLongLeftIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';

type BackToOriginalBeamProps = {
  label: string;
  onClick: () => void;
};

const BackToOriginalBeam: React.FC<BackToOriginalBeamProps> = props => {
  const { label, onClick } = props;
  return (
    <Card className="p-4">
      <Stack direction="row" spacing="gap-x-2">
        <Button variant="link" onClick={onClick}>
          <ArrowLongLeftIcon />
          {label}
        </Button>
      </Stack>
    </Card>
  );
};

export default BackToOriginalBeam;
