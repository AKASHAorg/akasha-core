import * as React from 'react';
import { act } from '@testing-library/react';
import ImageCropper from '../';
import { customRender } from '../../../test-utils';

describe('<ImageCropper /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const image = {
    height: 320,
    src: 'https://placebeard.it/360x360',
    width: 320,
  };

  const cropHandler = jest.fn(() => {
    /** */
  });

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <ImageCropper
          image={image}
          dragToRepositionLabel="Drag the image to reposition"
          onCrop={cropHandler}
        />,
        {},
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('has input type of slider', () => {
    const { getByRole } = componentWrapper;

    const rangeInput = getByRole('slider', { name: 'range-input' });

    expect(rangeInput).toBeDefined();
    expect(rangeInput).toHaveAttribute('type', 'range');
  });
});
