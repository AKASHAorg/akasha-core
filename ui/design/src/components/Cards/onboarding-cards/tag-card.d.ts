import * as React from 'react';
import { ITag } from '../widget-cards/trending-widget-card';
import { IMentionData } from '../../Charts/area-chart';
export interface ITagCard {
  tag: ITagData;
  mentionsLabel?: string;
  subscribeLabel?: string;
  subscribedLabel?: string;
  unsubscribeLabel?: string;
  handleSubscribe: (name: string) => void;
  handleUnsubscribe: (name: string) => void;
}
export interface ITagData extends ITag {
  tagHistoricData: IMentionData[];
  subscribed?: boolean;
}
declare const TagCard: React.FC<ITagCard>;
export { TagCard };
