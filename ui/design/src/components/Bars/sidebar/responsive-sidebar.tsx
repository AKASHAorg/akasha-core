import * as React from 'react';
import { useViewportSize } from '../../Providers/viewport-dimension';
import { Sidebar, SidebarMobile } from '../index';
import { ISidebarProps } from './sidebar';

const ResponsiveSidebar: React.FC<ISidebarProps> = props => {
  const {
    ethAddress,
    installedApps,
    onClickAddApp,
    onClickOption,
    onClickSearch,
    onClickCloseSidebar,
    searchLabel,
    appCenterLabel,
  } = props;
  const { size } = useViewportSize();

  return (
    <>
      {size === 'small' ? (
        <SidebarMobile
          onClickAddApp={onClickAddApp}
          onClickOption={onClickOption}
          onClickSearch={onClickSearch}
          onClickCloseSidebar={onClickCloseSidebar}
          searchLabel={searchLabel}
          appCenterLabel={appCenterLabel}
          installedApps={installedApps}
          ethAddress={ethAddress}
        />
      ) : (
        <Sidebar
          onClickAddApp={onClickAddApp}
          onClickOption={onClickOption}
          onClickSearch={onClickSearch}
          onClickCloseSidebar={onClickCloseSidebar}
          searchLabel={searchLabel}
          appCenterLabel={appCenterLabel}
          installedApps={installedApps}
          ethAddress={ethAddress}
        />
      )}
    </>
  );
};

export { ResponsiveSidebar };
