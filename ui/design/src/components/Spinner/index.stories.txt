/* eslint-disable import/first */
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Spinner from './index';

storiesOf('Spinner', module).add('default', () => <Spinner size={25} />);
