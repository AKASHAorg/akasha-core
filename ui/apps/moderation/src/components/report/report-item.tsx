import React from 'react';

import Accordion, { AccordionProps } from '@akashaorg/design-system-core/lib/components/Accordion';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';

import {
  CategoryPills,
  CategoryPillsProps,
  PageHeaderProps,
  SubtitleRendererProps,
  PageHeader,
  SubtitleRenderer,
} from '../common';

export type ReportItemProps = PageHeaderProps &
  CategoryPillsProps &
  SubtitleRendererProps & {
    step: number;
    introLabel: string;
    subTextLabel: string;
    accordionNodes: AccordionProps[];
    reasonPlaceholderLabel: string;
  };

export const ReportItem: React.FC<ReportItemProps> = props => {
  const { step, introLabel, subTextLabel, accordionNodes, reasonPlaceholderLabel } = props;

  return (
    <PageHeader {...props}>
      <Box customStyle="space-y-4">
        <Text>
          {introLabel}{' '}
          <Text as="span" variant="footnotes2" color={{ light: 'grey7', dark: 'grey6' }}>
            {`(${subTextLabel})`}
          </Text>
        </Text>

        {step === 0 && (
          <>
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
          </>
        )}

        {step === 1 && (
          <>
            <TextField placeholder={reasonPlaceholderLabel} type="multiline" />

            <SubtitleRenderer
              {...props}
              textVariant="footnotes2"
              textAlign="start"
              textColor={{ light: 'grey7', dark: 'grey6' }}
            />
          </>
        )}
      </Box>
    </PageHeader>
  );
};
