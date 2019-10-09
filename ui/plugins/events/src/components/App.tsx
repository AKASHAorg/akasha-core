// @ts-ignore
import { styled } from "@akashaproject/design-system";
import React, { Dispatch, PureComponent, Suspense } from "react";
import { I18nextProvider } from "react-i18next";
import { eventsInit, EventsProvider, eventsReducer } from "./reducers/events";
import {
  IProfileState,
  ProfileAction,
  ProfileProvider,
  profileReducer,
  profileState
} from "./reducers/profiles";
import Routes from "./routes";

export interface IProps {
  singleSpa: any;
  activeWhen: {
    path: string;
  };
  mountParcel: (config: any, props: any) => void;
  rootNodeId: string;
  sdkModules: any;
  logger: any;
  i18n?: any;
  profileState: IProfileState;
  profileDispatch: Dispatch<ProfileAction>;
}

/**
 * This is the entry point of a plugin.
 * Here you can add react-router, react-redux, etc..
 *
 * @todo Add more documentation for this component
 *
 * @warning :: Root component for a plugin should always extend React.Component
 * @warning :: Always use default export
 */

const PageLayout = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  margin-left: 16%;
`;

const Page = styled.div`
  width: 100%;
  height: 100%;
  padding-left: 16px;
`;

// this example is to showcase how the consumers can be outside of component, reusable
// maybe react hooks call inside?
// tslint:disable-next-line:no-console
const subConsumer = (data: any) => console.log("sdkModule call", data);

class App extends PureComponent<IProps> {
  public state: { hasErrors: boolean };

  constructor(props: IProps) {
    super(props);
    this.state = {
      hasErrors: false
    };
  }

  public componentDidCatch(err: Error, info: React.ErrorInfo) {
    this.setState({
      hasErrors: true
    });
    const { logger } = this.props;
    logger.error(err, info);
  }
  // @TODO: remove this after having a real use-case
  public onClickSdk = () => {
    const { sdkModules, logger } = this.props;
    logger.info("sdk call");
    const callMethod = sdkModules.commons.validator_service({
      method: "validator",
      args: {}
    });
    callMethod.subscribe(subConsumer);
  };
  public getEvents = () => {
    return {
      events: [
        { name: "My Event 1", href: "/events/event-1", publisherId: "1" },
        { name: "My Other event", href: "/events/event-2", publisherId: "2" },
        { name: "An Event", href: "/events/event-3", publisherId: "3" }
      ]
    };
  };

  public handleNavigation(href: string) {
    return (ev: React.SyntheticEvent) => {
      this.props.singleSpa.navigateToUrl(href);
      ev.preventDefault();
    };
  }

  public render() {
    const { i18n } = this.props;
    if (this.state.hasErrors) {
      return <div>Oh no, something went wrong in {"events-app"}</div>;
    }
    return (
      <Suspense fallback={() => <>Loading</>}>
        <I18nextProvider i18n={i18n ? i18n : null}>
          <ProfileProvider reducer={profileReducer} initialState={profileState}>
            <EventsProvider
              reducer={eventsReducer}
              initialState={eventsInit(this.getEvents())}
            >
              <PageLayout>
                <Page>
                  <Routes {...this.props} />
                  <a href="#" onClick={this.handleNavigation("/feed")}>
                    Go to Feed
                  </a>
                </Page>
              </PageLayout>
            </EventsProvider>
          </ProfileProvider>
        </I18nextProvider>
      </Suspense>
    );
  }
}

export default App;
