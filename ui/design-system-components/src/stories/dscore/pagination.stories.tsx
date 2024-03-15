import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Pagination, {
  PaginationProps,
} from '@akashaorg/design-system-core/lib/components/Pagination';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

const meta: Meta<PaginationProps> = {
  title: 'DSCore/Pagination/Pagination',
  component: Pagination,
};

export default meta;
type Story = StoryObj<PaginationProps>;

const variants: Pick<PaginationProps, 'prevButtonLabel' | 'nextButtonLabel' | 'hasButtons'>[] = [
  {
    prevButtonLabel: 'Prev',
    nextButtonLabel: 'Next',
  },
  {
    hasButtons: false,
  },
];

const Component = () => {
  const pages = 10;
  const [curPage, setCurPage] = useState<number>(1);

  const handleClickPage = (page: number) => {
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
    <Stack direction="column" spacing="gap-y-2" customStyle="w-[50%]">
      {variants.map((variant, idx) => (
        <Pagination
          key={idx}
          {...variant}
          pageCount={pages}
          currentPage={curPage}
          prevButtonDisabled={curPage === 1}
          nextButtonDisabled={curPage === pages}
          onClickPage={handleClickPage}
          onClickPrev={handleClickPrev}
          onClickNext={handleClickNext}
        />
      ))}
    </Stack>
  );
};

export const PaginationVariants: Story = {
  render: () => <Component />,
};
