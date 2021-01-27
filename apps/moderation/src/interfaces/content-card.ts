import { IContentProps } from './content';

export interface IContentCardProps extends Omit<IContentProps, 'entryData'> {
  sdkModules: any;
}
