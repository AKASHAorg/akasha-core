import * as React from 'react';
import { act, fireEvent } from '@testing-library/react';
import Pagination from '../';
import { customRender } from '../../../test-utils';

describe('<Pagination /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const prevLabel = 'Previous';
  const nextLabel = 'Next';
  const handleClickPrev = jest.fn(/** */);
  const handleClickNext = jest.fn(/** */);
  const handleClickPage = jest.fn(/** */);

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(
        <Pagination
          pageCount={10}
          currentPage={2}
          prevButtonDisabled={false}
          prevButtonLabel="Previous"
          nextButtonLabel="Next"
          onClickPrev={handleClickPrev}
          onClickPage={handleClickPage}
          onClickNext={handleClickNext}
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

  it('calls correct button handlers', () => {
    const { getByText } = componentWrapper;

    const prevButton = getByText(prevLabel);
    const nextButton = getByText(nextLabel);

    expect(prevButton).toBeDefined();
    expect(nextButton).toBeDefined();
    expect(handleClickPrev).toBeCalledTimes(0);
    expect(handleClickNext).toBeCalledTimes(0);

    fireEvent.click(prevButton);
    fireEvent.click(nextButton);

    expect(handleClickPrev).toBeCalledTimes(1);
    expect(handleClickNext).toBeCalledTimes(1);
  });
});
