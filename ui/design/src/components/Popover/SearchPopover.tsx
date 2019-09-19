import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { Search, Add } from 'grommet-icons';
import { PopoverFC, PopoverProps } from './BasePopover';
import List, { ListProps } from '../List';
import Input from '../Input';
import Button from '../Button';
import {
  StyledSearchPopover,
  StyledSearchPopoverHeader,
  StyledSearchPopoverBody,
  StyledListContainer,
  StyledAddIconContainer,
  StyledSearchPopoverFooter,
} from './styled-search-popover';

const Popover: PopoverFC<PopoverProps> = (props: PopoverProps) => (
  <StyledSearchPopover {...props} />
);
Popover.Header = props => <StyledSearchPopoverHeader {...props} />;
Popover.Body = props => <StyledSearchPopoverBody {...props} />;
Popover.Footer = props => <StyledSearchPopoverFooter {...props} />;

export interface SearchPopoverProps extends ListProps, PopoverProps {
  searchValue: string;
  searchPlaceholder: string;
  onSearchChange: React.EventHandler<React.SyntheticEvent>;
  onSearchClick: React.EventHandler<React.SyntheticEvent>;
  onAddClick: React.EventHandler<React.SyntheticEvent>;
}

const SearchPopover: React.FC<SearchPopoverProps> = ({
  show,
  placement,
  target,
  dataSource,
  renderItem,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  onSearchClick,
  onAddClick,
}: SearchPopoverProps) => {
  const styledComponentsTheme = useContext(ThemeContext);
  const iconSize = styledComponentsTheme.spacing.components.popover.searchPopover.iconSize;

  return (
    <Popover show={show} placement={placement} target={target}>
      <Popover.Header>
        <Input
          value={searchValue}
          placeholder={searchPlaceholder}
          icon={<Search size={iconSize} color="light-1" />}
          withButton
          onChange={onSearchChange}
          onButtonClick={onSearchClick}
        />
      </Popover.Header>
      <Popover.Body>
        <StyledListContainer>
          <List dataSource={dataSource} renderItem={renderItem} />
        </StyledListContainer>
      </Popover.Body>
      <Popover.Footer>
        <Button buttonType="regular" fullWidth onClick={onAddClick}>
          <StyledAddIconContainer>
            <Add size={iconSize} color="light-1" />
          </StyledAddIconContainer>
          <span>Create a new list</span>
        </Button>
      </Popover.Footer>
    </Popover>
  );
};

export default SearchPopover;
