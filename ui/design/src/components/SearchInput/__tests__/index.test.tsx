import { cleanup, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { act, create } from 'react-test-renderer';
import DropSearchInput from '../../DropSearchInput';
import { customRender, wrapWithTheme } from '../../../test-utils';
const mockDataSource = {
  users: [
    {
      name: 'Gilbert Carter',
      imageUrl: 'https://placebeard.it/640/480',
    },
    {
      name: 'Johan Gimli',
      imageUrl: 'https://placebeard.it/640/480',
    },
  ],
  tags: ['#gitcoin', '#gitcoinbounties'],
  apps: [
    {
      name: 'GitCoin',
      imageUrl: 'https://placebeard.it/640/480',
    },
  ],
};

const mockClassName = 'search-input-test-class';
const mockPlaceholderStrings = {
  placeholder: 'Search',
  resultsLabel: 'Search results',
  usersLabel: 'Users',
  tagsLabel: 'Tags',
  appsLabel: 'Apps',
};
const testSearchStr = 'Gi';

const createBaseComponent = (props: any = {}) => {
  return (
    <DropSearchInput
      getData={props.getDataHandler || jest.fn()}
      className={mockClassName}
      dataSource={mockDataSource}
      {...mockPlaceholderStrings}
      onClickApp={props.onClickAppHandler || jest.fn()}
      onClickTag={props.onClickTagHandler || jest.fn()}
      onClickUser={props.onClickUserhandler || jest.fn()}
    />
  );
};

describe('<DropSearchInput /> Component', () => {
  let componentWrapper = create(<></>);
  beforeEach(() => {
    act(() => {
      componentWrapper = create(wrapWithTheme(createBaseComponent()));
    });
  });
  afterEach(() => {
    act(() => componentWrapper.unmount());
    cleanup();
  });
  it('should mount without errors', () => {
    const component = componentWrapper.root.findByType(DropSearchInput);
    expect(component).toBeDefined();
  });
  it('should be customizable via className passed as prop', async () => {
    const { container } = customRender(createBaseComponent(), {});
    const rootNode = container.firstElementChild?.firstElementChild;
    expect(rootNode?.classList.contains(mockClassName)).toBe(true);
  });

  it('should call getData when input is changed', async () => {
    const getDataHandler = jest.fn();
    const { findByTestId } = customRender(createBaseComponent({ getDataHandler }), {});
    const searchInputNode = await findByTestId('search-input');
    fireEvent.change(searchInputNode, { target: { value: 'test search string' } });
    expect(getDataHandler).toBeCalledTimes(1);
  });

  it.skip('should call getData with searchString and searchId: getData(searchString: string, activeTab: string, searchId: string);', async () => {
    let getDataParams: any[] = [];
    const getDataHandler = jest.fn((arg1, arg2, arg3) => {
      getDataParams = [arg1, arg2, arg3];
    });
    const { findByTestId } = customRender(createBaseComponent({ getDataHandler }), {});
    const searchInputNode = await findByTestId('search-input');
    fireEvent.change(searchInputNode, { target: { value: testSearchStr } });
    expect(getDataParams[0]).toStrictEqual(testSearchStr);
    expect(getDataParams[1]).toBeDefined();
    expect(getDataParams[2]).toBeDefined();
  });
  it('should show search results dropdown when there are results', async () => {
    const getDataHandler = jest.fn();
    const { findByTestId } = customRender(createBaseComponent({ getDataHandler }), {});
    const searchInputNode = await findByTestId('search-input');
    fireEvent.change(searchInputNode, { target: { value: testSearchStr } });
    const resultsDropdown = await findByTestId('search-results-dropdown');
    expect(resultsDropdown).toBeDefined();
  });
  it('should show placeholder, resultsLabel, usersLabel, tagsLabel, appsLabel, props when passed', async () => {
    const { findByPlaceholderText, findByText, findByTestId } = customRender(
      createBaseComponent(),
      {},
    );
    const searchInputNode = await findByTestId('search-input');
    const placeholder = await findByPlaceholderText(mockPlaceholderStrings.placeholder);
    fireEvent.change(searchInputNode, { target: { value: testSearchStr } });
    const resultsLabel = await findByText(mockPlaceholderStrings.resultsLabel);
    const usersLabel = await findByText(mockPlaceholderStrings.usersLabel);
    const appsLabel = await findByText(mockPlaceholderStrings.appsLabel);
    const tagsLabel = await findByText(mockPlaceholderStrings.tagsLabel);
    expect(placeholder).toBeDefined();
    expect(placeholder.nodeName === 'INPUT').toBe(true);
    expect(resultsLabel).toBeDefined();
    expect(usersLabel).toBeDefined();
    expect(appsLabel).toBeDefined();
    expect(tagsLabel).toBeDefined();
  });
  it.skip('should call onClickAppHandler', () => {
    return;
  });
  it.skip('should call onClickTagHandler', () => {
    return;
  });
  it.skip('should call onClickUserhandler', () => {
    return;
  });
});
