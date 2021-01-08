---
title: When a simple React context gets out of hand.
published: true
description: It seemed like a good idea to start. Separate state into different "contexts". Just use `useState`. Then, `useEffect` and multiple if branches snuck in and it became a nightmare.
tags: react, javascript, redux
cover_image: https://content.altexsoft.com/media/2018/09/code-refactoring.jpg
---

# TL;DR:

- Sometimes what you think is a [K.I.S.S.](https://en.m.wikipedia.org/wiki/KISS_principle) solution turns into Frankenstein.
- If you find yourself wanting to use a [`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect) inside a React context, think twice.
- More importantly, be careful with `useEffects` that depend on global state.
- Kent C Dodds has some clean ideas about setting up the [React Context API](https://reactjs.org/docs/context.html).
- I will prolly default to a [`useReducer`](https://reactjs.org/docs/hooks-reference.html#usereducer) in my "app" contexts from now on.

# Let's start simple.

My team started a new React app and we wanted see what it would be like to use the React Context API, *simple* [`useState`](https://reactjs.org/docs/hooks-reference.html#usestate). We also wanted to treat each context as "boxes" of similar data.

Let's assume that our app has grown to need 2 contexts:
  - 1 for "Auth"
  - 1 for the "Timeline" [for lack of better naming]

```javascript
  const AuthContext = React.createContext();

  const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState();

    const state = { user, isLoggedIn };

    return (
      <AuthContext.Provider value={{ state, setUser, setIsLoggedIn }}>
        {children}
      </AuthContext.Provider>
    );
  };
```

The `AuthContext` contains state associated with authentication. When a user signs in, setIsLoggedIn(true) & setUser({email, username}) functions are both called. This will change the state of the `AuthContext` and can trickle through the app.

```javascript
const TimelineContext = React.createContext();

const TimelineContextProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  // For the purposes of this blog, selectedPost will be used to display
  // the "show page"
  const [selectedPost, setSelectedPost] = useState(null);
  // And let's imagine we want to do the same thing for a comment.
  const [selectedComment, setSelectedComment] = useState(null);

  const state = { posts, selectedPost, selectedComment };

  return (
    <TimelineContext.Provider
      value={{ state, setPosts, setSelectedPost, setSelectedComment }}
    >
      {children}
    </TimelineContext.Provider>
  );
};
```

The `TimelineContext` will maintain the state for our timeline including a list of `posts`, a `selectedPost`, and a `selectedComment`.

These are pretty simple, right?

One issue with this that immediately pops out is the return value of each context. Currently, we can see as we add new state the return value grow pretty quickly.

Let's go ahead and solve that in the `TimelineContext`.

```javascript
  const TimelineContextProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null)
    const [selectedComment, setSelectedComment] = useState(null)

    const state = { posts, selectedPost, selectedComment };
    const actions = { setPosts, setSelectedPost, setSelectedComment }

    return (
      <TimelineContext.Provider value={{ state, actions}}>
        {children}
      </TimelineContext.Provider>
    );
  };
```

Ok. That helps a bit. We have constrained the return object to `state` & `actions`.

![Noice!](https://media.giphy.com/media/PhKhSXofSAm3e/giphy.gif)

Another annoyance would be if this context grows in size. The more `useStates` we add, the harder it could be to manage. This was the idea of having multiple contexts. We can have a clear separation of concerns.

# NEW REQUIREMENT!

Now we want to set a selected post and comment within our application. If the comment is dependent on the post, we will also need to nullify the `selectedComment`  when a new post is selected.

This is fairly simple. We can just throw in a `useEffect` and boom.

```javascript
  const TimelineContextProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null)
    const [selectedComment, setSelectedComment] = useState(null)

    const state = { posts, selectedPost, selectedComment };
    const actions = { setPosts, setSelectedPost, setSelectedComment }

    useEffect(() => {
      setSelectedComment(null)
    }, [selectedPost])

    return (
      <TimelineContext.Provider value={{ state, actions}}>
        {children}
      </TimelineContext.Provider>
    );
  };
```

## More Modification!!!

Now let's say for testing purposes we want to add initial{SelectedPost and SelectedComment}. Stupid simple. Or is it?

The way we currently have it set up, the useEffect will set our `initialSelectedComment` to null on the first render. OOOO no a side useEffect!!!

So our context then turns into:

```javascript
const TimelineContextProvider = ({
  initialSelectedPost,
  initialSelectedComment,
  children
}) => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(initialSelectedPost);
  const [selectedComment, setSelectedComment] = useState(
    initialSelectedComment
  );

  const state = { posts, selectedPost, selectedComment };
  const actions = { setPosts, setSelectedPost, setSelectedComment };

  useEffect(() => {
    if (initialSelectedPost != initialSelectedComment) {
      setSelectedComment(null);
    }
  }, [selectedPost]);

  return (
    <TimelineContext.Provider value={{ state, actions }}>
      {children}
    </TimelineContext.Provider>
  );
};
```

This may not be a huge issue, but it will cause us to have to think about any consequences that may occur just from changing state.

# Single Source of Global Truth

One gripe from the team has been "well which use{X}Context do I use in the component?".  Both the `AuthContext` and `TimelineContext` are part of the global state so one solution would be to just combine them, and separate the domains inside the state object. Let's start by solving that issue.

```javascript
const AppContextProvider = ({
  initialSelectedPost,
  initialSelectedComment,
  children
}) => {
  const [user, setUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(initialSelectedPost);
  const [selectedComment, setSelectedComment] = useState(
    initialSelectedComment
  );

  const state = {
    auth: { user, isLoggedIn },
    timeline: { posts, selectedPost, selectedComment }
  };

  const actions = {
    setUser,
    setIsLoggedIn,
    setPosts,
    setSelectedPost,
    setSelectedComment
  };

  useEffect(() => {
    if (initialSelectedPost != initialSelectedComment) {
      setSelectedComment(null);
    }
  }, [selectedPost]);

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};
```

Not a huge win IMO, but now the team is happier.

# Revelio Side Effects

After working with React hooks for a year, I've come to the conclusion that `useEffect` in a context is probably a bad idea. (I'd love to see examples where you've made this work BTW).

A more concrete rule that I've landed on is that we should not have a useEffect in our app that relies on global state. I kind of see this a sharp knife that could easily poke your eye out. It raises the barrier to work on a project for people that don't work in the frontend day in and day out. Even for someone working in the codebase, it's something they always have to keep in the back of their mind. "If I change {X}, this callback will run, and do I need to modify it?".

My solution to this is to always (well prolly 95% of the time) use `useReducer` in global state and to never have a `useEffect` depend on a piece of global state.

Let's go!

## Initial State

First, we will start with our app's initial state.

```javascript
const initialState = {
  auth: { user: null, isLoggedIn: false },
  timeline: { posts: [], selectedPost: null, selectedComment: null }
};
```

Well, that was easy enough! Defining our initial state lets us see all of our global state at a glance. Any time we want to add something to our global state, we can start by adding a sensible default to our initialState object. For example, `isLoggedIn` is initially false, and `posts` is initially an empty array.

## Reducery, my dear Watson

My favorite part of the reducer pattern is you can think of each action in your reducer as single interactions with your app. These interactions can either be network requests or UserEvents. When setting up an action, I ask "What happens to the state when {X} occurs".  Then, you just dispatch that action with the correct payload and boom boom boom. Done! Now, if the same interaction occurs in 2 places, you don't have to open the other component and remember the logic; you just dispatch the action.

For the `auth` part of our context, we have 2 interactions: sign in and logout.

Let's take a look at the code for this.

```javascript
const ActionTypes = {
  SET_USER: "set-user",
  LOGOUT_USER: "logout-user",
}
const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_USER: {
      return {
        ...state,
        auth: { ...state.auth, user: action.payload, isLoggedIn: true }
      };
    }
    case ActionTypes.LOGOUT_USER: {
      return {
        ...state,
        auth: { ...state.auth, user: null, isLoggedIn: false }
      };
    }
    ...
  }
};
```

Wow, that's K.I.S.S. :D

Now we don't have to remember to call `setUser` and `setIsLoggedIn`, we just dispatch the corresponding action for the given interaction.

Next up, let's add actions for the `timeline` state.

```javascript
const ActionTypes = {
  ...,
  ADD_POSTS: "add-posts",
  SELECT_POST: "select-post",
  SELECT_COMMENT: "select-comment"
};

const reducer = (state, action) => {
  switch (action.type) {
    ...,
    case ActionTypes.ADD_POSTS: {
      return {
        ...state,
        timeline: {
          ...state.timeline,
          posts: [...state.timeline.posts, ...action.payload]
        }
      };
    }
    case ActionTypes.SELECT_POST: {
      return {
        ...state,
        timeline: {
          ...state.timeline,
          selectedPost: action.payload,
          selectedComment: null
        }
      };
    }
    case ActionTypes.SELECT_COMMENT: {
      return {
        ...state,
        timeline: {
          ...state.timeline,
          selectedComment: action.payload
        }
      };
    }
    ...,
  }
};
```

You may not have realized it, but the `SELECT_POST` action solves the useEffect side effect issue! If you remember, we had a `useEffect` in our original context that would nullify the `selectedComment` when the `selectedPost` changes. Now, we can set an `initialSelectedPost` & `initialSelectedComment` without worrying about the `useEffect` firing off; eliminating the need for an `if` state just for testing purposes.

## The New Context

The last piece of the puzzle is providing our new reducer to our app via a React Context.

```javascript
const AppProvider = ({ initialState, reducer, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
```

Well, that's a lot cleaner. My team works in a [Rails](https://rubyonrails.org/) monolith which is why I've decided to have `initialState` and the `reducer` to be props for the AppProvider. This approach allows us to use the same provider for any React app that we decide to create.

# Conclusion

Currently, this is my favorite way to [with some extra magic I'll blog about later] to manage global state in a React app.
 - No added dependencies.
 - No side effects on global state that have to be memorized.
 - Each interation is mapped to a single encapsulated action.

Putting it all together.

```javascript
const initialState = {
  auth: { user: null, isLoggedIn: false },
  timeline: { posts: [], selectedPost: null, selectedComment: null }
};

const ActionTypes = {
  SET_USER: "set-user",
  LOGOUT_USER: "logout-user",
  ADD_POSTS: "add-posts",
  SELECT_POST: "select-post",
  SELECT_COMMENT: "select-comment"
};

const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_USER: {
      return {
        ...state,
        auth: { ...state.auth, user: action.payload, isLoggedIn: true }
      };
    }
    case ActionTypes.LOGOUT_USER: {
      return {
        ...state,
        auth: { ...state.auth, user: null, isLoggedIn: false }
      };
    }
    case ActionTypes.ADD_POSTS: {
      return {
        ...state,
        timeline: {
          ...state.timeline,
          posts: [...state.timeline.posts, ...action.payload]
        }
      };
    }
    case ActionTypes.SELECT_POST: {
      return {
        ...state,
        timeline: {
          ...state.timeline,
          selectedPost: action.payload,
          selectedComment: null
        }
      };
    }
    case ActionTypes.SELECT_COMMENT: {
      return {
        ...state,
        timeline: {
          ...state.timeline,
          selectedComment: action.payload
        }
      };
    }
    default:
      return state;
  }
};

const AppProvider = ({ initialState, reducer, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
```

You can find my random tech ramblings on tweeter [@basicbrogrammer](https://twitter.com/basicbrogrammer)

# References

[Shout out to Kent Dodds. He has some killer React patterns on his blog. Check it out.](https://kentcdodds.com/blog/how-to-use-react-context-effectively)

[The docs on `userReducer` from React](https://reactjs.org/docs/hooks-reference.html#usereducer)
