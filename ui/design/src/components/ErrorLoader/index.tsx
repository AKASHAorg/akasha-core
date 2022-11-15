import * as React from 'react';
import type { ErrorLoaderProps } from './interfaces';
import ErrorCard from './error-card';

const ErrorLoader: React.FC<ErrorLoaderProps> = props => {
  const { type, publicImgPath = '/images' } = props;

  let imagesrc;
  switch (type) {
    case 'missing-saved-items':
      imagesrc = `${publicImgPath}/no-saved-posts-error.webp`;
      break;
    case 'missing-notifications':
      imagesrc = `${publicImgPath}/no-notifications-error.webp`;
      break;
    case 'missing-feed-customization':
      imagesrc = `${publicImgPath}/no-feed-customization-error.webp`;
      break;
    case 'no-connection':
      imagesrc = `${publicImgPath}/no-internet-connection-error.webp`;
      break;
    case 'no-apps':
      imagesrc = `${publicImgPath}/no-apps-error.webp`;
      break;
    case 'not-registered':
      imagesrc = `${publicImgPath}/login-widget-illustration.webp`;
      break;
    case 'network-not-supported':
      imagesrc = `${publicImgPath}/network-not-supported-error.webp`;
      break;
    case 'no-login':
    default:
      imagesrc = `${publicImgPath}/general-error.webp`;
      break;
  }

  return <ErrorCard imageSrc={imagesrc} {...props} />;
};

export default ErrorLoader;
