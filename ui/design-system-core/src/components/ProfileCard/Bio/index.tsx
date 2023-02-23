import React from 'react';
import Card from '../../Card';
import Stack from '../../Stack';
import Text from '../../Text';

export type BioProps = {
  title: string;
  biography: string;
};

const Bio: React.FC<BioProps> = ({ title, biography }) => {
  return (
    <Card elevation="1" radius={20} padding={16}>
      <Stack direction="column" spacing="gap-y-2.5">
        <Text variant="label">{title}</Text>
        <Text variant="body2">{biography}</Text>
      </Stack>
    </Card>
  );
};

export default Bio;
