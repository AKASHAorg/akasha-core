import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { uploadMediaToTextile } from '../services/posting-service';

const { Helmet, EditorCard, ErrorLoader, Box, Button, editorDefaultValue } = DS;

interface NewPostPageProps {
  globalChannel: any;
  sdkModules: any;
  ethAddress: string | null;
  pubKey: string | null;
  logger: any;
  showLoginModal: () => void;
  onError: (err: Error) => void;
}

const NewPostPage: React.FC<NewPostPageProps> = props => {
  const { showLoginModal, sdkModules, ethAddress } = props;

  const [editorState, setEditorState] = React.useState(editorDefaultValue);

  const onUploadRequest = uploadMediaToTextile(
    sdkModules.profiles.profileService,
    sdkModules.commons.ipfsService,
  );

  const { t } = useTranslation();

  const handlePostPublish = (_ethAddress: string, _content: any) => {
    // todo
  };

  const handleBackNavigation = () => {
    // todo
  };

  const handleGetMentions = () => {
    // todo
  };

  const handleGetTags = () => {
    // todo
  };

  return (
    <Box fill="horizontal">
      <Helmet>
        <title>Write something.. | AKASHA App</title>
      </Helmet>
      {!ethAddress && (
        <ErrorLoader
          type="no-login"
          title={t('No Ethereum address detected')}
          details={t(
            'You need to login or allow access to your current Ethereum address in your Web3 Ethereum client like MetaMask, and then reload, please.',
          )}
        >
          <Box direction="row">
            <Button label={t('Cancel')} secondary={true} margin={{ right: '.5em' }} />
            <Button label={t('Connect Wallet')} primary={true} onClick={showLoginModal} />
          </Box>
        </ErrorLoader>
      )}
      {ethAddress && (
        <Box direction="column" align="center">
          <EditorCard
            avatar={'https://www.stevensegallery.com/360/360'}
            ethAddress={ethAddress}
            onPublish={handlePostPublish}
            handleNavigateBack={handleBackNavigation}
            postLabel={t('Publish')}
            placeholderLabel={t('Share your thoughts')}
            getMentions={handleGetMentions}
            getTags={handleGetTags}
            // mentions={mentions}
            // tags={tags}
            uploadRequest={onUploadRequest}
            editorState={editorState}
            setEditorState={setEditorState}
          />
        </Box>
      )}
    </Box>
  );
};

export default NewPostPage;
