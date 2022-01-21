import * as React from 'react';
import ReactDOM from 'react-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import singleSpaReact from 'single-spa-react';
import { withProviders } from '@akashaproject/ui-awf-hooks';
import DS from '@akashaproject/design-system';
import { rootRoute } from '../routes';

const { ThemeSelector, lightTheme, darkTheme, ErrorLoader, ModalContainer, ShareModal } = DS;

const UpdateProfileModal: React.FC<RootComponentProps> = props => {
  const { profileId } = props.activeModal;
  const url = `${window.location.origin}${rootRoute}/${profileId}`;

  const handleProfileShare = (service: 'twitter' | 'facebook' | 'reddit' | 'copy', url: string) => {
    let shareUrl;
    switch (service) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'reddit':
        shareUrl = `http://www.reddit.com/submit?url=${url}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
      default:
        break;
    }
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  const closeShareModal = () => {
    props.singleSpa.navigateToUrl(location.pathname);
  };

  return (
    <ModalContainer>
      <ShareModal link={url} handleProfileShare={handleProfileShare} closeModal={closeShareModal} />
    </ModalContainer>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(UpdateProfileModal),
  errorBoundary: (error, errorInfo, props: RootComponentProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(error)}, ${errorInfo}`);
    }
    return (
      <ThemeSelector
        availableThemes={[lightTheme, darkTheme]}
        settings={{ activeTheme: 'LightTheme' }}
      >
        <ErrorLoader
          type="script-error"
          title="Error in update profile modal"
          details={error.message}
        />
      </ThemeSelector>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
