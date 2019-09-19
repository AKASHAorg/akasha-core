import styled, { css } from 'styled-components';
import MarginSetter from '../../utils/marginSetter';
import MarginInterface from '../../interfaces/margin.interface';

/* avatar size:
 * xs = 24px;
 * sm = 32px;
 * md = 40px;
 * lg = 48px;
 */
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

    const marginSize = margin ? MarginSetter(margin) : '0px';
    const borderRadius = roundedCorners ? props.theme.shapes.borderRadius : '';

    return css`
      background: ${props => backgroundColor || props.theme.colors.white}
      margin: ${marginSize}
      border-radius: ${borderRadius}
    `;
  }}
  overflow: hidden;
  width: ${props =>
    props.theme.spacing.components.avatar.sizes[props.size]
      ? props.theme.spacing.components.avatar.sizes[props.size]
      : '100%'};
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
