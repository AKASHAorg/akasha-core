import * as React from 'react';
import { act, cleanup, fireEvent } from '@testing-library/react';

import TransparencyLogMiniCard from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<TransparencyLogMiniCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleClickAvatar = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <TransparencyLogMiniCard
            locale="en"
            title="Post Delisted"
            content="This post violates our Code fo Conduct by being offensive and harmful to others. This person is directly threatening a group of people"
            isSelected={true}
            isDelisted={true}
            moderatedTimestamp="2021-06-14T16:48:00.000Z"
            moderatorAvatarUrl="https://placebeard.it/360x360"
            moderatorEthAddress="0x003410490050000320006570034567114572000"
            onClickAvatar={handleClickAvatar}
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

  it('has correct title', () => {
    const { getByText } = componentWrapper;
    const title = getByText('Post Delisted');

    expect(title).toBeDefined();
  });

  it('triggers avatar callback when clicked', () => {
    const { getByRole } = componentWrapper;
    const avatar = getByRole('img');
    fireEvent.click(avatar);
    expect(handleClickAvatar).toHaveBeenCalledTimes(1);
  });
});
