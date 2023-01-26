import { tw } from '@twind/core';
import React, { PropsWithChildren } from 'react';

import { IBasicCardBox } from '../../interfaces/basicCardBox.interface';

const BasicCardBox: React.FC<PropsWithChildren<IBasicCardBox>> = props => {
  const {
    children,
    elevation = 'none',
    callToAction,
    dashedBorder,
    redDashedBorder,
    darkBorder,
    rootNodeRef,
    pad = 'p-6',
    margin,
    round = 'rounded-md',
    noBorder,
    noBorderRadius,
    bottomBorderOnly,
    accentBorderTop,
    isSelected,
    onClick,
  } = props;

  const generateBorder = () => {
    if (callToAction) {
      return 'border-2 border-solid border-[#8b9FFF]';
    }

    if (dashedBorder) {
      return `border-2 border-dashed border-[${redDashedBorder ? '#FF5050' : '#B6BFD1'}]`;
    }

    if (darkBorder) {
      return 'border-2 border-solid border-[#B6BFD1]';
    }

    if (isSelected) {
      return 'border-l-2 border-solid border-[#8b9FFF]';
    }

    if (bottomBorderOnly) {
      return 'border-b-2 border-solid border-[#425166]';
    }

    if (accentBorderTop) {
      return 'border-t-2 border-solid border-[#8b9FFF]';
    }

    if (noBorder) {
      return 'border-none';
    }

    return 'border-2 border-solid border-[#425166]';
  };

  const className = `flex flex-col shadow-${elevation} w-full ${pad ? pad : 'p-0'} ${
    margin ? margin : 'm-0'
  } bg-[${isSelected ? '#F6F8FF' : '#FFF'}] dark:bg-[${isSelected ? '#F6F8FF' : '#132540'}] ${
    noBorderRadius ? 'rounded-none' : round
  } ${generateBorder()}`;

  console.log({ className });

  return (
    <div className={tw(className)} ref={rootNodeRef} onClick={onClick}>
      {children}
    </div>
  );
};

export default BasicCardBox;
