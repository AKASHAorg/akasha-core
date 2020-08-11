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
        case 'xs':
          return css`
            width: 1rem;
            height: 1rem;
          `;
        case 'sm':
          return css`
            width: 1.5rem;
            height: 1.5rem;
          `;
        case 'md':
          return css`
            width: 2rem;
            height: 2rem;
          `;
        case 'lg':
          return css`
            width: 2.5rem;
            height: 2.5rem;
          `;
        default:
          return css`
            width: 1.5rem;
            height: 1.5rem;
          `;
      }
    }
    return css`
      width: 1.5rem;
      height: 1.5rem;
    `;
  }}
  border-radius: 50%;
  cursor: pointer;
  background-color: ${props => props.theme.colors.white};
`;

const StyledImage = styled(Image)<IconSize>`
  ${props => {
    if (props.size) {
      switch (props.size) {
        case 'xs':
          return css`
            width: 1rem;
            height: 1rem;
          `;
        case 'sm':
          return css`
            width: 1.5rem;
            height: 1.5rem;
          `;
        case 'md':
          return css`
            width: 2rem;
            height: 2rem;
          `;
        case 'lg':
          return css`
            width: 2.5rem;
            height: 2.5rem;
          `;
        default:
          return css`
            width: 1.5rem;
            height: 1.5rem;
          `;
      }
    }
    return css`
      width: 1.5rem;
      height: 1.5rem;
    `;
  }}
  border-radius: 50%;
`;

export { StyledIconDiv, StyledImage };
