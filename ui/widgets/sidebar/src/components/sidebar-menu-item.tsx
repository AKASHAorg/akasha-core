import * as React from 'react';
import { SidebarMenuItemProps } from '@akashaorg/design-system/lib/components/SideBar/sidebar-menu-item';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { LoginState } from '@akashaorg/ui-awf-hooks';
import DS from '@akashaorg/design-system';
import { IMessage } from '@akashaorg/typings/sdk';

const { Box, SidebarMenuItem } = DS;

type MenuItemPassedProps = {
  plugins?: RootComponentProps['plugins'];
  loginState?: LoginState;
};

export const MenuItem: React.FC<SidebarMenuItemProps & MenuItemPassedProps> = props => {
  const { menuItem, loginState } = props;

  const [notificationsCount, setNotificationsCount] = React.useState(0);

  React.useEffect(() => {
    let notifSub: { unsubscribe: () => void };
    let messagingSub: { unsubscribe: () => void };

    if (props.plugins['@akashaorg/app-notifications']?.notification) {
      notifSub = props.plugins['@akashaorg/app-notifications'].notification.listen(menuItem.name, {
        next: (messages?: unknown[]) => {
          if (messages) {
            setNotificationsCount(messages.length);
          }
        },
      });
    }

    if (props.plugins['@akashaorg/app-messaging']?.notification) {
      messagingSub = props.plugins['@akashaorg/app-messaging'].notification.listen(menuItem.name, {
        next: (messages?: IMessage[]) => {
          if (messages) {
            const fromOthers = messages.filter(msg => msg.from !== loginState.pubKey);
            setNotificationsCount(fromOthers.length);
          }
        },
      });
    }
    return () => {
      if (notifSub) {
        notifSub.unsubscribe();
      }
      if (messagingSub) {
        messagingSub.unsubscribe();
      }
    };
  }, [props.plugins, menuItem, loginState]);

  return (
    <Box flex={true} direction="row">
      <SidebarMenuItem {...props} notificationsCount={notificationsCount ?? 0} />
    </Box>
  );
};
