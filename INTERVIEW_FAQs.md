# FAQs:

- Didn't you just 'borrow' our quickstart?
    - Yes, but it was the most idiomatic react way of creating global state and
      async side effects, needed for doing auth in modern react apps
    - I have rewritten parts of the hook implementation to improve consistency, 
      performance and tesability 
    - I added value through setting up testing, packaging and deploying
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
