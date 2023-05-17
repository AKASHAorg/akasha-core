import React from 'react';

import Accordion, { IAccordionProps } from '@akashaorg/design-system-core/lib/components/Accordion';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';

import {
  CategoryPills,
  ICategoryPillsProps,
  IPageHeaderProps,
  ISubtitleRendererProps,
  PageHeader,
  SubtitleRenderer,
} from '../common';

export interface IReportItemProps extends IPageHeaderProps {
  step: number;
  introLabel: string;
  subTextLabel: string;
  accordionNodes: IAccordionProps[];
  reasonPlaceholderLabel: string;
}

export const ReportItem: React.FC<
  IReportItemProps & ICategoryPillsProps & ISubtitleRendererProps
> = props => {
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
