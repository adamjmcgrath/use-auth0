import React from 'react'; // eslint-disable-line no-unused-vars
import { Link } from 'react-router-dom';
import { useAuth0 } from '@adamjmcgrath/use-auth0';

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout, loading } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {!isAuthenticated && (
        <button onClick={() => loginWithRedirect({})}>Log in</button>
      )}

      {isAuthenticated && (
        <span>
          <Link to="/">Home</Link>&nbsp;
          <Link to="/profile">Profile</Link>&nbsp;
          <button onClick={() => logout()}>Log out</button>
        </span>
      )}
    </div>
  );
};

export default NavBar;
