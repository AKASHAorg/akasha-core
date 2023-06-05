import React from 'react';
import { apply, tw } from '@twind/core';

import Box from '../Box';
import Text from '../Text';
import Icon from '../Icon';

type TDataValues = string[];

export interface ITableProps {
  tableTitle?: string;
  theadValues?: string[];
  rows: TDataValues[];
  hasIcons?: boolean;
  clickableRows?: boolean;
  customTdStyle?: string;
  onRowClick?: (contentId: string) => void;
}

const Table: React.FC<ITableProps> = props => {
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

  const baseTdStyle = apply(`py-4 px-5 ${customTdStyle}`);

  return (
    <>
      {tableTitle && (
        <Box customStyle="w-full py-4 px-5">
          <Text weight="bold" align="center">
            {tableTitle}
          </Text>
        </Box>
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
                  {hasIcons && idx === 2 ? (
                    <div className={tw('flex space-x-1.5 items-center')}>
                      <div
                        className={tw(
                          `w-2 h-2 rounded-full ${
                            value === 'Kept' ? 'bg-success' : 'bg(errorLight dark:errorDark)'
                          }`,
                        )}
                      />
                      <Text variant="body2">{value}</Text>
                    </div>
                  ) : hasIcons && idx === 3 ? (
                    <Icon type="ChevronRightIcon" accentColor={true} />
                  ) : (
                    <Text variant="body2">{value}</Text>
                  )}
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
