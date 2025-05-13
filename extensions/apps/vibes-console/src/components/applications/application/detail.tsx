import React from 'react';
import { Separator } from '@akashaorg/ui/lib/components/separator';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { formatDate } from '@akashaorg/design-system-core/lib/utils';
import {
  PageHeaderProps,
  PageHeader,
} from '@akashaorg/design-system-components/lib/components/PageHeader';
import { TApplicationStatus, renderStatusDetail } from '../../../utils';
export type ApplicationDetailProps = PageHeaderProps & {
  sections: {
    title: string;
    description?: string;
    value?: string;
    status?: TApplicationStatus;
    resolvedDate?: Date;
  }[];
};
export const ApplicationDetail: React.FC<ApplicationDetailProps> = props => {
  const { sections } = props;
  return (
    <PageHeader {...props}>
      {sections.map(({ title, description, status, resolvedDate, value }, idx) => (
        <React.Fragment key={title}>
          <Stack spacing="gap-y-1">
            <Stack direction="row" align="center" justify="between">
              <Typography variant="sm" bold>
                {title}
              </Typography>
              {status && renderStatusDetail(status)}

              {resolvedDate && (
                <Typography variant="sm" className="font-light">
                  {formatDate(new Date(resolvedDate).toISOString(), 'DD MMM YYYY')}
                </Typography>
              )}

              {value && (
                <Typography variant="sm" className="font-light">
                  {value}
                </Typography>
              )}
            </Stack>
            {description && (
              <Typography variant="xs" className="font-medium font-light">
                {description}
              </Typography>
            )}
          </Stack>

          {idx < sections.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </PageHeader>
  );
};
