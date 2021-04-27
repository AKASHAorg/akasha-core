import { Box, Text } from 'grommet';
import * as React from 'react';
import { Icon } from '../Icon';
import { WidgetAreaCardBox } from '../EntryCard/basic-card-box';
import { StyledButton } from '../AppInfoWidgetCard/styled-widget-cards';

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
    <WidgetAreaCardBox className={className} callToAction={true}>
      {handleDismiss && (
        <Box justify="end" pad={{ top: 'xxsmall', right: 'xxsmall' }} direction="row">
          <Icon type="close" onClick={handleDismiss} primaryColor={true} />
        </Box>
      )}
      <Box pad={{ horizontal: 'medium' }} gap="xsmall">
        <Text weight="bold"> {titleLabel}</Text>
        <Text>{subtitleLabel}</Text>
        <Box direction="row" pad={{ bottom: 'xsmall' }} gap="xsmall">
          {handleLearnMore && <StyledButton label={learnMoreLabel} onClick={handleLearnMore} />}
          {handleCallToAction && (
            <StyledButton
              label={callToActionLabel}
              onClick={handleCallToAction}
              primary={true}
              fill={!handleLearnMore}
            />
          )}
        </Box>
      </Box>
    </WidgetAreaCardBox>
  );
};

export default MiniInfoWidgetCard;
