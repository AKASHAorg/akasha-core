import Loader from '../src';

test('Loader instantiates', () => {
  const loader = new Loader({ rootNodeId: 'test-node' });
  expect(loader).toBeInstanceOf(Loader);
});
