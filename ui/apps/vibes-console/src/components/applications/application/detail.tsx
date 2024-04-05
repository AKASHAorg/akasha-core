import React from 'react';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
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
              <Text variant="button-md">{title}</Text>
              {status && renderStatusDetail(status)}

              {resolvedDate && (
                <Text variant="body2" weight="light">
                  {formatDate(new Date(resolvedDate).toISOString(), 'DD MMM YYYY')}
                </Text>
              )}

              {value && (
                <Text variant="body2" weight="light">
                  {value}
                </Text>
              )}
            </Stack>
            {description && (
              <Text variant="footnotes2" weight="light">
                {description}
              </Text>
            )}
          </Stack>

          {idx < sections.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </PageHeader>
  );
};
