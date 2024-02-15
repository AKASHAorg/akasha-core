import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';

import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { Profile, RootExtensionProps } from '@akashaorg/typings/lib/ui';
import { transformSource, withProviders } from '@akashaorg/ui-awf-hooks';
import { trendingProfilesData } from '@akashaorg/design-system-components/lib/utils/dummy-data';

import ManageCollaboratorsModal from '@akashaorg/design-system-components/lib/components/ManageCollaboratorsModal';

const ManageCollaborators = (props: RootExtensionProps) => {
  const [inputValue, setInputValue] = React.useState<string>('');
  const [collaborators, setCollaborators] = React.useState<Profile[]>([]);
  const [searchResults, setSearchResults] = React.useState<Profile[]>([]);

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
          (c.name.includes(inputValue) || c.name.includes(inputValue)) &&
          !collaborators.some(el => el.did.id === c.did.id),
      );
      setSearchResults(results);
    }
  };

  const handleClickCollaborator = (profileId: string, action: 'add' | 'remove') => () => {
    if (action === 'add') {
      // find the collaborator
      const collaborator = trendingProfilesData.find(el => el.did.id === profileId);
      // add to collaborators state
      setCollaborators([...collaborators, collaborator]);
      // remove from search results
      setSearchResults(searchResults.filter(_r => _r.did.id !== profileId));
    }

    if (action === 'remove') {
      const filtered = collaborators.filter(_collaborator => _collaborator.did.id !== profileId);
      setCollaborators(filtered);
    }
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
      addButtonLabel={t('Add')}
      removeButtonLabel={t('Remove')}
      onInputChange={handleInputChange}
      onSearch={handleSearch}
      closeModal={handleModalClose}
      onClickCollaborator={handleClickCollaborator}
      transformSource={transformSource}
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
  ReactDOMClient,
  rootComponent: withProviders(Wrapped),
  errorBoundary: (err, errorInfo, props: RootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(err)}, ${errorInfo}`);
    }
    return (
      <ErrorLoader
        type="script-error"
        title="Error in manage collaborators modal"
        details={err.message}
      />
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
