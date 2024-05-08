import React from 'react';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export interface ISearchResultCountProps {
  countLabel: string;
}

const SearchResultCount: React.FC<ISearchResultCountProps> = ({ countLabel }) => {
  return (
    <Text variant="button-md" weight="bold" customStyle="mb-4">
      {countLabel}
    </Text>
  );
};

export default SearchResultCount;
