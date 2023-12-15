import * as React from 'react';
import ErrorCard from './error-card';

export interface ErrorLoaderProps {
  /**
   * Error type
   */
  type:
    | 'missing-feed-customization'
    | 'missing-saved-items'
    | 'missing-notifications'
    | 'no-connection'
    | 'no-apps'
    | 'network-not-supported'
    | 'no-login'
    | 'script-error'
    | 'not-registered';
  /* Path to public folder */
  publicImgPath?: string;
  /**
   * The error title
   */
  title: string;
  /**
   * Additional details about the error
   */
  details: React.ReactElement | string;
  /**
   *  Message to be shown when in deveolopment mode
   */
  devDetails?: React.ReactElement | string;
  customStyle?: string; // use valid twind classes;
  children?: React.ReactElement | string | number;
}

const ErrorLoader: React.FC<ErrorLoaderProps> = ({ children, ...props }) => {
  const { type, publicImgPath = '/images' } = props;

  let imagesrc: string;

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

  return (
    <ErrorCard imageSrc={imagesrc} {...props}>
      {children}
    </ErrorCard>
  );
};

export default ErrorLoader;
