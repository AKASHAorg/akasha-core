import * as React from 'react';
import { SidebarMenuItemProps } from '@akashaorg/design-system/lib/components/SideBar/sidebar-menu-item';
import { RootComponentProps } from '@akashaorg/typings/ui';

import DS from '@akashaorg/design-system';
const { Box, SidebarMenuItem } = DS;

type MenuItemPassedProps = {
  plugins?: RootComponentProps['plugins'];
};

export const MenuItem: React.FC<SidebarMenuItemProps & MenuItemPassedProps> = props => {
  const { menuItem } = props;
  const [notificationsCount, setNotificationsCount] = React.useState(0);
  React.useEffect(() => {
    let sub: { unsubscribe: () => void };
    if (props.plugins['@akashaorg/app-notifications']?.notification) {
      sub = props.plugins['@akashaorg/app-notifications'].notification.listen(menuItem.name, {
        next: (messages?: unknown[]) => {
          if (messages) {
            setNotificationsCount(messages.length);
          }
        },
      });
    }
    return () => {
      if (sub) {
        sub.unsubscribe();
      }
    };
  }, [props.plugins, menuItem]);

  return (
    <Box flex={true} direction="row">
      <SidebarMenuItem {...props} notificationsCount={notificationsCount ?? 0} />
    </Box>
  );
};
