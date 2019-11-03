import React, { Fragment } from 'react'; // eslint-disable-line no-unused-vars
import { useAuth0 } from '@adamjmcgrath/use-auth0';

const Profile = () => {
  const { loading, user } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <img src={user.picture} alt="Profile" />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <code style={{ whiteSpace: 'pre' }}>{JSON.stringify(user, null, 2)}</code>
    </Fragment>
  );
};

export default Profile;
