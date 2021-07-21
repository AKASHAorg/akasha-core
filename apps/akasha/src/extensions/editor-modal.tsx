import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { uploadMediaToTextile } from '@akashaproject/ui-awf-hooks/lib/utils/media-utils';
import { PublishPostData } from '@akashaproject/ui-awf-hooks/lib/use-posts';
import {
  useMentions,
  useLoginState,
  useProfile,
  useErrors,
  withProviders,
} from '@akashaproject/ui-awf-hooks';
import { useCreatePost } from '@akashaproject/ui-awf-hooks/lib/use-posts.new';
import { buildPublishObject } from '@akashaproject/ui-awf-hooks/lib/utils/entry-utils';

const { EditorModal } = DS;

const EditorModalContainer = (props: RootComponentProps) => {
  const { logger } = props;

  const { t } = useTranslation();
  const location = useLocation();

  const [, errorActions] = useErrors({ logger });

  const [loginState] = useLoginState({
    onError: errorActions.createError,
  });

  const [loggedProfileData] = useProfile({
    onError: errorActions.createError,
  });

  // const [, postsActions] = usePosts({
  //   user: loginState.ethAddress,
  //   onError: errorActions.createError,
  // });

  const [mentionsState, mentionsActions] = useMentions({
    onError: errorActions.createError,
  });

  const publishPost = useCreatePost();
  const handleEntryPublish = async (data: PublishPostData) => {
    publishPost.mutate(buildPublishObject(data));
    //postsActions.optimisticPublishPost(data, loggedProfileData, currentEmbedEntry);
    handleModalClose();
  };

  // const handleEntryPublish = async (data: PublishPostData) => {
  //   postsActions.optimisticPublishPost(data, loggedProfileData, props.activeModal.embedEntry);
  //   handleModalClose();
  // };

  const handleModalClose = () => {
    props.singleSpa.navigateToUrl(location.pathname);
  };

  return (
    <EditorModal
      avatar={loggedProfileData.avatar}
      ethAddress={loginState.ethAddress}
      postLabel={t('Publish')}
      placeholderLabel={t('Write something')}
      emojiPlaceholderLabel={t('Search')}
      discardPostLabel={t('Discard Post')}
      discardPostInfoLabel={t(
        "You have not posted yet. If you leave now you'll discard your post.",
      )}
      keepEditingLabel={t('Keep Editing')}
      onPublish={handleEntryPublish}
      handleNavigateBack={handleModalClose}
      getMentions={mentionsActions.getMentions}
      getTags={mentionsActions.getTags}
      tags={mentionsState.tags}
      mentions={mentionsState.mentions}
      uploadRequest={uploadMediaToTextile}
      embedEntryData={props.activeModal.embedEntry}
      style={{ width: '36rem' }}
    />
  );
};

const Wrapped = (props: RootComponentProps) => (
  <Router>
    <React.Suspense fallback={<></>}>
      <EditorModalContainer {...props} />
    </React.Suspense>
  </Router>
);

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(Wrapped),
  errorBoundary: (err, errorInfo, props) => {
    if (props.logger) {
      props.logger('Error: %s; Info: %s', err, errorInfo);
    }
    return <div>!</div>;
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
