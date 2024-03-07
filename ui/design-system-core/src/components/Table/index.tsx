import React from 'react';
import { apply, tw } from '@twind/core';
import Stack from '../Stack';
import Text from '../Text';

type TDataValues = { value: React.ReactNode[]; clickHandler?: () => void };

export type TableProps = {
  tableTitle?: string;
  theadValues?: React.ReactNode[];
  rows: TDataValues[];
  customTdStyle?: string;
};

const Table: React.FC<TableProps> = props => {
  const { tableTitle, theadValues, rows, customTdStyle = '' } = props;

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
                <th key={idx} className={tw(baseTdStyle)}>
                  {value}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className={tw(
                `${
                  !theadValues && idx === 0 ? 'border-none' : 'border(t-1 grey8 dark:grey5)'
                } cursor-${typeof row.clickHandler == 'function' ? 'pointer' : 'default'}`,
              )}
              onClick={row.clickHandler}
            >
              {row.value.map((value, idx) => (
                <td key={idx} className={baseTdStyle}>
                  {value}
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
