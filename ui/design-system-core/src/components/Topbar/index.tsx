import React from 'react';
import { apply, tw } from '@twind/core';
import Button from '../Button';
import Icon from '../Icon';
import { isMobileOnly } from 'react-device-detect';

export interface ITopbarProps {
  // data
  versionURL?: string;
  hasNewNotifications?: boolean;
  currentLocation?: string;
  // sidebar
  sidebarVisible: boolean;
  // handlers
  onSidebarToggle?: () => void;
  onBackClick: () => void;
  onAppCenterClick: () => void;
  onBrandClick?: () => void;
  onNotificationClick: () => void;
  // external css
  className?: string;
  modalSlotId: string;
}

const Topbar: React.FC<ITopbarProps> = props => {
  const {
    className = '',
    sidebarVisible,
    onSidebarToggle,
    onBrandClick,
    onAppCenterClick,
    onNotificationClick,
    onBackClick,
    hasNewNotifications,
    modalSlotId,
  } = props;

  const iconSize = isMobileOnly ? 'small' : 'regular';
  const BaseStyles = apply`
    flex justify-between items-center
    py-2 px-2 space-x-4 w-full
    border(1 grey8) rounded-md shadow-sm
    `;

  const InstanceStyles = apply`
  ${BaseStyles}
  ${className}
  `;

  return (
    <div className={tw(InstanceStyles)}>
      <div className={tw('flex space-x-2')}>
        {isMobileOnly ? (
          <Button
            iconOnly={true}
            noBorder={true}
            icon="ArrowRightOnRectangleIcon"
            size={iconSize}
            onClick={onSidebarToggle}
          />
        ) : (
          <Button iconOnly={true} noBorder={true} icon="ArrowLeftOnRectangleIcon" size={iconSize} />
        )}
        <Button
          iconOnly={true}
          noBorder={true}
          icon="ChevronLeftIcon"
          size={iconSize}
          onClick={onBackClick}
        />
      </div>

      <div className={tw('p-0 m-0 cursor-pointer')} onClick={onBrandClick}>
        <Icon icon="TopbarLogo" styling="w-18 h-8" />
      </div>

      <div className={tw('flex space-x-2')}>
        <Button
          iconOnly={true}
          noBorder={true}
          icon="AppCenter"
          size={iconSize}
          onClick={onAppCenterClick}
        />
        <Button
          iconOnly={true}
          noBorder={true}
          icon={hasNewNotifications ? 'BellAlertIcon' : 'BellIcon'}
          size={iconSize}
          onClick={onNotificationClick}
        />
      </div>
    </div>
  );
};

Topbar.defaultProps = {
  onBackClick: () => {
    return;
  },
  onBrandClick: () => {
    return;
  },
};

export default Topbar;
