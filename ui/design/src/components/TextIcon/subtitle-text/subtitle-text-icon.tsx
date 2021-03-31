import { Box, Text } from 'grommet';
import React from 'react';
import { Icon } from '../../Icon';
import { IconType } from '../../Icon/icon';
import { IconDiv, StyledBox } from './styled-subtitle-text-icon';

export interface ISubtitleTextIcon {
  className?: string;
  iconType?: IconType;
  iconSize?: string;
  iconBackground?: boolean;
  label?: string | number;
  labelColor?: string;
  labelSize?: 'small' | 'large';
  subtitle?: string;
  subtitleColor?: string;
  onClick?: React.EventHandler<React.SyntheticEvent>;
  gap?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large';
  maxWidth?: string;
}

const SubtitleTextIcon: React.FC<ISubtitleTextIcon> = props => {
  const {
    className,
    iconType,
    iconSize,
    iconBackground,
    label,
    labelColor,
    labelSize,
    subtitle,
    subtitleColor,
    onClick,
    gap,
    maxWidth,
  } = props;
  return (
    <StyledBox
      data-testid={`${props['data-testid']}`}
      direction="row"
      justify="center"
      onClick={onClick}
      className={className}
    >
      {iconType ? (
        <IconDiv iconSize={iconSize} iconBackground={iconBackground}>
          <Icon type={iconType} />
        </IconDiv>
      ) : null}
      <Box pad="none" gap={gap} width={{ max: maxWidth }}>
        <Text color={labelColor} size={labelSize} truncate={true}>
          {label}
        </Text>
        <Text size="small" color={subtitleColor} truncate={true}>
          {subtitle}
        </Text>
      </Box>
    </StyledBox>
  );
};

SubtitleTextIcon.defaultProps = {
  labelColor: 'primaryText',
  labelSize: 'large',
  subtitleColor: 'secondaryText',
};

export default SubtitleTextIcon;
