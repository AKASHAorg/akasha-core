import React from 'react';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
import { ModeratorApplicantData } from '@akashaorg/typings/lib/ui';
import { ChevronRightIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { transformSource } from '@akashaorg/ui-awf-hooks';

export type ApplicantProps = {
  applicant: ModeratorApplicantData;
  onClickApplicant: (contentId: string) => void;
};

const Applicant: React.FC<ApplicantProps> = props => {
  const { applicant, onClickApplicant } = props;

  const textStyle = 'max-w([12.5rem] md:[7.5rem]) w-fit cursor-default';

  return (
    <Stack direction="row" justify="between">
      <Stack direction="row" align="start" spacing="gap-x-2">
        <Avatar
          avatar={transformSource(applicant?.avatar?.default)}
          alternativeAvatars={applicant?.avatar?.alternatives?.map(alternative =>
            transformSource(alternative),
          )}
        />

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
        <Icon icon={<ChevronRightIcon />} accentColor={true} />
      </Button>
    </Stack>
  );
};

export default Applicant;
