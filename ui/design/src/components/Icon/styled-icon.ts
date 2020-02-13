import { Image } from 'grommet';
import styled, { css } from 'styled-components';
import { IconSize } from './app-icon';

const StyledIconDiv = styled.div<IconSize>`
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => {
    if (props.size) {
      switch (props.size) {
        case 'sm':
          return css`
            width: 1.5em;
            height: 1.5em;
          `;
        case 'md':
          return css`
            width: 2em;
            height: 2em;
          `;
        case 'lg':
          return css`
            width: 2.5em;
            height: 2.5em;
          `;
        default:
          return css`
            width: 1.5em;
            height: 1.5em;
          `;
      }
    }
    return css`
      width: 1.5em;
      height: 1.5em;
    `;
  }}
  border-radius: 50%;
  cursor: pointer;
  background-color: ${props => props.theme.colors.lightBackground};
`;

const StyledImage = styled(Image)<IconSize>`
  ${props => {
    if (props.size) {
      switch (props.size) {
        case 'sm':
          return css`
            width: 1.5em;
            height: 1.5em;
          `;
        case 'md':
          return css`
            width: 2em;
            height: 2em;
          `;
        case 'lg':
          return css`
            width: 2.5em;
            height: 2.5em;
          `;
        default:
          return css`
            width: 1.5em;
            height: 1.5em;
          `;
      }
    }
    return css`
      width: 1.5em;
      height: 1.5em;
    `;
  }}
  border-radius: 50%;
`;

export { StyledIconDiv, StyledImage };
