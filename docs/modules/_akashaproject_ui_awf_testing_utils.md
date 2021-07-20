[AWF](../README.md) / [Exports](../modules.md) / @akashaproject/ui-awf-testing-utils

# Module: @akashaproject/ui-awf-testing-utils

## Table of contents

### Interfaces

- [ChannelOverrides](../interfaces/_akashaproject_ui_awf_testing_utils.ChannelOverrides.md)

### Variables

- [globalChannelMock](_akashaproject_ui_awf_testing_utils.md#globalchannelmock)

### Functions

- [genEthAddress](_akashaproject_ui_awf_testing_utils.md#genethaddress)
- [genLoggedUser](_akashaproject_ui_awf_testing_utils.md#genloggeduser)
- [genMockOp](_akashaproject_ui_awf_testing_utils.md#genmockop)
- [genPostData](_akashaproject_ui_awf_testing_utils.md#genpostdata)
- [genSlatePost](_akashaproject_ui_awf_testing_utils.md#genslatepost)
- [genUser](_akashaproject_ui_awf_testing_utils.md#genuser)
- [getSDKMocks](_akashaproject_ui_awf_testing_utils.md#getsdkmocks)
- [renderWithAllProviders](_akashaproject_ui_awf_testing_utils.md#renderwithallproviders)
- [renderWithWrapper](_akashaproject_ui_awf_testing_utils.md#renderwithwrapper)

## Variables

### globalChannelMock

• `Const` **globalChannelMock**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pipe` | () => { `subscribe`: () => `void` ; `unsubscribe`: () => `void`  } |

#### Defined in

[ui/testing-utils/src/mocks/channels.ts:2](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/testing-utils/src/mocks/channels.ts#L2)

## Functions

### genEthAddress

▸ `Const` **genEthAddress**(): `string`

#### Returns

`string`

#### Defined in

[ui/testing-utils/src/data-generator/user.ts:43](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/testing-utils/src/data-generator/user.ts#L43)

___

### genLoggedUser

▸ `Const` **genLoggedUser**(`ethAddress?`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ethAddress?` | `string` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `avatar` | `string` |
| `coverImage` | `string` |
| `default` | { `property`: `string` = 'userName'; `provider`: `string` = 'ewa.providers.basic'; `value`: `string`  }[] |
| `description` | `string` |
| `ethAddress` | `string` |
| `name` | `string` |
| `providers` | { `property`: `string` = 'userName'; `provider`: `string` = 'ewa.providers.basic'; `value`: `string`  }[] |
| `pubKey` | `string` |
| `userName` | `string` |

#### Defined in

[ui/testing-utils/src/data-generator/user.ts:15](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/testing-utils/src/data-generator/user.ts#L15)

___

### genMockOp

▸ `Const` **genMockOp**(`payload?`): `Mock`<`any`, `any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `payload?` | `Object` |

#### Returns

`Mock`<`any`, `any`\>

#### Defined in

[ui/testing-utils/src/mocks/operator.ts:1](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/testing-utils/src/mocks/operator.ts#L1)

___

### genPostData

▸ `Const` **genPostData**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `_id` | `string` |
| `author` | `Object` |
| `author.avatar` | `string` |
| `author.coverImage` | `string` |
| `author.description` | `string` |
| `author.ethAddress` | `string` |
| `author.name` | `string` |
| `author.pubKey` | `string` |
| `author.totalFollowers` | `number` |
| `author.totalFollowing` | `number` |
| `author.totalPosts` | `string` |
| `author.userName` | `string` |
| `content` | ({ `children`: ({ `children`: `undefined` ; `text`: `string` = ''; `type`: `undefined` = 'text'; `url`: `undefined` = 'https://google.com' } \| { `children`: { `text`: `string` = '' }[] ; `text`: `undefined` = ' -\> test'; `type`: `string` = 'link'; `url`: `string` = 'https://google.com' } \| { `children`: `undefined` ; `text`: `string` = ' -\> test'; `type`: `string` = 'text'; `url`: `undefined` = 'https://google.com' })[] ; `size`: `undefined` ; `type`: `string` = 'paragraph'; `url`: `undefined` = 'https://google.com' } \| { `children`: { `text`: `string` = '' }[] ; `size`: { `height`: `number` = 426; `naturalHeight`: `number` = 426; `naturalWidth`: `number` = 640; `width`: `number` = 640 } ; `type`: `string` = 'image'; `url`: `string` = 'https://hub.textile.io/ipfs/bafkreidketqm2q5xuxvtezegtu7hchc2a6bdlazpxftdudczngkrht674i' })[] |
| `entryId` | `string` |
| `ipfsLink` | `string` |
| `quotedBy` | `any`[] |
| `quotedByAthors` | `any` |
| `quotes` | `any`[] |
| `tags` | `any`[] |
| `totalComments` | `number` |

#### Defined in

[ui/testing-utils/src/data-generator/post.ts:13](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/testing-utils/src/data-generator/post.ts#L13)

___

### genSlatePost

▸ `Const` **genSlatePost**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `content` | ({ `children`: ({ `children`: `undefined` ; `text`: `string` = ''; `type`: `undefined` = 'text'; `url`: `undefined` = 'https://google.com' } \| { `children`: { `text`: `string` = '' }[] ; `text`: `undefined` = ' -\> test'; `type`: `string` = 'link'; `url`: `string` = 'https://google.com' } \| { `children`: `undefined` ; `text`: `string` = ' -\> test'; `type`: `string` = 'text'; `url`: `undefined` = 'https://google.com' })[] ; `size`: `undefined` ; `type`: `string` = 'paragraph'; `url`: `undefined` = 'https://google.com' } \| { `children`: { `text`: `string` = '' }[] ; `size`: { `height`: `number` = 426; `naturalHeight`: `number` = 426; `naturalWidth`: `number` = 640; `width`: `number` = 640 } ; `type`: `string` = 'image'; `url`: `string` = 'https://hub.textile.io/ipfs/bafkreidketqm2q5xuxvtezegtu7hchc2a6bdlazpxftdudczngkrht674i' })[] |

#### Defined in

[ui/testing-utils/src/data-generator/post.ts:28](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/testing-utils/src/data-generator/post.ts#L28)

___

### genUser

▸ `Const` **genUser**(`ethAddress?`, `userName?`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ethAddress?` | `string` |
| `userName?` | `string` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `avatar` | `string` |
| `coverImage` | `string` |
| `description` | `string` |
| `ethAddress` | `string` |
| `name` | `string` |
| `pubKey` | `string` |
| `userName` | `string` |

#### Defined in

[ui/testing-utils/src/data-generator/user.ts:3](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/testing-utils/src/data-generator/user.ts#L3)

___

### getSDKMocks

▸ `Const` **getSDKMocks**(`overrides`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides` | [`ChannelOverrides`](../interfaces/_akashaproject_ui_awf_testing_utils.ChannelOverrides.md) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `auth` | `Object` |
| `auth.authService` | `Object` |
| `auth.authService.getCurrentUser` | () => `Observable`<`string`\> |
| `commons` | `Object` |
| `commons.ipfsService` | `Object` |
| `commons.ipfsService.getSettings` | () => `Observable`<`string`\> |
| `commons.web3Service` | `Object` |
| `commons.web3Service.checkCurrentNetwork` | () => `Observable`<`string`\> |
| `posts` | `Object` |
| `posts.tags` | `Object` |
| `posts.tags.getTrending` | () => `Observable`<`string`\> |
| `profiles` | `Object` |
| `profiles.profileService` | `Object` |
| `profiles.profileService.getTrending` | () => `Observable`<`string`\> |
| `profiles.profileService.isFollowing` | () => `Observable`<`string`\> |
| `registry` | `Object` |
| `registry.ens` | `Object` |
| `registry.ens.resolveAddress` | () => `Observable`<`string`\> |

#### Defined in

[ui/testing-utils/src/mocks/channels.ts:23](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/testing-utils/src/mocks/channels.ts#L23)

___

### renderWithAllProviders

▸ `Const` **renderWithAllProviders**(`component`, `options`): `RenderResult`<`__module`, `HTMLElement`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `component` | `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\> |
| `options` | `RenderOptions`<`__module`, `HTMLElement`\> |

#### Returns

`RenderResult`<`__module`, `HTMLElement`\>

#### Defined in

[ui/testing-utils/src/index.ts:31](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/testing-utils/src/index.ts#L31)

___

### renderWithWrapper

▸ `Const` **renderWithWrapper**(`component`, `wrapper`, `options`): `RenderResult`<`__module`, `HTMLElement`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `component` | `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\> |
| `wrapper` | `ComponentType`<`Object`\> |
| `options` | `RenderOptions`<`__module`, `HTMLElement`\> |

#### Returns

`RenderResult`<`__module`, `HTMLElement`\>

#### Defined in

[ui/testing-utils/src/index.ts:22](https://github.com/AKASHAorg/akasha-world-framework/blob/d41b6a20/ui/testing-utils/src/index.ts#L22)
