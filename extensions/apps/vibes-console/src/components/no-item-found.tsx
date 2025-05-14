import React from 'react';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export type NoItemFoundProps = {
  title: string;
};
export const NoItemFound: React.FC<NoItemFoundProps> = ({ title }) => (
  <Typography variant="sm" className="font-light">
    {title}
  </Typography>
);
