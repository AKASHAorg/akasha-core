import React from 'react';

import DS from '@akashaorg/design-system';

const { Box, Button, Icon, Text, styled } = DS;

export interface ICardTitleProps {
  leftIcon: boolean;
  title: string;
  buttonLabel?: string;
  onClickIcon?: () => void;
  onClickButton?: () => void;
}

const StyledButton = styled(Button)`
  position: absolute;
  top: ${props => `${props.theme.shapes.baseSpacing * 3}px`};
  right: ${props => `${props.theme.shapes.baseSpacing * 3}px`};
`;

const CardTitle: React.FC<ICardTitleProps> = props => {
  const { leftIcon, title, buttonLabel, onClickIcon, onClickButton } = props;

  const handleIconClick = () => {
    if (onClickIcon) {
      onClickIcon();
    }
  };

  const handleButtonClick = () => {
    if (onClickButton) {
      onClickButton();
    }
  };

  return (
    <Box direction="row" pad="small" margin={{ bottom: 'medium' }}>
      {leftIcon && (
        <Icon
          type="chevronLeft"
          size="sm"
          accentColor={true}
          clickable={true}
          onClick={handleIconClick}
          style={{ position: 'absolute' }}
        />
      )}
      <Text size="large" weight="bold" margin={{ vertical: '0', horizontal: 'auto' }}>
        {title}
      </Text>
      {buttonLabel && (
        <StyledButton primary={true} label={buttonLabel} onClick={handleButtonClick} />
      )}
    </Box>
  );
};

export default CardTitle;
