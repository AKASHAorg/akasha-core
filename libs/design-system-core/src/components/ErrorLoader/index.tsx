import * as React from 'react';
import ErrorCard from './error-card';

export type ErrorLoaderProps = React.PropsWithChildren<{
  /**
   * Error type
   */
  type:
    | 'missing-feed-customization'
    | 'missing-notifications'
    | 'missing-saved-items'
    | 'network-not-supported'
    | 'no-apps'
    | 'no-connection'
    | 'not-registered'
    | 'not-authenticated'
    | 'script-error';
  /* Path to public folder */
  publicImgPath?: string;
  /**
   * The error title
   */
  title: string;
  /**
   * Additional details about the error
   */
  details: string;
  dataTestId?: string;
  customStyle?: string; // use valid twind classes;
}>;

/**
 * An ErrorLoader serves the purpose of displaying an error card with an image and a messagge
 * explaining to the user the error in detail. It can also have an optional call to action button
 * @param type -  error type
 * @param publicImgPath - (optional) path of the image to be displayed
 * @param title - error title
 * @param details - additional details about the error
 * @param customStyle - provide custom twind classes if needed
 * @example
 * ```tsx
 *  <ErrorLoader type="script-error" title="Error in akasha app" details={error.message} />
 * ```
 **/
const ErrorLoader: React.FC<ErrorLoaderProps> = ({ children, ...props }) => {
  const { type, publicImgPath = '/images' } = props;

  let imagesrc: string;

  switch (type) {
    case 'missing-feed-customization':
      imagesrc = `${publicImgPath}/no-feed-customization-error.webp`;
      break;
    case 'missing-notifications':
      imagesrc = `${publicImgPath}/no-notifications-error.webp`;
      break;
    case 'missing-saved-items':
      imagesrc = `${publicImgPath}/no-saved-posts-error.webp`;
      break;
    case 'network-not-supported':
      imagesrc = `${publicImgPath}/network-not-supported-error.webp`;
      break;
    case 'no-apps':
      imagesrc = `${publicImgPath}/no-apps-error.webp`;
      break;
    case 'no-connection':
      imagesrc = `${publicImgPath}/no-internet-connection-error.webp`;
      break;
    case 'not-registered':
      imagesrc = `${publicImgPath}/login-widget-illustration.webp`;
      break;
    case 'not-authenticated':
      imagesrc = `${publicImgPath}/not-authenticated.webp`;
      break;
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
