import styled, { css } from 'styled-components';

const StyledStackBox = styled.div<{ zIndex: number }>`
  z-index: ${props => props.zIndex};
  display: inline-flex;
  ${props => {
    if (props.zIndex > 1) {
      return css`
        margin-left: -0.75rem;
      `;
    }
    return;
  }}
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export { StyledStackBox, StyledContainer };
