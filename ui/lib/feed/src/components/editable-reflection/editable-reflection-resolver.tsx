import * as React from 'react';
import EditableReflection from './index';
import { hasOwn, mapReflectEntryData, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useGetReflectionByIdSuspenseQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

export type EditableReflectionResolverProps = {
  reflectID: string;
  beamID: string;
};

export const EditableReflectionResolver = (props: EditableReflectionResolverProps) => {
  const reflectionQuery = useGetReflectionByIdSuspenseQuery({
    variables: {
      id: props.reflectID,
    },
  });

  const { getRoutingPlugin } = useRootComponentProps();

  return (
    <React.Suspense>
      <EditableReflection
        entryData={mapReflectEntryData(
          hasOwn(reflectionQuery.data?.node, 'id') ? reflectionQuery.data.node : undefined,
        )}
        reflectToId={
          mapReflectEntryData(
            hasOwn(reflectionQuery.data?.node, 'id') ? reflectionQuery.data.node : undefined,
          ).id
        }
        contentClickable={true}
        onContentClick={() => {
          if (hasOwn(reflectionQuery.data?.node, 'id')) {
            const reflectionId = reflectionQuery.data.node.id;
            return getRoutingPlugin().navigateTo({
              appName: '@akashaorg/app-akasha-integration',
              getNavigationUrl: navRoutes => `${navRoutes.Reflection}/${reflectionId}`,
            });
          }
        }}
        onReflect={() => {
          if (hasOwn(reflectionQuery.data?.node, 'id')) {
            const reflectionId = reflectionQuery.data.node.id;
            getRoutingPlugin().navigateTo({
              appName: '@akashaorg/app-akasha-integration',
              getNavigationUrl: navRoutes =>
                `${navRoutes.Reflection}/${reflectionId}${navRoutes.Reflect}`,
            });
          }
        }}
      />
    </React.Suspense>
  );
};
