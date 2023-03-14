import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import { useTranslation } from 'react-i18next';
import { useLocation, BrowserRouter as Router } from 'react-router-dom';

import DS from '@akashaorg/design-system';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { RootExtensionProps } from '@akashaorg/typings/ui';
import { withProviders, ThemeWrapper } from '@akashaorg/ui-awf-hooks';

const { FeedbackModal } = DS;

const FeedbackModalContainer = (props: RootExtensionProps) => {
  const { t } = useTranslation('ui-widget-topbar');
  const location = useLocation();

  const handleFeedbackModalClose = () => {
    props.singleSpa.navigateToUrl(location.pathname);
  };

  return (
    <FeedbackModal
      titleLabel={t('We’d love to hear from you!')}
      subtitleLabel={t('If you find any bugs or experience problems, please get in touch!')}
      openAnIssueLabel={t('Open an Issue')}
      emailUsLabel={t('Email Us')}
      footerTextLabel={t(
        'Join our Discord channel to meet everyone, say "Hello!", provide feedback and share ideas.',
      )}
      footerLinkText1Label={t('Join in')}
      footerLinkText2Label={t('Discord')}
      openIssueLink={'https://github.com/AKASHAorg/akasha-world-framework/issues/new/choose'}
      emailUsLink={'mailto:feedback@ethereum.world'}
      joinDiscordLink={'https://discord.gg/A5wfg6ZCRt'}
      closeModal={handleFeedbackModalClose}
    />
  );
};

const Wrapped = (props: RootExtensionProps) => (
  <Router>
    <FeedbackModalContainer {...props} />
  </Router>
);

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(Wrapped),
  renderType: 'createRoot',
  errorBoundary: (err, errorInfo, props: RootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(err)}, ${errorInfo}`);
    }
    return (
      <ThemeWrapper {...props}>
        <ErrorLoader type="script-error" title="Error in feedback modal" details={err.message} />
      </ThemeWrapper>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
