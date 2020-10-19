# Profile plugin

## Usage

```tsx
import AppLoader from '@akashaproject/ui-plugin-loader';
import ProfilePlugin from '@akashaproject/ui-plugin-profile';

// ...
const app = new AppLoader(/* LoaderConfig */);

app.registerPlugin(ProfilePlugin).then(() => {
  app.start();
});
```

### State Management

State management is done using `react-tracked` library.

#### Folder structure:

- **`state/`**
  - **`articles/`**
    - **`actions`** - action creators (a la redux)
    - **`reducer.ts`** - reducer (imports actions and types)
    - **`index.ts`** - export reducer API mainly
    - **`interfaces.d.ts`**
    - **`types.ts`**

#### Usage:

First off you need to add the `Provider` higher up in the tree - preferably in root - (in the above case `ArticlesProvider`):

```jsx
// App.jsx
import { ProfilesProvider, profilesReducer, profilesState, profilesInit } from '../state/profiles';

const App = () => {
  return (
    <ProfilesProvider
      reducer={profilesReducer}
      // optional if initialState is provided
      init={profilesInit(someOtherInitialState)}
      // optional if init is provided
      initialState={profilesState}
    >
      <ProfilesList />
    </ArticlesProvider>
  );
};
```

> Note: If you only need to **`read`** from state (no need to fire actions), use **`useProfileState()`** for improved performance:
> `const articleState = useProfileState()`. If you need to only fire actions use: **`useProfileUpdate()`**.

### Suspense Support

Every action mounts a hook that will ensure suspense support, however this means that
for the first render (initial render) you must ensure that the data exist before using it

Example:
```jsx
  const MyComponent = () => {
    const [profileState, profileActions] = useProfile();
    // get the logged profile
    profileActions.getLoggedProfile();
    
    // this is important for the initial render (before the hook is mounted)
    if (!profileState.loggedProfile) {
      return null;
    }
    
    // a Suspense component higher in the tree will show the fallback
    // until the data is fetched

    return <div>{profileState.loggedProfile}</div>
  }
```

Because the action mounts a hook, you cannot use it in a handler (in `onClick` handler for example), but this is the way you must use hooks anyways.

Every action should be wrapped by an utility fn `createSuspenseAction` with the following signature:

```ts
interface Action {
  type: string;
  // payload is what you receive from fetcherFn
  payload: any;
}

interface UpdaterFn {
  // the method to update the state/store, if you use React.useReducer, this method is the dispatch param
  (action: Action): void;
}

interface fetcherFn {
  // a method to get the data;
  // it will be called with params that was passed except 
  // the `type` property
  (params: ActionParams): Promise
}
interface ActionResult {
  /** 
   *  if we receive an error from remote
   *  the action will return it so you can use:
   *   
   *   const actionError = myAction();
   *   if(actionError.error) {
   *     return <ErrorComponent error={actionError.error} />
   *   }
   */
  error: Error
}

createSuspenseAction(updater: UpdaterFn, fetchMethod: fetcherFn, params: ActionParams) => ActionResult;
```


Example of using an action in a handler:

```jsx
const ProfileList = () => {
  // global state in which you can find profiles
  const [profileState, profileActions] = useProfile();
  // use local state to manage the cursor
  const [cursorState, setCursorState] = useState({
    previousId: null,
    // hardcoded, but it can be also dynamic
    // for example, if the user scrolls very fast
    // and reaches the end of the list multiple times
    // this limit can be increased
    limit: 3
  });
  
  // this will be called every time the local state updates
  profileActions.getProfiles({
    from: cursorState.previousId,
    limit: cursorState.limit
  });

  const loadMoreProfiles = () => {
    setCursorState({
      previousId: profileState.profiles[profileState.profiles.length - 1].ethAddress,
      limit: cursorState.limit
    });
  }

  return (
    <div>
      {profileState.profiles.map(profile => {
        return <ProfileCard profile={profile} key={profile.ethAddress} />
      })}
      <button onClick={loadMoreProfiles}>Load more...</button>
    </div>
  )
}
```

One of the biggest advantages of this approach is that you would not end with a hard to manage mix between local and global states, and it ensures that all of the cases are covered (no more hard to maintain, 1km long `if/else` guards).

### Immutability

Is ensured by `Immer` library. By using a simple helper `handleActions` we wrap the whole action handlers in reducer with this library's `produce` utility. This means that in the action handler we actually receive a copy of the state (`draft`).

Example:

```js
const reducer = handleActions(
  {
    ACTION_HANDLER_CONSTANT: (draft, payload) => {
      // we can do what we want directly mutating
      // the draft, without changing the actual state
      draft = {
        ...draft,
        profiles: payload.profiles,
      };

      // when we are done we return the draft;
      return draft;
    },
  },
  initialState,
);
```

Advanced Use:

- we can use `Immer` for `undo` functionality
- we can use react-tracked selectors to further improve performance (selectors are like redux-selectors)


