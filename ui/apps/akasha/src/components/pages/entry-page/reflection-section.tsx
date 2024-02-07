import React, { useRef } from 'react';
import EditorPlaceholder from '@akashaorg/design-system-components/lib/components/EditorPlaceholder';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ReflectEditor from '../../reflect-editor';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import EditableReflection from '@akashaorg/ui-lib-feed/lib/components/editable-reflection';
import routes, { REFLECT } from '../../../routes';
import { useTranslation } from 'react-i18next';
import { useCloseActions } from '@akashaorg/design-system-core/lib/utils';
import { ReflectEntryData } from '@akashaorg/typings/lib/ui';
import { useLocation } from 'react-router-dom';
import { transformSource, useRootComponentProps } from '@akashaorg/ui-awf-hooks';

type ReflectionSectionProps = {
  beamId: string;
  reflectionId: string;
  entryData: ReflectEntryData;
  isLoggedIn: boolean;
  showLoginModal: () => void;
};

const ReflectionSection: React.FC<ReflectionSectionProps> = props => {
  const { beamId, reflectionId, entryData, isLoggedIn, showLoginModal } = props;
  const { t } = useTranslation('app-akasha-integration');
  const { getRoutingPlugin } = useRootComponentProps();
  const location = useLocation();
  const navigateTo = getRoutingPlugin().navigateTo;
  const pendingReflectRef = useRef(null);

  const onNavigate = (reflectionId: string, reflect?: boolean) => {
    navigateTo(
      {
        appName: '@akashaorg/app-akasha-integration',
        getNavigationUrl: navRoutes =>
          `${navRoutes.Reflect}/${reflectionId}${reflect ? navRoutes.Reflect : ''}`,
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
          <EditableReflection
            entryData={entryData}
            contentClickable={false}
            reflectToId={entryData.id}
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
              reflectToId={reflectionId}
              showEditorInitialValue={isReflecting}
              pendingReflectRef={pendingReflectRef}
            />
          )}
        </Stack>
      </Stack>
      <Card ref={pendingReflectRef} type="plain" />
    </Stack>
  );
};

export default ReflectionSection;
