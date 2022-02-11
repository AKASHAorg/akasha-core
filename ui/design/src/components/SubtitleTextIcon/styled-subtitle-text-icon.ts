import { Box } from 'grommet';
import styled, { css } from 'styled-components';

export interface IIconDiv {
  backgroundSize?: string;
  backgroundColor?: boolean;
}

const BackgroundDiv = styled.div<IIconDiv>`
  ${props => {
    const size = props.backgroundSize ? props.backgroundSize : '3.5rem';
    const background = props.backgroundColor ? props.theme.colors.beigeBackground : 'none';
    if (props.backgroundColor) {
      return css`
        border-radius: 4px;
        width: ${size};
        height: ${size};
        background: ${background};
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: ${`${props.theme.shapes.baseSpacing * 2}px`};
      `;
    } else {
      return css`
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: ${`${props.theme.shapes.baseSpacing * 2}px`};
      `;
    }
  }}
`;

const StyledBox = styled(Box)`
  cursor: pointer;
`;

export { BackgroundDiv, StyledBox };
