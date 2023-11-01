import * as React from 'react';
import { Profile } from '@akashaorg/typings/lib/ui';
import { Extension } from '@akashaorg/ui-lib-extensions/lib/react/extension';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Helmet from '@akashaorg/design-system-core/lib/utils/helmet';

export type EditorPageProps = {
  loggedProfileData?: Profile;
};

const EditorPage: React.FC<EditorPageProps> = props => {
  const { loggedProfileData } = props;
  return (
    <Stack fullWidth={true}>
      <Helmet.Helmet>
        <title>Beam Editor</title>
      </Helmet.Helmet>
      {loggedProfileData?.did?.id && (
        <Stack customStyle="mb-1">
          <Extension name="beam-editor_feed_page" />
        </Stack>
      )}
    </Stack>
  );
};

export default EditorPage;
