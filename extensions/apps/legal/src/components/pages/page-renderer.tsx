import React from 'react';
import { useTranslation } from 'react-i18next';

import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { ErrorInfoCard } from '@akashaorg/design-system-core/lib/components/ErrorLoader/error-info-card';
import MarkdownCard from '@akashaorg/design-system-core/lib/components/MarkdownCard';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type PageRendererProps = {
  doc: string | null;
  error?: Error | null;
  title: string;
};

const PageRenderer: React.FC<PageRendererProps> = props => {
  const { doc, error, title } = props;

  const { t } = useTranslation('app-legal');

  if (error) {
    return (
      <ErrorInfoCard error={error}>
        {message => (
          <ErrorLoader
            type="script-error"
            title={t('There was an error loading the docs')}
            details={message}
          />
        )}
      </ErrorInfoCard>
    );
  }

  return (
    <Card padding={0}>
      <Stack
        padding="py-4"
        align="center"
        justify="center"
        customStyle="border(b-1 solid grey8 dark:grey5)"
      >
        <Text weight="bold">{title}</Text>
      </Stack>
      <Stack padding={16}>
        {!doc && <Spinner />}
        {doc && <MarkdownCard mdText={doc} />}
      </Stack>
    </Card>
  );
};

export default PageRenderer;
