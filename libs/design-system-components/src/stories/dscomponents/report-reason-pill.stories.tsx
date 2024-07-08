import type { Meta, StoryObj } from '@storybook/react';
import ReportReasonPill, { ReportReasonPillProps } from '../../components/ReportReasonPill';

const meta: Meta<ReportReasonPillProps> = {
  title: 'DSComponents/Vibes/ReportReasonPill',
  component: ReportReasonPill,
  tags: ['autodocs'],
};

type Story = StoryObj<ReportReasonPillProps>;

export const Default: Story = {
  args: {
    reason: 'Hate Speech',
    reportCount: 13,
  },
};

export default meta;
