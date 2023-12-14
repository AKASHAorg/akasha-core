import faker from 'faker';

const genAuthor = () => ({ id: faker.datatype.uuid(), isViewer: false });

const genBeamData = () => {
  return {
    id: faker.datatype.uuid(),
    active: true,
    author: genAuthor(),
    content: [{ order: 1, blockID: 1 }],
    createdAt: new Date(),
    reflections: null,
    reflectionsCount: 0,
    version: '1',
  };
};

const genBeamSlate = () => {
  return {
    content: [
      {
        type: 'paragraph',
        children: [
          { text: '' },
          {
            url: 'https://google.com',
            type: 'link',
            children: [{ text: '' }],
          },
          {
            text: ' -> test',
            type: 'text',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [{ text: 'another line', type: 'text' }],
      },
      {
        type: 'paragraph',
        children: [{ text: '3rd line', type: 'text' }],
      },
      {
        url: 'https://pbs.twimg.com/profile_banners/3296506527/1556880274/1500x500',
        size: {
          width: 640,
          height: 426,
          naturalWidth: 640,
          naturalHeight: 426,
        },
        type: 'image',
        children: [{ text: '' }],
      },
    ],
  };
};

export { genBeamSlate, genBeamData };
