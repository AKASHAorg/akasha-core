import React from 'react';

import { ModeratorApplicantData } from '@akashaorg/typings/ui';
import Box from '@akashaorg/design-system-core/lib/components/Box';

import Applicant, { IApplicantProps } from '../applicant';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';

export interface IApplicationsTabProps extends Pick<IApplicantProps, 'onClickApplicant'> {
  applicants: ModeratorApplicantData[];
}

export const ApplicationsTab: React.FC<IApplicationsTabProps> = props => {
  const { applicants, onClickApplicant } = props;

  return (
    <Box customStyle="space-y-4">
      {applicants.map((applicant, idx) => (
        <Box key={applicant.pubKey}>
          <Applicant applicant={applicant} onClickApplicant={onClickApplicant} />

          {idx < applicants.length - 1 && <Divider />}
        </Box>
      ))}
    </Box>
  );
};
