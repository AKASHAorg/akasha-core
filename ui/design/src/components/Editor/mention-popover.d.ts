import * as React from 'react';
export interface IMentionPopover {
  values: string[];
  ref: React.Ref<any>;
  currentIndex: number;
  handleSelect: (index: number) => void;
}
export declare const MentionPopover: React.FC<IMentionPopover>;
