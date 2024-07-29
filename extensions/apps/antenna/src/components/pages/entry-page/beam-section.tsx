import React, { useState } from 'react';
import EditorPlaceholder from '@akashaorg/design-system-components/lib/components/EditorPlaceholder';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import BeamCard from '@akashaorg/ui-lib-feed/lib/components/cards/beam-card';
import ReflectEditor from '../../reflect-editor';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import routes, { REFLECT } from '../../../routes';
import { useTranslation } from 'react-i18next';
import { BeamData } from '@akashaorg/typings/lib/ui';
import { transformSource } from '@akashaorg/ui-awf-hooks';
import { useRouterState } from '@tanstack/react-router';

type BeamSectionProps = {
  beamId: string;
  beamData: BeamData;
  isLoggedIn: boolean;
  showNSFWCard: boolean;
  showLoginModal: (title?: string, message?: string) => void;
};

const BeamSection: React.FC<BeamSectionProps> = props => {
  const { beamId, beamData, isLoggedIn, showNSFWCard, showLoginModal } = props;
  const { t } = useTranslation('app-antenna');
  const routerState = useRouterState();
  const [isReflecting, setIsReflecting] = useState(
    routerState.location.pathname.endsWith(routes[REFLECT]),
  );
  const activeBeam = beamData?.active;

  return (
    <Stack
      dataTestId="beam-section"
      spacing="gap-y-2"
      customStyle={`grow ${activeBeam ? 'mb-2' : ''}`}
    >
      <Card customStyle="grow" type="plain">
        <BeamCard
          beamData={beamData}
          noWrapperCard={true}
          contentClickable={false}
          showHiddenContent={true}
          showNSFWCard={showNSFWCard}
          showLoginModal={showLoginModal}
          onReflect={() => {
            if (!isLoggedIn) {
              showLoginModal(
                'Member Only Feature',
                'You need to connect first to be able to use this feature.',
              );
              return;
            }
            setIsReflecting(!isReflecting);
          }}
        />
        {activeBeam && <Divider />}
      </Card>
      {activeBeam && (
        <Stack padding="px-2" customStyle="mt-auto">
          {!isLoggedIn && (
            <EditorPlaceholder
              onClick={() =>
                showLoginModal(
                  'Member Only Feature',
                  'You need to connect first to be able to use this feature.',
                )
              }
              profileId={null}
              actionLabel={t('Reflect')}
              placeholderLabel={t('Share your thoughts')}
              transformSource={transformSource}
            />
          )}
          {isLoggedIn && (
            <ReflectEditor
              beamId={beamId}
              reflectToId={beamId}
              showEditor={isReflecting}
              setShowEditor={setIsReflecting}
            />
          )}
        </Stack>
      )}
    </Stack>
  );
};

export default BeamSection;
