import faker from 'faker';
import { toBinary } from '../utils/toBinary';
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
        value: window.btoa(toBinary(JSON.stringify({ text: 'Reflection content' }))),
      },
    ],
    mentions: [],
    version: '1',
  };
};

export { genReflectionData };
