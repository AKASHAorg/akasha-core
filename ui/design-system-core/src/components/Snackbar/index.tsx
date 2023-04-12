import React from 'react';
import Icon from '../Icon';
import Text from '../Text';
import Button from '../Button';
import { tw, apply } from '@twind/core';
import { getColorLight, getColorDark } from './getColor';

export type snackBarType = 'alert' | 'caution' | 'success' | 'info';

export interface ISnackbar {
  title: string;
  description: string;
  actionButtonLabel?: string;
  type: snackBarType;
  handleButtonClick?: (event: React.SyntheticEvent<Element, Event>) => void;
  handleDismiss?: (event: React.SyntheticEvent<Element, Event>) => void;
}

const Snackbar: React.FC<ISnackbar> = ({
  title,
  description,
  type,
  //action button
  actionButtonLabel,
  handleButtonClick,
  handleDismiss,
}) => {
  const colorLight = getColorLight(type);
  const colorDark = getColorDark(type);

  const textcolor = { dark: 'white', light: 'black' };
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
          customStyle={`w-6 h-6 fill-${colorLight} dark:fill-${colorDark} stroke-white dark:stroke-black`}
        />
      </span>
      <div className={tw('w-11/12')}>
        <Text variant="button-md" color={textcolor}>
          {title}
        </Text>
        <Text variant="body2" color={textcolor}>
          {description}
        </Text>
        {actionButtonLabel && (
          <Button onClick={handleButtonClick} plain>
            <Text variant="button-md" color={{ light: `${colorLight}`, dark: `${colorDark}` }}>
              {actionButtonLabel}
            </Text>
          </Button>
        )}
      </div>
      <Button onClick={handleDismiss} customStyle="ml-2" plain={true} data-testid="dismiss-button">
        <Icon type="XMarkIcon" color="grey7" customStyle="w-4 h-4" />
      </Button>
    </div>
  );
};

export default Snackbar;
