import React from 'react';

import { ModeratorApplicantData } from '@akashaorg/typings/ui';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';

import Applicant, { IApplicantProps } from './applicant';

export interface IApplicationsTabProps extends Pick<IApplicantProps, 'onClickApplicant'> {
  applicants: ModeratorApplicantData[];
}

export const ApplicationsTab: React.FC<IApplicationsTabProps> = props => {
  const { applicants, onClickApplicant } = props;

  return (
    <Box>
      {applicants.map((applicant, idx) => (
        <Box key={applicant.pubKey}>
          <Applicant applicant={applicant} onClickApplicant={onClickApplicant} />

          {idx < applicants.length - 1 && <Divider />}
        </Box>
      ))}
    </Box>
  );
};
