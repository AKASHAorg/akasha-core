/* eslint-disable import/first */
import {
  Notification,
  notify,
} from '@akashaproject/design-system/lib/components/Notification/index';
import { action } from '@storybook/addon-actions';
import { boolean, number, radios, select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

const NotificationComponent = () => {
  const posOptions = {
    topRight: 'top-right',
    topCenter: 'top-center',
    topLeft: 'top-left',
    bottomRight: 'bottom-right',
    bottomCenter: 'bottom-center',
    bottomLeft: 'bottom-left',
  };
  const typeOptions = {
    Default: 'default',
    Success: 'success',
    Info: 'info',
    Warning: 'warning',
    Error: 'error',
  };
  const type = radios('Type', typeOptions, typeOptions.Default);
  const title = text('Title', 'test');
  const options = {
    onOpen: action('toast-open'),
    onClose: action('toast-close'),
  };

  const buttonClick = () => {
    (type === typeOptions.Default ? notify : (notify as any)[type])(title, options);
  };

  return (
    <>
      <button onClick={buttonClick}>test</button>
      <Notification
        position={select('Position', posOptions, posOptions.topRight)}
        autoClose={number('AutoClose', 5000)}
        hideProgressBar={boolean('hideProgressBar', false)}
        newestOnTop={boolean('newestOnTop', false)}
        closeOnClick={boolean('closeOnClick', true)}
        rtl={boolean('Rtl', false)}
        pauseOnVisibilityChange={boolean('PauseOnVisibilityChange', false)}
        draggable={boolean('Draggable', false)}
        pauseOnHover={boolean('PauseOnHover', false)}
        onClick={action('toast-click')}
      />
    </>
  );
};

storiesOf('Notification/Notifications', module).add('default', () => <NotificationComponent />);
