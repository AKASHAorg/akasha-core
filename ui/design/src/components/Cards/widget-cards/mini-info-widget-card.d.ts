import * as React from 'react';
export interface IMiniInfoCardProps {
  className?: string;
  titleLabel: string;
  subtitleLabel: React.ReactNode;
  learnMoreLabel?: string;
  callToActionLabel?: string;
  handleLearnMore?: () => void;
  handleCallToAction?: () => void;
  handleDismiss?: () => void;
}
declare const MiniInfoWidgetCard: React.FC<IMiniInfoCardProps>;
export default MiniInfoWidgetCard;
