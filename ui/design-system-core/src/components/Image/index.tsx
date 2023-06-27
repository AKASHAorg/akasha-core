import React from 'react';
import { apply, tw } from '@twind/core';

export type ImageProps = {
  customStyle?: string;
  testId?: string;
  src: string;
};

const Box: React.FC<ImageProps> = props => {
  const { customStyle = '', testId, src } = props;

  const className = apply`${customStyle}`;

  return <img className={tw(className)} data-testid={testId} src={src} />;
};

export default Box;
