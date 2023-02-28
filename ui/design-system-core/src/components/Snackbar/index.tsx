import React from 'react';
import Icon from '../Icon';
import Text from '../Text';
import { tw, apply } from '@twind/core';
import { getColorLight, getColorDark } from './getColor';

export type snackBarType = 'alert' | 'caution' | 'success' | 'info';

export interface ISnackbar {
  title?: string;
  description?: string;
  actionButtonLabel?: string;
  type: snackBarType;
  handleButtonClick?: (event: React.SyntheticEvent<Element, Event>) => void;
  handleDismiss?: (event: React.SyntheticEvent<Element, Event>) => void;
}

const Snackbar: React.FC<ISnackbar> = ({
  title = 'Alert Title',
  description = 'Some important information will appear here.',
  type,
  //action button
  actionButtonLabel,
  handleButtonClick,
  handleDismiss,
}) => {
  const colorLight = getColorLight(type);
  const colorDark = getColorDark(type);

  const textcolor = 'text-black dark:text-white';
  const bgColor = 'bg-white dark:bg-grey1';

  const instanceStyle = apply`
  flex items-start px-5 py-4 w-full md:w-[592px]
  ${bgColor}
  rounded-md
  border(l-8 ${colorLight}) dark:border-${colorDark}
  shadow-sm
  `;
  return (
    <div className={tw(instanceStyle)}>
      <span className={tw('mr-2')}>
        <Icon
          type="InformationCircleIcon"
          color="red"
          styling={`w-6 h-6 fill-${colorLight} dark:fill-${colorDark} stroke-white dark:stroke-black`}
        />
      </span>
      <div className={tw('w-11/12')}>
        <Text variant="button-md" color={tw(textcolor)}>
          {title}
        </Text>
        <Text variant="body2" color={tw(textcolor)}>
          {description}
        </Text>
        {actionButtonLabel && (
          <span onClick={handleButtonClick} className={tw(`cursor-pointer`)}>
            <Text
              variant="button-md"
              color={{ light: `text-${colorLight}`, dark: `text-${colorDark}` }}
            >
              {actionButtonLabel}
            </Text>
          </span>
        )}
      </div>
      <span className={tw('ml-2')}>
        <Icon
          type="XMarkIcon"
          plain={true}
          color="grey7"
          styling="w-4 h-4"
          clickable={true}
          onClick={handleDismiss}
        />
      </span>
    </div>
  );
};

export default Snackbar;
