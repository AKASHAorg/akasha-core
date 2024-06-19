import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type TDeveloperMode = {
  titleLabel: string;
  sections: {
    title: string;
    toggleButtonNode?: React.ReactNode;
    descriptionNode?: React.ReactNode;
    ctaNode?: React.ReactNode;
  }[];
};

export const DeveloperMode: React.FC<TDeveloperMode> = props => {
  const { titleLabel, sections } = props;

  return (
    <Card padding={0} margin="mb-4">
      <Stack padding="p-4" customStyle="border(b-1 solid grey8 dark:grey5)">
        <Text variant="h5" align="center">
          {titleLabel}
        </Text>
      </Stack>
      <Stack padding="p-4" spacing="gap-y-4">
        {sections.map(({ title, toggleButtonNode, descriptionNode, ctaNode }, idx) => (
          <>
            {idx > 0 && <Divider />}
            <Stack key={title + idx} spacing="gap-y-2">
              <Stack direction="row" justify="between" align="center" customStyle="mb-2">
                <Text weight="bold">{title}</Text>
                {toggleButtonNode}
              </Stack>
              {descriptionNode}
              {ctaNode}
            </Stack>
          </>
        ))}
      </Stack>
    </Card>
  );
};
