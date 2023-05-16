import React from 'react';

import Accordion, { IAccordionProps } from '@akashaorg/design-system-core/lib/components/Accordion';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import { CategoryPills, ICategoryPillsProps, IPageHeaderProps, PageHeader } from '../common';

export interface IReportItemProps extends IPageHeaderProps {
  introLabel: string;
  maxLimitLabel: string;
  accordionNodes: IAccordionProps[];
}

const ReportItem: React.FC<IReportItemProps & ICategoryPillsProps> = props => {
  const { introLabel, maxLimitLabel, accordionNodes } = props;
  return (
    <PageHeader {...props}>
      <Box customStyle="space-y-4">
        <Text>
          {introLabel}{' '}
          <Text as="span" variant="footnotes2" color={{ light: 'grey7', dark: 'grey6' }}>
            {`(${maxLimitLabel}.)`}
          </Text>
        </Text>

        <CategoryPills {...props} />

        <Box>
          {accordionNodes.map(({ titleNode, contentNode }, idx) => (
            <Accordion
              key={idx}
              titleNode={titleNode}
              contentNode={contentNode}
              contentStyle="p-0"
            />
          ))}
        </Box>
      </Box>
    </PageHeader>
  );
};

export default ReportItem;
