import * as React from 'react';
import { act, fireEvent } from '@testing-library/react';

import Menu from '../';
import { ListItem } from '../../List';
import {
  ArrowUpOnSquareIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from '../../Icon/hero-icons-outline';
import { customRender } from '../../../test-utils';

describe('<Menu /> Component', () => {
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
      componentWrapper = customRender(
        <Menu
          anchor={{
            icon: <EllipsisVerticalIcon />,
            variant: 'primary',
            greyBg: true,
            iconOnly: true,
          }}
          items={items}
        />,
        {},
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(componentWrapper).toBeDefined();
  });

  it('shows list when clicked', async () => {
    const { getByRole, findByText } = componentWrapper;

    const anchorEl = getByRole('button');
    expect(anchorEl).toBeDefined();

    fireEvent.click(anchorEl);

    const uploadOption = await findByText('Upload');
    expect(uploadOption).toBeDefined();
  });

  it('calls correct handler for each option', async () => {
    const { getByRole, findByText } = componentWrapper;

    const anchorEl = getByRole('button');
    fireEvent.click(anchorEl);

    const uploadOption = await findByText('Upload');

    expect(uploadOption).toBeDefined();
    expect(items[1].onClick).toBeCalledTimes(0);

    fireEvent.click(uploadOption);
    expect(items[0].onClick).toBeCalledTimes(1);
  });
});
