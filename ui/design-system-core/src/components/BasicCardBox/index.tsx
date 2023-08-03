import React, { PropsWithChildren } from 'react';
import { apply, tw } from '@twind/core';

export type BasicCardBoxProps = {
  elevation?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner' | 'none';
  dashedBorder?: boolean;
  accentBorder?: boolean;
  rootNodeRef?: React.Ref<HTMLDivElement>;
  pad?: string;
  margin?: string;
  round?: string;
  border?: boolean;
  noBorderRadius?: boolean;
  customStyle?: string;
  onClick?: () => void;
  tabIndex?: number;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
};

const BasicCardBox: React.FC<PropsWithChildren<BasicCardBoxProps>> = props => {
  const {
    children,
    elevation = '[0_0_4px_rgba(0,0,0,0.2)]',
    dashedBorder,
    accentBorder,
    rootNodeRef,
    pad = 'p-6',
    margin = 'm-0',
    round = 'rounded-2xl',
    border,
    noBorderRadius,
    customStyle = '',
    tabIndex = 0,
    onKeyDown = () => {
      void 0;
    },
    onClick,
  } = props;

  const generatedBorder = React.useMemo(() => {
    if (dashedBorder) {
      return 'border(2 dashed grey5)';
    }

    if (border) {
      return 'border(1 solid grey9 dark:grey3)';
    }
    if (accentBorder) {
      return 'border(1 solid secondaryLight dark:secondaryDark)';
    }

    /**
     * Define other border-changing props here
     */

    return 'border-none';
  }, [dashedBorder, border, accentBorder]);

  const className = React.useMemo(
    () =>
      apply`flex flex-col shadow-${elevation} w-full ${pad} ${margin} bg(white dark:grey2) ${
        noBorderRadius ? 'rounded-none' : round
      } ${generatedBorder} ${customStyle}`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [generatedBorder],
  );

  return (
    <div
      className={tw(className)}
      role={onClick ? 'button' : 'presentation'}
      tabIndex={tabIndex}
      ref={rootNodeRef}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
};

export default BasicCardBox;
