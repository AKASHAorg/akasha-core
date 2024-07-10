import * as React from 'react';
import EditableReflection from './index';
import { hasOwn, mapReflectEntryData } from '@akashaorg/ui-awf-hooks';
import { useGetReflectionByIdQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import EntryCardLoading from '@akashaorg/design-system-components/lib/components/Entry/EntryCardLoading';

export type EditableReflectionResolverProps = {
  reflectID: string;
  onContentClick: () => void;
  onReflect: () => void;
};

export const EditableReflectionResolver = ({
  reflectID,
  onContentClick,
  onReflect,
}: EditableReflectionResolverProps) => {
  const reflectionReq = useGetReflectionByIdQuery({
    variables: {
      id: reflectID,
    },
    fetchPolicy: 'cache-first',
    skip: !reflectID,
  });

  if (reflectionReq.loading) return <EntryCardLoading noWrapperCard={true} />;

  const reflectionData =
    reflectionReq.data?.node && hasOwn(reflectionReq.data.node, 'id')
      ? reflectionReq.data.node
      : undefined;

  return (
    <React.Suspense>
      <EditableReflection
        reflectionData={mapReflectEntryData(reflectionData)}
        contentClickable={true}
        onContentClick={onContentClick}
        onReflect={onReflect}
      />
    </React.Suspense>
  );
};
