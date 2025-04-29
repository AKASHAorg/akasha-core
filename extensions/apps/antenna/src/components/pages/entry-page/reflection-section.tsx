import React, { ReactElement, useState } from 'react';
import { EditorPlaceholder } from '@akashaorg/ui-lib-feed';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { ReflectEditorProps } from '../../reflect-editor';
import ReflectionCard from '@akashaorg/ui-lib-feed/lib/components/cards/reflection-card';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import routes, { REFLECT } from '../../../routes';
import { useTranslation } from 'react-i18next';
import { ReflectionData } from '@akashaorg/typings/lib/ui';
import { transformSource } from '@akashaorg/ui-core-hooks';
import { useRouterState } from '@tanstack/react-router';

export type ReflectionSectionProps = {
  isBeamActive: boolean;
  isActive: boolean;
  reflectionData: ReflectionData;
  isLoggedIn: boolean;
  renderEditor: (props: ReflectEditorProps) => ReactElement;
  showLoginModal: (title?: string, message?: string) => void;
};

const ReflectionSection: React.FC<ReflectionSectionProps> = props => {
  const { isBeamActive, isActive, reflectionData, isLoggedIn, renderEditor, showLoginModal } =
    props;
  const { t } = useTranslation('app-antenna');
  const routerState = useRouterState();
  const [isReflecting, setIsReflecting] = useState(
    routerState.location.pathname.endsWith(routes[REFLECT]),
  );

  const activeReflection = isBeamActive ? isActive : false;

  return (
    <Stack
      data-testid="reflection-section"
      spacing={2}
      className={`grow ${activeReflection ? 'mb-2' : ''}`}
    >
      <Card className="p-0 border-none grow">
        <ReflectionCard
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
              beamId: reflectionData.beamID,
              reflectToId: reflectionData.id,
              showEditor: isReflecting,
              setShowEditor: setIsReflecting,
            })}
        </Stack>
      )}
    </Stack>
  );
};

export default ReflectionSection;
