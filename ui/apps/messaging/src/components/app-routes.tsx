import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import * as React from 'react';
import DS from '@akashaorg/design-system';
import routes, { MESSAGING } from '../routes';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';
import { sendMessage } from '../api/message';

const { Helmet, CommentEditor } = DS;

const MessageForm = () => {
  const [to, setTo] = React.useState('');
  const submitForm = async publish => {
    const result = await sendMessage(to, publish);
    console.info(result);
  };
  return (
    <form>
      <input type={'text'} placeholder={'to'} onChange={ev => setTo(ev.target.value)} />
      <CommentEditor
        ethAddress={undefined}
        onPublish={submitForm}
        getLinkPreview={undefined}
        getMentions={undefined}
        getTags={undefined}
      ></CommentEditor>
      <button type={'submit'}>Send message</button>
    </form>
  );
};

const AppRoutes: React.FC<RootComponentProps> = props => {
  return (
    <Router basename={props.baseRouteName}>
      <Routes>
        {/*<>*/}
        {/*  <Helmet>*/}
        {/*    <title>My Bookmarks | Ethereum World</title>*/}
        {/*  </Helmet>*/}
        {/*</>*/}
        <Route path={`${routes[MESSAGING]}`} element={<MessageForm />}></Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
