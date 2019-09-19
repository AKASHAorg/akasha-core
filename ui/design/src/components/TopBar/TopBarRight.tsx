import React from 'react';
import styled from 'styled-components';
import Balance from './Balance';

export interface TopBarRightProps {
  balance: boolean;
  cyclingStates: object;
  hasPendingActions?: boolean;
  loggedProfile?: object;
  loggedProfileData?: object;
  notificationsLoaded?: boolean;
  notificationsPanelOpen?: boolean;
  showNotificationsPanel: boolean;
  showTransactionsLog: boolean;
  showWallet?: string;
  toggleAethWallet: () => {};
  toggleEthWallet: () => {};
  toggleGuestModal: () => {};
  transactionsLogOpen?: boolean;
  unreadNotifications: number;
  unlocked?: boolean;
}

const TopBarRightWrapper = styled.div`
  display: flex;
  flex: 0 0 auto;
  height: 100%;
  border-left: 1px solid @light-border;
  padding-left: 12px;

  &__services {
    flex: 0 0 auto;
    display: flex;
  }

  &__divider {
    margin: 0 10px;
    width: 2px;
    background-color: @light-background;
  }

  &__icon-wrapper {
    position: relative;
    flex: 0 0 auto;
    margin-right: 10px;
  }

  &__notifications-icon {
    height: 20px;
    width: 20px;
    stroke: @text-color !important;

    &_selected {
      stroke: @heading-color !important;
    }
  }

  &__activity-icon {
    stroke: initial !important;
    width: 18px;
    height: 16px;
    path {
      fill: @text-color;
    }

    &_selected path {
      fill: @heading-color;
    }
  }

  &__pending-indicator {
    position: absolute;
    top: 12px;
    right: 0;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: @primary-color;
    cursor: pointer;
  }

  &__cycled-indicator {
    position: absolute;
    top: 11px;
    right: 8px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: @primary-color;
    cursor: pointer;
  }

  &__notifications-indicator {
    position: absolute;
    top: 8px;
    right: 0;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background-color: @error-color;
    color: @text-color-dark;
    font-size: 9px;
    cursor: pointer;
  }

  &__balance {
    flex: 0 0 auto;
    margin-right: 12px;
    min-width: 60px;

    &_selected {
      color: @heading-color;
    }
  }

  &__guest {
    cursor: pointer;
    margin-right: 10px;
  }
`;

const TopBarRight: React.FC<TopBarRightProps> = props => {
  return (
    <TopBarRightWrapper>
      <Balance short={true} type="eth" />
    </TopBarRightWrapper>
  );
};

export default TopBarRight;
