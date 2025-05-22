import React from 'react';
import { transformSource } from '@akashaorg/ui-core-hooks';
import { Profile } from '@akashaorg/typings/lib/ui';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Separator } from '@akashaorg/ui/lib/components/separator';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@akashaorg/ui/lib/akasha-components/tooltip';
import { formatDate } from '@akashaorg/design-system-core/lib/utils';
import { TApplicationStatus, renderStatusDetail } from '../../../utils';
import {
  ProfileAvatarButton,
  ProfileDidField,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar-button';
import { ProfileAvatarImage } from '@akashaorg/ui/lib/akasha-components/profile-avatar';
import { ProfileAvatarFallback } from '@akashaorg/ui/lib/akasha-components/profile-avatar';
import { ProfileAvatar } from '@akashaorg/ui/lib/akasha-components/profile-avatar';
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
  return (
    <Card className="p-0">
      <Stack spacing={4} className="p-4">
        <Stack direction="row" justifyContent="between">
          <Stack direction="row" spacing={2} alignItems="center">
            <ProfileAvatar size={isMini ? 'lg' : 'md'}>
              <ProfileAvatarImage src={transformSource(applicant?.avatar?.default).src} />
              <ProfileAvatarFallback />
            </ProfileAvatar>
            <Stack>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger>
                    <Typography variant="sm" bold>
                      {applicant.name}
                    </Typography>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{applicant.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <ProfileAvatarButton profileDID={applicant.did.id}>
                <ProfileDidField />
              </ProfileAvatarButton>
            </Stack>
          </Stack>

          {isMini && <Button onClick={onClickViewProfile}>{viewProfileLabel}</Button>}
          {!isMini && renderStatusDetail(applicant.status)}
        </Stack>

        <Separator />

        <Stack direction="row" justifyContent="between">
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
          alignItems="center"
          justifyContent="between"
          className="p-4 border-t-1 border-solid border-grey8 dark:border-grey5"
        >
          <Button onClick={onClickViewProfile}>{viewProfileLabel}</Button>
          {viewApplicationLabel && (
            <Button onClick={onClickViewApplication}>{viewApplicationLabel}</Button>
          )}
        </Stack>
      )}
    </Card>
  );
};
