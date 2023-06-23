import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import { I18nextProvider, useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { RootExtensionProps, EntityTypes } from '@akashaorg/typings/ui';
import { withProviders, ThemeWrapper } from '@akashaorg/ui-awf-hooks';

const { MenuItemButton, ModalContainer } = DS;

const EntryEditButton: React.FC<RootExtensionProps> = props => {
  const { t } = useTranslation('app-akasha-integration');

  const handleClick = () => {
    if (props.extensionData && props.extensionData.hasOwnProperty('itemId')) {
      props.singleSpa.navigateToUrl(
        `${window.location.origin}/@akashaorg/app-akasha-integration/${
          props.extensionData?.itemType === EntityTypes.POST ? 'post' : 'reply'
        }/${props.extensionData.itemId}?action=edit`,
      );
    }
  };

  const itemTypeLabel = React.useMemo(() => {
    if (props.extensionData.itemType === EntityTypes.REPLY) {
      return t('reply');
    }
    if (props.extensionData.itemType === EntityTypes.POST) {
      return t('post');
    }
  }, [props.extensionData.itemType, t]);

  return (
    <MenuItemButton
      icon={'edit'}
      label={t('Edit {{ itemTypeLabel }}', { itemTypeLabel })}
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
  ReactDOMClient: ReactDOM,
  rootComponent: withProviders(ModalWrapper),
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
