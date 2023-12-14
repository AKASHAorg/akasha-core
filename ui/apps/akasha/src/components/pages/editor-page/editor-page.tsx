import * as React from 'react';
import { Profile } from '@akashaorg/typings/lib/ui';
import { Extension } from '@akashaorg/ui-lib-extensions/lib/react/extension';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Helmet from '@akashaorg/design-system-core/lib/utils/helmet';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { useTranslation } from 'react-i18next';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';

export type EditorPageProps = {
  loggedProfileData?: Profile;
};

const EditorPage: React.FC<EditorPageProps> = props => {
  const { loggedProfileData } = props;
  const { getRoutingPlugin } = useRootComponentProps();
  const navigateTo = React.useRef(getRoutingPlugin().navigateTo);
  const { t } = useTranslation();
  return (
    <Stack fullWidth={true}>
      <Helmet.Helmet>
        <title>Beam Editor</title>
      </Helmet.Helmet>
      {!loggedProfileData && (
        <Stack>
          <ErrorLoader
            type={'not-registered'}
            title={t('Uh-oh! You are not connected!')}
            details={t('To create Beams you must be connected ⚡️')}
          >
            <Button
              label={t('Connect')}
              variant="primary"
              onClick={() =>
                navigateTo.current({
                  appName: '@akashaorg/app-auth-ewa',
                  getNavigationUrl: navRoutes =>
                    `${navRoutes.Connect}?redirectTo=${encodeURIComponent(location.pathname)}`,
                })
              }
            />
          </ErrorLoader>
        </Stack>
      )}
      {loggedProfileData?.did?.id && (
        <Stack customStyle="mb-1">
          <Extension name="beam-editor_feed_page" />
        </Stack>
      )}
    </Stack>
  );
};

export default EditorPage;
