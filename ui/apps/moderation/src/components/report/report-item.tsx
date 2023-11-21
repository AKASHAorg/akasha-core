import React from 'react';

import Accordion, { AccordionProps } from '@akashaorg/design-system-core/lib/components/Accordion';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
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
import { useAccordion } from '@akashaorg/ui-awf-hooks';

export type ReportItemProps = PageHeaderProps &
  CategoryPillsProps &
  SubtitleRendererProps & {
    step: number;
    introLabel: string;
    subTextLabel: string;
    accordionNodes: Omit<AccordionProps, 'accordionId' | 'open' | 'handleClick'>[];
    reasonPlaceholderLabel: string;
  };

export const ReportItem: React.FC<ReportItemProps> = props => {
  const { step, introLabel, subTextLabel, accordionNodes, reasonPlaceholderLabel } = props;

  const { active, handleAccordionClick } = useAccordion();

  return (
    <PageHeader {...props}>
      <Stack spacing="gap-y-4">
        <Text>
          {introLabel}{' '}
          <Text as="span" variant="footnotes2" color={{ light: 'grey7', dark: 'grey6' }}>
            {`(${subTextLabel})`}
          </Text>
        </Text>

        {step === 0 && (
          <>
            <CategoryPills {...props} />

            <Stack spacing="gap-y-2">
              {accordionNodes.map(({ titleNode, contentNode }, idx) => (
                <Stack key={idx}>
                  <Accordion
                    accordionId={idx}
                    open={idx === active}
                    titleNode={titleNode}
                    contentNode={contentNode}
                    handleClick={handleAccordionClick}
                    contentStyle="p-0"
                  />
                </Stack>
              ))}
            </Stack>
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
      </Stack>
    </PageHeader>
  );
};
