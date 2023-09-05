import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import { AUTH0 } from './constants';

ReactDOM.render(
  <Auth0Provider
    domain={AUTH0.DOMAIN}
    clientId={AUTH0.CLIENT_ID}
    redirectUri={window.location.origin}
    useRefreshTokens={true}
    cacheLocation='localstorage'
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Auth0Provider>,
  document.getElementById('root')
);
