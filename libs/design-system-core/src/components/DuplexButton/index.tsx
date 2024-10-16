import React, { useEffect, useState, EventHandler, SyntheticEvent } from 'react';

import Button from '../Button';
import { ButtonProps } from '../Button/types';
import { getLabel } from './utilities/get-label';
import { getIcon } from './utilities/get-icon';

export type DuplexButtonProps = Pick<
  ButtonProps,
  'iconDirection' | 'size' | 'icon' | 'loading' | 'customStyle'
> & {
  inactiveLabel?: string;
  inactiveVariant?: ButtonProps['variant'];
  activeLabel?: string;
  activeVariant?: ButtonProps['variant'];
  activeHoverLabel?: string;
  active?: boolean;
  activeIcon?: React.ReactElement;
  activeHoverIcon?: React.ReactElement;
  allowMinimization?: boolean;
  fixedWidth?: string;
  onClickInactive?: EventHandler<SyntheticEvent>;
  onClickActive?: EventHandler<SyntheticEvent>;
};

/**
 * A DuplexButton component is a special type of button that has been customized to satisfy
 * a specific use case. This button will change its label depending on its active and hover state.
 * A DuplexButton component takes all the props of a Button component minus the `label`
 * and additional customization
 * props as shown below:
 * @param onClickInactive - (optional) click event handler for inactive state
 * @param onClickActive - (optional)  click event handler for active state
 * @param inactiveLabel - (optional) label for inactive state
 * @param inactiveVariant - (optional) customize button variant for inactive state
 * @param activeLabel - (optional) label for active state
 * @param activeVariant - (optional) customize button variant for active state
 * @param active - boolean (optional) whether the button's state is active
 * @param activeIcon - (optional) icon for active state
 * @param activeHoverIcon - (optional) icon on hover for active state
 * @param fixedWidth - (optional) specify a fixed width for the button
 * @example
 * ```tsx
 *  <DuplexButton
 *    name='dropdown'
 *    customStyle={disabledStyle}
 *    inactiveLabel={t('Follow')}
 *    activeLabel={t('Following')}
 *    activeHoverLabel={t('Unfollow')}
 *    active={following}
 *   />
 * ```
 **/
const DuplexButton: React.FC<DuplexButtonProps> = props => {
  const {
    onClickActive,
    onClickInactive,
    size = 'sm',
    inactiveLabel,
    inactiveVariant = 'primary',
    activeLabel,
    activeVariant = 'secondary',
    activeHoverLabel,
    active,
    icon,
    iconDirection,
    activeIcon = icon,
    activeHoverIcon = icon,
    loading,
    fixedWidth,
    customStyle = '',
  } = props;

  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    //Reset hovered state when button is set as active
    if (active) setHovered(false);
  }, [active]);

  if (loading) {
    return <Button loading={true} customStyle={fixedWidth} />;
  }

  const label = getLabel({ active, hovered, activeHoverLabel, activeLabel, inactiveLabel });
  const iconUi = getIcon({ active, hovered, icon, activeHoverIcon, activeIcon });
  const variant = active ? activeVariant : inactiveVariant;
  const hoverColors = active
    ? {
        hoverColors: {
          background: { light: 'transparent', dark: 'transparent' },
          border: { light: 'errorLight', dark: 'errorDark' },
          text: { light: 'errorLight', dark: 'errorDark' },
          icon: { light: 'errorLight', dark: 'errorDark' },
        } as const,
      }
    : {};

  return (
    <Button
      {...hoverColors}
      label={label}
      onClick={active ? onClickActive : onClickInactive}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      icon={iconUi}
      variant={variant}
      size={size}
      hover={true}
      iconDirection={iconDirection}
      customStyle={`${customStyle} ${fixedWidth}`}
    />
  );
};

export default DuplexButton;
