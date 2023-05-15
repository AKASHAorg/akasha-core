import React from 'react';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import { CategoryPills, ICategoryPillsProps, IPageHeaderProps, PageHeader } from '../common';

export interface IReportItemProps extends IPageHeaderProps {
  introLabel: string;
  maxLimitLabel: string;
}

const ReportItem: React.FC<IReportItemProps & ICategoryPillsProps> = props => {
  const { introLabel, maxLimitLabel } = props;
  return (
    <PageHeader {...props}>
      <Box>
        <Text>
          {introLabel}{' '}
          <Text as="span" variant="footnotes2" color={{ light: 'grey7', dark: 'grey2' }}>
            {`(${maxLimitLabel}.)`}
          </Text>
        </Text>
        <CategoryPills {...props} />
      </Box>
    </PageHeader>
  );
};

export default ReportItem;
