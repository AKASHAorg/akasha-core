import React from 'react';
import ReactDOM from 'react-dom';
import { Avatar } from './index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Avatar src="not_found" seed={'0x0000000000'} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
