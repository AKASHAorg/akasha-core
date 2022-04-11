import { Box, Text, Drop } from 'grommet';
import React from 'react';
import Icon, { IconType } from '../Icon';
import { BackgroundDiv, StyledBox } from './styled-subtitle-text-icon';
import Tooltip from '../Tooltip';

export interface ISubtitleTextIcon {
  className?: string;
  iconType?: IconType;
  plainIcon?: boolean;
  iconSize?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  backgroundSize?: string;
  backgroundColor?: boolean;
  label?: string | number;
  labelColor?: string;
  labelSize?: 'small' | 'large';
  subtitle?: string;
  subtitleColor?: string;
  subtitleIcon?: IconType;
  subtitleIconTooltip?: string;
  onClick?: React.EventHandler<React.SyntheticEvent>;
  gap?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large';
  maxWidth?: string;
}

const SubtitleTextIcon: React.FC<ISubtitleTextIcon> = props => {
  const {
    className,
    iconType,
    iconSize,
    plainIcon,
    backgroundColor,
    backgroundSize,
    label,
    labelColor,
    labelSize,
    subtitle,
    subtitleColor,
    subtitleIcon,
    subtitleIconTooltip,
    onClick,
    gap,
    maxWidth,
  } = props;

  const [showTooltip, setShowTooltip] = React.useState(false);
  const targetRef = React.useRef();

  return (
    <StyledBox
      data-testid={`${props['data-testid']}`}
      direction="row"
      align="center"
      justify="center"
      onClick={onClick}
      className={className}
    >
      {iconType ? (
        <BackgroundDiv backgroundSize={backgroundSize} backgroundColor={backgroundColor}>
          <Icon type={iconType} size={iconSize} plain={plainIcon} />
        </BackgroundDiv>
      ) : null}
      <Box pad="none" gap={gap} width={{ max: maxWidth }}>
        <Text color={labelColor} size={labelSize} truncate={true}>
          {label}
        </Text>
        <Box direction="row" gap="xsmall">
          <Text size="small" color={subtitleColor} truncate={true}>
            {subtitle}
          </Text>
          {subtitleIcon && (
            <Icon
              size="xs"
              type={subtitleIcon}
              accentColor={true}
              clickable={false}
              ref={targetRef}
              onClick={() => setShowTooltip(!showTooltip)}
            />
          )}
          {subtitleIconTooltip && showTooltip && targetRef.current && (
            <Drop
              margin={{ left: 'xsmall' }}
              align={{ left: 'right' }}
              target={targetRef.current}
              onClickOutside={() => setShowTooltip(false)}
            >
              <Box background="activePanelBackground" round="xsmall" pad="xsmall">
                <Text>{subtitleIconTooltip}</Text>
              </Box>
            </Drop>
          )}
        </Box>
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
