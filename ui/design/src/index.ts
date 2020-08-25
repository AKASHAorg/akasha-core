/* Components */
import {
  Box,
  Grid,
  Grommet,
  grommet,
  ResponsiveContext,
  ThemeContext,
  Text,
  Carousel,
} from 'grommet';

import styled, { createGlobalStyle, css, withTheme } from 'styled-components';

import Autosizer from 'react-virtualized-auto-sizer';

import { Avatar, EditableAvatar } from './components/Avatar';

import { Sidebar, Topbar } from './components/Bars/index';

import EntryCardLoading from './components/VirtualList/placeholders/entry-card-placeholder';

import {
  Button,
  DuplexButton,
  IconButton,
  IconLink,
  ProfileAvatarButton,
  VoteIconButton,
} from './components/Buttons';
import { AreaChart, LineChart, ResponsiveChart } from './components/Charts';

import {
  AppInfoWidgetCard,
  AppsWidgetCard,
  BasicCardBox,
  MainAreaCardBox,
  BoxFormCard,
  EditorCard,
  EnsFormCard,
  EntryCard,
  MiniInfoWidgetCard,
  ProfileCard,
  ProfileWidgetCard,
  ProfileMiniCard,
  TopicsWidgetCard,
  WidgetAreaCardBox,
  ModalCard,
  LoginCTAWidgetCard,
  TrendingWidgetCard,
  SourcesWidgetCard,
  TutorialWidgetCard,
  CustomizeFeedCard,
  TagCard,
  TagDetailCard,
  FilterCard,
} from './components/Cards';

import TextInputField from './components/Forms/text-input-field';
import { AppIcon, Icon, iconTypes } from './components/Icon';
import ErrorInfoCard from './components/Errors/error-info-card';
import ErrorLoader from './components/Errors/error-loader';

import { CommentInput, SearchInput, DropSearchInput } from './components/Input';
import {
  ShareModal,
  ModalContainer,
  ModalRenderer,
  EthProviderListModal,
  EthProviderModal,
  MobileListModal,
  LoginModal,
} from './components/Modals';

import { NotificationsPopover, SelectPopover } from './components/Popovers';
import ViewportSizeProvider, { useViewportSize } from './components/Providers/viewport-dimension';
import { SubtitleTextIcon, TextIcon } from './components/TextIcon';
import VirtualList from './components/VirtualList';
import { Helmet } from 'react-helmet';
import { HorizontalDivider } from './components/Dividers';

/* Utilities (these are not components) */
import responsiveBreakpoints from './styles/responsive-breakpoints';
import { formatImageSrc } from './utils/image-utils';
import { isBase64 } from './utils/string-utils';
/* Hooks */
import { useGlobalLogin } from './hooks/use-global-login';
/* Themes and theme related utils */
import darkTheme from './styles/themes/dark';
import lightTheme from './styles/themes/light';
import { createTheme } from './styles/themes/utils/create-theme';
import { ThemeSelector } from './styles/themes/utils/theme-selector';
/* Grommet utils */

const exported = {
  Autosizer,
  Avatar,
  AppIcon,
  AreaChart,
  LineChart,
  ResponsiveChart,
  Button,
  Carousel,
  DuplexButton,
  EditableAvatar,
  ErrorInfoCard,
  ErrorLoader,
  AppInfoWidgetCard,
  AppsWidgetCard,
  BasicCardBox,
  CustomizeFeedCard,
  DropSearchInput,
  EditorCard,
  EntryCard,
  EntryCardLoading,
  BoxFormCard,
  EnsFormCard,
  MiniInfoWidgetCard,
  ProfileCard,
  ProfileWidgetCard,
  ProfileMiniCard,
  TextInputField,
  TopicsWidgetCard,
  TagCard,
  TagDetailCard,
  Icon,
  iconTypes,
  IconButton,
  IconLink,
  LoginModal,
  ProfileAvatarButton,
  VoteIconButton,
  CommentInput,
  SearchInput,
  MainAreaCardBox,
  NotificationsPopover,
  ShareModal,
  SelectPopover,
  SubtitleTextIcon,
  Sidebar,
  Text,
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
  isBase64,
  formatImageSrc,
  Helmet,
  WidgetAreaCardBox,
  ModalCard,
  EthProviderListModal,
  EthProviderModal,
  MobileListModal,
  ModalContainer,
  ModalRenderer,
  HorizontalDivider,
  LoginCTAWidgetCard,
  TrendingWidgetCard,
  SourcesWidgetCard,
  TutorialWidgetCard,
  FilterCard,
  /* hooks */
  useGlobalLogin,
};

export default exported;
