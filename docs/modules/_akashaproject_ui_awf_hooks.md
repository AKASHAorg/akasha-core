[AWF](../README.md) / [Exports](../modules.md) / @akashaproject/ui-awf-hooks

# Module: @akashaproject/ui-awf-hooks

## Table of contents

### Enumerations

- [BookmarkTypes](../enums/_akashaproject_ui_awf_hooks.BookmarkTypes.md)

### Properties

- [constants](_akashaproject_ui_awf_hooks.md#constants)
- [moderationRequest](_akashaproject_ui_awf_hooks.md#moderationrequest)

### Functions

- [useAnalytics](_akashaproject_ui_awf_hooks.md#useanalytics)
- [useBookmarks](_akashaproject_ui_awf_hooks.md#usebookmarks)
- [useENSRegistration](_akashaproject_ui_awf_hooks.md#useensregistration)
- [useEntryPublisher](_akashaproject_ui_awf_hooks.md#useentrypublisher)
- [useErrors](_akashaproject_ui_awf_hooks.md#useerrors)
- [useFeedReducer](_akashaproject_ui_awf_hooks.md#usefeedreducer)
- [useFollow](_akashaproject_ui_awf_hooks.md#usefollow)
- [useGlobalLogin](_akashaproject_ui_awf_hooks.md#usegloballogin)
- [useLegal](_akashaproject_ui_awf_hooks.md#uselegal)
- [useLoginState](_akashaproject_ui_awf_hooks.md#useloginstate)
- [useMentions](_akashaproject_ui_awf_hooks.md#usementions)
- [useModalState](_akashaproject_ui_awf_hooks.md#usemodalstate)
- [useNetworkState](_akashaproject_ui_awf_hooks.md#usenetworkstate)
- [useNotifications](_akashaproject_ui_awf_hooks.md#usenotifications)
- [usePosts](_akashaproject_ui_awf_hooks.md#useposts)
- [useProfile](_akashaproject_ui_awf_hooks.md#useprofile)
- [useSearch](_akashaproject_ui_awf_hooks.md#usesearch)
- [useSignData](_akashaproject_ui_awf_hooks.md#usesigndata)
- [useTagSubscribe](_akashaproject_ui_awf_hooks.md#usetagsubscribe)
- [useTrendingData](_akashaproject_ui_awf_hooks.md#usetrendingdata)
- [withProviders](_akashaproject_ui_awf_hooks.md#withproviders)

## Properties

### constants

• **constants**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `BASE_DECISION_URL` | `string` |
| `BASE_MODERATOR_URL` | `string` |
| `BASE_REPORT_URL` | `string` |
| `BASE_STATUS_URL` | `string` |

___

### moderationRequest

• **moderationRequest**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `checkModerator` | (`loggedUserEthAddress`: `string`) => `Promise`<`any`\> |
| `checkStatus` | (`isBatch`: `boolean`, `data`: `Record`<`string`, `unknown`\>, `entryId?`: `string`) => `Promise`<`any`\> |
| `getAllModerated` | () => `Promise`<`any`\> |
| `getAllPending` | () => `Promise`<`any`\> |
| `getCount` | () => `Promise`<`any`\> |
| `getFlags` | (`entryId`: `string`) => `Promise`<`any`\> |
| `getLog` | (`data?`: { `limit?`: `number` ; `offset?`: `string`  }) => `Promise`<`any`\> |
| `modalClickHandler` | (`__namedParameters`: `Object`) => `Promise`<`void`\> |

## Functions

### useAnalytics

▸ `Const` **useAnalytics**(): [`UseAnalyticsState`, `UseAnalyticsActions`]

#### Returns

[`UseAnalyticsState`, `UseAnalyticsActions`]

#### Defined in

[ui/hooks/src/use-analytics.ts:28](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/hooks/src/use-analytics.ts#L28)

___

### useBookmarks

▸ `Const` **useBookmarks**(`props`): [`IBookmarkState`, `IBookmarkActions`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `UseEntryBookmarkProps` |

#### Returns

[`IBookmarkState`, `IBookmarkActions`]

#### Defined in

[ui/hooks/src/use-entry-bookmark.ts:124](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/hooks/src/use-entry-bookmark.ts#L124)

___

### useENSRegistration

▸ `Const` **useENSRegistration**(`props`): [`UseENSRegistrationState`, `UseENSRegistrationActions`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `UseENSRegistrationProps` |

#### Returns

[`UseENSRegistrationState`, `UseENSRegistrationActions`]

#### Defined in

[ui/hooks/src/use-ens-registration.ts:216](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/hooks/src/use-ens-registration.ts#L216)

___

### useEntryPublisher

▸ `Const` **useEntryPublisher**(`props`): [`IPendingEntry`[], `IPendingActions`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `IEntryPublisherProps` |

#### Returns

[`IPendingEntry`[], `IPendingActions`]

#### Defined in

[ui/hooks/src/use-entry-publisher.ts:33](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/hooks/src/use-entry-publisher.ts#L33)

___

### useErrors

▸ `Const` **useErrors**(`props`): [`ErrorState`, `ErrorActions`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `UseErrorStateProps` |

#### Returns

[`ErrorState`, `ErrorActions`]

#### Defined in

[ui/hooks/src/use-error-state.ts:16](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/hooks/src/use-error-state.ts#L16)

___

### useFeedReducer

▸ `Const` **useFeedReducer**(`initialState`): [`IFeedState`, `IFeedActions`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `initialState` | `Partial`<`IFeedState`\> |

#### Returns

[`IFeedState`, `IFeedActions`]

#### Defined in

[ui/hooks/src/use-feed-reducer.ts:85](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/hooks/src/use-feed-reducer.ts#L85)

___

### useFollow

▸ `Const` **useFollow**(`props`): [`string`[], `UseFollowActions`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `UseFollowProps` |

#### Returns

[`string`[], `UseFollowActions`]

#### Defined in

[ui/hooks/src/use-follow.ts:180](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/hooks/src/use-follow.ts#L180)

___

### useGlobalLogin

▸ `Const` **useGlobalLogin**(`props`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `UseGlobalLoginProps` |

#### Returns

`void`

#### Defined in

[ui/hooks/src/use-global-login.ts:22](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/hooks/src/use-global-login.ts#L22)

___

### useLegal

▸ `Const` **useLegal**(`props`): [`string`, `UseLegalActions`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `UseLegalProps` |

#### Returns

[`string`, `UseLegalActions`]

#### Defined in

[ui/hooks/src/use-legal.ts:53](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/hooks/src/use-legal.ts#L53)

___

### useLoginState

▸ `Const` **useLoginState**(`props`): [`ILoginState`, `UseLoginActions`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `UseLoginProps` |

#### Returns

[`ILoginState`, `UseLoginActions`]

#### Defined in

[ui/hooks/src/use-login-state.ts:97](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/hooks/src/use-login-state.ts#L97)

___

### useMentions

▸ `Const` **useMentions**(`props`): [`IMentionsState`, `UseMentionsActions`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `UseMentionsProps` |

#### Returns

[`IMentionsState`, `UseMentionsActions`]

#### Defined in

[ui/hooks/src/use-mentions.ts:76](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/hooks/src/use-mentions.ts#L76)

___

### useModalState

▸ `Const` **useModalState**(`props`): [`ModalState`, `ModalStateActions`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `UseModalStateProps` |

#### Returns

[`ModalState`, `ModalStateActions`]

#### Defined in

[ui/hooks/src/use-modal-state.ts:39](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/hooks/src/use-modal-state.ts#L39)

___

### useNetworkState

▸ `Const` **useNetworkState**(): [`INetworkState`, `UseNetworkActions`]

#### Returns

[`INetworkState`, `UseNetworkActions`]

#### Defined in

[ui/hooks/src/use-network-state.ts:41](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/hooks/src/use-network-state.ts#L41)

___

### useNotifications

▸ `Const` **useNotifications**(`props`): [`INotificationsState`, `UseNotificationsActions`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `UseNotificationsProps` |

#### Returns

[`INotificationsState`, `UseNotificationsActions`]

#### Defined in

[ui/hooks/src/use-notifications.ts:119](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/hooks/src/use-notifications.ts#L119)

___

### usePosts

▸ `Const` **usePosts**(`props`): [`PostsState`, `PostsActions`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `UsePostsProps` |

#### Returns

[`PostsState`, `PostsActions`]

#### Defined in

[ui/hooks/src/use-posts.ts:516](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/hooks/src/use-posts.ts#L516)

___

### useProfile

▸ `Const` **useProfile**(`props`): [`IProfileState`, `UseProfileActions`, `ProfileUpdateStatus`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `UseProfileProps` |

#### Returns

[`IProfileState`, `UseProfileActions`, `ProfileUpdateStatus`]

#### Defined in

[ui/hooks/src/use-profile.ts:285](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/hooks/src/use-profile.ts#L285)

___

### useSearch

▸ `Const` **useSearch**(`props`): [`ISearchState`, `UseSearchActions`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `UseSearchProps` |

#### Returns

[`ISearchState`, `UseSearchActions`]

#### Defined in

[ui/hooks/src/use-search.ts:86](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/hooks/src/use-search.ts#L86)

___

### useSignData

▸ `Const` **useSignData**(`props`): [{ `pubKey`: `string` ; `serializedData`: `any` ; `signature`: `string` \| `Uint8Array`  }, `UseSignDataActions`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `UseSignDataProps` |

#### Returns

[{ `pubKey`: `string` ; `serializedData`: `any` ; `signature`: `string` \| `Uint8Array`  }, `UseSignDataActions`]

#### Defined in

[ui/hooks/src/use-sign-data.ts:74](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/hooks/src/use-sign-data.ts#L74)

___

### useTagSubscribe

▸ `Const` **useTagSubscribe**(`props`): [`string`[], `UseTagSubscribeActions`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `UseTagSubscribeProps` |

#### Returns

[`string`[], `UseTagSubscribeActions`]

#### Defined in

[ui/hooks/src/use-tag-subscribe.ts:126](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/hooks/src/use-tag-subscribe.ts#L126)

___

### useTrendingData

▸ `Const` **useTrendingData**(`props`): [{ `profiles`: `IProfileData`[] ; `tags`: { `name`: `string` ; `totalPosts`: `number`  }[]  }, `ITrendingActions`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `UseTrendingDataProps` |

#### Returns

[{ `profiles`: `IProfileData`[] ; `tags`: { `name`: `string` ; `totalPosts`: `number`  }[]  }, `ITrendingActions`]

#### Defined in

[ui/hooks/src/use-trending-data.ts:75](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/hooks/src/use-trending-data.ts#L75)

___

### withProviders

▸ **withProviders**<`T`\>(`WrappedComponent`): (`props`: `any`) => `Element`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `WrappedComponent` | `React.ComponentType`<`T`\> |

#### Returns

`fn`

▸ (`props`): `Element`

##### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `any` |

##### Returns

`Element`

| Name | Type |
| :------ | :------ |
| `displayName` | `string` |

#### Defined in

[ui/hooks/src/utils/provider-hoc.tsx:10](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/hooks/src/utils/provider-hoc.tsx#L10)
