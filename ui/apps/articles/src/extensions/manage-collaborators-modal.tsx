import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';

import DS from '@akashaorg/design-system';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { IProfileData, RootExtensionProps } from '@akashaorg/typings/ui';
import { withProviders, ThemeWrapper } from '@akashaorg/ui-awf-hooks';
import { trendingProfilesData } from '@akashaorg/design-system/lib/utils/dummy-data';

const { ManageCollaboratorsModal } = DS;

const ManageCollaborators = (props: RootExtensionProps) => {
  const [inputValue, setInputValue] = React.useState<string>('');
  const [dropOpen, setDropOpen] = React.useState<boolean>(false);
  const [collaborators, setCollaborators] = React.useState<IProfileData[]>([]);
  const [searchResults, setSearchResults] = React.useState<IProfileData[]>([]);

  const { t } = useTranslation('app-articles');

  const handleModalClose = () => {
    props.singleSpa.navigateToUrl(location.pathname);
  };

  const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.target.value === '') {
      // reset search results
      setSearchResults([]);
    }
    setInputValue(ev.target.value);
  };

  const handleSearch = () => {
    if (inputValue.length) {
      const results = trendingProfilesData.filter(
        c =>
          (c.name.includes(inputValue) || c.userName.includes(inputValue)) &&
          !collaborators.some(el => el.pubKey === c.pubKey),
      );
      setSearchResults(results);
      setDropOpen(true);
    }
  };

  const handleClickCollaborator = (pubKey: string, action: 'add' | 'remove') => () => {
    if (action === 'add') {
      // find the collaborator
      const collaborator = trendingProfilesData.find(el => el.pubKey === pubKey);
      // add to collaborators state
      setCollaborators([...collaborators, collaborator]);
      // remove from search results
      setSearchResults(searchResults.filter(_r => _r.pubKey !== pubKey));
    }

    if (action === 'remove') {
      const filtered = collaborators.filter(_collaborator => _collaborator.pubKey !== pubKey);
      setCollaborators(filtered);
    }
  };

  const handleDropClose = () => {
    setDropOpen(false);
    setSearchResults([]);
  };

  return (
    <ManageCollaboratorsModal
      titleLabel={t('Collaborators')}
      inputValue={inputValue}
      inputPlaceholderLabel={t('Search for a name or @name')}
      collaborators={collaborators}
      searchResults={searchResults}
      noCollaboratorsLabel={t('You have not invited any collaborators yet')}
      noSearchItemsLabel={t("We couldn't find matching profiles")}
      dropOpen={dropOpen}
      addButtonLabel={t('Add')}
      removeButtonLabel={t('Remove')}
      onInputChange={handleInputChange}
      onSearch={handleSearch}
      closeModal={handleModalClose}
      onClickCollaborator={handleClickCollaborator}
      closeDrop={handleDropClose}
    />
  );
};

const Wrapped = (props: RootExtensionProps) => (
  <Router>
    <React.Suspense fallback={<></>}>
      <I18nextProvider i18n={props.plugins?.translation?.i18n}>
        <ManageCollaborators {...props} />
      </I18nextProvider>
    </React.Suspense>
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
        <ErrorLoader
          type="script-error"
          title="Error in manage collaborators modal"
          details={err.message}
        />
      </ThemeWrapper>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
