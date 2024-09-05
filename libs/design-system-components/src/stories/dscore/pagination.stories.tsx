import type { Meta, StoryObj } from '@storybook/react';
import Pagination, {
  PaginationProps,
} from '@akashaorg/design-system-core/lib/components/Pagination';

Pagination.displayName = 'Pagination';

const meta: Meta<PaginationProps> = {
  title: 'DSCore/Pagination/Pagination',
  component: Pagination,
  argTypes: {
    pageCount: { control: 'number' },
    currentPage: { control: 'number' },
    maxPagesToShow: { control: 'number' },
    customStyle: { control: 'text' },
    prevButtonLabel: { control: 'text' },
    nextButtonLabel: { control: 'text' },
    hasButtons: { control: 'boolean' },
    prevButtonDisabled: { control: 'boolean' },
    nextButtonDisabled: { control: 'boolean' },
    onClickPage: { action: 'page clicked' },
    onClickPrev: { action: 'prev button clicked' },
    onClickNext: { action: 'next button clicked' },
  },
};

type Story = StoryObj<PaginationProps>;

export const Default: Story = { args: { pageCount: 10, currentPage: 1 } };

export const PaginationWithButtons: Story = {
  args: {
    pageCount: 10,
    currentPage: 2,
    prevButtonLabel: 'Prev',
    nextButtonLabel: 'Next',
  },
};

export const PaginationPrevDisabled: Story = {
  args: {
    pageCount: 10,
    currentPage: 1,
    prevButtonLabel: 'Prev',
    nextButtonLabel: 'Next',
    prevButtonDisabled: true,
  },
};

export const PaginationNextDisabled: Story = {
  args: {
    pageCount: 10,
    currentPage: 10,
    prevButtonLabel: 'Prev',
    nextButtonLabel: 'Next',
    nextButtonDisabled: true,
  },
};

export default meta;
