/* Components */
import { Box, Grid, Grommet, grommet, ResponsiveContext, ThemeContext } from 'grommet';
import styled, { createGlobalStyle, css } from 'styled-components';
import { Avatar, EditableAvatar } from './components/Avatar';
import {
  Button,
  IconButton,
  IconLink,
  ProfileAvatarButton,
  VoteIconButton,
} from './components/Buttons';
import {
  AppsWidgetCard,
  BasicCardBox,
  EditorCard,
  EntryBox,
  EntryCard,
  ProfileCard,
  ProfileWidgetCard,
  TopicsWidgetCard,
} from './components/Cards';
import { Icon, iconTypes } from './components/Icon';
import { CommentInput, SearchInput } from './components/Input';
import { NotificationsPopover, SelectPopover } from './components/Popovers';
import ViewportSizeProvider, { useViewportSize } from './components/Providers/viewport-dimension';
import { SubtitleTextIcon, TextIcon } from './components/TextIcon';
import { Topbar } from './components/Topbar/index';
import responsiveBreakpoints from './styles/responsive-breakpoints';

/* Themes and theme related utils */
import darkTheme from './styles/themes/dark';
import lightTheme from './styles/themes/light';
import { createTheme } from './styles/themes/utils/create-theme';
import { ThemeSelector } from './styles/themes/utils/theme-selector';
/* Grommet utils */

const exported = {
  Avatar,
  Button,
  EditableAvatar,
  AppsWidgetCard,
  BasicCardBox,
  EditorCard,
  EntryBox,
  EntryCard,
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
  SelectPopover,
  SubtitleTextIcon,
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
  createGlobalStyle,
  ViewportSizeProvider,
  useViewportSize,
};

export default exported;
