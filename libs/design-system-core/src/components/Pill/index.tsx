import React, { useState } from 'react';
import Button from '../Button';
import Stack from '../Stack';
import Text, { TextProps } from '../Text';
import { ButtonProps } from '../Button/types';
import { Color } from '../types/common.types';
import { getColorClasses } from '../../utils';

type ActionPillProps = Pick<
  ButtonProps,
  'label' | 'size' | 'icon' | 'iconDirection' | 'loading' | 'customStyle'
> & {
  hover?: { icon: ButtonProps['icon']; active: boolean };
  active?: boolean;
  onPillClick?: (active?: boolean) => void;
};

export type InfoPillProps = Pick<TextProps, 'weight' | 'color' | 'customStyle'> & {
  label: string;
  borderColor?: Color;
  background?: Color;
  customTextStyle?: string;
};

export type PillProps =
  | (ActionPillProps & { type: 'action' })
  | (InfoPillProps & {
      type: 'info';
    });

/**
 * A Pill component is an UI element that takes the shape of a capsule/pill. It is often used
 * to display compact information such as tags, labels, or counters. In Akasha's design system,
 * Pills have two types: action pills and info pills. The main difference between the two is that
 * info pills are informative only and action pills allow users to take action.
 * Action Pills take most of the Button component's props as they also act as a button.
 * Info Pills, on the other hand, have their own set of props mostly for customization purpose.
 * @example
 * ```tsx
 * // Action pill
 *    <Pill
        type="action"
        label='This is an action pill'
        active={true}
        icon={<XMarkIcon />}
        iconDirection="right"
        onPillClick={clickHandler}
      />
  // Info pill
      <Pill
        type='info'
        label='This is an info pill'
        background='blue'
        borderColor='success'
        customStyle='w-20'
      />
 * ```
 **/
const Pill: React.FC<PillProps> = props => {
  if (props.type === 'info') {
    const { borderColor, background, color, label, weight, customStyle, customTextStyle } = props;

    const borderStyle = borderColor ? `border ${getColorClasses(borderColor, 'border')}` : '';
    return (
      <Stack
        align="center"
        justify="center"
        background={background}
        customStyle={`min-h-min min-w-min rounded-full py-1 px-2 ${borderStyle} ${customStyle}`}
      >
        <Text
          variant="footnotes2"
          selectable={false}
          weight={weight}
          color={color}
          customStyle={customTextStyle}
        >
          {label}
        </Text>
      </Stack>
    );
  }

  return <ActionPill {...props} />;
};

const ActionPill: React.FC<ActionPillProps> = props => {
  const { label, size, active, hover, icon, iconDirection, loading, customStyle, onPillClick } =
    props;
  const [showHover, setShowHover] = useState(false);
  const handlePillClick = () => {
    if (onPillClick) {
      onPillClick(!active);
    }
  };
  return (
    <Button
      aria-label="dismiss"
      hover={false}
      label={label}
      size={size}
      icon={showHover && hover ? hover.icon : icon}
      iconDirection={iconDirection}
      active={showHover && hover ? hover.active : active}
      loading={loading}
      customStyle={customStyle}
      onMouseEnter={() => setShowHover(true)}
      onMouseLeave={() => setShowHover(false)}
      onClick={handlePillClick}
    />
  );
};

export default Pill;
