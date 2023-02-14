const mockGetBookmarks = {
  data: {
    _id: '01G10G10FM8HBNX3YFN407QX8Y',
    serviceName: 'AKASHA_APP_BOOKMARK_ENTRIES',
    options: [
      [
        'entries-bookmarks',
        '[{"entryId":"01g0bxz7tgxx1ftbmark5v9tb1","type":0},{"entryId":"01g0f6gfq866xa9ae8sr1t0ts8","type":0},{"entryId":"01g0fe8bkfwgbs75br1jghnnkp","type":0},{"entryId":"01g0feca16195x2vq0sypy6tjz","type":0}]',
      ],
    ],
  },
};

export const mockQueryData = [
  {
    entryId: '01g119x09zhhwf4ac00zhpgrdz',
    type: 0,
  },
  {
    entryId: '01g0bxz7tgxx1ftbmark5v9tb1',
    type: 0,
  },
  {
    entryId: '01g0f6gfq866xa9ae8sr1t0ts8',
    type: 0,
  },
  {
    entryId: '01g0fe8bkfwgbs75br1jghnnkp',
    type: 0,
  },
  {
    entryId: '01g0feca16195x2vq0sypy6tjz',
    type: 0,
  },
];

export const mockGetBookmarksAsync = Promise.resolve(mockGetBookmarks);
