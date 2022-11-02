import singleSpaReact from 'single-spa-react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { RootExtensionProps, EntityTypes } from '@akashaorg/typings/ui';
import DS from '@akashaorg/design-system';
import { withProviders, ThemeWrapper } from '@akashaorg/ui-awf-hooks';
import { I18nextProvider, useTranslation } from 'react-i18next';

const { MenuItemButton, ErrorLoader, ModalContainer } = DS;

const EntryEditButton: React.FC<RootExtensionProps> = props => {
  const { t } = useTranslation('app-akasha-integration');

  const handleClick = () => {
    if (
      props.extensionData &&
      props.extensionData.hasOwnProperty('entryId') &&
      props.extensionData?.entryType === EntityTypes.ENTRY
    ) {
      props.singleSpa.navigateToUrl(
        `${window.location.origin}/@akashaorg/app-akasha-integration/post/${props.extensionData.entryId}?action=edit`,
      );
    }

    if (
      props.extensionData &&
      props.extensionData.hasOwnProperty('commentId') &&
      props.extensionData?.entryType === EntityTypes.COMMENT
    ) {
      props.singleSpa.navigateToUrl(
        `${window.location.origin}/@akashaorg/app-akasha-integration/reply/${props.extensionData.commentId}?action=edit`,
      );
      return;
    }
  };

  const entryTypeLabel = React.useMemo(() => {
    if (props.extensionData.entryType === EntityTypes.COMMENT) {
      return t('reply');
    }
    if (props.extensionData.entryType === EntityTypes.ENTRY) {
      return t('post');
    }
  }, [props.extensionData.entryType, t]);

  return (
    <MenuItemButton
      icon={'edit'}
      label={t('Edit {{ entryTypeLabel }}', { entryTypeLabel })}
      onClick={handleClick}
    />
  );
};

const ModalWrapper: React.FC<RootExtensionProps> = props => {
  return (
    <React.Suspense fallback={'...'}>
      <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
        <EntryEditButton {...props} />
      </I18nextProvider>
    </React.Suspense>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(ModalWrapper),
  renderType: 'createRoot',
  errorBoundary: (err, errorInfo, props: RootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo}`);
    }
    return (
      <ThemeWrapper {...props}>
        <ModalContainer>
          <ErrorLoader type="script-error" title="Error in edit button" details={err.message} />
        </ModalContainer>
      </ThemeWrapper>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;
export const mount = reactLifecycles.mount;
export const unmount = reactLifecycles.unmount;
