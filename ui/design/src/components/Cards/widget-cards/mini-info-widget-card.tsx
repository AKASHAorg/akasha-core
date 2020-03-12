import { Box, Text } from 'grommet';
import * as React from 'react';
import { Icon } from '../../Icon/index';
import { StyledButton, StyledWidgetCard } from './styled-widget-cards';

export interface IMiniInfoCardProps {
  className?: string;
  titleLabel: string;
  subtitleLabel: string;
  learnMoreLabel: string;
  callToActionLabel: string;
  handleLearnMore?: () => void;
  handleCallToAction: () => void;
  handleDismiss?: () => void;
}

const MiniInfoWidgetCard: React.FC<IMiniInfoCardProps> = props => {
  const {
    className,
    titleLabel,
    subtitleLabel,
    learnMoreLabel,
    callToActionLabel,
    handleLearnMore,
    handleCallToAction,
    handleDismiss,
  } = props;

  return (
    <StyledWidgetCard className={className} callToAction={true}>
      {handleDismiss && (
        <Box justify="end" pad={{ top: 'xxsmall', right: 'xxsmall' }} direction="row">
          <Icon type="close" onClick={handleDismiss} primaryColor={true} />
        </Box>
      )}
      <Box pad={{ horizontal: 'medium' }} gap="xsmall">
        <Text weight="bold"> {titleLabel}</Text>
        <Text> {subtitleLabel}</Text>
        <Box direction="row" pad={{ bottom: 'xsmall' }} gap="xsmall">
          {handleLearnMore && <StyledButton label={learnMoreLabel} onClick={handleLearnMore} />}
          <StyledButton
            label={callToActionLabel}
            onClick={handleCallToAction}
            primary={true}
            fill={!handleLearnMore}
          />
        </Box>
      </Box>
    </StyledWidgetCard>
  );
};

export default MiniInfoWidgetCard;
