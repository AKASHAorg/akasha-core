import registerPostsModule from '@akashaproject/sdk-posts';
import { extractCallableServices } from '../utils';
import { ENTRY_SERVICE, TAG_SERVICE } from '@akashaproject/sdk-posts/lib/constants';

export const postsModule = registerPostsModule();

export default function registryApi(channel) {
  const extractedServices = extractCallableServices(postsModule, channel);
  return {
    [postsModule.name]: {
      entries: {
        getEntry: extractedServices[ENTRY_SERVICE]('getEntry'),
        getEntries: extractedServices[ENTRY_SERVICE]('entries'),
        postEntry: extractedServices[ENTRY_SERVICE]('postEntry'),
      },
      tags: {
        getTag: extractedServices[TAG_SERVICE]('getTag'),
        getTags: extractedServices[TAG_SERVICE]('tags'),
        createTag: extractedServices[TAG_SERVICE]('createTag'),
      },
    },
  };
}
