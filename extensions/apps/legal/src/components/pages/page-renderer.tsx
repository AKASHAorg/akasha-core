import React from 'react';
import { useTranslation } from 'react-i18next';
import MarkdownCard from '@akashaorg/design-system-components/lib/components/MarkdownCard';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Loader2 } from 'lucide-react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import {
  ErrorLoader,
  ErrorLoaderDescription,
  ErrorLoaderTitle,
} from '@akashaorg/ui/lib/akasha-components/error-loader';

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
      <ErrorLoader type="script-error">
        <ErrorLoaderTitle>{t('There was an error loading the docs')}</ErrorLoaderTitle>
        <ErrorLoaderDescription>{error.message}</ErrorLoaderDescription>
      </ErrorLoader>
    );
  }
  return (
    <Card className="p-0">
      <Stack
        alignItems="center"
        justifyContent="center"
        className="py-4 border-b-1 border-solid border-grey8 dark:border-grey5"
      >
        <Typography bold>{title}</Typography>
      </Stack>
      <Stack className="p-4">
        {!doc && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
        {doc && <MarkdownCard mdText={doc} />}
      </Stack>
    </Card>
  );
};
export default PageRenderer;
