import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import EditableReflection from '../editable-reflection';
import { useGetReflectReflectionsQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { EntityTypes, IContentClickDetails } from '@akashaorg/typings/lib/ui';
import { useTranslation } from 'react-i18next';
import { getColorClasses } from '@akashaorg/design-system-core/lib/utils';
import { mapReflectEntryData } from '@akashaorg/ui-awf-hooks';

const MAXIMUM_REFLECTION_PREVIEWS = 2;

type ReflectionPreviewProps = {
  reflectionId: string;
  onNavigate: (details: IContentClickDetails, itemType: EntityTypes) => void;
};

const ReflectionPreview: React.FC<ReflectionPreviewProps> = props => {
  const { reflectionId, onNavigate } = props;
  const { t } = useTranslation('ui-lib-feed');
  const { data: reflectOfReflectionReq } = useGetReflectReflectionsQuery({
    variables: { id: reflectionId, first: MAXIMUM_REFLECTION_PREVIEWS + 1 },
  });

  const reflections = reflectOfReflectionReq?.akashaReflectIndex?.edges?.map(edge => ({
    ...edge.node,
    beam: null /*Note: the hook returns partial result for beam, if complete result is needed the result of the hook should be modified*/,
    beamID: edge.node.beam?.id,
  }));

  const leftBorderStyle = `border-l ${getColorClasses(
    { light: 'secondaryLight', dark: 'secondaryDark' },
    'border',
  )}`;

  return (
    reflections?.length > 0 && (
      <Stack spacing="gap-y-1" customStyle="ml-4">
        <Stack customStyle={leftBorderStyle}>
          {reflections.slice(0, MAXIMUM_REFLECTION_PREVIEWS).map(reflection => (
            <EditableReflection
              key={reflection?.id}
              entryData={mapReflectEntryData(reflection)}
              contentClickable={true}
              reflectToId={reflectionId}
              hover={true}
              onReflect={() => {
                onNavigate(
                  {
                    authorId: reflection?.author.id,
                    id: reflection?.id,
                    reflect: true,
                  },
                  EntityTypes.REFLECT,
                );
              }}
              onContentClick={() =>
                onNavigate(
                  { authorId: reflection?.author.id, id: reflection.id },
                  EntityTypes.REFLECT,
                )
              }
            />
          ))}
        </Stack>
        {reflections.length > MAXIMUM_REFLECTION_PREVIEWS && (
          <Button
            variant="text"
            label={t('View more')}
            onClick={() => onNavigate({ id: reflectionId, authorId: null }, EntityTypes.REFLECT)}
            customStyle="mr-auto"
          />
        )}
      </Stack>
    )
  );
};

export default ReflectionPreview;
