import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import { useTranslation } from 'react-i18next';

import { withProviders, ThemeWrapper } from '@akashaorg/ui-awf-hooks';
import { IconType, RootExtensionProps } from '@akashaorg/typings/ui';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Modal from '@akashaorg/design-system-core/lib/components/Modal';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

const ShareProfileModal: React.FC<RootExtensionProps> = props => {
  const { profileId } = props.extensionData;

  const [showModal, setShowModal] = useState(true);

  const { t } = useTranslation('app-profile');

  const url = `${window.location.origin}/@akashaorg/app-profile/${profileId}`;

  const socialApps: IconType[] = ['twitter', 'telegram', 'ClipboardDocumentIcon'];

  const handleProfileShare = (service: IconType, url: string) => () => {
    let shareUrl: string;

    switch (service) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${url}`;
        break;
      case 'telegram':
        shareUrl = `https://telegram.me/share/url?${url}`;
        break;
      case 'ClipboardDocumentIcon':
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
    setShowModal(false);
    props.singleSpa.navigateToUrl(location.pathname);
  };

  return (
    <Modal
      show={showModal}
      title={{ label: `${t('Share profile: ')} ${profileId}`, variant: 'h5' }}
      actions={[{ label: 'Cancel', variant: 'secondary', onClick: closeShareModal }]}
      onClose={closeShareModal}
    >
      <Stack spacing="gap-y-2">
        <Text variant="body2">{t('Share to your social platforms')}</Text>

        <Stack direction="row">
          <Box customStyle="flex w-[2em] h-[2em] items-center justify-center rounded-full">
            <Icon type="LinkIcon" />
          </Box>
        </Stack>

        <Stack direction="row">
          {socialApps.map((app, idx) => (
            <Button key={app + idx} plain={true} onClick={handleProfileShare(app, url)}>
              <Box customStyle="flex w-[2em] h-[2em] items-center justify-center rounded-[50%]">
                <Icon type={app} color="white" testId={app} />
              </Box>
            </Button>
          ))}
        </Stack>
      </Stack>
    </Modal>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient: ReactDOM,
  rootComponent: withProviders(ShareProfileModal),
  errorBoundary: (error, errorInfo, props: RootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(error)}, ${errorInfo}`);
    }
    return (
      <ThemeWrapper {...props}>
        <ErrorLoader
          type="script-error"
          title="Error in share profile modal"
          details={error.message}
        />
      </ThemeWrapper>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
