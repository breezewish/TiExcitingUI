import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Sidemenu from './Sidemenu';
import { Layout } from 'antd';
import './App.css';

import Home from './Home';
import DeployMain from './deploy/Main';
import LayerHostList from './layers/HostList';
import LayerHostAdd from './layers/HostAdd';

export default class App extends Component {
  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sidemenu />
        <Layout.Content>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/deploy">
              <DeployMain />
            </Route>
            <Route path="/dashboard">
              <Home />
            </Route>
          </Switch>
        </Layout.Content>
        <LayerHostList />
        <LayerHostAdd />
      </Layout>
    );
  }
}
