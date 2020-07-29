import * as React from 'react';
import type { ErrorLoaderProps } from './interfaces';
import ErrorCard from './error-card';
import noSavedPosts from './images/no-saved-posts';
import noFeedCustomization from './images/no-feed-customization';
import generalError from './images/general-error';
import noInternetConnection from './images/no-internet-connection';

const ErrorLoader: React.FC<ErrorLoaderProps> = props => {
  const { type } = props;

  let imagesrc;
  switch (type) {
    case 'missing-saved-items':
      imagesrc = noSavedPosts;
      break;
    case 'missing-feed-customization':
      imagesrc = noFeedCustomization;
      break;
    case 'no-connection':
      imagesrc = noInternetConnection;
      break;
    case 'no-login':
    default:
      imagesrc = generalError;
      break;
  }

  return <ErrorCard imageSrc={imagesrc} {...props} />;
};

export default ErrorLoader;
