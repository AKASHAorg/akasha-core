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
    <Box align="center" pad={{ top: '40px' }} width="582px">
      <BoxFormCard
        uploadLabel={text('Upload Label', 'Upload an image')}
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
    <Box align="center" pad={{ top: '40px' }} width="582px">
      <EnsFormCard
        titleLabel={text('Title Label', 'Add a Username')}
        nameLabel={text('Name Label', 'Select a username')}
        errorLabel={text(
          'Error Label',
          'Sorry, this username has already been taken. Please choose another one.',
        )}
        options={[
          {
            type: 0,
            label: text('Option label', 'Display my AKASHA Ethereum name'),
            value: text('option value', 'mysubdomain.akasha.eth'),
            defaultChecked: boolean('Checked by default', false),
            textDetails: <>text('Additional details text', 'Username Powered by ENS')</>,
          },
        ]}
        cancelLabel={text('Cancel Label', 'Cancel')}
        saveLabel={text('Save Label', 'Save')}
        onSave={() => action('Form submitted')('Synthetic Event')}
        onCancel={() => action('Form Cancelled')('Synthetic Event')}
      />
    </Box>
  ));
