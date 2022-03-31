import { Box } from 'grommet';
import styled, { css } from 'styled-components';

export interface IIconDiv {
  backgroundSize?: string;
  backgroundColor?: boolean;
}

const BackgroundDiv = styled.div<IIconDiv>`
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  margin-right: ${props => `${props.theme.shapes.baseSpacing * 2}px`};
  ${props => {
    const size = props.backgroundSize ? props.backgroundSize : '3.5rem';
    const background = props.backgroundColor ? props.theme.colors.beigeBackground : 'none';
    if (props.backgroundColor) {
      return css`
        border-radius: 4px;
        width: ${size};
        height: ${size};
        background: ${background};
      `;
    }
  }}
`;

const StyledBox = styled(Box)`
  cursor: pointer;
`;

export { BackgroundDiv, StyledBox };
