# AWF Hooks

This package contains all hooks required for proper functioning of the Akasha Web Framework

## Available Hooks

### [useAnalytics](./src/use-analytics.ts)
> handles user consent to tracking and analytics functions. Available actions include;
- enableTracking
- acceptConsent
- rejectConsent
- trackEvent

### [useENSRegistration](./src/use-ens-registration.ts)
> handles registration and resolution of ENS (Ethereum Name Service) names. Available actions include;
- getENSByAddress
- register
- updateUserName
- validateName
- claim
- resetRegistrationStatus

### [useBookmarks](./src/use-entry-bookmark.ts)
> handles bookmark related functionalities in the [bookmarks plugin](../plugins/bookmarks/README.md). Available actions include;
- getBookmarks
- bookmarkPost
- bookmarkComment
- removeBookmark


### [useEntryPublisher](./src/use-entry-publisher.ts)
> handles creation and publishing of entries in the virtual list. Available actions include;
- addEntry
- removeEntry

### [useFeedReducer](./src/use-feed-reducer.ts)
> handles loading and data fetching for feed items. Available actions include;
- setFeedItems
- setFeedItemData
- loadFeedStart
- hasMoreItems

### [useFollow](./src/use-follow.ts)
> handles follow/unfollow functionality in the [profile plugin](../plugins/profile/README.md) (and applicable widgets). Available actions include;
- isFollowing
- follow
- unfollow

### [useGlobalLogin](./src/use-global-login.ts)
> handles actions triggered right after user logs in or out of the app.

### [useLegal](./src/use-legal.ts)
> handles retrieval of legal docs from IPFS service. Available actions include;
- getLegalDoc

### [useMentions](./src/use-mentions.ts)
> handles mentions and tags functionalities. Available actions include;
- getMentions
- getTags

### [useModalState](./src/use-modal-state.ts)
> handles rendering and dismissal of modals. Available actions include;
- show
- showAfterLogin
- hide


### [useNetworkState](./src/use-network-state.ts)
> handles checks to ensure that the user is on the appropriate ethereum network required for the app. Available actions include;
- checkNetwork

### [useNotifications](./src/use-notifications.ts)
> handles notification related functionalities in the [notifications plugin](../plugins/notifications/README.md). Available actions include;
- getMessages
- markMessageAsRead
- hasNewNotifications

### [usePosts](./src/use-posts.ts)
> handles post(s) and comment(s) publishing and retrieval functionalities. Available actions include;
- getPost
- getPostData
- getComment
- getPosts
- getComments
- getUserPosts
- getTagPosts
- optimisticPublishComment
- optimisticPublishPost
- resetPostIds
- updatePostsState

### [useProfile](./src/use-profile.ts)
> handles profile related functionalities in the [profile plugin](../plugins/profile/README.md). Available actions include;
- getProfileData
- getEntryAuthor
- resetProfileData
- optimisticUpdate
- updateProfile
- resetUpdateStatus
- validateUsername
- getUsernameTypes
- updateUsernameProvider

### [useSearch](./src/use-search.ts)
> handles search related functionalities in the [search plugin](../plugins/search/README.md). Available actions include;
- search
- updateSearchState


### [useTagSubscribe](./src/use-tag-subscribe.ts)
> handles tag subscription functionalities. Available actions include;
- isSubscribedToTag
- toggleTagSubscription
- getTagSubscriptions

### [useTrendingData](./src/use-trending-data.ts)
> handles fetching of trending data (tags and profiles). Available actions include;
- setTrendingTags
- setTrendingProfiles

## [useModeration](./src/use-moderation.ts)
- handles moderation related actions. Available actions include;
- createModerationMutation
- checkStatus
- checkModerator
- getCount
- getFlags
- getLog
- getPending
- getKept
- getDelisted

