import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, Route, hashHistory } from 'react-router';
import configureStore from './stores';
import RealtimeCheckins from './components/pages/RealtimeCheckins/RealtimeCheckins.jsx';
import HistoryCheckins from './components/pages/HistoryCheckins/HistoryCheckins.jsx';
import UserInst from './components/pages/UserInst/UserInst.jsx';
import UserVk from './components/pages/UserVk/UserVk.jsx';
import InstagramAccessToken from './components/pages/InstagramAccessToken/InstagramAccessToken.jsx';

const store = configureStore();

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(hashHistory, store)

render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/realtime_checkins" component={RealtimeCheckins} />
            <Route path="/access_token=:token" component={InstagramAccessToken} />
            <Route path="/user_inst/:user_id" component={UserInst} />
            <Route path="/user_vk/:user_id" component={UserVk} />
            <Route path="/" component={HistoryCheckins} />
        </Router>
    </Provider>,
    document.getElementById('app')
);
