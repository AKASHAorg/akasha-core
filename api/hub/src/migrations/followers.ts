import { getAppDB, getCurrentApiProvider } from '../helpers';
import { Client, ThreadID } from '@textile/hub';
import { Profile } from '../collections/interfaces';

const cleanup = () => {
  const provider = getCurrentApiProvider();
};

export default async function runMigration(dbID: ThreadID) {
  const db: Client = await getAppDB();
  const provider = getCurrentApiProvider();
  const profiles = await provider.profileAPI.getProfiles();
  console.info(profiles.length, ' profiles ');
  for (const profile of profiles) {
    if (!profile?.following?.length || !Array.isArray(profile.following)) {
      console.info(profile.pubKey, 'does not follow anyone', '\n');
      continue;
    }
    for (const follow of profile.following) {
      console.info(profile.pubKey, '-->', follow, '\n');
      await provider.followerAPI.followProfile(profile.pubKey, follow);
      await new Promise(res => setTimeout(res, 300));
    }
  }
  console.info('running cleanup');
  for (const profile of profiles) {
    profile.following = [];
    profile.followers = [];
    await db.save(dbID, provider.profileAPI.collection, [profile]);
    console.info('cleaned', profile.pubKey);
    await new Promise(res => setTimeout(res, 300));
  }
}
