import React from 'react';
import { transformSource } from '@akashaorg/ui-core-hooks';
import { Profile } from '@akashaorg/typings/lib/ui';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
import { formatDate } from '@akashaorg/design-system-core/lib/utils';
import { TApplicationStatus, renderStatusDetail } from '../../../utils';
import {
  ProfileAvatarButton,
  ProfileDidField,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar-button';
export type ApplicantDataCardProps = {
  applicant: {
    name: string;
    did: {
      id: string;
    };
    status: TApplicationStatus;
    avatar: Profile['avatar'];
    appliedOn: Date;
    memberSince: Date;
  };
  isMini?: boolean;
  tenureInfoLabel: string;
  appliedOnLabel: string;
  viewProfileLabel: string;
  viewApplicationLabel?: string;
  onClickViewProfile: () => void;
  onClickViewApplication?: () => void;
};
export const ApplicantDataCard: React.FC<ApplicantDataCardProps> = props => {
  const {
    applicant,
    tenureInfoLabel,
    appliedOnLabel,
    viewProfileLabel,
    viewApplicationLabel,
    isMini = false,
    onClickViewProfile,
    onClickViewApplication,
  } = props;
  const textStyle = 'max-w([12.5rem] md:[7.5rem]) w-fit cursor-default';
  return (
    <Card className="p-0">
      <Stack padding="p-4" spacing="gap-y-4">
        <Stack direction="row" justify="between">
          <Stack direction="row" spacing="gap-x-2" align="center">
            <Avatar
              size={isMini ? 'lg' : 'md'}
              avatar={transformSource(applicant?.avatar?.default)}
              alternativeAvatars={applicant?.avatar?.alternatives?.map(alternative =>
                transformSource(alternative),
              )}
            />
            <Stack>
              <Tooltip content={applicant.name} placement="right">
                <Typography variant="sm" bold>
                  {applicant.name}
                </Typography>
              </Tooltip>

              <ProfileAvatarButton profileDID={applicant.did.id}>
                <ProfileDidField />
              </ProfileAvatarButton>
            </Stack>
          </Stack>

          {isMini && <Button label={viewProfileLabel} onClick={onClickViewProfile} />}
          {!isMini && renderStatusDetail(applicant.status)}
        </Stack>

        <Divider />

        <Stack direction="row" justify="between">
          <Stack>
            <Typography variant="sm" bold>
              {appliedOnLabel}:
            </Typography>

            <Typography variant="xs" className="font-medium font-light text-grey4 dark:text-grey6">
              {formatDate(applicant.appliedOn.toISOString(), 'DD MMM YYYY')}
            </Typography>
          </Stack>

          <Stack>
            <Typography variant="sm" bold>
              {tenureInfoLabel}:
            </Typography>

            <Typography variant="xs" className="font-medium font-light text-grey4 dark:text-grey6">
              {formatDate(applicant.memberSince.toISOString(), 'DD MMM YYYY')}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      {!isMini && (
        <Stack
          direction="row"
          padding="p-4"
          align="center"
          justify="between"
          customStyle="border-t-1 border-solid border-grey8 dark:border-grey5"
        >
          <Button label={viewProfileLabel} onClick={onClickViewProfile} />
          {viewApplicationLabel && (
            <Button
              variant="primary"
              label={viewApplicationLabel}
              onClick={onClickViewApplication}
            />
          )}
        </Stack>
      )}
    </Card>
  );
};
