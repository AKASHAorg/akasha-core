require('@testing-library/jest-dom/extend-expect');

import { install } from '@twind/core';
import twindConfig from './src/twind/twind.config.js';

install(twindConfig);
