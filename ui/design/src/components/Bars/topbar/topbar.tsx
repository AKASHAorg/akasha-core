import { Box, Stack } from 'grommet';
import * as React from 'react';
import { Icon } from '../../Icon';
import { SearchBar } from './search-bar';
import { MobileSearchBar } from './mobile-search-bar';
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
import styled from 'styled-components';
import { Button } from '../../Buttons';

export interface ITopbarProps {
  // data
  avatarImage?: string;
  ethAddress: string | null;
  brandLabel: string;
  signInLabel?: string;
  signUpLabel?: string;
  signOutLabel?: string;
  searchBarLabel?: string;
  notifications?: any;
  quickAccessItems: IMenuItem[] | null;
  searchAreaItem?: IMenuItem;
  // handlers
  onNavigation: (path: string) => void;
  onSidebarToggle?: (visibility: boolean) => void;
  onSearch: (ev: React.KeyboardEvent<HTMLInputElement>, inputValue: string) => void;
  // external css
  className?: string;
  // viewport size
  size?: string;
  onLoginClick: () => void;
  onLogout: any;
}

const BrandIcon = styled(Icon)`
  &:hover {
    & * {
      stroke: none;
    }
  }
`;

const Topbar = (props: ITopbarProps) => {
  const {
    avatarImage,
    brandLabel,
    signInLabel,
    signUpLabel,
    signOutLabel,
    searchBarLabel,
    className,
    quickAccessItems,
    searchAreaItem,
    onSearch,
    onNavigation,
    // onSidebarToggle,
    ethAddress,
    size,
    onLoginClick,
    onLogout,
    notifications,
  } = props;

  const [inputValue, setInputValue] = React.useState('');
  // const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const [dropOpen, setDropOpen] = React.useState(false);
  const [avatarDropOpen, setAvatarDropOpen] = React.useState(false);
  const [dropItems, setDropItems] = React.useState<IMenuItem[]>([]);
  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);

  const [currentDropItem, setCurrentDropItem] = React.useState<IMenuItem | null>(null);

  const menuItemRefs: React.RefObject<any> = React.useRef([]);

  const handleNavigation = (menuItem: IMenuItem) => () => {
    if (onNavigation) {
      onNavigation(menuItem.route);
    }
    setDropOpen(false);
    setAvatarDropOpen(false);
  };

  // const handleSidebarVisibility = () => {
  //   if (!sidebarOpen && onSidebarToggle) {
  //     onSidebarToggle(true);
  //     setSidebarOpen(true);
  //   } else if (sidebarOpen && onSidebarToggle) {
  //     onSidebarToggle(false);
  //     setSidebarOpen(false);
  //   }
  // };

  const onClickPluginButton = (menuItem: IMenuItem) => () => {
    setCurrentDropItem(menuItem);
    if (menuItem.subRoutes && menuItem.subRoutes.length > 0) {
      setDropItems(menuItem.subRoutes);
      setDropOpen(true);
    } else {
      onNavigation(menuItem.route);
    }
  };

  const onClickAvatarButton = (menuItem: IMenuItem) => () => {
    setCurrentDropItem(menuItem);
    if (menuItem.subRoutes && menuItem.subRoutes.length > 0) {
      setDropItems(menuItem.subRoutes);
      setAvatarDropOpen(true);
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
          <Box fill="horizontal" onClick={handleNavigation(menuItem)} key={index}>
            <StyledText>{menuItem.label}</StyledText>
          </Box>
        ))}
      </Box>
    </StyledDrop>
  );

  const renderAvatarDrop = () => (
    <StyledDrop
      target={currentDropItem && menuItemRefs.current[currentDropItem?.index]}
      onClickOutside={() => {
        setAvatarDropOpen(false);
      }}
      onEsc={() => {
        setAvatarDropOpen(false);
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
          <Box fill="horizontal" onClick={handleNavigation(menuItem)} key={index}>
            <StyledText>{menuItem.label}</StyledText>
          </Box>
        ))}
        {ethAddress && (
          <Box fill="horizontal" justify="start" direction="row" onClick={onLogout}>
            <StyledText>{signOutLabel}</StyledText>
          </Box>
        )}
      </Box>
    </StyledDrop>
  );

  const renderPluginIcon = (menuItem: IMenuItem) => {
    if (menuItem.label === 'Notifications') {
      return (
        <Stack anchor="top-right">
          <Icon type={menuItem.logo?.value || 'app'} size="sm" clickable={true} />
          {notifications?.length && (
            <Box background="#FF5050" width="9px" height="9px" round={true} />
          )}
        </Stack>
      );
    }
    return <Icon type={menuItem.logo?.value || 'app'} size="sm" clickable={true} />;
  };

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
          onClick={onClickAvatarButton(menuItem)}
        />
      ) : (
        renderPluginIcon(menuItem)
      )}
    </StyledDiv>
  );

  const renderSearchArea = () => {
    if (searchAreaItem) {
      if (size === 'small') {
        return (
          <Icon
            type="search"
            size="xs"
            onClick={() => {
              setMobileSearchOpen(true);
            }}
          />
        );
      } else {
        return (
          <StyledSearchContainer>
            <SearchBar
              inputValue={inputValue}
              onInputChange={ev => setInputValue(ev.target.value)}
              handleKeyDown={ev => onSearch(ev, inputValue)}
              inputPlaceholderLabel={searchBarLabel}
            />
          </StyledSearchContainer>
        );
      }
    }
    return;
  };

  const renderContent = () => {
    if (size === 'small' && mobileSearchOpen) {
      return (
        <MobileSearchBar
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleKeyDown={ev => onSearch(ev, inputValue)}
          inputPlaceholderLabel={searchBarLabel}
          handleCloseInput={() => setMobileSearchOpen(false)}
        />
      );
    }
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
          <BrandIcon type="ethereumWorldLogo" clickable={true} />
          {size !== 'small' && <StyledText size="large">{brandLabel}</StyledText>}
        </Box>

        <Box direction="row" align="center" gap="small" pad={{ horizontal: 'medium' }}>
          {renderSearchArea()}
          {quickAccessItems && quickAccessItems.map(renderPluginButton)}
          {!ethAddress && (
            <Box direction="row" align="center" gap="small">
              <Button onClick={onLoginClick} label={signInLabel} />
              <Button primary={true} onClick={onLoginClick} label={signUpLabel} />
            </Box>
          )}
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
      {avatarDropOpen && renderAvatarDrop()}
    </TopbarWrapper>
  );
};

Topbar.defaultProps = {
  onNavigation: () => {
    return;
  },
  signUpLabel: 'Sign Up',
  signInLabel: 'Sign In',
  signOutLabel: 'Sign Out',
};

export { Topbar };
