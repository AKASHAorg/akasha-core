import React from 'react';
import { tw } from '@twind/core';

import Pagination, { IPaginationProps } from '.';

export default {
  title: 'Pagination/Pagination',
  component: Pagination,
};

const Template = (args: IPaginationProps) => {
  const pages = 10;
  const [curPage, setCurPage] = React.useState<number>(1);

  const handleClickPage = (page: number) => () => {
    setCurPage(page);
  };

  const handleClickPrev = () => {
    if (!(curPage === 1)) {
      setCurPage(curPage - 1);
    }
  };

  const handleClickNext = () => {
    if (!(curPage === pages)) {
      setCurPage(curPage + 1);
    }
  };

  return (
    <div className={tw('w-[50%]')}>
      <Pagination
        {...args}
        pageCount={pages}
        currentPage={curPage}
        prevButtonDisabled={curPage === 1}
        nextButtonDisabled={curPage === pages}
        onClickPage={handleClickPage}
        onClickPrev={handleClickPrev}
        onClickNext={handleClickNext}
      />
    </div>
  );
};

export const BasicPagination = Template.bind({});

BasicPagination.args = {
  prevButtonLabel: 'Prev',
  nextButtonLabel: 'Next',
};

export const PaginationWithoutButtons = Template.bind({});

PaginationWithoutButtons.args = {
  hasButtons: false,
};
