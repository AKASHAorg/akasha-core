import * as React from 'react';
export interface IReadOnlyEditor {
  content: any;
  handleMentionClick?: any;
}
declare const ReadOnlyEditor: React.FC<IReadOnlyEditor>;
export { ReadOnlyEditor };
