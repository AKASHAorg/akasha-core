import React from 'react';
import { useTranslation } from 'react-i18next';

import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { ErrorInfoCard } from '@akashaorg/design-system-core/lib/components/ErrorLoader/error-info-card';
import MarkdownCard from '@akashaorg/design-system-core/lib/components/MarkdownCard';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

export type PageRendererProps = {
  doc: string | null;
  error: Error | null;
};

const PageRenderer: React.FC<PageRendererProps> = props => {
  const { doc, error } = props;

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
    <Stack align="center">
      {!doc && <Spinner />}

      {doc && <MarkdownCard mdText={doc} />}
    </Stack>
  );
};

export default PageRenderer;
