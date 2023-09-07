import React from 'react';

import { ModeratorApplicantData } from '@akashaorg/typings/ui';

import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';

export type ApplicantProps = {
  applicant: ModeratorApplicantData;
  onClickApplicant: (contentId: string) => void;
};

const Applicant: React.FC<ApplicantProps> = props => {
  const { applicant, onClickApplicant } = props;

  const textStyle = 'max-w([12.5rem] md:[7.5rem]) w-fit cursor-default';

  return (
    <Stack justify="between" customStyle="p-4">
      <Stack spacing="gap-x-2" align="start">
        <Avatar avatar={applicant.avatar} />

        <Stack>
          <Tooltip content={applicant.name} placement="right">
            <Text variant="body2" weight="bold" truncate={true} customStyle={textStyle}>
              {applicant.name}
            </Text>
          </Tooltip>

          <Tooltip content={`@${applicant.name}`} placement="right">
            <Text
              variant="button-md"
              weight="normal"
              truncate={true}
              customStyle={textStyle}
              color={{ light: 'grey4', dark: 'grey7' }}
            >
              @{applicant.did.id}
            </Text>
          </Tooltip>
        </Stack>
      </Stack>

      <Button plain={true} onClick={() => onClickApplicant(applicant.did.id)}>
        <Icon type="ChevronRightIcon" accentColor={true} />
      </Button>
    </Stack>
  );
};

export default Applicant;
