import { Box } from 'grommet';
import styled, { css } from 'styled-components';

export interface IIconDiv {
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
      background: ${props.theme.colors.lightBackground};
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: ${`${props.theme.shapes.baseSpacing * 2}px`};
    `;
  }}
`;

const StyledBox = styled(Box)`
  cursor: pointer;
`;

export { IconDiv, StyledBox };
