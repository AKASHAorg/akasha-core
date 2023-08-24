import React from 'react';

import { ModeratorApplicantData } from '@akashaorg/typings/ui';

import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
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
    <BasicCardBox pad="p-0">
      <Box customStyle="flex justify-between items-center p-4">
        <Box customStyle="flex space-x-2 items-center">
          <Avatar size="lg" avatar={selectedApplicant.avatar} />

          <Box>
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
          </Box>
        </Box>

        <Button label={viewProfileLabel} onClick={onButtonClick()} />
      </Box>

      <Divider />

      <Box customStyle="flex justify-between items-center p-4">
        <Box customStyle="space-y-2">
          <Text variant="footnotes2">{applicationDateLabel}</Text>

          <Text variant="footnotes2" color={{ light: 'grey4', dark: 'grey6' }}>
            {formatDate(selectedApplicant.applicationDate, 'DD-MMM-YYYY')}
          </Text>
        </Box>

        <Box customStyle="space-y-2">
          <Text variant="footnotes2">{memberSinceLabel}</Text>

          <Text variant="footnotes2" color={{ light: 'grey4', dark: 'grey6' }}>
            {formatDate(selectedApplicant.createdAt, 'DD-MMM-YYYY')}
          </Text>
        </Box>
      </Box>
    </BasicCardBox>
  );
};

export default ApplicationDetailIntro;
