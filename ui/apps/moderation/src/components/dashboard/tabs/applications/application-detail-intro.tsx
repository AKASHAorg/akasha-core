import React from 'react';

import { ModeratorApplicantData } from '@akashaorg/typings/lib/ui';

import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';

import { formatDate } from '../../../../utils';

export type ApplicationDetailIntroProps = {
  selectedApplicant: ModeratorApplicantData;
  viewProfileLabel: string;
  applicationDateLabel: string;
  memberSinceLabel: string;
  onButtonClick: (route?: string) => () => void;
};

const ApplicationDetailIntro: React.FC<ApplicationDetailIntroProps> = props => {
  const {
    selectedApplicant,
    viewProfileLabel,
    applicationDateLabel,
    memberSinceLabel,
    onButtonClick,
  } = props;

  const textStyle = 'max-w([12.5rem] md:[7.5rem]) w-fit cursor-default';

  return (
    <Card padding={0}>
      <Stack align="center" justify="between" customStyle="p-4">
        <Stack customStyle="flex space-x-2 items-center">
          <Avatar size="lg" avatar={selectedApplicant.avatar} />

          <Stack>
            <Tooltip content={selectedApplicant.name} placement="right">
              <Text variant="body2" weight="bold" truncate={true} customStyle={textStyle}>
                {selectedApplicant.name}
              </Text>
            </Tooltip>

            <Tooltip content={`@${selectedApplicant.name}`} placement="right">
              <Text
                variant="button-md"
                weight="normal"
                truncate={true}
                customStyle={textStyle}
                color={{ light: 'grey4', dark: 'grey7' }}
              >
                @{selectedApplicant.did.id}
              </Text>
            </Tooltip>
          </Stack>
        </Stack>

        <Button label={viewProfileLabel} onClick={onButtonClick()} />
      </Stack>

      <Divider />

      <Stack align="center" justify="between" customStyle=" p-4">
        <Stack customStyle="space-y-2">
          <Text variant="footnotes2">{applicationDateLabel}</Text>

          <Text variant="footnotes2" color={{ light: 'grey4', dark: 'grey6' }}>
            {formatDate(selectedApplicant.applicationDate, 'DD-MMM-YYYY')}
          </Text>
        </Stack>

        <Stack spacing="gap-y-2">
          <Text variant="footnotes2">{memberSinceLabel}</Text>

          <Text variant="footnotes2" color={{ light: 'grey4', dark: 'grey6' }}>
            {formatDate(selectedApplicant.createdAt, 'DD-MMM-YYYY')}
          </Text>
        </Stack>
      </Stack>
    </Card>
  );
};

export default ApplicationDetailIntro;
