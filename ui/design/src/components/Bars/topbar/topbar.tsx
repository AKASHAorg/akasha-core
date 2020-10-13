import { Box } from 'grommet';
import * as React from 'react';
import { Icon } from '../../Icon';
import { SearchBar } from './search-bar';
import { Avatar } from '../../Avatar/index';
import { IMenuItem } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { LogoTypeSource } from '@akashaproject/ui-awf-typings/lib/';
import {
  TopbarWrapper,
  StyledText,
  StyledSearchContainer,
  StyledDrop,
  StyledDiv,
} from './styled-topbar';

export interface ITopbarProps {
  // data
  avatarImage?: string;
  ethAddress: string;
  brandLabel: string;
  unreadNotifications?: number;
  quickAccessItems: IMenuItem[];
  searchAreaItem?: IMenuItem;
  // handlers
  onNavigation: (path: string) => void;
  // onSidebarToggle: (visibility: boolean) => void;
  onSearch: (ev: React.KeyboardEvent<HTMLInputElement>, inputValue: string) => void;
  // external css
  className?: string;
  // viewport size
  size?: string;
}

const Topbar = (props: ITopbarProps) => {
  const {
    avatarImage,
    brandLabel,
    className,
    quickAccessItems,
    searchAreaItem,
    onSearch,
    onNavigation,
    ethAddress,
    size,
  } = props;

  const [inputValue, setInputValue] = React.useState('');

  const [dropOpen, setDropOpen] = React.useState(false);
  const [dropItems, setDropItems] = React.useState<IMenuItem[]>([]);

  const [currentDropItem, setCurrentDropItem] = React.useState<IMenuItem | null>(null);

  const menuItemRefs: React.RefObject<any> = React.useRef([]);

  const handleNavigation = (menuItem: IMenuItem) => () => {
    if (onNavigation) {
      onNavigation(menuItem.route);
    }
    setDropOpen(false);
  };

  const onClickPluginButton = (menuItem: IMenuItem) => () => {
    setCurrentDropItem(menuItem);
    if (menuItem.subRoutes && menuItem.subRoutes.length > 0) {
      setDropItems(menuItem.subRoutes);
      setDropOpen(true);
    } else {
      onNavigation(menuItem.route);
    }
  };

  const renderDrop = () => (
    <StyledDrop
      target={currentDropItem && menuItemRefs.current[currentDropItem?.index]}
      onClickOutside={() => {
        setDropOpen(false);
      }}
      onEsc={() => {
        setDropOpen(false);
      }}
      align={{ top: 'bottom', right: 'right' }}
    >
      <Box
        round="xxsmall"
        pad="xsmall"
        align="center"
        justify="start"
        gap="xsmall"
        border={{ style: 'solid', size: '1px', color: 'border', side: 'all' }}
      >
        {dropItems.map((menuItem: IMenuItem, index: number) => (
          <Box onClick={handleNavigation(menuItem)} key={index}>
            <StyledText>{menuItem.label}</StyledText>
          </Box>
        ))}
      </Box>
    </StyledDrop>
  );

  const renderPluginButton = (menuItem: IMenuItem, index: number) => (
    <StyledDiv
      key={index}
      onClick={onClickPluginButton(menuItem)}
      ref={ref => {
        menuItemRefs.current[menuItem.index] = ref;
      }}
    >
      {menuItem.logo?.type === LogoTypeSource.AVATAR ? (
        <Avatar
          ethAddress={ethAddress}
          src={avatarImage}
          size="xs"
          onClick={onClickPluginButton(menuItem)}
        />
      ) : (
        <Icon type={menuItem.logo?.value || 'app'} size="sm" clickable={true} />
      )}
    </StyledDiv>
  );

  const renderContent = () => {
    return (
      <>
        <Box
          direction="row"
          gap="small"
          align="center"
          pad={{ right: 'medium' }}
          onClick={() => {
            onNavigation('/');
          }}
        >
          <Icon type="ethereumWorldLogo" clickable={true} />
          {size !== 'small' && (
            <StyledText size="large" weight="bold">
              {brandLabel}
            </StyledText>
          )}
        </Box>

        <Box direction="row" align="center" gap="small" pad={{ horizontal: 'medium' }}>
          {searchAreaItem && (
            <StyledSearchContainer>
              <SearchBar
                inputValue={inputValue}
                onInputChange={event => setInputValue(event.target.value)}
                handleKeyDown={ev => onSearch(ev, inputValue)}
              />
            </StyledSearchContainer>
          )}
          {quickAccessItems.map(renderPluginButton)}
        </Box>
      </>
    );
  };

  return (
    <TopbarWrapper
      direction="row"
      pad="small"
      justify="between"
      align="center"
      fill="horizontal"
      className={className}
      elevation="shadow"
      height="3rem"
      border={{ side: 'bottom', size: '1px', style: 'solid', color: 'border' }}
    >
      {renderContent()}
      {dropOpen && renderDrop()}
    </TopbarWrapper>
  );
};

Topbar.defaultProps = {
  onNavigation: () => {
    return;
  },
  unreadNotifications: 0,
};

export { Topbar };
