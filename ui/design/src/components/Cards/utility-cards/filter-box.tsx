import * as React from 'react';
import { Box, Text } from 'grommet';
import { TextIcon } from '../../TextIcon';
import { FormDown } from 'grommet-icons';
import { MenuDrop } from './menu-drop';
import { StyledDiv } from './styled-filter-box';

export interface IFilterBox {
  currentlySeeingLabel?: string;
  sortByLabel?: string;
  allLabel?: string;
  followingLabel?: string;
  latestLabel?: string;
  oldestLabel?: string;
  handleClickAll: () => void;
  handleClickFollowing: () => void;
  handleClickLatest: () => void;
  handleClickOldest: () => void;
}

export interface IMenuItem {
  label?: string;
  handler?: () => void;
}

const FilterBox: React.FC<IFilterBox> = props => {
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
  } = props;

  const topRef = React.useRef(null);
  const bottomRef = React.useRef(null);

  const [topDropOpen, setTopDropOpen] = React.useState(false);
  const [bottomDropOpen, setBottomDropOpen] = React.useState(false);
  const [dropItems, setDropItems] = React.useState<IMenuItem[] | null>(null);

  const [topLabel, setTopLabel] = React.useState(allLabel);
  const [bottomLabel, setBottomLabel] = React.useState(latestLabel);

  const onClickAll = () => {
    handleClickAll();
    setTopLabel(allLabel);
  };

  const onClickFollowing = () => {
    handleClickFollowing();
    setTopLabel(followingLabel);
  };

  const onClickLatest = () => {
    handleClickLatest();
    setBottomLabel(latestLabel);
  };

  const onClickOldest = () => {
    handleClickOldest();
    setBottomLabel(oldestLabel);
  };
  const toggleTopDrop = () => {
    setDropItems([
      { label: allLabel, handler: onClickAll },
      { label: followingLabel, handler: onClickFollowing },
    ]);
    setTopDropOpen(!topDropOpen);
  };
  const toggleBottomDrop = () => {
    setDropItems([
      { label: latestLabel, handler: onClickLatest },
      { label: oldestLabel, handler: onClickOldest },
    ]);
    setBottomDropOpen(!bottomDropOpen);
  };

  const closeTopDrop = () => {
    setTopDropOpen(false);
  };

  const closeBottomDrop = () => {
    setBottomDropOpen(false);
  };

  return (
    <>
      <Box
        gap="xxsmall"
        pad="medium"
        border={{ color: 'border', size: 'xsmall', style: 'solid', side: 'all' }}
        round={{ size: 'small' }}
        background="ultraLightBackground"
      >
        <Box direction="row" justify="between">
          <TextIcon iconType="eye" label={currentlySeeingLabel} />
          <Box direction="row" gap="xsmall" align="center">
            <Text>{topLabel}</Text>
            <StyledDiv ref={topRef}>
              <FormDown color="primaryText" onClick={toggleTopDrop} />
            </StyledDiv>
          </Box>
        </Box>
        <Box direction="row" justify="between">
          <TextIcon iconType="menuPyramid" label={sortByLabel} />
          <Box direction="row" gap="xsmall" align="center">
            <Text>{bottomLabel}</Text>
            <StyledDiv ref={bottomRef}>
              <FormDown color="primaryText" onClick={toggleBottomDrop} />
            </StyledDiv>
          </Box>
        </Box>
      </Box>
      {topDropOpen && topRef.current && dropItems && (
        <MenuDrop closeDrop={closeTopDrop} menuItems={dropItems} target={topRef.current} />
      )}
      {bottomDropOpen && bottomRef.current && dropItems && (
        <MenuDrop closeDrop={closeBottomDrop} menuItems={dropItems} target={bottomRef.current} />
      )}
    </>
  );
};

FilterBox.defaultProps = {
  currentlySeeingLabel: 'Currently seeing',
  sortByLabel: 'Sort by',
  allLabel: 'All',
  followingLabel: 'Following',
  latestLabel: 'Latest',
  oldestLabel: 'Oldest',
};

export { FilterBox };
