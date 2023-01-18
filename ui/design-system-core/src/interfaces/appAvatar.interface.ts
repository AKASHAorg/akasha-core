import { IntegrationTypes } from '@akashaorg/typings/ui';
import { IAvatarProps } from './avatar.interface';

export interface IAppAvatarProps extends IAvatarProps {
  appType: IntegrationTypes;
}
