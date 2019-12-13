/* eslint-disable import/first */
import Spinner from '@akashaproject/design-system/lib/components/Spinner/index';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

storiesOf('Spinner', module).add('default', () => <Spinner size={25} />);
