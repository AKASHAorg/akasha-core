import React from 'react';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export interface ISearchResultCountProps {
  countLabel: string;
}
const SearchResultCount: React.FC<ISearchResultCountProps> = ({ countLabel }) => {
  return (
    <Typography variant="sm" bold className="mb-4">
      {countLabel}
    </Typography>
  );
};
export default SearchResultCount;
