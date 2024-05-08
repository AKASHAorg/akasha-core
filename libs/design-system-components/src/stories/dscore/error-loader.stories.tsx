import type { Meta, StoryObj } from '@storybook/react';
import ErrorLoader, {
  ErrorLoaderProps,
} from '@akashaorg/design-system-core/lib/components/ErrorLoader';

const meta: Meta<ErrorLoaderProps> = {
  title: 'DSCore/Cards/ErrorLoader',
  component: ErrorLoader,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'text' },
    publicImgPath: { control: 'text' },
    title: { control: 'text' },
    details: { control: 'text' },
  },
};

type Story = StoryObj<ErrorLoaderProps>;

export const Default: Story = {
  args: {
    publicImgPath: '',
    type: 'no-login',
    title: 'No Ethereum address detected',
    details:
      'You need to login or allow access to your current Ethereum address in your Web3 Ethereum client like MetaMask, and then reload, please',
  },
};

export default meta;
