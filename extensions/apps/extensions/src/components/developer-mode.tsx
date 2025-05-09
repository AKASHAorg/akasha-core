import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export type TDeveloperMode = {
  titleLabel: string;
  sections: {
    title: string;
    toggleButtonNode?: React.ReactNode;
    descriptionNode?: React.ReactNode;
    ctaNode?: React.ReactNode;
  }[];
};
export const DeveloperMode: React.FC<TDeveloperMode> = props => {
  const { titleLabel, sections } = props;
  return (
    <Card className="p-0 mb-4">
      <Stack className="p-4 border-b border-border">
        <Typography variant="h5" className="text-center">
          {titleLabel}
        </Typography>
      </Stack>
      <Stack spacing={4} className="p-4">
        {sections.map(({ title, toggleButtonNode, descriptionNode, ctaNode }, idx) => (
          <React.Fragment key={title + idx}>
            {idx > 0 && <Divider />}
            <Stack key={title + idx} spacing={2}>
              <Stack direction="row" justifyContent="between" alignItems="center" className="mb-2">
                <Typography bold>{title}</Typography>
                {toggleButtonNode}
              </Stack>
              {descriptionNode}
              {ctaNode}
            </Stack>
          </React.Fragment>
        ))}
      </Stack>
    </Card>
  );
};
