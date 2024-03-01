import React from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type JoinVibesCardProps = {
  title: string;
  description: string;
  ctaButtonLabel: string;
  onCtaButtonClick: () => void;
};
export const JoinVibesCard: React.FC<JoinVibesCardProps> = props => {
  const { title, description, ctaButtonLabel, onCtaButtonClick } = props;

  return (
    <Card>
      <Stack spacing="gap-y-2">
        <Text variant="h6">{title}</Text>
        <Text variant="body2" color={{ light: 'grey4', dark: 'grey6' }}>
          {description}!🛡️
        </Text>
        <Button
          variant="primary"
          label={ctaButtonLabel}
          customStyle="w-fit self-end"
          onClick={() => onCtaButtonClick()}
        />
      </Stack>
    </Card>
  );
};
