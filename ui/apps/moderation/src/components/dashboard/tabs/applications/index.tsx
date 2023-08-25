import React from 'react';

import { ModeratorApplicantData } from '@akashaorg/typings/ui';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';

import Applicant, { ApplicantProps } from './applicant';

export type ApplicationsTabProps = Pick<ApplicantProps, 'onClickApplicant'> & {
  applicants: ModeratorApplicantData[];
};

export const ApplicationsTab: React.FC<ApplicationsTabProps> = props => {
  const { applicants, onClickApplicant } = props;

  return (
    <Box>
      {applicants.map((applicant, idx) => (
        <Box key={applicant.name + idx}>
          <Applicant applicant={applicant} onClickApplicant={onClickApplicant} />

          {idx < applicants.length - 1 && <Divider />}
        </Box>
      ))}
    </Box>
  );
};
