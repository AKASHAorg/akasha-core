import React from 'react';
import EditorPlaceholder from '@akashaorg/design-system-components/lib/components/EditorPlaceholder';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import BeamCard from '@akashaorg/ui-lib-feed/lib/components/cards/beam-card';
import ReflectEditor from '../../reflect-editor';
import routes, { REFLECT } from '../../../routes';
import { useTranslation } from 'react-i18next';
import { useCloseActions } from '@akashaorg/design-system-core/lib/utils';
import { BeamEntryData, type ReflectEntryData } from '@akashaorg/typings/lib/ui';
import { useLocation } from 'react-router-dom';
import { createReactiveVar, transformSource, useRootComponentProps } from '@akashaorg/ui-awf-hooks';

type BeamSectionProps = {
  beamId: string;
  entryData: BeamEntryData;
  isLoggedIn: boolean;
  showLoginModal: () => void;
  pendingReflectionsVar: ReturnType<typeof createReactiveVar<ReflectEntryData[]>>;
};

const BeamSection: React.FC<BeamSectionProps> = props => {
  const { beamId, entryData, isLoggedIn, showLoginModal, pendingReflectionsVar } = props;
  const { t } = useTranslation('app-akasha-integration');
  const { getRoutingPlugin } = useRootComponentProps();
  const location = useLocation();
  const navigateTo = getRoutingPlugin().navigateTo;

  const onNavigate = (beamId: string, reflect?: boolean) => {
    navigateTo(
      {
        appName: '@akashaorg/app-akasha-integration',
        getNavigationUrl: navRoutes =>
          `${navRoutes.Beam}/${beamId}${reflect ? navRoutes.Reflect : ''}`,
      },
      true,
    );
  };

  const wrapperRef = useCloseActions(() => {
    onNavigate(entryData?.id);
  });

  const isReflecting = location.pathname.endsWith(routes[REFLECT]);

  return (
    <Stack ref={wrapperRef}>
      <Stack spacing="gap-y-2">
        <Stack>
          <BeamCard
            entryData={entryData}
            noWrapperCard={true}
            contentClickable={false}
            showHiddenContent={true}
            onReflect={() => {
              onNavigate(entryData?.id, !isReflecting);
            }}
          />
          <Divider />
        </Stack>
        <Stack padding="px-2 pb-2">
          {!isLoggedIn && (
            <EditorPlaceholder
              onClick={showLoginModal}
              profileId={null}
              actionLabel={t('Reflect')}
              placeholderLabel={t('Share your thoughts')}
              transformSource={transformSource}
            />
          )}
          {isLoggedIn && entryData?.active && (
            <ReflectEditor
              beamId={beamId}
              reflectToId={beamId}
              showEditorInitialValue={isReflecting}
              pendingReflectionsVar={pendingReflectionsVar}
            />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default BeamSection;
