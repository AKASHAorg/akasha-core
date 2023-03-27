import React from 'react';
import Icon from '../Icon';
import { MONTHS_IN_A_YEAR } from './calendarHelpers';
import { tw, tx } from '@twind/core';
import Button from '../Button';
import Text from '../Text';

const baseMonthCellStyle = 'grid place-items-center w-full h-full py-3';
export const selectedCellStyle = 'text-white bg-secondary-light dark:bg-secondary-dark rounded-lg';
export const unselectedCellStyle = 'text-grey5 dark:text-grey7';

interface MonthSelectorProps {
  currentMonth: number;
  currentYear: number;
  handleMonthSelect: (index: number) => void;
  goToNextYear: () => void;
  goToPreviousYear: () => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({
  currentMonth,
  currentYear,
  handleMonthSelect,
  goToNextYear,
  goToPreviousYear,
}) => {
  const displayMonths = MONTHS_IN_A_YEAR.map((month, index) => {
    return (
      <Button
        plain={true}
        customStyle={`${baseMonthCellStyle}
          ${currentMonth === index ? selectedCellStyle : unselectedCellStyle}`}
        key={index}
        onClick={() => handleMonthSelect(index)}
      >
        {month}
      </Button>
    );
  });

  return (
    <div
      className={tw(
        'mt-10 bg-white dark:bg-grey3 rounded-lg shadow p-4 w-full absolute top-0 left-0',
      )}
    >
      <div className={tw('flex justify-between items-center')}>
        <div>
          <Button onClick={goToPreviousYear} plain={true}>
            <Icon type="ChevronLeftIcon" accentColor={true} hover={true} />
          </Button>
        </div>
        <div>
          <Text variant="h6" color={{ light: 'text-secondary-light', dark: 'text-secondary-dark' }}>
            {currentYear}
          </Text>
        </div>
        <div>
          <Button onClick={goToNextYear} plain={true}>
            <Icon type="ChevronRightIcon" accentColor={true} hover={true} hoverColor="white" />
          </Button>
        </div>
      </div>
      <div className={tx('grid grid-cols-3 justify-items-center mt-3')}>{displayMonths}</div>
    </div>
  );
};

export default MonthSelector;
