import React, { useState } from 'react';
import EditorPlaceholder from '@akashaorg/design-system-components/lib/components/EditorPlaceholder';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ReflectEditor from '../../reflect-editor';
import EditableReflection from '@akashaorg/ui-lib-feed/lib/components/editable-reflection';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import routes, { REFLECT } from '../../../routes';
import { useTranslation } from 'react-i18next';
import { ReflectionData } from '@akashaorg/typings/lib/ui';
import { hasOwn, transformSource } from '@akashaorg/ui-awf-hooks';
import { useRouterState } from '@tanstack/react-router';
import { useGetBeamByIdQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

type ReflectionSectionProps = {
  beamId: string;
  reflectionId: string;
  reflectionData: ReflectionData;
  isLoggedIn: boolean;
  showLoginModal: (title?: string, message?: string) => void;
};

const ReflectionSection: React.FC<ReflectionSectionProps> = props => {
  const { beamId, reflectionId, reflectionData, isLoggedIn, showLoginModal } = props;
  const { t } = useTranslation('app-antenna');
  const routerState = useRouterState();
  const [isReflecting, setIsReflecting] = useState(
    routerState.location.pathname.endsWith(routes[REFLECT]),
  );

  const { data: beamData } = useGetBeamByIdQuery({
    variables: { id: beamId },
    skip: !beamId,
  });

  const activeParentBeam =
    beamData && hasOwn(beamData.node, 'active') ? beamData.node.active : false;
  const activeReflection = activeParentBeam ? reflectionData?.active : false;

  return (
    <Stack
      dataTestId="reflection-section"
      spacing="gap-y-2"
      customStyle={`grow ${activeReflection ? 'mb-2' : ''}`}
    >
      <Card customStyle="grow" type="plain">
        <EditableReflection
          reflectionData={reflectionData}
          contentClickable={false}
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
        {activeReflection && <Divider />}
      </Card>
      {activeReflection && (
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
              reflectToId={reflectionId}
              showEditor={isReflecting}
              setShowEditor={setIsReflecting}
            />
          )}
        </Stack>
      )}
    </Stack>
  );
};

export default ReflectionSection;
