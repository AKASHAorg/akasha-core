import React from 'react';
import { Box, Text } from 'grommet';
import styled, { css } from 'styled-components';
import Icon, { IconType } from '../Icon';

interface ISubtitleTextIcon {
  iconType?: IconType;
  iconSize?: string;
  title: string;
  titleColor?: string;
  titleSize?: 'small' | 'large';
  subtitle: string;
  subtitleColor?: string;
  onClick?: React.EventHandler<React.SyntheticEvent<HTMLDivElement, MouseEvent>>;
  gap?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large';
}
interface IIconDiv {
  iconSize?: string;
}
const IconDiv = styled.div<IIconDiv>`
  ${props => {
    const size = props.iconSize ? props.iconSize : '28px';
    const radius = props.iconSize ? '100%' : '14px';
    return css`
      border-radius: ${radius};
      width: ${size};
      height: ${size};
      background: ${props => props.theme.colors.lightBackground};
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: ${props => `${props.theme.spacing.baseSpacing * 2}px`};
    `;
  }}
`;

const StyledBox = styled(Box)`
  cursor: pointer;
`;

const SubtitleTextIcon: React.FC<ISubtitleTextIcon> = props => {
  const {
    iconType,
    iconSize,
    title,
    titleColor,
    titleSize,
    subtitle,
    subtitleColor,
    onClick,
    gap,
  } = props;

  return (
    <StyledBox direction="row" justify="center" onClick={onClick}>
      {iconType ? (
        <IconDiv iconSize={iconSize}>
          <Icon type={iconType} />
        </IconDiv>
      ) : null}
      <Box pad="none" gap={gap}>
        <Text color={titleColor} size={titleSize}>
          {title}
        </Text>
        <Text size="small" color={subtitleColor}>
          {subtitle}
        </Text>
      </Box>
    </StyledBox>
  );
};

SubtitleTextIcon.defaultProps = {
  titleColor: 'primaryText',
  titleSize: 'large',
  subtitleColor: 'secondaryText',
};

export default SubtitleTextIcon;
