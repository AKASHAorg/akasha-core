import faker from 'faker';
import { genBeamData } from './beam';

const genAuthor = () => ({ id: faker.datatype.uuid(), isViewer: false });

const genReflectionData = () => {
  return {
    id: faker.datatype.uuid(),
    active: true,
    beam: genBeamData(),
    beamID: faker.datatype.uuid(),
    createdAt: '12/12/2023',
    isReply: false,
    author: genAuthor(),
    content: [
      {
        label: 'AkashaApp',
        propertyType: 'slate-block',
        value:
          'H4sIAAAAAAAAE4uuViqpLEhVslIqSCxKTC9KLMhQ0lFKzsjMSSlKzVOyiq5WKkmtKFGyUgpKTctJTS7JzM9TSM7PK0nNK1Gqja2NBQDYB++jQQAAAA==',
      },
    ],
    mentions: [],
    version: '1',
  };
};

export { genReflectionData };
