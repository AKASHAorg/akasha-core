import faker from 'faker';
import { toBinary } from '../utils/toBinary';

const genAuthor = () => ({ id: faker.datatype.uuid(), isViewer: false });

const genReflectionData = () => {
  return {
    id: faker.datatype.uuid(),
    active: true,
    beamID: faker.datatype.uuid(),
    createdAt: new Date(),
    isReply: false,
    author: genAuthor(),
    content: [
      {
        label: 'AkashaApp',
        propertyType: 'slate-block',
        value: window.btoa(toBinary(JSON.stringify({ text: 'Reflection content' }))),
      },
    ],
    mentions: [],
    version: '1',
  };
};

export { genReflectionData };
