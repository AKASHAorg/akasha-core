import * as Tags from './tags';
import * as Profiles from './profiles';
import * as Posts from './posts';
import * as Comments from './comments';
import { Client, ThreadID } from '@textile/hub';

export const initCollections = async (client: Client, threadID: ThreadID) => {
  const collections = await client.listCollections(threadID);

  const profilesDeployed = collections.find(d => d.name === 'Profiles');
  if (!profilesDeployed) {
    await Profiles.newCollection(client, threadID);
  }

  const tagsDeployed = collections.find(d => d.name === 'Tags');
  if (!tagsDeployed) {
    await Tags.newCollection(client, threadID);
  }

  const postsDeployed = collections.find(d => d.name === 'Posts');
  if (!postsDeployed) {
    await Posts.newCollection(client, threadID);
  }

  const commentsDeployed = collections.find(d => d.name === 'Comments');
  if (!commentsDeployed) {
    await Comments.newCollection(client, threadID);
  }
};

export const updateCollections = async (client: Client, threadID: ThreadID) => {
  await Profiles.updateCollection(client, threadID);
  await Tags.updateCollection(client, threadID);
  await Posts.updateCollection(client, threadID);
  await Comments.updateCollection(client, threadID);
};
