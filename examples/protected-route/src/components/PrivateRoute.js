import React, { useEffect } from 'react'; // eslint-disable-line no-unused-vars
import { Route } from 'react-router-dom';
import { useAuth0 } from '@adamjmcgrath/use-auth0';

const PrivateRoute = ({ component: Component, path, ...rest }) => {
  const { loading, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (loading || isAuthenticated) {
      return;
    }
    (async () => {
      await loginWithRedirect({
        appState: { targetUrl: path }
      });
    })();
  }, [loading, isAuthenticated, loginWithRedirect, path]);

  const render = props =>
    isAuthenticated === true ? <Component {...props} /> : null;

  return <Route path={path} render={render} {...rest} />;
};

export default PrivateRoute;
