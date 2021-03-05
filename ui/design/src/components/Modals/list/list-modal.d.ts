import * as React from 'react';
import { ILocale } from '../../../utils/time';
import { IconType } from '../../Icon/icon';
export interface IlistModal {
  className?: string;
  list: IListElem[];
  label: string;
  secondaryLabel: string;
  closeModal: () => void;
  onClickAvatar: React.EventHandler<any>;
  locale: ILocale;
  iconType: IconType;
}
interface IListElem {
  name?: string;
  time: string;
  ethAddress: string;
  avatar?: string;
}
declare const ListModal: React.FC<IlistModal>;
export default ListModal;
