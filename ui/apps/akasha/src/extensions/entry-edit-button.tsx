import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import { I18nextProvider, useTranslation } from 'react-i18next';

import { RootExtensionProps, EntityTypes } from '@akashaorg/typings/lib/ui';
import { useRootComponentProps, withProviders } from '@akashaorg/ui-awf-hooks';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

type EntryEditButtonExtensionData = {
  itemId: string;
  itemType: EntityTypes;
};

const EntryEditButton: React.FC<RootExtensionProps<EntryEditButtonExtensionData>> = props => {
  const { t } = useTranslation('app-akasha-integration');

  const handleClick = () => {
    if (props.extensionData && props.extensionData.hasOwnProperty('itemId')) {
      props.singleSpa.navigateToUrl(
        `${window.location.origin}/@akashaorg/app-akasha-integration/${
          props.extensionData?.itemType === EntityTypes.BEAM ? 'post' : 'reflect'
        }/${props.extensionData.itemId}?action=edit`,
      );
    }
  };

  const itemTypeLabel = React.useMemo(() => {
    if (props.extensionData.itemType === EntityTypes.REFLECT) {
      return t('reflect');
    }
    if (props.extensionData.itemType === EntityTypes.BEAM) {
      return t('beam');
    }
  }, [props.extensionData.itemType, t]);

  return (
    <Button plain={true} onClick={handleClick}>
      <Stack direction="row" align="center" spacing="gap-x-3" customStyle="py-2 px-4">
        <Icon type="PencilIcon" size="sm" />

        <Text variant="body1">{t('Edit {{ itemTypeLabel }}', { itemTypeLabel })}</Text>
      </Stack>
    </Button>
  );
};

const ModalWrapper: React.FC<RootExtensionProps<EntryEditButtonExtensionData>> = props => {
  const { getTranslationPlugin } = useRootComponentProps();
  return (
    <React.Suspense fallback={'...'}>
      <I18nextProvider i18n={getTranslationPlugin().i18n}>
        <EntryEditButton {...props} />
      </I18nextProvider>
    </React.Suspense>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient: ReactDOM,
  rootComponent: withProviders(ModalWrapper),
  errorBoundary: (err, errorInfo, props: RootExtensionProps<EntryEditButtonExtensionData>) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo}`);
    }
    return <ErrorLoader type="script-error" title="Error in edit button" details={err.message} />;
  },
});

export const bootstrap = reactLifecycles.bootstrap;
export const mount = reactLifecycles.mount;
export const unmount = reactLifecycles.unmount;
