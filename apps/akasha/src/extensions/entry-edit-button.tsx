import singleSpaReact from 'single-spa-react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import DS from '@akashaproject/design-system';
import { withProviders } from '@akashaproject/ui-awf-hooks';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { ItemTypes } from '@akashaproject/ui-awf-typings/lib/app-loader';
import i18next, { setupI18next } from '../i18n';

const { StyledSelectBox, TextIcon } = DS;

const EntryEditButton: React.FC<RootComponentProps> = props => {
  const { t } = useTranslation();

  const handleClick = () => {
    if (props.extensionData && props.extensionData.hasOwnProperty('entryId')) {
      props.navigateToModal({
        name: 'editor',
        entryId: props.extensionData.entryId,
        action: 'edit',
      });
    }
  };

  const entryTypeLabel = React.useMemo(() => {
    if (props.extensionData.entryType === ItemTypes.COMMENT) {
      return t('reply');
    }
    if (props.extensionData.entryType === ItemTypes.ENTRY) {
      return t('post');
    }
  }, [props.extensionData.entryType, t]);

  return (
    <StyledSelectBox>
      <TextIcon
        iconType={'edit'}
        label={`${t('Edit')} ${entryTypeLabel}`}
        onClick={handleClick}
        // color={theme.colors.errorText}
        iconSize="xs"
        fontSize="medium"
      />
    </StyledSelectBox>
  );
};

const ModalWrapper: React.FC<RootComponentProps> = props => {
  return (
    <React.Suspense fallback={'...'}>
      <I18nextProvider i18n={i18next}>
        <EntryEditButton {...props} />
      </I18nextProvider>
    </React.Suspense>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(ModalWrapper),
  errorBoundary: (err, errorInfo, props) => {
    if (props.logger) {
      props.logger.error('Error: %s; Info: %s', err, errorInfo);
    }
    return <div>Error {err.message}</div>;
  },
});

export const bootstrap = (props: RootComponentProps) => {
  return setupI18next({
    logger: props.logger,
    // must be the same as the one in ../../i18next.parser.config.js
    namespace: 'app-akasha-integration',
  });
};
export const mount = reactLifecycles.mount;
export const unmount = reactLifecycles.unmount;
