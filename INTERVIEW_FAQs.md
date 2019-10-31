# FAQs:

- Didn't you just 'borrow' our quickstart?
    - I have rewritten parts of the hook implementation to improve consistency, 
      performance and tesability 
    - I also hope I've added value through the testing, packaging and deploying
- Why did you use a reducer?
    - I wanted to reduce number of renders (to improve performance)
    - make atomic updates (so we don't have partial intended state like
      `isAuthenticated` is `true` but `user` is `null`)
    - encapsulate some logic outside render (testing)
- Why did you use a ref for the `auth0Client` (not state)
    - I thought it better captured how `auth0Client` is used, it's a reference
      for callbacks
    - Also, it shouldn't re-render when it is initialised and shouldn't
      be external state
    - Lets us pull out the login with popup logic to make it easier to test
