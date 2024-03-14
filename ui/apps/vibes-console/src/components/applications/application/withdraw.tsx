import React from 'react';
import Text from '@akashaorg/design-system-core/lib/components/Text';
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
      <Text variant="body2" customStyle="mb-32">
        {description}
      </Text>
    </PageHeader>
  );
};
