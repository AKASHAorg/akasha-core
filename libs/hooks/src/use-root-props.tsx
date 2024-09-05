import * as React from 'react';
import { IRootComponentProps, IRootExtensionProps } from '@akashaorg/typings/lib/ui';
import { hasOwn } from './utils/has-own';

const RootComponentPropsContext = React.createContext(null);
const DEFAULT_TRANSLATION_PLUGIN = '@akashaorg/ui-widget-layout';

const RootComponentPropsProvider = ({
  children,
  ...props
}: IRootComponentProps | IRootExtensionProps) => {
  return (
    <RootComponentPropsContext.Provider value={props}>
      {children}
    </RootComponentPropsContext.Provider>
  );
};

/**
 * Hook to manage and access the context of the plugins for routing, translation, and extensions.
 * For example, through this hook, the `getRoutingPlugin`method can be used to
 * navigate between apps, or the `worldConfig` object can be used for accessing
 * the config info related to the World the whole application belongs to.
 * @example useRootComponentProps hook
 * ```typescript
 *   const { getTranslationPlugin, baseRouteName,getRoutingPlugin, navigateToModal, worldConfig } = useRootComponentProps();
 * ```
 */
const useRootComponentProps = <T extends IRootComponentProps>() => {
  const ctx = React.useContext<T>(RootComponentPropsContext);

  const getTranslationPlugin = React.useCallback(
    (ns = DEFAULT_TRANSLATION_PLUGIN): { i18n: IRootComponentProps['i18next'] } => {
      if (hasOwn(ctx?.plugins, ns)) {
        return ctx?.plugins[ns].translation;
      }
      console.warn('Translation plugin not available yet!');
      return { i18n: null };
    },
    [ctx?.plugins],
  );

  const getCorePlugins = React.useCallback(() => {
    return ctx.plugins.core;
  }, [ctx.plugins]);

  const getContext = React.useCallback(() => ctx, [ctx]);

  return {
    getTranslationPlugin,
    getCorePlugins,
    getContext,
    ...ctx,
  };
};

export { RootComponentPropsProvider, useRootComponentProps };
