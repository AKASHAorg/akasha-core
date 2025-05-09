import React from 'react';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import {
  PageHeaderProps,
  PageHeader,
} from '@akashaorg/design-system-components/lib/components/PageHeader';
export type WithdrawApplicationProps = PageHeaderProps & {
  description: string;
};
export const WithdrawApplication: React.FC<WithdrawApplicationProps> = props => {
  const { description } = props;
  return (
    <PageHeader {...props}>
      <Typography variant="sm" className="mb-32">
        {description}
      </Typography>
    </PageHeader>
  );
};
