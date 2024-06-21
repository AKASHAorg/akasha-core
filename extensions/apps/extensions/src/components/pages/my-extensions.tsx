import React from 'react';
import { useTranslation } from 'react-i18next';
import { MyExtensions } from '../my-extensions';

export const MyExtensionsPage: React.FC<unknown> = () => {
  const { t } = useTranslation('app-extensions');

  return <MyExtensions titleLabel={t('My Extensions')} />;
};
