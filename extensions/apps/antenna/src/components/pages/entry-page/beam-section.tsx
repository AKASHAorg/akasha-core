import React, { ReactElement, useState } from 'react';
import { EditorPlaceholder } from '@akashaorg/ui-lib-feed';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import BeamCard from '@akashaorg/ui-lib-feed/lib/components/cards/beam-card';
import routes, { REFLECT } from '../../../routes';
import { ReflectEditorProps } from '../../reflect-editor';
import { useTranslation } from 'react-i18next';
import { transformSource } from '@akashaorg/ui-core-hooks';
import { useRouterState } from '@tanstack/react-router';
import { GetBeamByIdQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { selectBeamId } from '@akashaorg/ui-core-hooks/lib/selectors/get-beam-by-id-query';

export type BeamSectionProps = {
  isActive: boolean;
  beamData: GetBeamByIdQuery;
  isLoggedIn: boolean;
  showNSFWCard: boolean;
  renderEditor: (props: ReflectEditorProps) => ReactElement;
  showLoginModal: (title?: string, message?: string) => void;
};

const BeamSection: React.FC<BeamSectionProps> = props => {
  const { isActive, beamData, isLoggedIn, showNSFWCard, renderEditor, showLoginModal } = props;
  const { t } = useTranslation('app-antenna');
  const routerState = useRouterState();
  const [isReflecting, setIsReflecting] = useState(
    routerState.location.pathname.endsWith(routes[REFLECT]),
  );

  const beamId = selectBeamId(beamData);

  return (
    <Stack
      data-testid="beam-section"
      spacing={2}
      className={`min-h-[inherit] ${isActive ? 'mb-2' : ''}`}
    >
      <Stack className="grow">
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
        {isActive && <Divider />}
      </Stack>
      {isActive && (
        <Stack className="px-2 mt-auto">
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
          {isLoggedIn &&
            renderEditor({
              beamId: beamId,
              reflectToId: beamId,
              showEditor: isReflecting,
              setShowEditor: setIsReflecting,
            })}
        </Stack>
      )}
    </Stack>
  );
};

export default BeamSection;
