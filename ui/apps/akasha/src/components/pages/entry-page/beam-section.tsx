import React from 'react';
import EditorPlaceholder from '@akashaorg/design-system-components/lib/components/EditorPlaceholder';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import BeamCard from '@akashaorg/ui-lib-feed/lib/components/cards/beam-card';
import ReflectEditor from '../../reflect-editor';
import routes, { REFLECT } from '../../../routes';
import { AkashaBeam } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { useTranslation } from 'react-i18next';
import { useCloseActions } from '@akashaorg/design-system-core/lib/utils';
import { EntityTypes, IContentClickDetails, Profile } from '@akashaorg/typings/lib/ui';
import { useLocation } from 'react-router-dom';

type BeamSectionProps = {
  beamId: string;
  entryData: AkashaBeam;
  loggedProfileData: Profile;
  onNavigate: (details: IContentClickDetails, itemType: EntityTypes) => void;
  showLoginModal: () => void;
};

const BeamSection: React.FC<BeamSectionProps> = props => {
  const { beamId, entryData, loggedProfileData, onNavigate, showLoginModal } = props;
  const { t } = useTranslation('app-akasha-integration');
  const location = useLocation();

  const isLoggedIn = !!loggedProfileData.id;

  const wrapperRef = useCloseActions(() => {
    onNavigate({ authorId: entryData?.author?.id, id: entryData?.id }, EntityTypes.BEAM);
  });

  return (
    <Stack spacing="gap-y-2" ref={wrapperRef}>
      <BeamCard
        loggedProfileData={loggedProfileData}
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
          <ReflectEditor
            beamId={beamId}
            reflectToId={beamId}
            showEditorInitialValue={location.pathname.includes(routes[REFLECT])}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default BeamSection;
