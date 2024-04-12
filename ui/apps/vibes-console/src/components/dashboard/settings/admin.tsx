import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import {
  PageHeader,
  PageHeaderProps,
} from '@akashaorg/design-system-components/lib/components/PageHeader';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Button from '@akashaorg/design-system-core/lib/components/Button';

export type AdminSettingsProps = PageHeaderProps & {
  changeLimitLabel: string;
  currentNumberLabel: string;
  sections: {
    one: {
      title: string;
    };
    two: {
      title: string;
      description: string;
    };
    three: {
      title: string;
      description: string;
    };
  };
  onChangeButtonClick: () => void;
};

export const AdminSettings: React.FC<AdminSettingsProps> = props => {
  const {
    sections: { one, two, three },
    currentNumberLabel,
    changeLimitLabel,
    onChangeButtonClick,
  } = props;

  return (
    <PageHeader {...props}>
      <Stack spacing="gap-y-4" customStyle="mb-8">
        <Stack direction="row" align="center" justify="between">
          <Text variant="button-md" color={{ light: 'black', dark: 'grey6' }}>
            {one.title}
          </Text>
          <Text variant="footnotes2" weight="normal" color={{ light: 'grey4', dark: 'grey7' }}>
            01-Jan-2015
          </Text>
        </Stack>
        <Divider />
        <Stack direction="row" align="start" justify="between">
          <Stack
            spacing="gap-y-3
          "
          >
            <Text variant="button-md" color={{ light: 'black', dark: 'grey6' }}>
              {two.title}
            </Text>
            <Text variant="footnotes2" weight="normal">
              {two.description}
            </Text>
            <Text variant="button-sm" color={{ light: 'grey4', dark: 'grey7' }}>
              {currentNumberLabel}:{' '}
              <Text as="span" variant="footnotes2">
                65
              </Text>
            </Text>
          </Stack>
          <Button plain={true} onClick={onChangeButtonClick}>
            <Text variant="button-sm" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
              {changeLimitLabel}
            </Text>
          </Button>
        </Stack>
        <Divider />
        <Stack>
          <Text variant="button-md" color={{ light: 'black', dark: 'grey6' }}>
            {three.title}
          </Text>
          <Text variant="footnotes2" weight="normal">
            {three.description}
          </Text>
        </Stack>
      </Stack>
    </PageHeader>
  );
};
