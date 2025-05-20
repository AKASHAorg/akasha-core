import React from 'react';
import { Separator } from '@akashaorg/ui/lib/components/separator';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { formatDate } from '@akashaorg/design-system-core/lib/utils';
import {
  PageHeaderProps,
  PageHeader,
} from '@akashaorg/design-system-components/lib/components/PageHeader';
import { TApplicationStatus, renderStatusDetail } from '../../../utils';
export type SelfApplicationDetailProps = PageHeaderProps & {
  sections: {
    title: string;
    description?: string;
    reason?: string;
    status?: TApplicationStatus;
    applicationDate?: Date;
  }[];
};
export const SelfApplicationDetail: React.FC<SelfApplicationDetailProps> = props => {
  const { sections } = props;
  return (
    <PageHeader {...props}>
      {sections.map(({ title, description, reason, status, applicationDate }, idx) => (
        <React.Fragment key={title}>
          <Stack
            spacing={1}
            {...(idx === sections.length - 1 &&
              status === 'pending' && {
                customStyle: 'mb-32',
              })}
          >
            <Stack direction="row" alignItems="center" justifyContent="between">
              <Typography variant="sm" bold>
                {title}
              </Typography>
              {status && renderStatusDetail(status)}
              {applicationDate && (
                <Typography variant="sm" className="font-light">
                  {formatDate(new Date(applicationDate).toISOString(), 'DD MMM YYYY')}
                </Typography>
              )}
            </Stack>
            {description && (
              <Typography variant="xs" className="font-medium font-light">
                {description}
              </Typography>
            )}
            {reason && (
              <ul className="ml-5 list-disc">
                <li>
                  <Typography variant="sm" className="font-light">
                    {reason}
                  </Typography>
                </li>
              </ul>
            )}
          </Stack>

          {idx < sections.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </PageHeader>
  );
};
