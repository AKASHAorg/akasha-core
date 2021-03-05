import * as React from 'react';
import { IEntryData } from '../Cards/entry-cards/entry-box';
export interface IEmbedEntryBox {
  embedEntryData: IEntryData;
}
declare const EmbedBox: React.FC<IEmbedEntryBox>;
export { EmbedBox };
