## Usage

```tsx
import AppLoader from '@akashaproject/ui-plugin-loader';
import Feed from '@akashaproject/ui-plugin-feed';

// ...
const app = new AppLoader(/* LoaderConfig */);

app.registerPlugin(Feed).then(() => {
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
import { ArticlesProvider, articlesReducer, articlesState, articlesInit } from '../state/articles';

const App = () => {
  return (
    <ArticlesProvider
      reducer={articlesReducer}
      // optional if initialState is provided
      init={articlesInit(someOtherInitialState)}
      // optional if init is provided
      initialState={articlesState}
    >
      <EntryList />
    </ArticlesProvider>
  );
};

// EntryList.jsx
import { useArticles } from '../state/articles';

const EntryList = () => {
  const [articleState, articleActions] = useArticles();
  // on mount
  React.useEffect(() => {
    fetchSomeArticles().then(articleArray => {
      articleActions.getArticles({ articles: articlesArray });
    });
  }, []);
  return (
    <>
      {articleState.articles.map(article => {
        return <>{article.name}</>;
      })}
    </>
  );
};
```

> Note: If you only need to **`read`** from state (no need to fire actions), use **`useArticlesState()`** for improved performance:
> `const articleState = useArticleState()`. If you need to only fire actions use: **`useArticlesUpdate()`**.

> Note: If you need to show a loading spinner until the articles are fetched, use local state for that: `const [isLoading, setIsLoading] = React.useState(true);`. We can develop a custom hook to deal with loading state.

> Note: In the example above we may end up in a `racing condition` if the component is `unmounted` (or `unmouning`) and the response is still pending. We can easily avoid that by using the above mentioned custom hook, wich can also manage the component's mounted state.

Example to prevent racing condition:

```js
const MyComponent = () => {
    const [articleState, articleActions] = useArticles();
    const [isLoading, setIsLoading, isMounted] = useSpinnerHook();
    // isMounted is a refObject -> React.useRef();
    React.useEffect(() => {
        setIsLoading(true);
        isMounted.current = true;
        fetchArticles().then((articleArray) => {
            if (isMounted.current) {
                articleActions.getArticles({...});
                setIsLoading(false);
            }
        })
        return () => {
            isMounted.current = false;
        }
    }, []);
    return (/** anything **/);
}
```

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
        articles: payload.articles,
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
