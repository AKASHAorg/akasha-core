import * as React from 'react';
import DS from '@akashaproject/design-system';
import { getLoggedProfileStore } from '../state/logged-profile-state';
import { useTranslation } from 'react-i18next';
import { uploadMediaToTextile } from '../services/posting-service';

const { Helmet, EditorCard, ErrorLoader, Box, Button } = DS;

interface NewPostPageProps {
  globalChannel: any;
  sdkModules: any;
  logger: any;
  showLoginModal: () => void;
  onError: (err: Error) => void;
}

const NewPostPage: React.FC<NewPostPageProps> = props => {
  const { showLoginModal, sdkModules } = props;
  const Login = getLoggedProfileStore();
  const loginEthAddr = Login.useStoreState((state: any) => state.data.ethAddress);

  const onUploadRequest = uploadMediaToTextile(sdkModules.profiles.profileService);

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
      {!loginEthAddr && (
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
      {loginEthAddr && (
        <Box direction="column" align="center">
          <EditorCard
            avatar={'https://www.stevensegallery.com/360/360'}
            ethAddress={loginEthAddr}
            onPublish={handlePostPublish}
            handleNavigateBack={handleBackNavigation}
            postLabel={t('Publish')}
            placeholderLabel={t('Share your thoughts')}
            getMentions={handleGetMentions}
            getTags={handleGetTags}
            // mentions={mentions}
            // tags={tags}
            uploadRequest={onUploadRequest}
          />
        </Box>
      )}
    </Box>
  );
};

export default NewPostPage;
