import React from 'react';
import { apply, tw } from '@twind/core';
import Text from '../Text';
import Icon from '../Icon';
import Button from '../Button';

type TDataValues = string[];

export interface ITableProps {
  theadValues: string[];
  rows: TDataValues[];
  hasIcons?: boolean;
  onIconClick?: (contentId: string) => void;
}

const Table: React.FC<ITableProps> = props => {
  const { theadValues, rows, hasIcons = false, onIconClick } = props;

  const handleIconClick = (contentId: string) => () => {
    if (typeof onIconClick === 'function') {
      onIconClick(contentId);
    }
  };

  const baseRowStyle = apply('py-4 px-5');

  return (
    <table className={tw('table-auto')}>
      <thead>
        <tr>
          {theadValues.map((value, idx) => (
            <th key={value + idx} className={tw(baseRowStyle)}>
              <Text color={{ light: 'text-black', dark: 'text-white' }}>{value}</Text>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((valueArr, idx) => (
          <tr key={idx} className={tw('border(t-1 grey8 dark:grey5)')}>
            {valueArr.map((value, idx) => (
              <td key={value + idx} className={baseRowStyle}>
                {hasIcons && idx === 2 ? (
                  <div className={tw('flex space-x-1.5 items-center')}>
                    <div
                      className={tw(
                        `w-2 h-2 rounded-full ${
                          value === 'Kept' ? 'bg-success' : 'bg(error-light dark:error-dark)'
                        }`,
                      )}
                    />
                    <Text variant="body2" color={{ light: 'text-black', dark: 'text-white' }}>
                      {value}
                    </Text>
                  </div>
                ) : hasIcons && idx === 3 ? (
                  <Button plain={true} onClick={handleIconClick(value)}>
                    <Icon type="ChevronRightIcon" accentColor={true} />
                  </Button>
                ) : (
                  <Text variant="body2" color={{ light: 'text-black', dark: 'text-white' }}>
                    {value}
                  </Text>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default Table;
