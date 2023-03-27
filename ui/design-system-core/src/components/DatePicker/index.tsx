import React, { useState, useEffect } from 'react';
import { useClickAway } from 'react-use';
import Icon from '../Icon';
import MonthSelector from './MonthSelector';
import DateSelector from './DateSelector';
import { tw } from '@twind/core';
import Text from '../Text';

const DatePicker = () => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [showDatepicker, setShowDatepicker] = useState(false);
  const [showMonthpicker, setShowMonthpicker] = useState(false);
  const [datepickerValue, setDatepickerValue] = useState('Selected Date');
  const [firstDate, setFirstDate] = useState(null);
  const [secondDate, setSecondDate] = useState(null);

  // Calculates the range in days between the first and second date
  const setSelectedDates = date => {
    const selectedDate = new Date(year, month, date);

    if (!firstDate) {
      setFirstDate(selectedDate);
      return;
    }

    // cannot select a second date that is prior to the first date selected
    if (selectedDate < firstDate) {
      return;
    }
    setSecondDate(selectedDate);
    setShowDatepicker(() => false);
  };

  // Checking to see if day is the first date
  const compareDate = (date, comparedDate = firstDate) => {
    const newDate = new Date(year, month, date);

    if (firstDate !== null && secondDate !== null) {
      return newDate.toDateString() == comparedDate.toDateString();
    }
  };

  useEffect(() => {
    // update input's content when both dates have been selected
    if (firstDate !== null && secondDate !== null) {
      setDatepickerValue(() => firstDate.toDateString() + ' - ' + secondDate.toDateString());
    }
  }, [firstDate, secondDate]);

  const handleMonthSelect = monthIndex => {
    setMonth(monthIndex);
    setShowMonthpicker(false);
    setShowDatepicker(true);
  };

  const handleMonthSelectToggle = () => {
    setShowDatepicker(false);
    setShowMonthpicker(true);
  };

  const wrapperRef = React.createRef<HTMLDivElement>();

  useClickAway(wrapperRef, () => {
    setShowDatepicker(false);
    setShowMonthpicker(false);
  });

  return (
    <div className={tw('w-full md:w-80')}>
      <div className={tw('relative')}>
        <div
          onClick={() => {
            setShowDatepicker(() => !showDatepicker);
            setShowMonthpicker(false);
          }}
          className={tw(
            `flex justify-start items-center border([1px] grey8) dark:border([1px] grey5) rounded-lg px-2 w-auto h-8 cursor-pointer ${
              showDatepicker && 'border(2 secondary-light) dark:border(2 secondary-dark)'
            })`,
          )}
        >
          <Icon type="CalendarIcon" accentColor={true} />
          <Text
            variant="body2"
            color={{ light: 'text-black', dark: 'text-grey6' }}
            customStyle="ml-2"
          >
            {datepickerValue.toString()}
          </Text>
        </div>
        <div ref={wrapperRef} className="w-full h-full">
          {showDatepicker && (
            <DateSelector
              month={month}
              setMonth={setMonth}
              year={year}
              setYear={setYear}
              handleMonthSelectToggle={handleMonthSelectToggle}
              compareDate={compareDate}
              firstDate={firstDate}
              setFirstDate={setFirstDate}
              secondDate={secondDate}
              setSecondDate={setSecondDate}
              setSelectedDates={setSelectedDates}
            />
          )}
          {showMonthpicker && (
            <MonthSelector
              currentMonth={month}
              currentYear={year}
              handleMonthSelect={handleMonthSelect}
              goToNextYear={() => setYear(year => year + 1)}
              goToPreviousYear={() => setYear(year => year - 1)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
