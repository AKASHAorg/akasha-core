import * as React from 'react';
import MarginInterface from '../../../interfaces/margin.interface';
import { IconType } from '../../Icon/icon';
export interface ITopicsCardWidgetProps {
  onClick: () => void;
  onTopicClick: (topic: ITopicData) => void;
  margin?: MarginInterface;
  label: string;
  labelColor?: string;
  iconType: IconType;
  dataSource: ITopicData[];
  className?: string;
}
export interface ITopicData {
  title: string;
  subtitle: string;
}
declare const TopicsWidgetCard: React.FC<ITopicsCardWidgetProps>;
export default TopicsWidgetCard;
