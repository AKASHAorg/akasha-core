import { RootComponentProps } from '@akashaorg/ui-awf-typings';

export interface ISharedModerationProps extends RootComponentProps {
  slotId?: string;
  user: string | null;
  isAuthorised: boolean;
  handleCTAClick?: () => void;
}
