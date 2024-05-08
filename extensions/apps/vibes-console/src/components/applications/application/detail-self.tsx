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
            spacing="gap-y-1"
            {...(idx === sections.length - 1 && status === 'pending' && { customStyle: 'mb-32' })}
          >
            <Stack direction="row" align="center" justify="between">
              <Text variant="button-md">{title}</Text>
              {status && renderStatusDetail(status)}
              {applicationDate && (
                <Text variant="body2" weight="light">
                  {formatDate(new Date(applicationDate).toISOString(), 'DD MMM YYYY')}
                </Text>
              )}
            </Stack>
            {description && (
              <Text variant="footnotes2" weight="light">
                {description}
              </Text>
            )}
            {reason && (
              <ul className="ml-5 list-disc">
                <li>
                  <Text variant="body2" weight="light">
                    {reason}
                  </Text>
                </li>
              </ul>
            )}
          </Stack>

          {idx < sections.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </PageHeader>
  );
};
