import React from 'react';
import ReactDOM from 'react-dom';
import Tab from './tab';
import Tabs from './tabs';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Tabs activeTab={{ id: 0 }}>
      <Tab id={0} title="Test Tab">
        <>Test Tab content</>
      </Tab>
    </Tabs>,
    div,
  );
  ReactDOM.unmountComponentAtNode(div);
});
