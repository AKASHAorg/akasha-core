/* Components */
import { Box, Grid, Grommet, grommet, ResponsiveContext, ThemeContext } from 'grommet';
import styled, { createGlobalStyle, css, withTheme } from 'styled-components';
import { Avatar, EditableAvatar } from './components/Avatar';
import { ResponsiveSidebar, Sidebar, SidebarMobile, Topbar } from './components/Bars/index';
import {
  Button,
  IconButton,
  IconLink,
  ProfileAvatarButton,
  VoteIconButton,
} from './components/Buttons';
import {
  AppInfoWidgetCard,
  AppsWidgetCard,
  BasicCardBox,
  BoxFormCard,
  EditorCard,
  EnsFormCard,
  EntryBox,
  EntryCard,
  MiniInfoWidgetCard,
  ProfileCard,
  ProfileWidgetCard,
  TopicsWidgetCard,
} from './components/Cards';
import { AppIcon, Icon, iconTypes } from './components/Icon';
import { CommentInput, SearchInput } from './components/Input';
import { ShareModal } from './components/Modals';
import { NotificationsPopover, SelectPopover } from './components/Popovers';
import ViewportSizeProvider, { useViewportSize } from './components/Providers/viewport-dimension';
import { SubtitleTextIcon, TextIcon } from './components/TextIcon';
import responsiveBreakpoints from './styles/responsive-breakpoints';
import VirtualList from './components/VirtualList';

/* Themes and theme related utils */
import darkTheme from './styles/themes/dark';
import lightTheme from './styles/themes/light';
import { createTheme } from './styles/themes/utils/create-theme';
import { ThemeSelector } from './styles/themes/utils/theme-selector';
/* Grommet utils */

const exported = {
  Avatar,
  AppIcon,
  Button,
  EditableAvatar,
  AppInfoWidgetCard,
  AppsWidgetCard,
  BasicCardBox,
  EditorCard,
  EntryBox,
  EntryCard,
  BoxFormCard,
  EnsFormCard,
  MiniInfoWidgetCard,
  ProfileCard,
  ProfileWidgetCard,
  TopicsWidgetCard,
  Icon,
  iconTypes,
  IconButton,
  IconLink,
  ProfileAvatarButton,
  VoteIconButton,
  CommentInput,
  SearchInput,
  NotificationsPopover,
  ResponsiveSidebar,
  ShareModal,
  SelectPopover,
  SubtitleTextIcon,
  Sidebar,
  SidebarMobile,
  TextIcon,
  Topbar,
  createTheme,
  darkTheme,
  lightTheme,
  Box,
  Grid,
  Grommet,
  grommet,
  ResponsiveContext,
  responsiveBreakpoints,
  ThemeContext,
  ThemeSelector,
  css,
  styled,
  withTheme,
  createGlobalStyle,
  ViewportSizeProvider,
  useViewportSize,
  VirtualList,
};

export default exported;
