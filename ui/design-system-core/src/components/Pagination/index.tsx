import React from 'react';

import Box from '../Box';
import Button from '../Button';
import Text from '../Text';

export interface IPaginationProps {
  pageCount: number;
  currentPage: number;
  customStyle?: string;
  prevButtonLabel: string;
  nextButtonLabel: string;
  hasButtons?: boolean;
  prevButtonDisabled?: boolean;
  nextButtonDisabled?: boolean;
  onClickPage: (page: number) => () => void;
  onClickPrev: () => void;
  onClickNext: () => void;
}

const Pagination: React.FC<IPaginationProps> = props => {
  const {
    pageCount,
    currentPage,
    customStyle = '',
    prevButtonLabel,
    nextButtonLabel,
    hasButtons = true,
    prevButtonDisabled = false,
    nextButtonDisabled = false,
    onClickPage,
    onClickPrev,
    onClickNext,
  } = props;

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  const activeButtonTextColor = { light: 'text-secondary-light', dark: 'text-secondary-dark' };

  const disabledButtonTextColor = 'text(secondary-light dark:secondary-dark)';

  const basePageWrapperStyle = 'flex items-center justify-center w-8 h-8 rounded-full';

  const activePageWrapperBg = 'bg-(secondary-light dark:secondary-dark)';

  const regularPageWrapperBg = 'bg-(grey8 dark:grey3)';

  return (
    <Box customStyle={`flex items-center space-x-2 ${customStyle}`}>
      {hasButtons && (
        <Button
          plain={true}
          customStyle={prevButtonDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          onClick={onClickPrev}
        >
          <Text
            variant="label"
            weight="bold"
            color={prevButtonDisabled ? disabledButtonTextColor : activeButtonTextColor}
          >
            {prevButtonLabel}
          </Text>
        </Button>
      )}

      {pages.map(page => {
        const isActive = page === currentPage;
        return (
          <Button key={page} plain={true} onClick={onClickPage(page)}>
            <Box
              customStyle={`${basePageWrapperStyle} ${
                isActive ? activePageWrapperBg : regularPageWrapperBg
              }`}
            >
              <Text
                variant="body2"
                weight="bold"
                color={{
                  light: isActive ? 'text-white' : 'text-black',
                  dark: isActive ? 'text-black' : 'text-white',
                }}
              >
                {page}
              </Text>
            </Box>
          </Button>
        );
      })}

      {hasButtons && (
        <Button
          plain={true}
          customStyle={nextButtonDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          onClick={onClickNext}
        >
          <Text
            variant="label"
            weight="bold"
            color={nextButtonDisabled ? disabledButtonTextColor : activeButtonTextColor}
          >
            {nextButtonLabel}
          </Text>
        </Button>
      )}
    </Box>
  );
};

export default Pagination;
