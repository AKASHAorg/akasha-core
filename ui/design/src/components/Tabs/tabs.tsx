import * as React from 'react';
import Spinner from '../Spinner';
import {
  AkashaTabs,
  TabAnchorItem,
  TabsContainer,
  TabsContentContainer,
  TabsList,
  TabTitleItem,
} from './styled-tabs';
import TabProvider, { ITab, ITabsContext, TabsContext } from './tabs-context';

interface ITabsProps {
  /**
   * Event triggered before changing tabs. Must return a promise. Use it to fetch data asynchronously.
   * Until the data is fetched it will display an loading spinner which can be customised as well.
   * This method must return a promise which when resolved must return the tabId
   * @example beforeChange = (tab) => { return Promise.resolve() }
   */
  beforeChange?: (tab: ITab) => Promise<number>;
  spinnerComponent?: React.ReactNode;
  /**
   * Event triggered when a tab is changed.
   */
  onChange?: (tab: ITab) => void;
  /**
   * The initially active tab. Title can be omitted.
   * @example <Tabs activeTab={{ id: 0 }} />
   */
  activeTab: ITab;
  /**
   * prop to center the tabs on the tabs bar.
   */
  center?: boolean;
}

type LoadingTabsState = ITab | undefined;
type ITabsState = HTMLLIElement[];

const Tabs: React.FC<ITabsProps> = props => {
  const [tabElements, setTabElements] = React.useState<ITabsState>([]);
  const [loadingTab, setLoadingTab] = React.useState<LoadingTabsState>();

  React.useEffect(() => {
    if (typeof props.beforeChange === 'function' && loadingTab) {
      props.beforeChange(loadingTab).then(() => {
        if (typeof props.onChange === 'function') {
          props.onChange(loadingTab);
        }
        setLoadingTab(undefined);
      });
    }
  }); // , [loadingTab]

  const handleTabClick = (value: ITabsContext, tab: ITab) => (ev: React.SyntheticEvent) => {
    if (typeof props.beforeChange === 'function') {
      setLoadingTab(tab);
      value.onClick(tab)(ev);
      ev.persist();
      return;
    }
    if (typeof props.onChange === 'function') {
      props.onChange(tab);
    }
    value.onClick(tab)(ev);
  };

  return (
    <TabProvider activeTab={props.activeTab}>
      <TabsContext.Consumer>
        {value => (
          <AkashaTabs>
            <TabsContainer>
              <TabsList center={props.center!}>
                {value.tabs.map((tab: ITab) => (
                  <TabTitleItem
                    key={`${tab.id}`}
                    onClick={handleTabClick(value, tab)}
                    id={`${tab.id}`}
                    isActiveTab={value.activeTab.id === tab.id}
                    innerRef={(tabElement: HTMLLIElement) => {
                      if (!tabElements[tab.id]) {
                        setTabElements((prevState: ITabsState) => [
                          ...prevState.slice(0, tab.id),
                          tabElement,
                          ...prevState.slice(tab.id),
                        ]);
                      }
                    }}
                  >
                    <TabAnchorItem>{tab.title}</TabAnchorItem>
                  </TabTitleItem>
                ))}
              </TabsList>
            </TabsContainer>
            <TabsContentContainer>
              {!loadingTab && props.children}
              {loadingTab && loadingTab.id === value.activeTab.id && props.spinnerComponent}
            </TabsContentContainer>
          </AkashaTabs>
        )}
      </TabsContext.Consumer>
    </TabProvider>
  );
};

Tabs.defaultProps = {
  spinnerComponent: <Spinner />,
};

export default Tabs;
