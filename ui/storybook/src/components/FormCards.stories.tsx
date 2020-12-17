/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { action } from '@storybook/addon-actions';
import { boolean, object, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { boxProviderData, ensProviderData } from './cards-data';

const { Box, BoxFormCard, EnsFormCard } = DS;

storiesOf('Cards/Form Cards', module)
  .add('3Box form card', () => (
    <Box align="center" pad={{ top: '40px' }}>
      <BoxFormCard
        uploadLabel={text('upload Label', 'Upload an image')}
        urlLabel={text('url Label', 'By url')}
        deleteLabel={text('delete Label', 'Delete Image')}
        titleLabel={text('Title Label', 'Ethereum Address')}
        avatarLabel={text('Avatar Label', 'Avatar')}
        coverImageLabel={text('Cover Image Label', 'Cover Image')}
        nameLabel={text('Name Label', 'Name')}
        descriptionLabel={text('Description Label', 'Description')}
        cancelLabel={text('Cancel Label', 'Cancel')}
        saveLabel={text('Save Label', 'Save')}
        nameFieldPlaceholder={text('Name placeholder', 'Type your name here')}
        descriptionFieldPlaceholder={text(
          'Description placeholder',
          'Add a description about you here',
        )}
        ethAddress={text('Logged Profile EthAddress', '0x003410499401674320006570047391024572456')}
        providerData={object('Provider Data', boxProviderData)}
        onSave={() => action('Form submitted')('Synthetic Event')}
        onCancel={() => action('Form Cancelled')('Synthetic Event')}
        updateStatus={{ saving: boolean('Is saving', false) }}
      />
    </Box>
  ))
  .add('ENS form card', () => (
    <Box align="center" pad={{ top: '40px' }}>
      <EnsFormCard
        titleLabel={text('Title Label', 'Add a Username')}
        secondaryTitleLabel={text('Secondary Title Label', 'Ethereum Name')}
        nameLabel={text('Name Label', 'Select a username')}
        errorLabel={text(
          'Error Label',
          'Sorry, this username has already been taken. Please choose another one.',
        )}
        ethAddressLabel={text('Ethereum Address Label', 'Your Ethereum Address')}
        ethNameLabel={text('Ethereum Name Label', 'Your Ethereum Name')}
        optionUsername={text('Option Username', 'username')}
        optionSpecify={text('Option Specify', 'Specify an Ethereum name')}
        optionUseEthereumAddress={text('Option Use Address', 'Use my Ethereum address')}
        consentText={text('Consent Text', 'By creating an account you agree to the ')}
        consentUrl={text('Consent Url', 'https://ethereum.world/community-agreement')}
        consentLabel={text('Consent Label', 'Community Agreement')}
        poweredByLabel={text('Powered by Label', 'Username powered by')}
        iconLabel={text('Icon Label', 'ENS')}
        cancelLabel={text('Cancel Label', 'Cancel')}
        saveLabel={text('Save Label', 'Save')}
        nameFieldPlaceholder={text('Name Placeholder', '@username')}
        ethAddress={text('Logged Profile EthAddress', '0x003410499401674320006570047391024572456')}
        providerData={object('Provider Data', ensProviderData)}
        onSave={() => action('Form submitted')('Synthetic Event')}
        onCancel={() => action('Form Cancelled')('Synthetic Event')}
        validateEns={() => action('validating ens')('Synthetic Event')}
        validEns={boolean('valid ens', true)}
        changeButtonLabel={text('Change ENS Label', 'Change ENS')}
        userNameProviderOptions={[
          { name: 'local', label: text('Label for local usernames', 'Do not use ENS') },
        ]}
      />
    </Box>
  ));
