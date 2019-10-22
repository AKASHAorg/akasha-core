/* Components */
import Avatar from './components/Avatar';
export * from './components/IconButton';
import Tab from './components/Tabs/tab';
import Tabs from './components/Tabs/tabs';
export * from './components/Cards';
import { SearchInput } from './components/Input/index';

/* Themes and theme related utils */
import { createTheme } from './styles/themes/create-theme';
import darkTheme from './styles/themes/dark-theme';
import lightTheme from './styles/themes/light-theme';

/* Grommet utils */

import { Box, Grid, Grommet, grommet, ResponsiveContext } from 'grommet';
import styled, { css } from 'styled-components';

export {
  Avatar,
  Tabs,
  Tab,
  SearchInput,
  lightTheme,
  darkTheme,
  createTheme,
  Box,
  Grid,
  ResponsiveContext,
  grommet,
  Grommet,
  styled,
  css,
};
