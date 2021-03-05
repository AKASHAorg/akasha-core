import * as React from 'react';
export interface IEntryCardHiddenProps {
  awaitingModerationLabel?: string;
  moderatedContentLabel?: string;
  ctaLabel?: string;
  isDelisted?: boolean;
  handleFlipCard?: any;
}
declare const EntryCardHidden: React.FC<IEntryCardHiddenProps>;
export { EntryCardHidden };
