import { Box, Text } from 'grommet';
import React from 'react';
import { Icon } from '../Icon';
import { IconType } from '../Icon/icon';
import { IconDiv, StyledBox } from './styled-subtitle-text-icon';

export interface ISubtitleTextIcon {
  className?: string;
  iconType?: IconType;
  iconSize?: string;
  label: string;
  labelColor?: string;
  labelSize?: 'small' | 'large';
  subtitle: string;
  subtitleColor?: string;
  onClick?: React.EventHandler<React.SyntheticEvent>;
  gap?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large';
}

const SubtitleTextIcon: React.FC<ISubtitleTextIcon> = props => {
  const {
    className,
    iconType,
    iconSize,
    label,
    labelColor,
    labelSize,
    subtitle,
    subtitleColor,
    onClick,
    gap,
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
        <IconDiv iconSize={iconSize}>
          <Icon type={iconType} />
        </IconDiv>
      ) : null}
      <Box pad="none" gap={gap}>
        <Text color={labelColor} size={labelSize}>
          {label}
        </Text>
        <Text size="small" color={subtitleColor}>
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
