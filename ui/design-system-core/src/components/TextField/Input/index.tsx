import React from 'react';
import Icon from '../../Icon';
import { apply, tw } from '@twind/core';
import { getContainerClasses } from './getContainerClasses';
import { getIconClasses } from './getIconClasses';
import { getInputClasses } from './getInputClasses';
import { InputProps } from '../types';

export const Input: React.FC<InputProps> = ({
  id,
  name,
  value,
  status,
  iconLeft,
  iconRight,
  disabled,
  onChange,
}) => {
  const containerStyle = getContainerClasses(disabled, status);
  const inputStyle = getInputClasses(disabled);
  const iconStyle = getIconClasses(disabled, status);

  return (
    <div
      className={tw(apply(containerStyle))}
      /* @TODO: Replace with stack component */
    >
      <input
        id={id}
        name={name}
        type="text"
        value={value}
        className={tw(apply(inputStyle))}
        disabled={disabled}
        onChange={onChange}
      />
      {iconLeft && <Icon icon={iconLeft} styling={tw(apply(`${iconStyle} order-first`))} />}
      {iconRight && <Icon icon={iconRight} styling={tw(apply(iconStyle))} />}
    </div>
  );
};
