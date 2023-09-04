import * as React from 'react';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { hasOwn } from './utils/has-own';

const RootComponentPropsContext = React.createContext(null);
const DEFAULT_ROUTING_PLUGIN = '@akashaorg/app-routing';
const DEFAULT_TRANSLATION_PLUGIN = '@akashaorg/app-translation';

const RootComponentPropsProvider = ({
  children,
  ...props
}: RootComponentProps & { children: React.ReactNode }) => {
  return (
    <RootComponentPropsContext.Provider value={props}>
      {children}
    </RootComponentPropsContext.Provider>
  );
};

const useRootComponentProps = () => {
  const ctx = React.useContext<RootComponentProps>(RootComponentPropsContext);

  const getRoutingPlugin = React.useCallback(
    (ns = DEFAULT_ROUTING_PLUGIN) => {
      if (hasOwn(ctx?.plugins, ns)) {
        return ctx?.plugins[ns].routing;
      }
      console.warn('Routing plugin not available yet');
      return {};
    },
    [ctx?.plugins],
  );

  const getTranslationPlugin = React.useCallback(
    (ns = DEFAULT_TRANSLATION_PLUGIN) => {
      if (hasOwn(ctx?.plugins, ns)) {
        return ctx?.plugins[ns].translation;
      }
      console.warn('Translation plugin not available yet!');
      return {};
    },
    [ctx?.plugins],
  );

  return {
    getRoutingPlugin,
    getTranslationPlugin,
    ...ctx,
  };
};

export { RootComponentPropsProvider, useRootComponentProps };
