import { Container } from 'inversify';
import { TYPES } from '@akashaproject/sdk-typings';
import { Logging } from './logging';
import { Gql } from './gql';
import ILogService from '@akashaproject/sdk-typings/lib/interfaces/log';
import IGqlClient from '@akashaproject/sdk-typings/lib/interfaces/gql';
import ISettingsService from '@akashaproject/sdk-typings/lib/interfaces/settings';
import { Settings } from './settings';
import IStashService from '@akashaproject/sdk-typings/lib/interfaces/stash';
import { Stash } from './stash';

const diContainer = new Container({
  defaultScope: 'Singleton',
});

diContainer.bind<ILogService>(TYPES.Log).to(Logging);
diContainer.bind<IGqlClient>(TYPES.Gql).to(Gql);
diContainer.bind<ISettingsService>(TYPES.Settings).to(Settings);
diContainer.bind<IStashService>(TYPES.Stash).to(Stash);
export default diContainer;
