import * as React from 'react';
import Icon, { IconType } from '../Icon';
import { Box, Tip, TipProps, Text } from 'grommet';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';

export interface ITooltipProps extends TipProps {
  icon?: IconType;
  message: string;
  caretPosition: 'top' | 'left' | 'bottom' | 'right';
}

const Caret = styled.div<{ position: ITooltipProps['caretPosition'] }>`
  width: 0;
  height: 0;
  ${props => {
    if (props.position === 'top' || props.position === 'bottom') {
      return `
        border-left: 0.5em solid transparent;
        border-right: 0.5em solid transparent;
        margin-left: calc(50% - 0.42rem);
      `;
    }
    return `
        border-top: 0.5em solid transparent;
        border-bottom: 0.5em solid transparent;
      `;
  }};
  border-bottom: 0.3em solid
    ${props => (props.position === 'top' ? props.theme.colors.darkGrey : 'transparent')};
  border-top: 0.3em solid
    ${props => (props.position === 'bottom' ? props.theme.colors.darkGrey : 'transparent')};
  border-left: 0.3em solid
    ${props => (props.position === 'right' ? props.theme.colors.darkGrey : 'transparent')};
  border-right: 0.3em solid
    ${props => (props.position === 'left' ? props.theme.colors.darkGrey : 'transparent')};
`;

const ContentWrapper = styled(Box)`
  background: ${props => props.theme.colors.darkGrey};
`;

const TooltipContent = ({
  message,
  icon,
  caretPosition,
}: {
  message: string;
  icon?: IconType;
  caretPosition: ITooltipProps['caretPosition'];
}) => {
  return (
    <>
      {caretPosition === 'top' && <Caret position={caretPosition} />}
      <Box direction="row" align="center">
        {caretPosition === 'left' && <Caret position={caretPosition} />}
        <ContentWrapper
          background="darkGrey"
          direction="row"
          pad={isMobile ? 'small' : 'xxsmall'}
          round="xxsmall"
        >
          {icon && <Icon type={icon} style={{ marginRight: '0.3em' }} color="green" />}
          <Text size="small" color="white" style={{ whiteSpace: 'nowrap' }}>
            {message}
          </Text>
        </ContentWrapper>
        {caretPosition === 'right' && <Caret position={caretPosition} />}
      </Box>
      {caretPosition === 'bottom' && <Caret position={caretPosition} />}
    </>
  );
};

const Tooltip: React.FC<ITooltipProps> = props => {
  return (
    <Tip
      dropProps={props.dropProps}
      plain={props.plain}
      content={
        <TooltipContent
          caretPosition={props.caretPosition}
          message={props.message}
          icon={props.icon}
        />
      }
    >
      {props.children}
    </Tip>
  );
};

export default Tooltip;
