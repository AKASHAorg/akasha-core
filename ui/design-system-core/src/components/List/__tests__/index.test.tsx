import * as React from 'react';
import { act, fireEvent } from '@testing-library/react';
import List, { ListItem } from '../';
import { ArrowUpOnSquareIcon, PencilIcon, TrashIcon } from '../../Icon/hero-icons-outline';
import { customRender } from '../../../test-utils';

describe('<List /> Component', () => {
  let componentWrapper = customRender(<></>, {});

  const handleUpload = jest.fn(/** */);
  const handleEdit = jest.fn(/** */);
  const handleDelete = jest.fn(/** */);

  const items: ListItem[] = [
    { label: 'Upload', icon: <ArrowUpOnSquareIcon />, onClick: handleUpload },
    { label: 'Edit', icon: <PencilIcon />, onClick: handleEdit },
    {
      label: 'Delete',
      icon: <TrashIcon />,
      color: { light: 'errorLight', dark: 'errorDark' },
      onClick: handleDelete,
    },
  ];

  beforeEach(() => {
    act(() => {
      componentWrapper = customRender(<List items={items} />, {});
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('shows correct options', () => {
    const { getByText } = componentWrapper;

    const uploadOption = getByText('Upload');

    expect(uploadOption).toBeDefined();
  });

  it('calls correct handler for each option', () => {
    const { getByText } = componentWrapper;

    const uploadOption = getByText('Upload');
    const editOption = getByText('Edit');
    const deleteOption = getByText('Delete');

    expect(uploadOption).toBeDefined();
    expect(items[0].onClick).toBeCalledTimes(0);
    expect(uploadOption).toBeDefined();
    expect(items[1].onClick).toBeCalledTimes(0);
    expect(uploadOption).toBeDefined();
    expect(items[2].onClick).toBeCalledTimes(0);

    fireEvent.click(uploadOption);
    fireEvent.click(editOption);
    fireEvent.click(deleteOption);

    expect(items[0].onClick).toBeCalledTimes(1);
    expect(items[1].onClick).toBeCalledTimes(1);
    expect(items[2].onClick).toBeCalledTimes(1);
  });
});
