import registerPostsModule from '@akashaproject/sdk-posts';
import { extractCallableServices } from '../utils';
import {
  ENTRY_SERVICE,
  TAG_SERVICE,
  COMMENT_SERVICE,
} from '@akashaproject/sdk-posts/lib/constants';

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
        searchTags: extractedServices[TAG_SERVICE]('searchTags'),
        getTrending: extractedServices[TAG_SERVICE]('getTrending'),
      },
      comments: {
        getComment: extractedServices[COMMENT_SERVICE]('getComment'),
        getComments: extractedServices[COMMENT_SERVICE]('getComments'),
        addComment: extractedServices[COMMENT_SERVICE]('addComment'),
      },
    },
  };
}
