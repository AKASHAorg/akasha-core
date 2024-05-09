import React, { useState } from 'react';
import EditorPlaceholder from '@akashaorg/design-system-components/lib/components/EditorPlaceholder';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ReflectEditor from '../../reflect-editor';
import EditableReflection from '@akashaorg/ui-lib-feed/lib/components/editable-reflection';
import routes, { REFLECT } from '../../../routes';
import { useTranslation } from 'react-i18next';
import { ReflectEntryData } from '@akashaorg/typings/lib/ui';
import { createReactiveVar, hasOwn, transformSource } from '@akashaorg/ui-awf-hooks';
import { useCloseActions } from '@akashaorg/design-system-core/lib/utils';
import { useRouterState } from '@tanstack/react-router';
import { usePendingReflections } from '@akashaorg/ui-awf-hooks/lib/use-pending-reflections';
import { PendingReflect } from '../../reflect-editor/pending-reflect';

type ReflectionSectionProps = {
  beamId: string;
  reflectionId: string;
  entryData: ReflectEntryData;
  isLoggedIn: boolean;
  pendingReflectionsVar: ReturnType<typeof createReactiveVar<ReflectEntryData[]>>;
  parentWrapperRef: React.MutableRefObject<unknown>;
  showLoginModal: (title?: string, message?: string) => void;
};

const ReflectionSection: React.FC<ReflectionSectionProps> = props => {
  const {
    beamId,
    reflectionId,
    entryData,
    isLoggedIn,
    pendingReflectionsVar,
    parentWrapperRef,
    showLoginModal,
  } = props;
  const { t } = useTranslation('app-antenna');
  const routerState = useRouterState();
  const [isReflecting, setIsReflecting] = useState(
    routerState.location.pathname.endsWith(routes[REFLECT]),
  );
  const { pendingReflections } = usePendingReflections(pendingReflectionsVar);

  useCloseActions(() => {
    setIsReflecting(false);
  }, parentWrapperRef);

  return (
    <Stack spacing="gap-y-2">
      <Stack>
        <EditableReflection
          entryData={entryData}
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
        <Divider />
      </Stack>
      <Stack padding="px-2">
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
        {isLoggedIn && entryData?.active && (
          <ReflectEditor
            beamId={beamId}
            reflectToId={reflectionId}
            showEditor={isReflecting}
            setShowEditor={setIsReflecting}
            pendingReflectionsVar={pendingReflectionsVar}
          />
        )}
      </Stack>
      {pendingReflections
        .filter(content => hasOwn(content, 'reflection') && content.reflection === reflectionId)
        .map((content, index) => (
          <PendingReflect key={`pending-${index}-${reflectionId}`} entryData={content} />
        ))}
    </Stack>
  );
};

export default ReflectionSection;
