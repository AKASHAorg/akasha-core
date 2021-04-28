import * as React from 'react';
// import { create } from 'react-test-renderer';
import { render } from '@testing-library/react';

import BoxFormCard from '../';
import { wrapWithTheme } from '../../../test-utils';
import { boxProviderData } from '../../../utils/dummy-data';

describe('BoxFormCard component', () => {
  it('renders correctly', () => {
    render(
      wrapWithTheme(
        <BoxFormCard
          nameLabel={'Name'}
          saveLabel={'Save'}
          urlLabel={'By url'}
          avatarLabel={'Avatar'}
          cancelLabel={'Cancel'}
          deleteLabel={'Delete Image'}
          coverImageLabel={'Cover Image'}
          uploadLabel={'Upload an image'}
          titleLabel={'Ethereum Address'}
          descriptionLabel={'Description'}
          nameFieldPlaceholder={'Type your name here'}
          descriptionFieldPlaceholder={'Add a description about you here'}
          ethAddress={'0x003410499401674320006570047391024572456'}
          providerData={boxProviderData}
          updateStatus={{ saving: false }}
          onSave={() => null}
          onCancel={() => null}
        />,
      ),
    );
  });
});
