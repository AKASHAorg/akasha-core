import React from 'react';
import { tw } from '@twind/core';
import Stack from '../Stack';
import Text from '../Text';

type TDataValues = { value: React.ReactNode[]; clickHandler?: () => void };

export type TableProps = {
  tableTitle?: string;
  theadValues?: React.ReactNode[];
  rows: TDataValues[];
  customThStyle?: string;
  customTdStyle?: string;
};

/**
 * The Table component makes it easy to display data in a tabular format with rows and columns.
 * @param tableTitle - (optional) supply the table title if there is any.
 * @param theadValues - (optional) a list of table head values if there are any
 * @param rows - an array of table data
 * @param customThStyle - (optional) for customizing the table head
 * @param customTdStyle - (optional) for customizing the table data rows
 * @example
 * ```tsx
 * const theadValues = [
 *     <Text key={0}>Song</Text>,
 *     <Text key={1}>Artist</Text>,
 *     <Text key={2}>Year</Text>,
 *   ];
 *
 * const rows = [
 *   {
 *     value: [
 *       <Text key={0}>The Sliding Mr. Bones (Next Stop, Pottersville)</Text>,
 *       <Text key={1}>Malcolm Lockyer</Text>,
 *       <Text key={2}>1961</Text>,
 *     ],
 *     clickHandler: () => {},
 *   },
 *   {
 *     value: [
 *       <Text key={0}>Witchy woman</Text>,
 *       <Text key={1}>The Eagles</Text>,
 *       <Text key={2}>1972</Text>,
 *     ],
 *     clickHandler: () => {},
 *   },
 *   {
 *     value: [
 *       <Text key={0}>Shining Star</Text>,
 *       <Text key={1}>Earth, Wind, and Fire</Text>,
 *       <Text key={2}>1975</Text>,
 *     ],
 *     clickHandler: () => {},
 *   },
 * ];
 *  <Table
 *      theadValues={theadValues}
 *      rows={rows}
 *   />
 * ```
 **/
const Table: React.FC<TableProps> = props => {
  const { tableTitle, theadValues, rows, customThStyle = '', customTdStyle = '' } = props;

  const thStyle = `py-4 px-5 ${customThStyle}`;
  const tdStyle = `py-4 px-5 ${customTdStyle}`;

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
                <th key={idx} className={tw(thStyle)}>
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
                <td key={idx} className={tw(tdStyle)}>
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
