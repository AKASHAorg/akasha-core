import React from 'react';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type DefaultEmptyCardProps = {
  infoText: string;
  buttonLabel?: string;
  buttonClickHandler?: () => void;
};

const DefaultEmptyCard: React.FC<DefaultEmptyCardProps> = ({
  infoText,
  buttonLabel,
  buttonClickHandler,
}) => {
  return (
    <Card elevation="1" radius={20} padding={16}>
      <BasicCardBox
        customStyle="bg(grey8 dark:grey5) w-[140px] h-[85px] shrink-0 m-auto my-4"
        round="rounded-xl"
      />
      <Text variant="h6" align="center">
        {infoText}
      </Text>
      <Stack justify="end" fullWidth spacing="gap-y-4" customStyle="pt-2">
        {buttonLabel && (
          <Button variant="primary" label={buttonLabel} onClick={buttonClickHandler} />
        )}
      </Stack>
    </Card>
  );
};

export default DefaultEmptyCard;
