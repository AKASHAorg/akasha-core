import { tw } from '@twind/core';
import React, { PropsWithChildren } from 'react';

import { IBasicCardBox } from '../../interfaces/basicCardBox.interface';

const BasicCardBox: React.FC<PropsWithChildren<IBasicCardBox>> = props => {
  const {
    children,
    elevation = 'none',
    dashedBorder,
    rootNodeRef,
    pad = 'p-6',
    margin,
    round = 'rounded-2xl',
    noBorder,
    noBorderRadius,
    onClick,
  } = props;

  const generateBorder = () => {
    if (dashedBorder) {
      return 'border-2 border-dashed border-grey5';
    }

    if (noBorder) {
      return 'border-none';
    }

    /**
     * Define other border-changing props here
     */

    return 'border-2 border-solid border-grey5';
  };

  const className = `flex flex-col shadow-${elevation} w-full ${pad ? pad : 'p-0'} ${
    margin ? margin : 'm-0'
  } bg-white dark:bg-grey2 ${noBorderRadius ? 'rounded-none' : round} ${generateBorder()}`;

  return (
    <div className={tw(className)} ref={rootNodeRef} onClick={onClick}>
      {children}
    </div>
  );
};

export default BasicCardBox;
