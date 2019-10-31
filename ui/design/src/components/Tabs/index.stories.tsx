/* eslint-disable */
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Tab from './tab';
import Tabs from './tabs';
import { ITab } from './tabs-context';

const TabsComponent = () => {
  return (
    <Tabs
      activeTab={{ id: 0 }}
      // tslint:disable-next-line: prefer-template
      onChange={tab => action('TabChange event')('tab = ' + JSON.stringify(tab))}
    >
      <Tab id={0} title="Apps">
        <>Apps Tab's Content</>
      </Tab>
      <Tab id={1} title="Games">
        <>Games Tab's Content</>
      </Tab>
      <Tab id={2} title="Music">
        <>Music Tab's Content</>
      </Tab>
      <Tab id={3} title="Books">
        <>Books Tab's Content</>
      </Tab>
    </Tabs>
  );
};

const TabsEventsComponent = () => {
  let timeout: number = -1;
  const onBeforeChange = (tab: ITab): Promise<number> => {
    // simulate a long fetch.
    // must return a promise.
    if (tab.id === 1) {
      return new Promise(resolve => {
        fetch('https://jsonplaceholder.typicode.com/todos/1', { method: 'GET' })
          .then(res => {
            return res.json();
          })
          .then(json => {
            return Promise.resolve(
              // tslint:disable-next-line: prefer-template
              action('beforeRequest')('received response:' + JSON.stringify(json)),
            );
          })
          .then(() => {
            if (timeout > 0) {
              clearTimeout(timeout);
              timeout = -1;
            }
            setTimeout(() => resolve(), 2000);
          });
      });
    }
    return Promise.resolve(tab.id);
  };

  return (
    <Tabs
      activeTab={{ id: 0 }}
      // tslint:disable-next-line: prefer-template
      onChange={tab => action('TabChange event')('tab = ' + JSON.stringify(tab))}
      beforeChange={onBeforeChange}
    >
      <Tab id={0} title="Apps">
        <>Apps Tab's Content</>
      </Tab>
      <Tab id={1} title="Users">
        <>Users Tab's Content</>
      </Tab>
      <Tab id={2} title="Music">
        <>Music Tab's Content</>
      </Tab>
      <Tab id={3} title="Books">
        <>Books Tab's Content</>
      </Tab>
    </Tabs>
  );
};

storiesOf('Tabs', module)
  .add('default with onChange event', () => <TabsComponent />)
  .add('default with onChange and onBeforeChange events', () => <TabsEventsComponent />);
