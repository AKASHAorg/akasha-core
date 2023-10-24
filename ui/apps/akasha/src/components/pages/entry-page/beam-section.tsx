import React from 'react';
import EditorPlaceholder from '@akashaorg/design-system-components/lib/components/EditorPlaceholder';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import BeamCard from '@akashaorg/ui-lib-feed/lib/components/cards/beam-card';
import { AkashaBeam } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { useTranslation } from 'react-i18next';
import { ReflectionEditor } from '../../reflection-editor';
import { useCloseActions } from '@akashaorg/design-system-core/lib/utils';
import { EntityTypes, IContentClickDetails } from '@akashaorg/typings/lib/ui';
import { useLocation } from 'react-router-dom';
import routes, { REFLECT } from '../../../routes';

type BeamSectionProps = {
  entryData: AkashaBeam;
  isLoggedIn: boolean;
  onNavigate: (details: IContentClickDetails, itemType: EntityTypes) => void;
  showLoginModal: () => void;
};

const BeamSection: React.FC<BeamSectionProps> = props => {
  const { entryData, isLoggedIn, onNavigate, showLoginModal } = props;
  const { t } = useTranslation('app-akasha-integration');
  const location = useLocation();

  const wrapperRef = useCloseActions(() => {
    onNavigate({ authorId: entryData?.author?.id, id: entryData?.id }, EntityTypes.BEAM);
  });

  return (
    <Stack spacing="gap-y-2" ref={wrapperRef}>
      <BeamCard
        entryData={entryData}
        noWrapperCard={true}
        contentClickable={false}
        onReflect={() => {
          if (location.pathname.includes(routes[REFLECT])) {
            onNavigate({ authorId: entryData?.author?.id, id: entryData?.id }, EntityTypes.BEAM);
            return;
          }

          onNavigate(
            { authorId: entryData?.author?.id, id: entryData?.id, reflect: true },
            EntityTypes.BEAM,
          );
        }}
      />
      <Divider />
      <Stack padding="px-2 pb-2">
        {!isLoggedIn && (
          <EditorPlaceholder
            onClick={showLoginModal}
            profileId={null}
            buttonLabel={t('Reflect')}
            placeholderLabel={t('Share your thoughts')}
          />
        )}
        {isLoggedIn && entryData?.active && (
          <ReflectionEditor
            beamId={entryData.id}
            action="reflect"
            showEditorInitialValue={location.pathname.includes(routes[REFLECT])}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default BeamSection;
