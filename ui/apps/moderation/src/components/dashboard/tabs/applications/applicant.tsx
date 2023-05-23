import React from 'react';

import { ModeratorApplicantData } from '@akashaorg/typings/ui';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';

export interface IApplicantProps {
  applicant: ModeratorApplicantData;
  onClickApplicant: (applicant: ModeratorApplicantData) => () => void;
}

const Applicant: React.FC<IApplicantProps> = props => {
  const { applicant, onClickApplicant } = props;

  const textStyle = 'max-w([12.5rem] md:[7.5rem]) w-fit cursor-default';

  return (
    <Box customStyle="flex justify-between p-4">
      <Box customStyle="flex space-x-2 items-start">
        <Avatar avatar={applicant.avatar} />

        <Box>
          <Tooltip content={applicant.name} placement="right">
            <Text variant="body2" weight="bold" truncate={true} customStyle={textStyle}>
              {applicant.name}
            </Text>
          </Tooltip>

          <Tooltip content={`@${applicant.userName}`} placement="right">
            <Text
              variant="button-md"
              weight="normal"
              truncate={true}
              customStyle={textStyle}
              color={{ light: 'grey4', dark: 'grey7' }}
            >
              @{applicant.userName}
            </Text>
          </Tooltip>
        </Box>
      </Box>

      <Button plain={true} onClick={onClickApplicant(applicant)}>
        <Icon type="ChevronRightIcon" accentColor={true} />
      </Button>
    </Box>
  );
};

export default Applicant;
