import * as React from 'react';
export interface ISourceWidgetCardProps {
  className?: string;
  titleLabel: string;
  tagsNumber: number;
  profilesNumber: number;
  appsNumber: number;
}
declare const SourcesWidgetCard: React.FC<ISourceWidgetCardProps>;
export default SourcesWidgetCard;
