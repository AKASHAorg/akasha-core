import React from 'react';
import EditorPlaceholder from '@akashaorg/design-system-components/lib/components/EditorPlaceholder';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ReflectEditor from '../../reflect-editor';
import ReflectionCard from '@akashaorg/ui-lib-feed/lib/components/cards/reflection-card';
import routes, { REFLECT } from '../../../routes';
import { AkashaReflect } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { useTranslation } from 'react-i18next';
import { useCloseActions } from '@akashaorg/design-system-core/lib/utils';
import { EntityTypes, IContentClickDetails } from '@akashaorg/typings/lib/ui';
import { useLocation } from 'react-router-dom';

type ReflectionSectionProps = {
  beamId: string;
  reflectionId: string;
  entryData: AkashaReflect;
  isLoggedIn: boolean;
  onNavigate: (details: IContentClickDetails, itemType: EntityTypes) => void;
  showLoginModal: () => void;
};

const ReflectionSection: React.FC<ReflectionSectionProps> = props => {
  const { beamId, reflectionId, entryData, isLoggedIn, onNavigate, showLoginModal } = props;
  const { t } = useTranslation('app-akasha-integration');
  const location = useLocation();

  const wrapperRef = useCloseActions(() => {
    onNavigate({ authorId: entryData?.author?.id, id: entryData?.id }, EntityTypes.REFLECT);
  });

  return (
    <Stack spacing="gap-y-2" ref={wrapperRef}>
      <ReflectionCard
        entryData={entryData}
        noWrapperCard={true}
        contentClickable={false}
        onReflect={() => {
          onNavigate(
            {
              authorId: entryData?.author?.id,
              id: entryData?.id,
              reflect: !location.pathname.includes(routes[REFLECT]),
            },
            EntityTypes.REFLECT,
          );
        }}
      />
      <Divider />
      <Stack padding="px-2 pb-2">
        {!isLoggedIn && (
          <EditorPlaceholder
            onClick={showLoginModal}
            profileId={null}
            actionLabel={t('Reflect')}
            placeholderLabel={t('Share your thoughts')}
          />
        )}
        {isLoggedIn && entryData?.active && (
          <ReflectEditor
            beamId={beamId}
            reflectToId={reflectionId}
            showEditorInitialValue={location.pathname.endsWith(routes[REFLECT])}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default ReflectionSection;
