import * as React from 'react';
import { act, cleanup } from '@testing-library/react';
import ImageCropper from '../';
import { customRender } from '../../../test-utils';

describe('<ImageCropper /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const image = {
    default: {
      height: 320,
      src: 'https://placebeard.it/360x360',
      width: 320,
    },
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
    act(() => componentWrapper.unmount());
    cleanup();
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('has hidden input', () => {
    const { getByTestId } = componentWrapper;

    const rangeInput = getByTestId('range-input');

    expect(rangeInput).toBeDefined();
    expect(rangeInput).toHaveAttribute('type', 'range');
  });
});
