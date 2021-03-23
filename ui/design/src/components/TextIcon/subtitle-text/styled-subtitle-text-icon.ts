import { Box } from 'grommet';
import styled, { css } from 'styled-components';

export interface IIconDiv {
  iconSize?: string;
  iconBackground?: boolean;
}

const IconDiv = styled.div<IIconDiv>`
  ${props => {
    const size = props.iconSize ? props.iconSize : '1.75em';
    const radius = props.iconSize ? '100%' : '0.875em';
    const background = props.iconBackground ? props.theme.colors.lightBackground : 'none';
    return css`
      border-radius: ${radius};
      width: ${size};
      height: ${size};
      background: ${background};
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
