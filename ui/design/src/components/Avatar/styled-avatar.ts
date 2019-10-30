import styled, { css } from 'styled-components';
import MarginInterface from '../../interfaces/margin.interface';
import MarginSetter from '../../utils/marginSetter';

const sizes = {
  xs: '24px',
  sm: '32px',
  md: '40px',
  lg: '48px',
};
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';

interface AvatarProps {
  roundedCorners?: boolean;
  size: AvatarSize;
  isClickable: boolean;
  margin?: MarginInterface;
  backgroundColor?: string;
}

const StyledAvatar = styled.div<AvatarProps>`
  ${props => {
    const { margin, backgroundColor, roundedCorners } = props;

    const marginSize = margin ? MarginSetter(margin) : null;
    const borderRadius = roundedCorners ? props.theme.shapes.borderRadius : '';

    return css`
      background: ${backgroundColor || props.theme.colors.white}
      ${marginSize}
      border-radius: ${borderRadius}
    `;
  }}
  overflow: hidden;
  width: ${props => (sizes[props.size] ? sizes[props.size] : '100%')};
  height: ${props => (sizes[props.size] ? sizes[props.size] : '100%')};
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

StyledAvatar.defaultProps = {
  roundedCorners: false,
};

export default StyledAvatar;
