import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import {BrowserRouter} from 'react-router-dom';
import './index.css';
import App from './App';

import storeLayers from './store/layers';
import storeHosts from './store/hosts';

ReactDOM.render(
  <BrowserRouter>
    <Provider
      hosts={storeHosts}
      layers={storeLayers}
    >
      <App />
    </Provider>
  </BrowserRouter>
, document.getElementById('root'));
