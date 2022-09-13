import styled, { css } from 'styled-components';
import { Box } from 'grommet';

export const TextLine = styled(Box)<{ animated?: boolean }>`
  min-height: 18px;
  ${props => {
    if (props.animated) {
      return css`
        background: linear-gradient(
          90deg,
          ${props.theme.colors.skeletonBackground},
          #fff,
          ${props.theme.colors.skeletonBackground}
        );
        animation: bgRotate 1s ease infinite;
      `;
    }
    return css`
      background-color: ${props.theme.colors.skeletonBackground}a6;
    `;
  }}
`;
