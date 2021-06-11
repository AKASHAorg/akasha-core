import * as React from 'react';
import { act, cleanup } from '@testing-library/react';

import SelectPopover from '../index';

import { customRender, wrapWithTheme } from '../../../test-utils';
import userEvent from '@testing-library/user-event';

const providerData = [
  { providerName: '3box', value: 'Some short text about 3Box' },
  {
    providerName: 'ENS',
    value:
      'A very long and uninspiring text, duplicated.A very long and uninspiring text, duplicated.A very long and uninspiring text, duplicated.',
  },
];

describe('<SelectPopover /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const targetNode = document.createElement('div');
  document.body.appendChild(targetNode);

  const handleClosePopover = jest.fn();
  const handleClickElement = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <SelectPopover
            dataSource={providerData}
            target={targetNode}
            closePopover={handleClosePopover}
            onClickElem={handleClickElement}
          />,
        ),
        {},
      );
    });
  });

  afterEach(() => {
    act(() => componentWrapper.unmount());
    cleanup();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('has two radio options', () => {
    const { getAllByRole } = componentWrapper;

    const options = getAllByRole('radio');
    expect(options).toHaveLength(2);
  });

  it('can select an option and call handler', () => {
    const { getByRole } = componentWrapper;

    const threeBoxOption = getByRole('radio', { name: '3box:' });
    expect(threeBoxOption).not.toBeChecked();
    expect(handleClickElement).toBeCalledTimes(0);

    userEvent.click(threeBoxOption);
    expect(threeBoxOption).toBeChecked();
    expect(handleClickElement).toBeCalledTimes(1);
  });
});
