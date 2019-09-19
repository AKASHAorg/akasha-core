import React from 'react';
import ReactDOM from 'react-dom';
import Button from './index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const onClickHandler = jest.fn();

  ReactDOM.render(<Button onClick={onClickHandler}>Test Button</Button>, div);
  ReactDOM.unmountComponentAtNode(div);
});
