import React, { useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import { useTranslation } from 'react-i18next';

import { withProviders } from '@akashaorg/ui-awf-hooks';
import { IconType, RootExtensionProps } from '@akashaorg/typings/ui';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Modal from '@akashaorg/design-system-core/lib/components/Modal';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

const ShareModal: React.FC<RootExtensionProps> = props => {
  const { singleSpa, parseQueryString } = props;

  const [showModal, setShowModal] = useState(true);
  const { t } = useTranslation('app-profile');

  const [title, url] = useMemo(() => {
    const { modal } = parseQueryString(location.search) as { modal: Record<string, string> };

    if (modal) {
      return [modal.title, `${location.protocol}://${location.host}/${modal.appPath}`];
    }
  }, [parseQueryString]);

  const socialApps: IconType[] = ['twitter', 'telegram', 'ClipboardDocumentIcon'];

  const handleProfileShare = (service: IconType) => () => {
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
    singleSpa.navigateToUrl(location.pathname);
  };

  return (
    <Modal
      show={showModal}
      title={{ label: `${t('Share')} ${title}`, variant: 'h5' }}
      actions={[{ label: 'Cancel', variant: 'secondary', onClick: closeShareModal }]}
      onClose={closeShareModal}
    >
      <Stack direction="column" align="center" spacing="gap-y-2">
        <Stack direction="row" spacing="gap-x-2">
          <Icon type="LinkIcon" />

          <Text variant="body2">{url}</Text>
        </Stack>

        <Stack direction="row">
          {socialApps.map((app, idx) => (
            <Button key={app + idx} plain={true} onClick={handleProfileShare(app)}>
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
  rootComponent: withProviders(ShareModal),
  errorBoundary: (error, errorInfo, props: RootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(error)}, ${errorInfo}`);
    }
    return (
      <ErrorLoader
        type="script-error"
        title="Error in share profile modal"
        details={error.message}
      />
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
