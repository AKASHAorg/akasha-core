/* eslint-disable import/first */
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Spinner from '@akashaproject/design-system/lib/components/Spinner/index';

storiesOf('Spinner', module).add('default', () => <Spinner size={25} />);
