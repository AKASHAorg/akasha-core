import { RootComponentProps } from '@akashaproject/ui-awf-typings';

export interface ISharedModerationProps extends RootComponentProps {
  slotId?: string;
  user: string | null;
  isAuthorised: boolean;
  handleCTAClick?: () => void;
}
