import { IGeneralSettings } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { AUTH_ENDPOINT } from './constants';

const settings: IGeneralSettings = [[AUTH_ENDPOINT, 'http://localhost:8778/authenticate']];

export default settings;
