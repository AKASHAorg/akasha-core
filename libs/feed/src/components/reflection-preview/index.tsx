import React, { useState } from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import ReflectionCard from '../cards/reflection-card';
import { useGetReflectReflectionsQuery } from '@akashaorg/ui-core-hooks/lib/generated/apollo';
import { EntityTypes, IContentClickDetails } from '@akashaorg/typings/lib/ui';
import { useTranslation } from 'react-i18next';
import { NetworkErrorCard } from '../cards/network-error-card';

const MAXIMUM_REFLECTION_PREVIEWS = 2;

type ReflectionPreviewProps = {
  reflectionId: string;
  onNavigate: (details: IContentClickDetails, itemType: EntityTypes) => void;
};

const ReflectionPreview: React.FC<ReflectionPreviewProps> = props => {
  const { reflectionId, onNavigate } = props;
  const { t } = useTranslation('ui-lib-feed');
  const [reloadCount, setReloadCount] = useState(0);
  const reflectOfReflectionReq = useGetReflectReflectionsQuery({
    variables: { id: reflectionId, first: MAXIMUM_REFLECTION_PREVIEWS + 1 },
  });
  const reflections = reflectOfReflectionReq?.data?.akashaReflectIndex?.edges?.map(edge => ({
    ...edge.node,
    beam: null /*Note: the hook returns partial result for beam, if complete result is needed the result of the hook should be modified*/,
    beamID: edge.node.beam?.id,
  }));

  const leftBorderStyle = `border-l border-secondaryLight dark:border-secondaryDark`;

  if (reflectOfReflectionReq.error)
    return (
      <Card className="p-0 border-x-none border-r-none ml-4 mb-4 border border-l-secondary-foreground">
        <NetworkErrorCard
          title={t('Reflection can’t be loaded')}
          message={t('Unable to load reflection content. Click “Reload” to reload the reflection.')}
          reloadCount={reloadCount}
          onReload={async () => {
            setReloadCount(reloadCount + 1);
            await reflectOfReflectionReq.refetch();
          }}
        />
      </Card>
    );

  return (
    reflections?.length > 0 && (
      <Stack spacing="gap-y-1" customStyle="ml-4 mb-4">
        <Stack customStyle={leftBorderStyle}>
          {reflections.slice(0, MAXIMUM_REFLECTION_PREVIEWS).map(reflection => (
            <ReflectionCard
              key={reflection?.id}
              reflectionData={{
                id: reflection.id,
                active: reflection.active,
                authorId: reflection.author?.id,
                createdAt: reflection.createdAt,
                nsfw: reflection.nsfw,
                content: reflection.content,
                beamID: reflection.beamID,
              }}
              contentClickable={true}
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
            variant="link"
            onClick={() => onNavigate({ id: reflectionId, authorId: null }, EntityTypes.REFLECT)}
            className="mr-auto"
          >
            {t('View more')}
          </Button>
        )}
      </Stack>
    )
  );
};

export default ReflectionPreview;
