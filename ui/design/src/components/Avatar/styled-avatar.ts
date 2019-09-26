import styled, { css } from 'styled-components';
import MarginInterface from '../../interfaces/margin.interface';
import MarginSetter from '../../utils/marginSetter';

/* avatar size:
 * xs = 24px;
 * sm = 32px;
 * md = 40px;
 * lg = 48px;
 */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';

interface AvatarProps {
  size: AvatarSize;
  isClickable: boolean;
  margin?: MarginInterface;
  backgroundColor?: string;
  withBorder?: boolean;
}

const StyledAvatar = styled.div<AvatarProps>`
  ${props => {
    const { margin, backgroundColor, withBorder } = props;

    const marginSize = margin ? MarginSetter(margin) : '0px';

    return css`
      background: ${p => backgroundColor || p.theme.colors.white};
      margin: ${marginSize};
      border-radius: ${props.theme.shapes.avatar.borderRadius};
      border: ${props.withBorder
        ? `calc(${props.theme.spacing.components.avatar.sizes[props.size]} / 4,76%) solid ${
            props.theme.colors.avatarBorder
          }`
        : 'none'};
    `;
  }};
  box-sizing: border-box;
  cursor: ${props => (props.isClickable ? 'pointer' : 'default')};
  user-select: none;
  position: relative;
  overflow: hidden;
  width: ${props =>
    props.theme.spacing.components.avatar.sizes[props.size]
      ? props.theme.spacing.components.avatar.sizes[props.size]
      : '100%'};
  height: ${props =>
    props.theme.spacing.components.avatar.sizes[props.size]
      ? props.theme.spacing.components.avatar.sizes[props.size]
      : '100%'};
  img {
    display: block;
    width: 100%;
    height: auto;
    position: absolute;
  }
`;

export default StyledAvatar;
