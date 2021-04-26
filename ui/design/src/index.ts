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

import Avatar from './components/Avatar';
import EditableAvatar from './components/EditableAvatar';

import { Sidebar } from './components/SideBar';
import TopBar from './components/TopBar';

import EditorCard from './components/EditorCard';
import CommentEditor from './components/EditorCard/comment-editor';
import { EditorPlaceholder } from './components/EditorCard/editor-placeholder';

import { EntryBox } from './components/EntryCard/entry-box';
import { EntryCard } from './components/EntryCard';
import { EntryCardHidden } from './components/EntryCard/entry-card-hidden';
import {
  BasicCardBox,
  MainAreaCardBox,
  WidgetAreaCardBox,
  ModalCard,
} from './components/EntryCard/basic-card-box';

import BoxFormCard from './components/BoxFormCard';
import EnsFormCard from './components/EnsFormCard';

import { NotificationsCard } from './components/NotificationCard/notification-card';

import { CustomizeFeedCard } from './components/OnboardingCard/customize-feed-card';

import ProfileCard from './components/ProfileCard';
import ProfileSearchCard from './components/ProfileCard/profile-search-card';
import ProfileWidgetCard from './components/ProfileCard/profile-widget-card';
import { ProfileMiniCard } from './components/ProfileCard/profile-mini-card';

import { TagCard } from './components/TagCard';
import { TagDetailCard } from './components/TagCard/tag-detail-card';
import { TagProfileCard } from './components/TagCard/tag-profile-card';
import { TagSearchCard } from './components/TagCard/tag-search-card';

import { FilterCard } from './components/FilterCard';
import SwitchCard from './components/SwitchCard';
import { MdCard } from './components/MdCard';

import AppInfoWidgetCard from './components/AppInfoWidgetCard';
import AppsWidgetCard from './components/AppsWidgetCard';
import CookieWidgetCard from './components/CookieCard';
import LoginCTAWidgetCard from './components/LoginCTAWidgetCard';
import SourcesWidgetCard from './components/SourcesWidgetCard';
import MiniInfoWidgetCard from './components/MiniInfoWidgetCard';
import TopicsWidgetCard from './components/TopicsWidgetCard';
import TrendingWidgetCard from './components/TrendingWidgetCard';
import TutorialWidgetCard from './components/TutorialWidgetCard';

import EntryCardLoading from './components/VirtualList/placeholders/entry-card-placeholder';

import EntryPublishErrorCard from './components/Errors/entry-publish-error-card';

import Button from './components/Button';
import DuplexButton from './components/DuplexButton';
import IconButton from './components/IconButton';
import IconLink from './components/IconLink';
import ProfileAvatarButton from './components/ProfileAvatarButton';
import VoteIconButton from './components/VoteIconButton';

import { AreaChart, LineChart, ResponsiveChart } from './components/Charts';

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
  ProfileCompletedModal,
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
  ProfileCompletedModal,
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
  MdCard,
  EntryPublishErrorCard,
  StyledLayer,
  Helmet: Helmet as HelmetType,
};

export default exported;
