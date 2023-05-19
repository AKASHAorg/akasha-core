import React from 'react';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { IPageHeaderProps, PageHeader } from '../common';

export interface IApplicantDetailProps extends IPageHeaderProps {
  moderationCategoryLabel: string;
}

const ApplicantDetail: React.FC<IApplicantDetailProps> = props => {
  const { moderationCategoryLabel } = props;

  return (
    <PageHeader {...props} labelTextVariant="h6">
      <Box>
        <Text weight="bold">{moderationCategoryLabel}</Text>
      </Box>
    </PageHeader>
  );
};

export default ApplicantDetail;
