/*
 * A very simple addon to sync component's
 * theme with the storybook theme
 * When dark theme is activated in component's panel, we want to switch
 * storybook in dark theme
 */

import addons from '@storybook/addons';
import { STORY_RENDER } from '@storybook/core-events';
import { themes } from '@storybook/theming';

addons.register('theme-sync', api => {
  const channel = addons.getChannel();
  const switchTheme = theme => {
    let newTheme;

    switch (theme) {
      case 'Light-Theme':
        newTheme = themes.light;
        break;
      case 'Dark-Theme':
        newTheme = themes.dark;
        break;
      default:
        newTheme = themes.normal;
    }

    api.setOptions({ theme: newTheme });
    channel.emit(STORY_RENDER);
  };
  channel.on('selectTheme' /* -> from the storybook-addon-styled-component-theme */, switchTheme);
});
