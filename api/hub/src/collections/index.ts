import * as Tags from './tags';
import * as Profiles from './profiles';
import * as Posts from './posts';
import * as Comments from './comments';
import { Client, ThreadID } from '@textile/hub';

export const initCollections = async (client: Client, threadID: ThreadID) => {
  await Profiles.newCollection(client, threadID);
  await Tags.newCollection(client, threadID);
  await Posts.newCollection(client, threadID);
  await Comments.newCollection(client, threadID);
};

export const updateCollections = async (client: Client, threadID: ThreadID) => {
  await Profiles.updateCollection(client, threadID);
  await Tags.updateCollection(client, threadID);
  await Posts.updateCollection(client, threadID);
  await Comments.updateCollection(client, threadID);
};
