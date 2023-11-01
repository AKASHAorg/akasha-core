import * as React from 'react';
import { Profile } from '@akashaorg/typings/lib/ui';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import Extension from '@akashaorg/design-system-components/lib/components/Extension';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Helmet from '@akashaorg/design-system-core/lib/utils/helmet';

export type EditorPageProps = {
  loggedProfileData?: Profile;
};

const EditorPage: React.FC<EditorPageProps> = props => {
  const { loggedProfileData } = props;
  const { uiEvents } = useRootComponentProps();
  return (
    <Stack fullWidth={true}>
      <Helmet.Helmet>
        <title>Beam Editor</title>
      </Helmet.Helmet>
      {loggedProfileData?.did?.id && (
        <Stack customStyle="mb-1">
          <Extension name="beam-editor_feed_page" uiEvents={uiEvents} />
        </Stack>
      )}
    </Stack>
  );
};

export default EditorPage;
