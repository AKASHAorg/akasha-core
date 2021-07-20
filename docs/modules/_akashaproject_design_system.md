[AWF](../README.md) / [Exports](../modules.md) / @akashaproject/design-system

# Module: @akashaproject/design-system

## Table of contents

### Variables

- [default](_akashaproject_design_system.md#default)

## Variables

### default

• `Const` **default**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `AppIcon` | `FC`<`IAppIcon`\> |
| `AppInfoWidgetCard` | `FC`<`IAppsWidgetCardProps`\> |
| `AppsWidgetCard` | `FC`<`IAppsWidgetCardProps`\> |
| `AreaChart` | `FC`<`IAreaChart`\> |
| `Autosizer` | typeof `default` |
| `Avatar` | `FC`<`AvatarProps`\> |
| `BasicCardBox` | `FC`<`IBasicCardBox`\> |
| `BookmarkPill` | `FC`<`IBookmarkPill`\> |
| `Box` | `FC`<`BoxExtendedProps`\> |
| `BoxFormCard` | `FC`<`IBoxFormCardProps`\> |
| `Button` | (`props`: `IButtonProps`) => `Element` |
| `Carousel` | `FC`<`CarouselExtendedProps`\> |
| `CommentEditor` | `FC`<`Omit`<`IEditorBox`, ``"editorState"`` \| ``"setEditorState"``\>\> |
| `CommentInput` | `FC`<`ICommentInput`\> |
| `ConfirmationModal` | `FC`<`ConfirmationModalProps`\> |
| `CookieWidgetCard` | `FC`<`ICookieWidgetCard`\> |
| `CustomizeFeedCard` | `FC`<`ICustomizeFeedCardProps`\> |
| `DropSearchInput` | `FC`<`ICustomSearchInput`\> |
| `DuplexButton` | (`props`: `IDuplexButtonProps`) => `Element` |
| `DuplexButton.defaultProps` | `Object` |
| `DuplexButton.defaultProps.active` | `boolean` |
| `DuplexButton.defaultProps.activeHoverLabel` | `string` |
| `DuplexButton.defaultProps.activeLabel` | `string` |
| `DuplexButton.defaultProps.inactiveLabel` | `string` |
| `EditableAvatar` | `FC`<`EditableAvatarProps` & `Partial`<`Object`\>\> |
| `EditorBox` | `FC`<`IEditorBox`\> |
| `EditorCard` | `FC`<`IEditorCard`\> |
| `EditorMeter` | `FC`<`IEditorMeter`\> |
| `EditorModal` | `FC`<`IEditorModal`\> |
| `EditorPlaceholder` | `FC`<`IEditorPlaceholder`\> |
| `EnsFormCard` | `FC`<`IEnsFormCardProps`\> |
| `EntryBox` | `FC`<`IEntryBoxProps`\> |
| `EntryCard` | `FC`<`IEntryCardProps`\> |
| `EntryCardHidden` | `FC`<`IEntryCardHiddenProps`\> |
| `EntryCardLoading` | `FC`<`IPlaceholderProps`\> |
| `EntryPublishErrorCard` | `FC`<`PublishErrorCardProps`\> |
| `ErrorInfoCard` | (`__namedParameters`: { `errors?`: { [key: string]: { `critical`: `boolean` ; `error`: `Error`  };  } ; `children`: (`messages`: `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\>, `isCritical`: `boolean`, `errors?`: `Record`<`string`, `unknown`\>[]) => `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\>  }) => `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\> |
| `ErrorLoader` | `FC`<`ErrorLoaderProps`\> |
| `EthProviderListModal` | (`props`: { `inputPlaceholder?`: `string` ; `providers`: `IProviderInfo`[] ; `showSignUp?`: { `inviteToken`: `string` ; `status`: `boolean`  } ; `titleLabel`: `string` ; `onModalClose`: () => `void` ; `onProviderClick`: (`providerId`: `string`) => `void`  }) => `Element` |
| `EthProviderModal` | `FC`<`IProviderModalProps`\> |
| `ExtensionPoint` | `FC`<`ExtensionPointProps`\> |
| `FeedbackModal` | `FC`<`IFeedbackModalProps`\> |
| `FilterCard` | `FC`<`IFilterCard`\> |
| `Grid` | `FC`<`GridExtendedProps`\> |
| `Grommet` | `FC`<`GrommetExtendedProps`\> |
| `Helmet` | `any` |
| `HorizontalDivider` | `FC`<`Object`\> |
| `Icon` | `FC`<`IconProps`\> |
| `IconButton` | (`props`: `IIconButtonProps`) => `Element` |
| `IconLink` | `ForwardRefExoticComponent`<`ILinkIconButtonProps` & `RefAttributes`<`unknown`\>\> |
| `Image` | `FC`<`ImageExtendedProps`\> |
| `LineChart` | `FC`<`ILineChart`\> |
| `LoginCTAWidgetCard` | `FC`<`ILoginWidgetCardProps`\> |
| `MainAreaCardBox` | `StyledComponent`<`FC`<`IBasicCardBox`\>, `any`, `Object`, `never`\> |
| `MdCard` | `FC`<`IMdCard`\> |
| `MiniInfoWidgetCard` | `FC`<`IMiniInfoCardProps`\> |
| `MobileListModal` | `FC`<`IMobileListModal`\> |
| `ModalCard` | `StyledComponent`<`FC`<`IBasicCardBox`\>, `any`, `Object`, `never`\> |
| `ModalContainer` | `FC`<`IModalContainerProps`\> |
| `ModalRenderer` | `FC`<`Object`\> |
| `ModerateModal` | `FC`<`IModerateModalProps`\> |
| `ModerationAppErrorCard` | `FC`<`IModerationAppErrorCardProps`\> |
| `NewPostsPill` | `FC`<`INewPostsPill`\> |
| `Notification` | `StyledComponent`<`FunctionComponent`<`NotificationProps`\>, `any`, `Object`, `never`\> |
| `NotificationsCard` | `FC`<`INotificationsCard`\> |
| `NotificationsPopover` | `FC`<`INotificationsPopover`\> |
| `ProfileAvatarButton` | `ForwardRefExoticComponent`<`ProfileAvatarButtonProps` & `RefAttributes`<`unknown`\>\> |
| `ProfileCard` | `FC`<`IProfileCardProps`\> |
| `ProfileCompletedModal` | `FC`<`IProfileCompletedModalProps`\> |
| `ProfileMiniCard` | `FC`<`IProfileMiniCard`\> |
| `ProfileSearchCard` | `FC`<`IProfileWidgetCard`\> |
| `ProfileWidgetCard` | `FC`<`IProfileWidgetCard`\> |
| `ReportModal` | `FC`<`IReportModalProps`\> |
| `ResponsiveChart` | `FC`<`Object`\> |
| `ResponsiveContext` | `Context`<`string`\> |
| `SearchInput` | `FC`<`ISearchInput`\> |
| `SelectPopover` | `FC`<`ISelectPopover`\> |
| `ShareModal` | `FC`<`IShareModal`\> |
| `Sidebar` | `FC`<`ISidebarProps`\> |
| `SignInModal` | `FC`<`SignInModalProps`\> |
| `SignUpModal` | (`props`: { `acceptedTerms?`: `boolean` ; `checkedTermsValues?`: `any` ; `errorMsg?`: `string` ; `hasError?`: `boolean` ; `headerLabel?`: `string` ; `inputPlaceholder?`: `string` ; `inviteToken`: `string` ; `submitted?`: `boolean` ; `submitting?`: `boolean` ; `subtitleLabel?`: `string` ; `success?`: `boolean` ; `waitForCheckTerms?`: `boolean` ; `onAcceptTerms?`: (`ev`: `any`) => `void` ; `onChange`: (`ev`: `ChangeEvent`<`HTMLInputElement`\>) => `void` ; `onCheckedTermsValues?`: (`ev`: `any`) => `void` ; `onModalClose`: () => `void` ; `validateTokenFn?`: (`ev`: `any`) => `void`  }) => `Element` |
| `SourcesWidgetCard` | `FC`<`ISourceWidgetCardProps`\> |
| `Spinner` | `FC`<`SpinnerProps`\> |
| `StyledLayer` | `StyledComponent`<`FC`<`LayerExtendedProps`\>, `any`, `Object`, `never`\> |
| `SubtitleTextIcon` | `FC`<`ISubtitleTextIcon`\> |
| `SwitchCard` | `FC`<`ISwitchCard`\> |
| `TagCard` | `FC`<`ITagCard`\> |
| `TagDetailCard` | `FC`<`ITagDetailCard`\> |
| `TagProfileCard` | `FC`<`ITagProfileCard`\> |
| `TagSearchCard` | `FC`<`ITagSearchCard`\> |
| `Text` | `FC`<`TextExtendedProps`\> |
| `TextIcon` | `FC`<`ITextIconProps`\> |
| `TextInputField` | `ForwardRefExoticComponent`<`ITextInputFieldProps` & `RefAttributes`<`any`\>\> |
| `ThemeContext` | `ThemeContextI` |
| `ThemeSelector` | (`props`: `IThemeSelector`) => `Element` |
| `ToastProvider` | `any` |
| `Topbar` | `FC`<`ITopbarProps`\> |
| `TopicsWidgetCard` | `FC`<`ITopicsCardWidgetProps`\> |
| `TransparencyLogBanner` | `FC`<`ITransparencyLogBannerProps`\> |
| `TransparencyLogDetailCard` | `FC`<`ITransparencyLogDetailCardProps`\> |
| `TransparencyLogMiniCard` | `FC`<`ITransparencyLogMiniCardProps`\> |
| `TrendingWidgetCard` | `FC`<`ITrendingWidgetCardProps`\> |
| `TutorialWidgetCard` | `FC`<`ITutorialWidgetCardProps`\> |
| `ViewportSizeProvider` | (`__namedParameters`: `IViewportDimProps`) => `Element` |
| `VirtualList` | `ForwardRefExoticComponent`<`Pick`<`IVirtualListProps`, ``"items"`` \| ``"itemsData"`` \| ``"useItemDataLoader"`` \| ``"loadMore"`` \| ``"loadItemData"`` \| ``"itemCard"`` \| ``"listHeader"`` \| ``"itemSpacing"`` \| ``"loadLimit"`` \| ``"initialPaddingTop"`` \| ``"startId"`` \| ``"overscan"`` \| ``"customEntities"`` \| ``"initialState"`` \| ``"hasMoreItems"`` \| ``"getNotificationPill"`` \| ``"showNotificationPill"`` \| ``"onItemRead"`` \| ``"averageItemHeight"`` \| ``"usePlaceholders"``\> & `RefAttributes`<`unknown`\>\> |
| `VoteIconButton` | (`props`: `IVoteIconProps`) => `Element` |
| `WidgetAreaCardBox` | `StyledComponent`<`FC`<`IBasicCardBox`\>, `any`, `Object`, `never`\> |
| `createGlobalStyle` | <P\>(`first`: `TemplateStringsArray` \| `CSSObject` \| `InterpolationFunction`<`ThemedStyledProps`<`P`, `DefaultTheme`\>\>, ...`interpolations`: `Interpolation`<`ThemedStyledProps`<`P`, `DefaultTheme`\>\>[]) => `GlobalStyleComponent`<`P`, `DefaultTheme`\> |
| `createTheme` | (`overrides?`: `Record`<`string`, `unknown`\>) => `DefaultTheme` |
| `css` | `ThemedCssFunction`<`DefaultTheme`\> |
| `darkTheme` | `Object` |
| `darkTheme.name` | `string` |
| `darkTheme.theme` | `Promise`<`__module`\> |
| `editorDefaultValue` | `Descendant`[] |
| `formatImageSrc` | (`src?`: `string`, `isUrl?`: `boolean`, `ipfsUrlPrefix?`: `string`) => { `isUrl`: `boolean` ; `prefix`: `string` ; `src`: `string`  } |
| `formatRelativeTime` | (`date`: `any`, `locale?`: `ILocale`) => `string` |
| `grommet` | `ThemeType` |
| `iconTypes` | `IconType`[] |
| `isBase64` | (`str`: `string`) => `boolean` |
| `lightTheme` | `Object` |
| `lightTheme.name` | `string` |
| `lightTheme.theme` | `Promise`<`__module`\> |
| `notify` | (`content`: `ToastContent`, `options?`: `ToastOptions`) => `ReactText` |
| `responsiveBreakpoints` | `Object` |
| `responsiveBreakpoints.global` | `Object` |
| `responsiveBreakpoints.global.breakpoints` | `Object` |
| `responsiveBreakpoints.global.breakpoints.large` | `Object` |
| `responsiveBreakpoints.global.breakpoints.large.value` | `number` |
| `responsiveBreakpoints.global.breakpoints.medium` | `Object` |
| `responsiveBreakpoints.global.breakpoints.medium.value` | `number` |
| `responsiveBreakpoints.global.breakpoints.small` | `Object` |
| `responsiveBreakpoints.global.breakpoints.small.value` | `number` |
| `responsiveBreakpoints.global.breakpoints.xlarge` | `Object` |
| `responsiveBreakpoints.global.breakpoints.xlarge.value` | `number` |
| `styled` | `StyledInterface` |
| `useViewportSize` | () => { `dimensions`: { `height`: `number` = 0; `width`: `number` = 0 } ; `size`: `string` = '' } |
| `withTheme` | `WithThemeFnInterface`<`DefaultTheme`\> |

#### Defined in

[ui/design/src/index.ts:153](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/design/src/index.ts#L153)
