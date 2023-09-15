import { Profile } from '@akashaorg/typings/lib/ui';

const nameList = [
  'Jon Gilbert',
  'Alexei Gilbertovich',
  'Jon Silbert',
  'Jon Wilbert',
  'Jon Bilbert',
];
const didList = [
  '13131mknnksbshr',
  '13131mknnksbsho',
  '13131mknnksbshl',
  '14232mknnksbskr',
  '13131mknnksbskr',
];
const descriptionList = [
  'nono',
  'hello world',
  'hello',
  'Product design @companyname. Main interests: User experience, Design processes, Project Managament. Author of This could be a book name, and Another Book. Love people, plants, words, and food.',
];

export const trendingProfilesData: Profile[] = Array.from({ length: 4 }, (k, v) => {
  return {
    id: (123 + v).toString(),
    name: nameList[v],
    did: { id: didList[v] },
    avatar: { default: { src: 'https://placebeard.it/480/480', height: 480, width: 480 } },
    description: descriptionList[3],
    background: { default: { src: 'https://placebeard.it/540/320', height: 540, width: 320 } },
    createdAt: '2020-01-01',
    followersCount: 0,
  };
});
export const sampleDevKey = {
  addedAt: '2022-10-05T22:01:34.889Z',
  name: 'Sample Key',
  id: 'bbaareigw7ua7k3thuacm2qpuhkgxone3ynsfo6n2v6pwgzpq2ie3eu7lpi',
};
