import React, { useState, useEffect } from 'react';
import Icon from '../Icon';
import { MONTHS_IN_A_YEAR, DAYS } from './calendarHelpers';
import { tx } from '@twind/core';
import { selectedCellStyle, unselectedCellStyle } from './MonthSelector';
import Button from '../Button';
import Text from '../Text';

const DateSelector = ({
  month,
  setMonth,
  year,
  setYear,
  firstDate,
  setFirstDate,
  secondDate,
  setSecondDate,
  setSelectedDates,
  handleMonthSelectToggle,
  compareDate,
}) => {
  const [currentMonthDays, setCurrentMonthDays] = useState([]);
  const [previousMonthDays, setPreviousMonthDays] = useState([]);
  const [nextMonthDays, setNextMonthDays] = useState([]);

  useEffect(() => {
    getNoOfDays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  const deselectDates = date => {
    if (!isInThePast(date)) {
      const selectedDate = new Date(year, month, date);

      setFirstDate(selectedDate);
      setSecondDate(null);
    }
  };

  // Checks if the day is the current day
  const isToday = date => {
    const today = new Date();
    const newDate = new Date(year, month, date);

    return today.toDateString() === newDate.toDateString() ? true : false;
  };

  // Checks if  day is in the past
  const isInThePast = date => {
    const today = new Date();
    const newDate = new Date(year, month, date);
    return newDate.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0) ? true : false;
  };

  // Calculates the number of days in the given month
  const getNoOfDays = () => {
    // get the number of days in the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // get the day of week that the first day of the month falls in
    const dayOfWeek = new Date(year, month).getDay();

    const currentMonthDaysArray = [];
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDaysArray.push(i);
    }

    /* Calculate days of previous month prior to current month */
    let daysInPreviousMonth = new Date(year, month, 0).getDate();
    const previousMonthDaysArray = [];
    for (let i = 1; i <= dayOfWeek; i++) {
      previousMonthDaysArray.push(daysInPreviousMonth--);
    }

    /* Calculate days of next month to be displayed  */
    // get the day of week that the last day of the current month falls in
    const dayOfWeekofLastDayofMonth = new Date(year, month + 1, 0).getDay();
    const nextMonthDaysArray = [];
    for (let i = 1; i <= 6 - dayOfWeekofLastDayofMonth; i++) {
      nextMonthDaysArray.push(i);
    }

    setPreviousMonthDays(() => previousMonthDaysArray.reverse());
    setNextMonthDays(() => nextMonthDaysArray);
    setCurrentMonthDays(() => currentMonthDaysArray);
  };

  // Checking to see if the date has been selected or not
  const checkIfDayIsFirstOrSecondDate = date => {
    const newDate = new Date(year, month, date);

    if (firstDate !== null && secondDate !== null) {
      return (
        newDate.toDateString() == firstDate.toDateString() ||
        newDate.toDateString() == secondDate.toDateString()
      );
    }

    if (firstDate !== null) {
      return newDate.toDateString() == firstDate.toDateString();
    }
    return false;
  };

  // Checking to see which days are between the first and second date
  const inBetweenDays = date => {
    const newDate = new Date(year, month, date);

    if (firstDate !== null && secondDate !== null) {
      return newDate <= secondDate && newDate >= firstDate;
    }
  };

  const getNextMonth = (month, year) => {
    const nextMonth = month < 11 ? month + 1 : 0;
    const nextMonthYear = month < 11 ? year : year + 1;
    setMonth(nextMonth);
    setYear(nextMonthYear);
  };

  const getPreviousMonth = (month, year) => {
    const prevMonth = month > 0 ? month - 1 : 11;
    const prevMonthYear = month > 0 ? year : year - 1;
    setMonth(prevMonth);
    setYear(prevMonthYear);
  };

  const applyCellClasses = day => {
    const baseStyle = 'text-center text-sm leading-loose w-7 font-skylight';
    const isClickEnabled = isInThePast(day) ? 'pointer-events-none' : 'cursor-pointer';
    const isTodayStyle = isToday(day) ? 'font-bold' : '';
    const selectedDayStyle = checkIfDayIsFirstOrSecondDate(day)
      ? 'text-white bg-secondary-light dark:bg-secondary-dark rounded-lg'
      : inBetweenDays(day)
      ? 'bg-secondary-light dark:bg-secondary-dark text-white'
      : '';
    return `${baseStyle} ${unselectedCellStyle} ${isClickEnabled} ${isTodayStyle} ${selectedDayStyle}`;
  };

  const displayDayTitles = DAYS.map((day, index) => {
    return (
      <div className={tx('px-1')} key={index}>
        <div
          key={index}
          className={tx(
            'text-grey4 dark:text-white font-medium text-center text-xs w-7 font-skylight',
          )}
        >
          {/* {day} */}
          <Text variant="footnotes2" color={{ light: 'text-grey4', dark: 'text-white' }}>
            {day}
          </Text>
        </div>
      </div>
    );
  });

  const displayCurrentMonthDays = currentMonthDays.map((day, index) => {
    return (
      <div
        className={tx(
          `${inBetweenDays(day) ? 'px-1 bg-secondary-light dark:bg-secondary-dark' : 'px-1'}
                    ${compareDate(day) && 'rounded-l-lg'}
                    ${compareDate(day, secondDate) && 'rounded-r-lg'} 
                    mb-1
                    `,
        )}
        key={index}
        onClick={secondDate ? () => deselectDates(day) : null}
      >
        <Button
          key={index}
          plain={true}
          onClick={() => {
            !secondDate ? setSelectedDates(day) : deselectDates;
          }}
          className={tx(applyCellClasses(day))}
        >
          {day}
        </Button>
      </div>
    );
  });

  return (
    <>
      <div
        className={tx(
          'bg-white dark:bg-grey3 mt-10 rounded-lg shadow p-4 absolute top-0 left-0 w-full',
        )}
      >
        <div className={tx('flex justify-between items-center')}>
          <div>
            <Button onClick={() => getPreviousMonth(month, year)} plain={true}>
              <Icon type="ChevronLeftIcon" accentColor={true} hover={true} />
            </Button>
          </div>
          <div onClick={handleMonthSelectToggle} className={tx('flex')}>
            {/* <span className={tx('text-lg font-bold text-gray-800 font-skylight')}>
              {MONTHS_IN_A_YEAR[month]}
            </span> */}
            <Text variant="button-lg" color={{ light: 'text-black', dark: 'text-white' }}>
              {MONTHS_IN_A_YEAR[month]}
            </Text>
            {/* <span className={tx('ml-1 text-lg text-gray-600 font-normal font-skylight')}>
              {year}
            </span> */}
            <Text
              variant="button-lg"
              color={{ light: 'text-black', dark: 'text-white' }}
              customStyle="ml-1"
            >
              {year}
            </Text>
          </div>
          <div>
            <Button onClick={() => getNextMonth(month, year)} plain={true}>
              <Icon type="ChevronRightIcon" accentColor={true} hover={true} />
            </Button>
          </div>
        </div>
        <div className={tx('grid grid-cols-7 justify-items-center mt-3')}>{displayDayTitles}</div>
        <div className={tx('grid grid-cols-7')}>
          {previousMonthDays.map((day, index) => {
            return (
              <div className={tx('px-1 mb-1')} key={index}>
                <div key={index} className={tx('pointer-events-none w-7')}>
                  <Text variant="button-md" color={{ light: 'text-grey8', dark: 'text-grey5' }}>
                    {day}
                  </Text>
                  {/* {day} */}
                </div>
              </div>
            );
          })}
          {displayCurrentMonthDays}
          {nextMonthDays.map((day, index) => {
            return (
              <div className={tx('px-1 mb-1')} key={index}>
                <div key={index} className={tx('pointer-events-none text-center')}>
                  <Text variant="button-md" color={{ light: 'text-grey8', dark: 'text-grey5' }}>
                    {day}
                  </Text>
                  {/* {day} */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default DateSelector;
