import * as React from 'react';
import { act, cleanup, fireEvent } from '@testing-library/react';

import TransparencyLogDetailCard from '../';
import { customRender, wrapWithTheme } from '../../../test-utils';

describe('<TransparencyLogDetailCard /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const reasons = ['Abusive or harmful to others', 'Violence'];

  const handleClickAvatar = jest.fn();

  const handleClickContactModerators = jest.fn();

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        wrapWithTheme(
          <TransparencyLogDetailCard
            locale="en"
            title="Reply delisted by"
            content="This post violates our Code fo Conduct by being offensive and harmful to others. This person is directly threatening a group of people"
            isDelisted={true}
            moderator="John Doe"
            moderatedTimestamp="2021-06-14T16:48:00.000Z"
            moderatorAvatarUrl="https://placebeard.it/360x360"
            moderatorEthAddress="0x003410490050000320006570034567114572000"
            reportedTimesLabel={`Reported ${4} times`}
            reasonsLabel={`${reasons.length > 1 ? 'reasons' : 'reason'}`}
            reasons={reasons}
            explanationLabel="explanation"
            contactModeratorsLabel="Contact the moderators"
            onClickAvatar={handleClickAvatar}
            onClickContactModerators={handleClickContactModerators}
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
    const title = getByText('Reply delisted by');

    expect(title).toBeDefined();
  });

  it('triggers callback when avatar is clicked', () => {
    const { getByRole } = componentWrapper;
    const avatar = getByRole('img');
    fireEvent.click(avatar);
    expect(handleClickAvatar).toHaveBeenCalledTimes(1);
  });

  it.skip('triggers callback when cta is clicked', () => {
    const { getByText } = componentWrapper;
    const cta = getByText(/moderators/);
    fireEvent.click(cta);
    expect(handleClickContactModerators).toHaveBeenCalledTimes(1);
  });

  it.skip('renders correct number of reasons', () => {
    const { getAllByRole } = componentWrapper;
    const renderedReasons = getAllByRole('span');

    expect(renderedReasons.length).toEqual(reasons.length);
  });
});
