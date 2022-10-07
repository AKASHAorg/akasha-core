import React from 'react';

import DS from '@akashaorg/design-system';
import { RootComponentProps } from '@akashaorg/typings/ui';

import CardTitle, { ICardTitleProps } from './card-title';

import menuRoute, { DEV_KEYS } from '../../../routes';

const { HorizontalDivider, MainAreaCardBox } = DS;

type ExtendableProps = RootComponentProps & ICardTitleProps;

interface IEditDevKeyCardProps extends ExtendableProps {
  className?: string;
}

const EditDevKeyCard: React.FC<IEditDevKeyCardProps> = props => {
  const { className, plugins } = props;

  const handleClickCardTitleIcon = () => {
    plugins['@akashaorg/app-routing']?.routing.navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => menuRoute[DEV_KEYS],
    });
  };

  return (
    <MainAreaCardBox className={className}>
      <CardTitle {...props} onClickIcon={handleClickCardTitleIcon} />

      <HorizontalDivider />
    </MainAreaCardBox>
  );
};

export default EditDevKeyCard;
