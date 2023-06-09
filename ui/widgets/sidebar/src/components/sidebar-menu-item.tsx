import * as React from 'react';
import { SidebarMenuItemProps } from '@akashaorg/design-system/lib/components/SideBar/sidebar-menu-item';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { LoginState } from '@akashaorg/ui-awf-hooks';
import DS from '@akashaorg/design-system';
import { IMessage } from '@akashaorg/typings/sdk';
const { Box, SidebarMenuItem } = DS;

type MenuItemPassedProps = {
  plugins?: RootComponentProps['plugins'];
  profileId?: string;
};

export const MenuItem: React.FC<SidebarMenuItemProps & MenuItemPassedProps> = props => {
  const { menuItem, profileId } = props;

  const [notificationsCount, setNotificationsCount] = React.useState(0);

  React.useEffect(() => {
    let notifSub: { unsubscribe: () => void };
    if (props.plugins['@akashaorg/app-notifications']?.notification) {
      notifSub = props.plugins['@akashaorg/app-notifications'].notification.listen(menuItem.name, {
        next: (messages?: IMessage[]) => {
          if (messages) {
            const fromOthers = messages.filter(msg => msg.from !== profileId);
            setNotificationsCount(fromOthers.length);
          }
        },
      });
    }
    return () => {
      if (notifSub) {
        notifSub.unsubscribe();
      }
    };
  }, [props.plugins, menuItem, profileId]);

  return (
    <Box flex={true} direction="row">
      <SidebarMenuItem {...props} notificationsCount={notificationsCount ?? 0} />
    </Box>
  );
};
