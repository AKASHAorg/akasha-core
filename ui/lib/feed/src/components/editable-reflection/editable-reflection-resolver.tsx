import * as React from 'react';
import EditableReflection from './index';
import { hasOwn, mapReflectEntryData, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useGetReflectionByIdQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import EntryCardLoading from '@akashaorg/design-system-components/lib/components/Entry/EntryCardLoading';

export type EditableReflectionResolverProps = {
  reflectID: string;
  beamID: string;
};

export const EditableReflectionResolver = (props: EditableReflectionResolverProps) => {
  const { getRoutingPlugin } = useRootComponentProps();

  const reflectionReq = useGetReflectionByIdQuery({
    variables: {
      id: props.reflectID,
    },
    fetchPolicy: 'cache-first',
    skip: !props.reflectID,
  });

  if (reflectionReq.loading) return <EntryCardLoading />;

  const entryData =
    reflectionReq.data?.node && hasOwn(reflectionReq.data.node, 'id')
      ? reflectionReq.data.node
      : undefined;

  return (
    <React.Suspense>
      <EditableReflection
        entryData={mapReflectEntryData(entryData)}
        reflectToId={mapReflectEntryData(entryData).id}
        contentClickable={true}
        onContentClick={() => {
          if (hasOwn(reflectionReq.data?.node, 'id')) {
            const reflectionId = reflectionReq.data.node.id;
            return getRoutingPlugin().navigateTo({
              appName: '@akashaorg/app-akasha-integration',
              getNavigationUrl: navRoutes => `${navRoutes.Reflection}/${reflectionId}`,
            });
          }
        }}
        onReflect={() => {
          if (hasOwn(reflectionReq.data?.node, 'id')) {
            const reflectionId = reflectionReq.data.node.id;
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
