import * as React from 'react';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { BoltIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { useRootComponentProps, withProviders } from '@akashaorg/ui-core-hooks';

const LoginBoltButton = () => {
  const { getCorePlugins } = useRootComponentProps();
  const navigateTo = React.useRef(getCorePlugins().routing.navigateTo);

  const onLoginClick = React.useCallback(() => {
    navigateTo.current({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: () => '/',
    });
  }, []);

  return (
    <Button
      onClick={onLoginClick}
      variant="outline"
      size="icon"
      className="md:invisible" // show only on mobile screens
    >
      {<BoltIcon />}
    </Button>
  );
};

export default withProviders(LoginBoltButton);
