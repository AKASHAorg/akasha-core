import * as React from 'react';
import { Link, match } from 'react-router-dom';

export interface IEventHomePageProps {
  rootPath: string;
  match: match<any> | null;
}

const EventHomePage: React.FC<IEventHomePageProps> = props => {
  const { rootPath } = props;

  return (
    <div>
      Events List
      <div>
        <Link to={{ pathname: `${rootPath}/my-event` }}>Event 1</Link>
      </div>
      <div>
        <Link to={`${rootPath}/123`}>Event 2</Link>
      </div>
      <div>
        <Link to={`${rootPath}/125`}>Event 3</Link>
      </div>
      <div>
        <Link to={`${rootPath}/not/found/event`}>Not found event</Link>
      </div>
    </div>
  );
};

export default EventHomePage;
