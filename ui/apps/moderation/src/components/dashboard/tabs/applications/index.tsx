import React from 'react';

import { ModeratorApplicantData } from '@akashaorg/typings/lib/ui';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';

import Applicant, { ApplicantProps } from './applicant';

export type ApplicationsTabProps = Pick<ApplicantProps, 'onClickApplicant'> & {
  applicants: ModeratorApplicantData[];
};

export const ApplicationsTab: React.FC<ApplicationsTabProps> = props => {
  const { applicants, onClickApplicant } = props;

  return (
    <Stack>
      {applicants.map((applicant, idx) => (
        <Stack key={applicant.name + idx}>
          <Applicant applicant={applicant} onClickApplicant={onClickApplicant} />

          {idx < applicants.length - 1 && <Divider />}
        </Stack>
      ))}
    </Stack>
  );
};
