import { RootComponentProps } from '@akashaorg/typings/ui';

export interface ISharedModerationProps extends RootComponentProps {
  slotId?: string;
  user: string | null;
  isAuthorised: boolean;
  handleCTAClick?: () => void;
}
