import styled, { css } from 'styled-components';
import MarginInterface from '../../interfaces/margin.interface';
import MarginSetter from '../../utils/marginSetter';

const sizes = {
  xs: '24px',
  sm: '32px',
  md: '40px',
  lg: '48px',
  xl: '72px',
};
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  size: AvatarSize;
  isClickable: boolean;
  margin?: MarginInterface;
  backgroundColor?: string;
  borderSize?: string;
  borderColor?: string;
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
    const { borderSize, borderColor } = props;
    if (borderSize) {
      return css`
        border: ${borderSize} solid ${borderColor || props.theme.colors.white};
      `;
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
    height: auto;
    position: absolute;
  }
`;

export default StyledAvatar;
