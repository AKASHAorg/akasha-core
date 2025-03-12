import React, { MouseEventHandler } from 'react';

export type BlockError = {
  errorTitle: string;
  errorDescription: string;
};

type BlockErrorCardProps = BlockError & {
  refreshLabel?: string;
  onRefresh?: MouseEventHandler<HTMLButtonElement>;
};

export const BlockErrorCard: React.FC<BlockErrorCardProps> = props => {
  const { errorTitle, errorDescription, refreshLabel, onRefresh } = props;
  return (
    <div className="flex flex-row this-is-an-error-block">
      <div className="flex flex-col bg-errorLight dark:bg-errorDark p-0 w-2.5 rounded-l-[0.5rem] border border-errorLight dark:border-errorDark" />
      <div className="flex flex-col bg-errorLight/30 dark:bg-errorDark/30 p-2 gap-y-1 w-full rounded-r-[0.5rem] border border-errorLight dark:border-errorDark">
        <div className="flex flex-row p-0 items-center gap-x-1">
          <p className="block text-[0.875rem] leading-[1.5rem] font-bold text-black dark:text-white text-start">
            {errorTitle}
          </p>
        </div>
        <p className="text-[0.75rem] leading-[1.125rem] font-medium text-black dark:text-white text-start font-normal">
          {errorDescription}
        </p>
        {refreshLabel && (
          <button
            onClick={onRefresh}
            className={`text-sm inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-bold
                  transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none
                  [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40
                  outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0 cursor-pointer
                  text-primary underline-offset-4 hover:underline h-10 px-4 py-2 ml-auto mt-auto`}
          >
            {refreshLabel}
          </button>
        )}
      </div>
    </div>
  );
};
