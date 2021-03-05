import * as React from 'react';
import MarginInterface from '../../../interfaces/margin.interface';
import { IconType } from '../../Icon/icon';
export interface IAppsWidgetCardProps {
  className?: string;
  onClick: () => void;
  margin?: MarginInterface;
  label: string;
  labelColor?: string;
  iconType: IconType;
  dataSource: IAppData[];
  onAppClick: (appData: IAppData) => void;
}
export interface IAppData {
  title: string;
  subtitle: string;
  appIconType: IconType;
  iconSize: string;
}
declare const AppsWidgetCard: React.FC<IAppsWidgetCardProps>;
export default AppsWidgetCard;
