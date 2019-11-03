# Protected Route Example App

A simple React app with a protected profile page. When a user is logged in, the
associated user profile information can be retrieved.

If the user tries to access it directly without logging in, they will be
automatically redirected to Auth0 to log in.

## Setup

Add a `.env` file to the root directory with your Auth0 domain and client id:

```text
REACT_APP_AUTH0_DOMAIN={yourdomain.auth0.com}
REACT_APP_AUTH0_CLIENT_ID={YOUR_CLIENT_ID}
```

Then install and run the application:

```bash
npm install
npm start
```

An example application will run at
[http://localhost:3000/](http://localhost:3000/)
