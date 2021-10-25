import * as React from 'react';
import { Box } from 'grommet';
import { IFilterBox, FilterBox } from './filter-box';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';
import TextIcon from '../TextIcon';

export interface IFilterCard extends IFilterBox {
  filtersLabel?: string;
  closeLabel?: string;
  titleElement: React.ReactElement;
  // external css
  className?: string;
  style?: React.CSSProperties;
  rootNodeRef?: React.Ref<HTMLDivElement>;
}

const FilterCard: React.FC<IFilterCard> = props => {
  const {
    currentlySeeingLabel,
    sortByLabel,
    allLabel,
    followingLabel,
    latestLabel,
    oldestLabel,
    handleClickAll,
    handleClickFollowing,
    handleClickLatest,
    handleClickOldest,
    filtersLabel,
    closeLabel,
    titleElement,
    className,
    style,
    rootNodeRef,
  } = props;

  const [expanded, setExpanded] = React.useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <MainAreaCardBox className={className} style={style} rootNodeRef={rootNodeRef}>
      <Box direction="row" pad="medium" justify="between">
        {titleElement}
        <TextIcon
          label={expanded ? closeLabel : filtersLabel}
          iconType={expanded ? 'close' : 'menuPyramid'}
          primaryColor={true}
          onClick={toggleExpand}
          reverse={true}
          clickable={true}
        />
      </Box>
      {expanded && (
        <Box pad="medium">
          <FilterBox
            currentlySeeingLabel={currentlySeeingLabel}
            allLabel={allLabel}
            sortByLabel={sortByLabel}
            followingLabel={followingLabel}
            latestLabel={latestLabel}
            oldestLabel={oldestLabel}
            handleClickAll={handleClickAll}
            handleClickFollowing={handleClickFollowing}
            handleClickLatest={handleClickLatest}
            handleClickOldest={handleClickOldest}
          />
        </Box>
      )}
    </MainAreaCardBox>
  );
};

FilterCard.defaultProps = {
  filtersLabel: 'Filters',
  closeLabel: 'Close',
};

export default FilterCard;
