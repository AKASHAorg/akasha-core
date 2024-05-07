import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { type BlockError, BlockErrorCard } from '../block-error-card';

export type RenderErrorProps = {
  fetchError: BlockError;
  contentLoadError: BlockError;
  fetchDataError: string;
  hasContentLoadError: boolean;
  refreshLabel?: string;
  handleRefresh: () => void;
};

export const RenderError: React.FC<RenderErrorProps> = props => {
  const {
    fetchError,
    contentLoadError,
    fetchDataError,
    hasContentLoadError,
    refreshLabel = '',
    handleRefresh,
  } = props;

  return (
    <Stack spacing="gap-y-2">
      {hasContentLoadError && (
        <BlockErrorCard
          errorTitle={contentLoadError.errorTitle}
          errorDescription={contentLoadError.errorDescription}
        />
      )}
      {fetchDataError && (
        <BlockErrorCard
          errorTitle={fetchError.errorTitle}
          errorDescription={fetchError.errorDescription}
          refreshLabel={refreshLabel}
          onRefresh={handleRefresh}
        />
      )}
    </Stack>
  );
};
