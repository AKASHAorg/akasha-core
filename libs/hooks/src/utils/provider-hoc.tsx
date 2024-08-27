import * as React from 'react';
import { AnalyticsProvider } from '../use-analytics';
import { IRootComponentProps } from '@akashaorg/typings/lib/ui';
import { RootComponentPropsProvider } from '../use-root-props';
import { ApolloProvider } from '@apollo/client';
import getSDK from '@akashaorg/core-sdk';

/**
 * Higher order component that wraps a component with all necessary providers
 */
export const withProviders = <T extends IRootComponentProps>(
  WrappedComponent: React.ComponentType<T>,
) => {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'WrappedHOComponent';
  const apolloClient = getSDK().services.gql.queryClient;
  const ComponentWithProviders = (props: T) => {
    return (
      <ApolloProvider client={apolloClient}>
        <AnalyticsProvider {...props}>
          <RootComponentPropsProvider {...props}>
            <WrappedComponent {...props} />
          </RootComponentPropsProvider>
        </AnalyticsProvider>
      </ApolloProvider>
    );
  };

  ComponentWithProviders.displayName = `withProviders(${displayName})`;

  return ComponentWithProviders;
};
