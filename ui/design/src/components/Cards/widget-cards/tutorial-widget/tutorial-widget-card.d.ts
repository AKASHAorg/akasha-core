import * as React from 'react';
export interface ITutorialWidgetCardProps {
  currentProgress: number;
  titleLabel: string;
  subtitleLabel: string;
  subtitleIcon?: string;
  infoLabel: string;
  learnMoreLabel: string;
  callToActionLabel: string;
  seeVideoTutorialLabel: string;
  handleLearnMore?: () => void;
  handleCallToAction?: () => void;
  handleSeeVideoTutorial?: () => void;
  handleDismiss?: () => void;
  className?: string;
}
declare const TutorialWidgetCard: React.FC<ITutorialWidgetCardProps>;
export default TutorialWidgetCard;
