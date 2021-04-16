import * as React from 'react';
import { Portal } from './helpers';
import styled from 'styled-components';
import { Text } from 'grommet';
export interface IMentionPopover {
  values: string[];
  ref: React.Ref<any>;
  currentIndex: number;
  handleSelect: (index: number) => void;
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
  cursor: pointer;
  padding: ${props => `${props.theme.shapes.baseSpacing}px`};
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
  background: ${props => (props.background ? '#B4D5FF' : 'transparent')};
  max-width: 20rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MentionPopover: React.FC<IMentionPopover> = React.forwardRef((props, ref) => {
  const { values, currentIndex, handleSelect } = props;

  return (
    <Portal>
      <StyledPopoverDiv ref={ref}>
        {values.map((value, i) => (
          <StyledValueDiv
            key={value}
            background={i === currentIndex}
            onClick={() => {
              handleSelect(i);
            }}
          >
            <Text>{value}</Text>
          </StyledValueDiv>
        ))}
      </StyledPopoverDiv>
    </Portal>
  );
});
