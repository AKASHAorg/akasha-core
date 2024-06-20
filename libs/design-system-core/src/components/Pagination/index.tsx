import React from 'react';

import Stack from '../Stack';
import Button from '../Button';
import Text from '../Text';

import PageBubble from './page-bubble';

import { Color } from '../types/common.types';

export type PaginationProps = {
  pageCount: number;
  currentPage: number;
  maxPagesToShow?: number;
  customStyle?: string;
  prevButtonLabel?: string;
  nextButtonLabel?: string;
  hasButtons?: boolean;
  prevButtonDisabled?: boolean;
  nextButtonDisabled?: boolean;
  onClickPage: (page: number) => void;
  onClickPrev: () => void;
  onClickNext: () => void;
};

/**
 * A Pagination component makes it easier to navigate through a large set of data by showing
 * a subset of the data per page and making sure the user can navigate back and forth between
 * the pages easily with controls.
 * @param pageCount - number that is the total number of pages
 * @param currentPage - number that is of the current page
 * @param maxPagesToShow - (optional) maximum number of pages to present to the user at any given time
 * @param prevButtonLabel - (optional) label for the prev button
 * @param nextButtonLabel - (optional) label for the next button
 * @param hasButtons - boolean (optional) whether to display the buttons
 * @param prevButtonDisabled - boolean (optional) whether to disable the prev button
 * @param nextButtonDisabled - boolean (optional) whether to disable the next button
 * @param nextButtonLabel - (optional) label for the next button
 * @param customStyle - (optional) apply your custom styling (Make sure to use standard Tailwind classes)
 * @param onClickPage - handler that will be called when clicking on the current page
 * @param onClickPrev - handler that will be called when clicking on the prev page
 * @param onClickNext - handler that will be called when clicking on the next page
 * @example
 * ```tsx
 *    <Pagination
        pageCount={10}
        currentPage={2}
        prevButtonDisabled={false}
        prevButtonLabel="Previous"
        nextButtonLabel="Next"
        onClickPrev={handleClickPrev}
        onClickPage={handleClickPage}
        onClickNext={handleClickNext}
      />
 * ```
 **/
const Pagination: React.FC<PaginationProps> = props => {
  const {
    pageCount,
    currentPage,
    maxPagesToShow = 6,
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
  const trimBubbles = pageCount - maxPagesToShow >= 2;

  const activeButtonTextColor: Color = { light: 'secondaryLight', dark: 'secondaryDark' };

  const disabledButtonTextColor = 'grey7';

  const getPage = () => {
    if (currentPage < maxPagesToShow) return maxPagesToShow;
    else if (currentPage === pageCount) return pageCount - 1;
    else return currentPage;
  };

  return (
    <Stack direction="row" align="center" spacing="gap-x-2" customStyle={customStyle}>
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

      {pages.map((page, idx) => {
        const isActive = page === currentPage;

        return (
          <React.Fragment key={page}>
            {/* SHOW INITIAL BUBBLES */}
            {/*
             * if:
             * idx is less than maxPagesToShow (means pageCount is less than or equal to maxPagesToShow)
             */}
            {idx < maxPagesToShow && !trimBubbles && (
              <PageBubble isActive={isActive} page={page} onClickPage={onClickPage} />
            )}

            {/*
             * if:
             * pagesCount is at least 2 more than maxPagesToShow, trim at an index less to give room for dynamic bubble
             */}
            {trimBubbles && idx < maxPagesToShow - 1 && (
              <PageBubble isActive={isActive} page={page} onClickPage={onClickPage} />
            )}

            {/*
             * SHOW DYNAMIC PAGE BUBBLE if:
              - idx is equal to maxPagesToShow and
              - maxPagesToShow is at least 2 less than pageCount
             */}
            {idx === maxPagesToShow && trimBubbles && (
              <PageBubble
                isActive={currentPage > maxPagesToShow - 1 && currentPage !== pageCount}
                page={getPage()}
                onClickPage={onClickPage}
              />
            )}

            {/*
             * SHOW ELLIPSIS if:
              - idx is one less than pageCount and
              - maxPagesToShow is at least 2 less than pageCount
             */}
            {idx === pageCount - 1 && trimBubbles && <Text weight="bold">. . .</Text>}

            {/*
             * SHOW LAST BUBBLE if:
              - maxPagesToShow is less than pageCount and
              - idx is the last element
             */}
            {maxPagesToShow < pageCount && idx === pageCount - 1 && (
              <PageBubble
                isActive={isActive}
                page={pages[pageCount - 1]}
                onClickPage={onClickPage}
              />
            )}
          </React.Fragment>
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
    </Stack>
  );
};

export default Pagination;
