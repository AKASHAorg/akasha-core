import { Box, Text } from 'grommet';
import * as React from 'react';
import { Icon } from '../Icon/index';
import { WidgetAreaCardBox } from '../EntryCard/basic-card-box';
import { StyledButton, StyledImageBox } from './styled-tutorial';
import { IconType, iconTypes } from '../Icon/icon';
import Button from '../Button';
import { ProgressBar } from './progress-bar';

export interface ITutorialWidgetCardProps {
  // data
  currentProgress: number;
  // labels
  titleLabel: string;
  subtitleLabel: string;
  subtitleIcon?: string;
  infoLabel: string;
  learnMoreLabel: string;
  callToActionLabel: string;
  seeVideoTutorialLabel: string;
  // handlers
  handleLearnMore?: () => void;
  handleCallToAction?: () => void;
  handleSeeVideoTutorial?: () => void;
  handleDismiss?: () => void;
  // css
  className?: string;
}

const TutorialWidgetCard: React.FC<ITutorialWidgetCardProps> = props => {
  const {
    className,
    currentProgress,
    titleLabel,
    subtitleLabel,
    subtitleIcon,
    infoLabel,
    learnMoreLabel,
    seeVideoTutorialLabel,
    callToActionLabel,
    handleLearnMore,
    handleCallToAction,
    handleSeeVideoTutorial,
    handleDismiss,
  } = props;

  return (
    <WidgetAreaCardBox className={className} callToAction={true}>
      {handleDismiss && (
        <Box justify="end" pad={{ top: 'small', horizontal: 'small' }} direction="row">
          <Icon type="close" onClick={handleDismiss} primaryColor={true} clickable={true} />
        </Box>
      )}
      <Box align="center">
        <ProgressBar currentState={currentProgress} />
      </Box>
      <Box
        border={{ side: 'bottom', color: 'border', size: 'xxxsmall' }}
        pad="medium"
        align="center"
        justify="center"
      >
        <Text>{titleLabel}</Text>
      </Box>
      <StyledImageBox pad="medium" />
      <Box pad="medium" gap="small">
        <Box direction="row" gap="xxsmall">
          {subtitleIcon && iconTypes.includes(subtitleIcon as IconType) && (
            <Icon type={subtitleIcon as IconType} size="sm" />
          )}
          <Text weight="bold"> {subtitleLabel}</Text>
        </Box>

        <Text> {infoLabel}</Text>
        <Box direction="row" pad={{ bottom: 'xsmall' }} gap="xsmall">
          {handleLearnMore && handleCallToAction && (
            <>
              <StyledButton label={learnMoreLabel} onClick={handleLearnMore} />

              <StyledButton
                label={callToActionLabel}
                onClick={handleCallToAction}
                primary={true}
                fill={!handleLearnMore}
              />
            </>
          )}
          {handleSeeVideoTutorial && (
            <Button
              fill="horizontal"
              onClick={handleSeeVideoTutorial}
              label={seeVideoTutorialLabel}
              icon={<Icon type="video" />}
            />
          )}
        </Box>
      </Box>
    </WidgetAreaCardBox>
  );
};

export default TutorialWidgetCard;
