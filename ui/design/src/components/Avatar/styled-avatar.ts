import styled, { css } from 'styled-components';
import MarginInterface from '../../interfaces/margin.interface';
import MarginSetter from '../../utils/marginSetter';

const sizes = {
  xxs: '24px',
  xs: '28px',
  sm: '32px',
  md: '40px',
  lg: '48px',
  xl: '72px',
  xxl: '84px',
};
export type AvatarSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface AvatarProps {
  size: AvatarSize;
  isClickable: boolean;
  margin?: MarginInterface;
  backgroundColor?: string;
  border?: 'sm' | 'md' | 'lg';
}

const StyledAvatar = styled.div<AvatarProps>`
  ${props => {
    const { margin, backgroundColor } = props;
    const marginSize = margin ? MarginSetter(margin) : null;
    return css`
      background: ${backgroundColor || props.theme.colors.white};
      ${marginSize};
    `;
  }};
  ${props => {
    const { border } = props;
    switch (border) {
      case 'sm':
        return css`
          border: 1px solid ${props.theme.colors.white};
        `;

      case 'md':
        return css`
          border: 2px solid ${props.theme.colors.white};
        `;

      case 'lg':
        return css`
          border: 4px solid ${props.theme.colors.white};
        `;

      default:
        return;
    }
  }}
  box-sizing: border-box;
  cursor: ${props => (props.isClickable ? 'pointer' : 'default')};
  user-select: none;
  position: relative;
  overflow: hidden;
  width: ${props => (sizes[props.size] ? sizes[props.size] : '100%')};
  height: ${props => (sizes[props.size] ? sizes[props.size] : '100%')};
  border-radius: 100%;
  img {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
  }
`;

export const StyleFileInput = styled.input`
  display: none;
`;

export const ActiveOverlay = styled.div`
  background-color: ${props => props.theme.colors.accent};
  opacity: 0.25;
  z-index: 10;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export default StyledAvatar;
