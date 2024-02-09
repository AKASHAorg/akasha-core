import React from 'react';
import { apply, tw } from '@twind/core';

import Stack from '../Stack';
import Text from '../Text';
import Icon from '../Icon';
import { ChevronRightIcon } from '../Icon/hero-icons-outline';

type TDataValues = string[];

export type TableProps = {
  tableTitle?: string;
  theadValues?: string[];
  rows: TDataValues[];
  hasIcons?: boolean;
  clickableRows?: boolean;
  customTdStyle?: string;
  onRowClick?: (contentId: string) => void;
};

const Table: React.FC<TableProps> = props => {
  const {
    tableTitle,
    theadValues,
    rows,
    hasIcons = false,
    clickableRows = false,
    customTdStyle = '',
    onRowClick,
  } = props;

  const handleRowClick = (contentId: string) => () => {
    if (clickableRows && typeof onRowClick === 'function') {
      onRowClick(contentId);
    }
  };

  const generateTdValue = (idx: number, value: string) => {
    if (hasIcons && idx === 2) {
      return (
        <div className={tw('flex space-x-1.5 items-center')}>
          <div
            className={tw(
              `w-2 h-2 rounded-full ${
                ['Kept', 'Accepted'].includes(value)
                  ? 'bg-success'
                  : 'bg(errorLight dark:errorDark)'
              }`,
            )}
          />
          <Text variant="body2">{value}</Text>
        </div>
      );
    }

    if (hasIcons && idx === 3) {
      return <Icon icon={<ChevronRightIcon />} accentColor={true} />;
    }
    return <Text variant="body2">{value}</Text>;
  };

  const baseTdStyle = apply(`py-4 px-5 ${customTdStyle}`);

  return (
    <>
      {tableTitle && (
        <Stack
          padding="py-4 px-5"
          fullWidth={true}
          customStyle="border(b-1 solid grey8 dark:grey5)"
        >
          <Text weight="bold" align="center">
            {tableTitle}
          </Text>
        </Stack>
      )}

      <table className={tw('table-auto w-full')}>
        {theadValues && (
          <thead>
            <tr>
              {theadValues.map((value, idx) => (
                <th key={value + idx} className={tw(baseTdStyle)}>
                  <Text>{value}</Text>
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((valueArr, idx) => (
            <tr
              key={idx}
              className={tw(
                `${
                  !theadValues && idx === 0 ? 'border-none' : 'border(t-1 grey8 dark:grey5)'
                } cursor-${clickableRows ? 'pointer' : 'default'}`,
              )}
              onClick={handleRowClick(valueArr[3])}
            >
              {valueArr.map((value, idx) => (
                <td
                  key={value + idx}
                  className={`${baseTdStyle} ${hasIcons && idx === 3 ? 'flex justify-end' : ''}`}
                >
                  {generateTdValue(idx, value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
export default Table;
