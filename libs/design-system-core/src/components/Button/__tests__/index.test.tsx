import * as React from 'react';
import { act, fireEvent } from '@testing-library/react';

import Button from '../';
import { PlusIcon } from '../../Icon/hero-icons-outline';
import { customRender } from '../../../test-utils';

const label = 'Default button';
const mockClickHandler = jest.fn(/** */);

describe('<Button /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <Button label={label} onClick={() => mockClickHandler()} />,
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

  it('has correct label', () => {
    const { getByText } = componentWrapper;
    const buttonLabel = getByText(label);
    expect(buttonLabel).toBeDefined();
  });

  it('correctly call handler function when clicked', () => {
    const { container } = componentWrapper;
    const button = container.querySelector('button');
    fireEvent.click(button);
    expect(mockClickHandler).toHaveBeenCalledTimes(1);
  });
});

describe('Icon Only Button', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <Button icon={<PlusIcon />} iconOnly={true} variant="text" label={label} />,
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

  it('doesn´t display label', () => {
    const { queryAllByText } = componentWrapper;
    const buttonLabel = queryAllByText(label);
    expect(buttonLabel.length).toEqual(0);
  });
});

describe('Disabled Button', () => {
  let componentWrapper = customRender(<></>, {});

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <Button
          icon={<PlusIcon />}
          label={label}
          disabled={true}
          onClick={() => mockClickHandler()}
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

  it('doesn´t call handler function when clicked', () => {
    const { container } = componentWrapper;
    const button = container.querySelector('button');
    fireEvent.click(button);
    expect(mockClickHandler).toHaveBeenCalledTimes(0);
  });
});
