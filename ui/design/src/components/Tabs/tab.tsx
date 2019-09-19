import propTypes from 'prop-types';
import * as React from 'react';
import { ITab, TabsContext } from './tabs-context';

interface TabProps extends ITab {
  children: React.ReactElement;
}

const Tab: React.FC<TabProps> = props => {
  const value = React.useContext(TabsContext);
  const { id, title, children } = props;

  React.useEffect(() => {
    value.addTab({ id, title });
  }, [id, title, value]);

  if (value.activeTab.id === id) {
    return children;
  }

  return <></>;
};

Tab.propTypes = {
  /* Id of tab >= 0 */
  id: propTypes.number.isRequired,
  /* Title of the tab, shown as clickable button */
  title: propTypes.string.isRequired,
  /* Content of the tab */
  children: propTypes.element.isRequired,
};

export default Tab;
