import * as React from 'react';
import { Portal } from './helpers';
import styled from 'styled-components';

export interface IMentionPopover {
  values: string[];
  ref: React.Ref<any>;
  currentIndex: number;
}

const StyledPopoverDiv = styled.div`
  top: -9999px;
  left: -9999px;
  position: absolute;
  z-index: 100;
  padding: ${props => `${props.theme.shapes.baseSpacing}px`};
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.colors.shadow};
`;

const StyledValueDiv = styled.div<{ background: boolean }>`
  padding: ${props => `${props.theme.shapes.baseSpacing}px`};
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
  background: ${props => (props.background ? '#B4D5FF' : 'transparent')};
`;

export const MentionPopover: React.FC<IMentionPopover> = React.forwardRef((props, ref) => {
  const { values, currentIndex } = props;

  return (
    <Portal>
      <StyledPopoverDiv ref={ref}>
        {values.map((value, i) => (
          <StyledValueDiv key={value} background={i === currentIndex}>
            {value}
          </StyledValueDiv>
        ))}
      </StyledPopoverDiv>
    </Portal>
  );
});
