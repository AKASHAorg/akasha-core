import * as React from 'react';
import { RootComponentProps, RootExtensionProps } from '@akashaorg/typings/lib/ui';
import { hasOwn } from './utils/has-own';

const RootComponentPropsContext = React.createContext(null);
const DEFAULT_ROUTING_PLUGIN = '@akashaorg/app-routing';
const DEFAULT_TRANSLATION_PLUGIN = '@akashaorg/ui-widget-layout';
const DEFAULT_EXTENSIONS_PLUGIN = '@akashaorg/app-extensions';

const RootComponentPropsProvider = ({
  children,
  ...props
}: RootComponentProps | RootExtensionProps) => {
  return (
    <RootComponentPropsContext.Provider value={props}>
      {children}
    </RootComponentPropsContext.Provider>
  );
};

const useRootComponentProps = <T extends RootComponentProps>() => {
  const ctx = React.useContext<T>(RootComponentPropsContext);
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
    (ns = DEFAULT_TRANSLATION_PLUGIN): { i18n: RootComponentProps['i18next'] } => {
      if (hasOwn(ctx?.plugins, ns)) {
        return ctx?.plugins[ns].translation;
      }
      console.warn('Translation plugin not available yet!');
      return { i18n: null };
    },
    [ctx?.plugins],
  );

  const getExtensionsPlugin = React.useCallback(() => {
    if (hasOwn(ctx?.plugins, DEFAULT_EXTENSIONS_PLUGIN)) {
      return ctx.plugins[DEFAULT_EXTENSIONS_PLUGIN];
    }
    console.warn('Extension plugin not available yet!');
    return {};
  }, [ctx?.plugins]);

  const getContext = React.useCallback(() => ctx, [ctx]);

  return {
    getRoutingPlugin,
    getTranslationPlugin,
    getExtensionsPlugin,
    getContext,
    ...ctx,
  };
};

export { RootComponentPropsProvider, useRootComponentProps };
