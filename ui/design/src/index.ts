// @ts-nocheck
/* Components */
import {
  Box,
  Grid,
  Image,
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

import EntryPublishErrorCard from './components/Errors/entry-publish-error-card';

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
  CommentEditor,
  EditorCard,
  EditorPlaceholder,
  EnsFormCard,
  EntryBox,
  EntryCard,
  EntryCardHidden,
  MiniInfoWidgetCard,
  ProfileCard,
  ProfileSearchCard,
  ProfileWidgetCard,
  ProfileMiniCard,
  TopicsWidgetCard,
  WidgetAreaCardBox,
  ModalCard,
  LoginCTAWidgetCard,
  TrendingWidgetCard,
  SourcesWidgetCard,
  TutorialWidgetCard,
  CookieWidgetCard,
  CustomizeFeedCard,
  TagCard,
  TagDetailCard,
  TagProfileCard,
  TagSearchCard,
  FilterCard,
  SwitchCard,
  NotificationsCard,
} from './components/Cards';

import { EditorBox, EditorMeter, editorDefaultValue } from './components/Editor';

import TextInputField from './components/Forms/text-input-field';
import { AppIcon, Icon, iconTypes } from './components/Icon';
import ErrorInfoCard from './components/Errors/error-info-card';
import ErrorLoader from './components/Errors/error-loader';
import ModerationAppErrorCard from './components/Errors/moderation-app-error-card';

import { CommentInput, SearchInput, DropSearchInput } from './components/Input';
import {
  ShareModal,
  ModalContainer,
  ModalRenderer,
  EthProviderListModal,
  EthProviderModal,
  MobileListModal,
  LoginModal,
  ReportModal,
  ModerateModal,
  FeedbackModal,
  ToastProvider,
  EditorModal,
  StyledLayer,
} from './components/Modals';

import { NotificationsPopover, SelectPopover } from './components/Popovers';
import ViewportSizeProvider, { useViewportSize } from './components/Providers/viewport-dimension';
import { SubtitleTextIcon, TextIcon } from './components/TextIcon';
import VirtualList from './components/VirtualList';
import type { Helmet as HelmetType } from '@types/react-helmet';
import Helmet from 'react-helmet';
import { HorizontalDivider } from './components/Dividers';
import { Notification, notify, BookmarkPill, NewPostsPill } from './components/Notification';
import Spinner from './components/Spinner';

/* Utilities (these are not components) */
import responsiveBreakpoints from './styles/responsive-breakpoints';
import { formatImageSrc } from './utils/image-utils';
import { isBase64 } from './utils/string-utils';
import { formatRelativeTime } from './utils/time';

/* Themes and theme related utils */
import darkTheme from './styles/themes/dark';
import lightTheme from './styles/themes/light';
import { createTheme } from './styles/themes/utils/create-theme';
import { ThemeSelector } from './styles/themes/utils/theme-selector';

/* Grommet utils */
// @TODO: fix this export style...
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
  ModerationAppErrorCard,
  AppInfoWidgetCard,
  AppsWidgetCard,
  BasicCardBox,
  BookmarkPill,
  NewPostsPill,
  CustomizeFeedCard,
  DropSearchInput,
  EditorBox,
  EditorMeter,
  editorDefaultValue,
  CommentEditor,
  EditorCard,
  EditorPlaceholder,
  EditorModal,
  EntryBox,
  EntryCard,
  EntryCardHidden,
  EntryCardLoading,
  BoxFormCard,
  EnsFormCard,
  MiniInfoWidgetCard,
  ProfileCard,
  ProfileSearchCard,
  ProfileWidgetCard,
  ProfileMiniCard,
  TextInputField,
  TopicsWidgetCard,
  TagCard,
  TagDetailCard,
  TagProfileCard,
  TagSearchCard,
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
  ReportModal,
  ModerateModal,
  FeedbackModal,
  Spinner,
  ToastProvider,
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
  Image,
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
  formatRelativeTime,
  WidgetAreaCardBox,
  ModalCard,
  EthProviderListModal,
  EthProviderModal,
  MobileListModal,
  ModalContainer,
  ModalRenderer,
  Notification,
  NotificationsCard,
  Spinner,
  notify,
  HorizontalDivider,
  LoginCTAWidgetCard,
  TrendingWidgetCard,
  SourcesWidgetCard,
  TutorialWidgetCard,
  CookieWidgetCard,
  FilterCard,
  SwitchCard,
  EntryPublishErrorCard,
  StyledLayer,
  Helmet: Helmet as HelmetType,
};

export default exported;
