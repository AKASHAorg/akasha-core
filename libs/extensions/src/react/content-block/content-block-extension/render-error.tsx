import React, { MouseEventHandler } from 'react';
import { type BlockError, BlockErrorCard } from '../block-error-card';

export type RenderErrorProps = {
  fetchError: BlockError;
  contentLoadError: BlockError;
  fetchDataError: string;
  hasContentLoadError: boolean;
  refreshLabel?: string;
  handleRefresh?: MouseEventHandler<HTMLButtonElement>;
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
    <div className="flex flex-col gap-y-2">
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
    </div>
  );
};
