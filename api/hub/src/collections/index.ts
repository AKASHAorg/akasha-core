import * as Tags from './tags';
import * as Profiles from './profiles';
import * as Posts from './posts';
import * as Comments from './comments';
import * as Invites from './invites';
import * as ModerationReports from './moderation-reports';
import * as ModerationDecisions from './moderation-decisions';
import * as Moderators from './moderators';
import { Client, ThreadID } from '@textile/hub';
import { logger } from '../helpers';

export const initCollections = async (client: Client, threadID: ThreadID) => {
  try {
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

    const invitesDeployed = collections.find(d => d.name === 'Invites');
    if (!invitesDeployed) {
      await Invites.newCollection(client, threadID);
    }

    const reportsDeployed = collections.find(d => d.name === 'ModerationReports');
    if (!reportsDeployed) {
      await ModerationReports.newCollection(client, threadID);
    }

    const decisionsDeployed = collections.find(d => d.name === 'ModerationDecisions');
    if (!decisionsDeployed) {
      await ModerationDecisions.newCollection(client, threadID);
    }

    const moderatorsDeployed = collections.find(d => d.name === 'Moderators');
    if (!moderatorsDeployed) {
      await Moderators.newCollection(client, threadID);
    }
  } catch (e) {
    logger.error(e);
  }
};

export const updateCollections = async (client: Client, threadID: ThreadID) => {
  await Profiles.updateCollection(client, threadID);
  await Tags.updateCollection(client, threadID);
  await Posts.updateCollection(client, threadID);
  await Comments.updateCollection(client, threadID);
};
