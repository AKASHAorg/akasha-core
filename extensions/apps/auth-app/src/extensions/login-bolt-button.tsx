import * as React from 'react';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { BoltIcon } from 'lucide-react';
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
      {<BoltIcon className="h-5 w-5" />}
    </Button>
  );
};

export default withProviders(LoginBoltButton);
