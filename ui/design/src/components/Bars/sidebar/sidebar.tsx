import * as React from 'react';
import { AppsSection } from './apps-section';
import { SidebarBox } from './styled-sidebar';
import { UserSection } from './user-section';

export interface ISidebarProps {
  ethAddress: string;
  avatarImage?: string;
  notifications?: INotification[];
  installedApps?: IApp[];
  aboutLabel: string;
  feedLabel: string;
  collectionsLabel: string;
}

export interface IApp {
  name: string;
  image?: string;
  ethAddress: string;
}

export interface INotification {
  ethAddress: string;
  user?: string;
  userAvatar?: string;
  time: string;
  action: string;
}

const Sidebar: React.FC<ISidebarProps> = props => {
  const {
    avatarImage,
    ethAddress,
    notifications,
    installedApps,
    aboutLabel,
    feedLabel,
    collectionsLabel,
  } = props;

  const onClickAddApp = () => {
    return;
  };

  return (
    <SidebarBox
      fill="vertical"
      direction="column"
      align="center"
      border={{
        color: 'border',
        size: 'xsmall',
        style: 'solid',
        side: 'right',
      }}
    >
      <UserSection
        avatarImage={avatarImage}
        ethAddress={ethAddress}
        notifications={notifications}
      />
      <AppsSection
        installedApps={installedApps}
        onClickAddApp={onClickAddApp}
        aboutLabel={aboutLabel}
        feedLabel={feedLabel}
        collectionsLabel={collectionsLabel}
      />
    </SidebarBox>
  );
};

export { Sidebar };
