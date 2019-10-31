import * as React from 'react';

export type ITabsContext = IState & {
  addTab: (newTab: ITab) => void;
  removeTab: (tabId: number) => void;
  onClick: (tab: ITab) => (ev: React.SyntheticEvent) => void;
};

export interface ITab {
  /** the `id` of the tab */
  id: number;
  /** `title` will appear as tab button. must be a string  */
  title?: string;
}

export interface IProviderProps {
  activeTab: ITab;
  children: React.ReactNode;
}

interface IState {
  tabs: ITab[];
  prevActiveTab: ITab;
  activeTab: ITab;
}

const TabsContext = React.createContext<ITabsContext>({
  tabs: [],
  prevActiveTab: { id: -1 },
  activeTab: { id: -1 },
  addTab: (newTab: ITab) => {},
  removeTab: (tabId: number) => {},
  onClick: (tab: ITab) => (ev: React.SyntheticEvent) => {},
});

const TabProvider: React.FC<IProviderProps> = props => {
  const [tabsState, setTabsState] = React.useState<IState>({
    tabs: [],
    prevActiveTab: { id: -1 },
    activeTab: props.activeTab,
  });

  const addTab = (newTab: ITab) => {
    const newTabExists = tabsState.tabs.findIndex(t => t.id === newTab.id);
    if (newTabExists > -1) {
      return;
    }
    return setTabsState(prevState => ({
      ...prevState,
      tabs: prevState.tabs.concat(newTab),
    }));
  };
  const removeTab = (tabId: number) => {
    setTabsState(prevState => ({
      ...prevState,
      tabs: prevState.tabs.filter(t => t.id !== tabId),
    }));
  };
  const onClick = (tab: ITab) => (ev: React.SyntheticEvent) => {
    setTabsState(prevState => ({
      tabs: prevState.tabs,
      prevActiveTab: prevState.activeTab,
      activeTab: tab,
    }));
  };

  return (
    <TabsContext.Provider
      value={{
        ...tabsState,
        addTab,
        removeTab,
        onClick,
      }}
    >
      {props.children}
    </TabsContext.Provider>
  );
};

export default TabProvider;

export { TabsContext };
