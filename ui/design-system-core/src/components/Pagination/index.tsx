import React from 'react';

import Box from '../Box';
import Button from '../Button';
import Text from '../Text';
import { Color } from '../types/common.types';

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

  // show buttons only when specified and there's more than a page
  const showButtons = hasButtons && pageCount > 1;

  const activeButtonTextColor: Color = { light: 'secondaryLight', dark: 'secondaryDark' };

  const disabledButtonTextColor = 'text(secondaryLight dark:secondaryDark)';

  const basePageWrapperStyle = 'flex items-center justify-center w-8 h-8 rounded-full';

  const activePageWrapperBg = 'bg-(secondaryLight dark:secondaryDark)';

  const regularPageWrapperBg = 'bg-(grey8 dark:grey3)';

  return (
    <Box customStyle={`flex items-center space-x-2 ${customStyle}`}>
      {showButtons && (
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
                  light: isActive ? 'white' : 'black',
                  dark: isActive ? 'black' : 'white',
                }}
              >
                {page}
              </Text>
            </Box>
          </Button>
        );
      })}

      {showButtons && (
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
