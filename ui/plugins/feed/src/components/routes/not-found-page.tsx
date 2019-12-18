import * as React from 'react';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const [t] = useTranslation();
  return <div>{t('Article not found!')}</div>;
};

export default NotFoundPage;
