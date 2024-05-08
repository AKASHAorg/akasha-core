import * as React from 'react';
import { act, fireEvent } from '@testing-library/react';
import DatePicker from '../';
import { customRender } from '../../../test-utils';
import { DAYS, MONTHS_IN_A_YEAR } from '../calendarHelpers';

describe('<DatePicker /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const defaultValue = 'Select date';

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<DatePicker />, {});
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('shows default value when no date is selected', () => {
    const { getByText } = componentWrapper;

    const value = getByText(defaultValue);

    expect(value).toBeDefined();
  });

  it('shows date picker when clicked', () => {
    const { getByTestId, getByText } = componentWrapper;

    const wrapper = getByTestId('date-picker');

    expect(wrapper).toBeDefined();

    /** toggle the date picker */
    fireEvent.click(wrapper.firstChild.firstChild);

    /**
     * find a random day from the array of days
     */
    const randomIndex = Math.floor(Math.random() * DAYS.length);
    const sampleDay = getByText(DAYS[randomIndex]);

    expect(sampleDay).toBeDefined();
  });

  it('shows month selector when toggled', () => {
    const { getByTestId, getByText } = componentWrapper;

    const wrapper = getByTestId('date-picker');

    expect(wrapper).toBeDefined();

    /** toggle the date picker */
    fireEvent.click(wrapper.firstChild.firstChild);

    /**
     * current month is shown by default,
     * click on it to toggle month selector
     */
    const monthIndex = new Date().getMonth();
    const month = getByText(MONTHS_IN_A_YEAR[monthIndex]);

    fireEvent.click(month);

    /**
     * find a random month from the array of months in a year
     */
    const randomIndex = Math.floor(Math.random() * MONTHS_IN_A_YEAR.length);

    const sampleMonth = getByText(MONTHS_IN_A_YEAR[randomIndex]);
    expect(sampleMonth).toBeDefined();
  });
});
