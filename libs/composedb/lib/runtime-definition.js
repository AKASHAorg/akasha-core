export const definition = { "models": { "AkashaApp": { "interface": false, "implements": ["kjzl6hvfrbw6c7mp2kgev6yk8hrxqkwj28l92a74x3p6wi1gcms00yx9ckxsokn"], "id": "kjzl6hvfrbw6c54ufn6whf1z78go3l03fxnmlh8fj4vw90r6q2ugbo8m2yjhj68", "accountRelation": { "type": "set", "fields": ["name"] } }, "AkashaAppInterface": { "interface": true, "implements": [], "id": "kjzl6hvfrbw6c7mp2kgev6yk8hrxqkwj28l92a74x3p6wi1gcms00yx9ckxsokn", "accountRelation": { "type": "none" } }, "AkashaAppRelease": { "interface": false, "implements": ["kjzl6hvfrbw6c8lieadu4bugco13jdp0j9agrrsflezai2uuhtzkv97xnantmdu"], "id": "kjzl6hvfrbw6c6klxamgwsshaebdwysia92wvkh3f3q2nxiwb1h0dyj3r8t6voy", "accountRelation": { "type": "set", "fields": ["applicationID", "version"] } }, "AkashaAppReleaseInterface": { "interface": true, "implements": [], "id": "kjzl6hvfrbw6c8lieadu4bugco13jdp0j9agrrsflezai2uuhtzkv97xnantmdu", "accountRelation": { "type": "none" } }, "AkashaAppsStream": { "interface": false, "implements": ["kjzl6hvfrbw6c549224gv8opbzydltjnidsxe8u2juj3f5n04zvlv23xli1pp2u"], "id": "kjzl6hvfrbw6c6p2p7kup6o31g9is1j2r0nsqnf2q4soe60mtf706yghtu30njd", "accountRelation": { "type": "set", "fields": ["applicationID"] } }, "AkashaBeam": { "interface": false, "implements": ["kjzl6hvfrbw6c5rvaehvw3bo06g91zzskdmqcamf87cou0c3rcjfga8otgn1dmh"], "id": "kjzl6hvfrbw6c7abwbe0gvpjuny4tja628bb73t65imu5k62eg8k3rm2g63v8bw", "accountRelation": { "type": "list" } }, "AkashaBeamInterface": { "interface": true, "implements": [], "id": "kjzl6hvfrbw6c5rvaehvw3bo06g91zzskdmqcamf87cou0c3rcjfga8otgn1dmh", "accountRelation": { "type": "none" } }, "AkashaBeamStream": { "interface": false, "implements": ["kjzl6hvfrbw6c549224gv8opbzydltjnidsxe8u2juj3f5n04zvlv23xli1pp2u"], "id": "kjzl6hvfrbw6ca0kmb94buwdyoqmlja4v1t6wfu6vgh8xxp77zqxfrkhy06peps", "accountRelation": { "type": "set", "fields": ["beamID"] } }, "AkashaBlockStorage": { "interface": false, "implements": ["kjzl6hvfrbw6camingc354x7fs0zfvcdntuls7514mom4gpzntbv0gtyaeqduwg"], "id": "kjzl6hvfrbw6c9t2hdrbp268359gqowq992ze623w08hmyxrnxhndusx16ok0tq", "accountRelation": { "type": "set", "fields": ["blockID"] } }, "AkashaContentBlock": { "interface": false, "implements": ["kjzl6hvfrbw6camingc354x7fs0zfvcdntuls7514mom4gpzntbv0gtyaeqduwg"], "id": "kjzl6hvfrbw6c9zkwodo2ez8d5ja8poazi1fcq3krhk1g8l26lhpm5e4ktxd49w", "accountRelation": { "type": "list" } }, "AkashaContentBlockInterface": { "interface": true, "implements": [], "id": "kjzl6hvfrbw6camingc354x7fs0zfvcdntuls7514mom4gpzntbv0gtyaeqduwg", "accountRelation": { "type": "none" } }, "AkashaContentBlockStream": { "interface": false, "implements": ["kjzl6hvfrbw6c549224gv8opbzydltjnidsxe8u2juj3f5n04zvlv23xli1pp2u"], "id": "kjzl6hvfrbw6c9f6k00s3dy07afm5lug78irvkpisu24djousz7hhyiiq0pqni0", "accountRelation": { "type": "set", "fields": ["blockID"] } }, "AkashaFollow": { "interface": false, "implements": ["kjzl6hvfrbw6cb893zwezpclu033att8nq0oatc21cns6ryr1dubpfeczla9xml"], "id": "kjzl6hvfrbw6cb9imwgspb0nunnnd587ofchw0g4elod2gqgpo7f8yt5ac9ptbd", "accountRelation": { "type": "set", "fields": ["profileID"] } }, "AkashaFollowInterface": { "interface": true, "implements": [], "id": "kjzl6hvfrbw6cb893zwezpclu033att8nq0oatc21cns6ryr1dubpfeczla9xml", "accountRelation": { "type": "none" } }, "AkashaIndexStreamInterface": { "interface": true, "implements": [], "id": "kjzl6hvfrbw6c549224gv8opbzydltjnidsxe8u2juj3f5n04zvlv23xli1pp2u", "accountRelation": { "type": "none" } }, "AkashaIndexedStream": { "interface": false, "implements": ["kjzl6hvfrbw6c549224gv8opbzydltjnidsxe8u2juj3f5n04zvlv23xli1pp2u"], "id": "kjzl6hvfrbw6cb6f62hy1dkat0frfanf0gy3u28flt3kwsn32ykl82agexkfzkv", "accountRelation": { "type": "set", "fields": ["stream", "indexType", "indexValue"] } }, "AkashaInterestsStream": { "interface": false, "implements": ["kjzl6hvfrbw6c549224gv8opbzydltjnidsxe8u2juj3f5n04zvlv23xli1pp2u"], "id": "kjzl6hvfrbw6c5458b2fiese44oevx64q156su51uj42mpokx2o8su1h5d6j5mu", "accountRelation": { "type": "set", "fields": ["labelType", "value"] } }, "AkashaProfile": { "interface": false, "implements": ["kjzl6hvfrbw6c8iuza101yr8ovi9pu4qub5ghbeqhr1g15xv6xm1bkeuof4dxxd"], "id": "kjzl6hvfrbw6c95s98ss8nidzuteyvjy5eipc0ov71gpt7wt6e4za6qnzqt3ccd", "accountRelation": { "type": "single" } }, "AkashaProfileInterests": { "interface": false, "implements": ["kjzl6hvfrbw6cb2j6p22bl9x8m2l3hfygn2k0jezbp90d58whdy4nvbwaacg39a"], "id": "kjzl6hvfrbw6c7ygagqz8epvitmnrgav4xcoipmfiaddskp39c2k93u0k2k6wua", "accountRelation": { "type": "single" } }, "AkashaProfileInterestsInterface": { "interface": true, "implements": [], "id": "kjzl6hvfrbw6cb2j6p22bl9x8m2l3hfygn2k0jezbp90d58whdy4nvbwaacg39a", "accountRelation": { "type": "none" } }, "AkashaProfileInterface": { "interface": true, "implements": [], "id": "kjzl6hvfrbw6c8iuza101yr8ovi9pu4qub5ghbeqhr1g15xv6xm1bkeuof4dxxd", "accountRelation": { "type": "none" } }, "AkashaProfileStream": { "interface": false, "implements": ["kjzl6hvfrbw6c549224gv8opbzydltjnidsxe8u2juj3f5n04zvlv23xli1pp2u"], "id": "kjzl6hvfrbw6c9k01k3l5nzghx7lc95xbwj2c0fijrrjzywtjqqv6tvpvhuwic8", "accountRelation": { "type": "set", "fields": ["profileID"] } }, "AkashaReflect": { "interface": false, "implements": ["kjzl6hvfrbw6c9aglcacfejq5fxzy0pxc8eraoyy03b9lv2mlx5o9u85zqnrhf5"], "id": "kjzl6hvfrbw6c964tbjdm53xvp2f984g5p8d2cbiqavz3tbqkp9y3luqtf128o6", "accountRelation": { "type": "list" } }, "AkashaReflectInterface": { "interface": true, "implements": [], "id": "kjzl6hvfrbw6c9aglcacfejq5fxzy0pxc8eraoyy03b9lv2mlx5o9u85zqnrhf5", "accountRelation": { "type": "none" } }, "AkashaReflectStream": { "interface": false, "implements": ["kjzl6hvfrbw6c549224gv8opbzydltjnidsxe8u2juj3f5n04zvlv23xli1pp2u"], "id": "kjzl6hvfrbw6c5h5mmvmzicfgz4v1xxxxw6ulcekhjdg62okuw6x56vietsx809", "accountRelation": { "type": "set", "fields": ["reflectionID"] } } }, "objects": { "AkashaApp": { "meta": { "type": "list", "required": false, "immutable": false, "item": { "type": "reference", "refType": "object", "refName": "AppProviderValue", "required": false, "immutable": false } }, "name": { "type": "string", "required": true, "immutable": true, "indexed": true }, "nsfw": { "type": "boolean", "required": false, "immutable": true }, "links": { "type": "list", "required": false, "immutable": false, "item": { "type": "reference", "refType": "object", "refName": "AppLinkSource", "required": false, "immutable": false } }, "gallery": { "type": "list", "required": false, "immutable": false, "item": { "type": "reference", "refType": "object", "refName": "AppImageSource", "required": false, "immutable": false } }, "license": { "type": "string", "required": true, "immutable": true }, "keywords": { "type": "list", "required": false, "immutable": true, "item": { "type": "string", "required": false, "immutable": true } }, "createdAt": { "type": "datetime", "required": true, "immutable": true, "indexed": true }, "logoImage": { "type": "reference", "refType": "object", "refName": "AppImageSource", "required": false, "immutable": false }, "coverImage": { "type": "reference", "refType": "object", "refName": "AppImageSource", "required": false, "immutable": false }, "description": { "type": "string", "required": true, "immutable": false }, "displayName": { "type": "string", "required": true, "immutable": true, "indexed": true }, "contributors": { "type": "list", "required": false, "immutable": false, "item": { "type": "did", "required": false, "immutable": false } }, "applicationType": { "type": "reference", "refType": "enum", "refName": "AkashaAppApplicationType", "required": false, "immutable": false, "indexed": true }, "author": { "type": "view", "viewType": "documentAccount" }, "version": { "type": "view", "viewType": "documentVersion" }, "releases": { "type": "view", "viewType": "relation", "relation": { "source": "queryConnection", "model": "kjzl6hvfrbw6c8lieadu4bugco13jdp0j9agrrsflezai2uuhtzkv97xnantmdu", "property": "applicationID" } }, "releasesCount": { "type": "view", "viewType": "relation", "relation": { "source": "queryCount", "model": "kjzl6hvfrbw6c8lieadu4bugco13jdp0j9agrrsflezai2uuhtzkv97xnantmdu", "property": "applicationID" } } }, "AkashaAppInterface": { "meta": { "type": "list", "required": false, "immutable": false, "item": { "type": "reference", "refType": "object", "refName": "AppProviderValue", "required": false, "immutable": false } }, "name": { "type": "string", "required": true, "immutable": true }, "nsfw": { "type": "boolean", "required": false, "immutable": true }, "links": { "type": "list", "required": false, "immutable": false, "item": { "type": "reference", "refType": "object", "refName": "AppLinkSource", "required": false, "immutable": false } }, "gallery": { "type": "list", "required": false, "immutable": false, "item": { "type": "reference", "refType": "object", "refName": "AppImageSource", "required": false, "immutable": false } }, "license": { "type": "string", "required": true, "immutable": true }, "keywords": { "type": "list", "required": false, "immutable": false, "item": { "type": "string", "required": false, "immutable": false } }, "createdAt": { "type": "datetime", "required": true, "immutable": true }, "logoImage": { "type": "reference", "refType": "object", "refName": "AppImageSource", "required": false, "immutable": false }, "coverImage": { "type": "reference", "refType": "object", "refName": "AppImageSource", "required": false, "immutable": false }, "description": { "type": "string", "required": true, "immutable": false }, "displayName": { "type": "string", "required": true, "immutable": true }, "contributors": { "type": "list", "required": false, "immutable": false, "item": { "type": "did", "required": false, "immutable": false } }, "author": { "type": "view", "viewType": "documentAccount" }, "version": { "type": "view", "viewType": "documentVersion" } }, "AkashaAppRelease": { "meta": { "type": "list", "required": false, "immutable": false, "item": { "type": "reference", "refType": "object", "refName": "AppProviderValue", "required": false, "immutable": false } }, "source": { "type": "uri", "required": true, "immutable": true }, "version": { "type": "string", "required": true, "immutable": true, "indexed": true }, "createdAt": { "type": "datetime", "required": true, "immutable": true, "indexed": true }, "applicationID": { "type": "streamid", "required": true, "immutable": true, "indexed": true }, "application": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": "kjzl6hvfrbw6c7mp2kgev6yk8hrxqkwj28l92a74x3p6wi1gcms00yx9ckxsokn", "property": "applicationID" } } }, "AkashaAppReleaseInterface": { "meta": { "type": "list", "required": false, "immutable": false, "item": { "type": "reference", "refType": "object", "refName": "AppProviderValue", "required": false, "immutable": false } }, "source": { "type": "uri", "required": true, "immutable": true }, "version": { "type": "string", "required": true, "immutable": true }, "createdAt": { "type": "datetime", "required": true, "immutable": true }, "applicationID": { "type": "streamid", "required": true, "immutable": false }, "application": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": "kjzl6hvfrbw6c7mp2kgev6yk8hrxqkwj28l92a74x3p6wi1gcms00yx9ckxsokn", "property": "applicationID" } } }, "AkashaAppsStream": { "active": { "type": "boolean", "required": true, "immutable": false, "indexed": true }, "status": { "type": "reference", "refType": "enum", "refName": "AkashaAppsStreamModerationStatus", "required": false, "immutable": false, "indexed": true }, "createdAt": { "type": "datetime", "required": true, "immutable": true, "indexed": true }, "moderationID": { "type": "streamid", "required": false, "immutable": true, "indexed": true }, "applicationID": { "type": "streamid", "required": true, "immutable": true, "indexed": true }, "moderation": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": null, "property": "moderationID" } }, "application": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": "kjzl6hvfrbw6c7mp2kgev6yk8hrxqkwj28l92a74x3p6wi1gcms00yx9ckxsokn", "property": "applicationID" } } }, "AkashaBeam": { "nsfw": { "type": "boolean", "required": false, "immutable": false, "indexed": true }, "tags": { "type": "list", "required": false, "immutable": true, "item": { "type": "reference", "refType": "object", "refName": "BeamLabeled", "required": false, "immutable": true } }, "appID": { "type": "streamid", "required": true, "immutable": true }, "active": { "type": "boolean", "required": true, "immutable": false, "indexed": true }, "content": { "type": "list", "required": true, "immutable": true, "item": { "type": "reference", "refType": "object", "refName": "BeamBlockRecord", "required": true, "immutable": true } }, "mentions": { "type": "list", "required": false, "immutable": true, "item": { "type": "did", "required": false, "immutable": true } }, "createdAt": { "type": "datetime", "required": true, "immutable": true, "indexed": true }, "appVersionID": { "type": "streamid", "required": true, "immutable": true }, "embeddedStream": { "type": "reference", "refType": "object", "refName": "BeamEmbeddedType", "required": false, "immutable": true }, "app": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": "kjzl6hvfrbw6c7mp2kgev6yk8hrxqkwj28l92a74x3p6wi1gcms00yx9ckxsokn", "property": "appID" } }, "author": { "type": "view", "viewType": "documentAccount" }, "version": { "type": "view", "viewType": "documentVersion" }, "appVersion": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": "kjzl6hvfrbw6c8lieadu4bugco13jdp0j9agrrsflezai2uuhtzkv97xnantmdu", "property": "appVersionID" } }, "reflections": { "type": "view", "viewType": "relation", "relation": { "source": "queryConnection", "model": "kjzl6hvfrbw6c9aglcacfejq5fxzy0pxc8eraoyy03b9lv2mlx5o9u85zqnrhf5", "property": "beamID" } }, "reflectionsCount": { "type": "view", "viewType": "relation", "relation": { "source": "queryCount", "model": "kjzl6hvfrbw6c9aglcacfejq5fxzy0pxc8eraoyy03b9lv2mlx5o9u85zqnrhf5", "property": "beamID" } } }, "AkashaBeamInterface": { "nsfw": { "type": "boolean", "required": false, "immutable": false }, "tags": { "type": "list", "required": false, "immutable": false, "item": { "type": "reference", "refType": "object", "refName": "BeamLabeled", "required": false, "immutable": false } }, "appID": { "type": "streamid", "required": true, "immutable": true }, "active": { "type": "boolean", "required": true, "immutable": false }, "content": { "type": "list", "required": true, "immutable": false, "item": { "type": "reference", "refType": "object", "refName": "BeamBlockRecord", "required": true, "immutable": false } }, "mentions": { "type": "list", "required": false, "immutable": false, "item": { "type": "did", "required": false, "immutable": false } }, "createdAt": { "type": "datetime", "required": true, "immutable": true }, "appVersionID": { "type": "streamid", "required": true, "immutable": true }, "embeddedStream": { "type": "reference", "refType": "object", "refName": "BeamEmbeddedType", "required": false, "immutable": true }, "app": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": "kjzl6hvfrbw6c7mp2kgev6yk8hrxqkwj28l92a74x3p6wi1gcms00yx9ckxsokn", "property": "appID" } }, "author": { "type": "view", "viewType": "documentAccount" }, "version": { "type": "view", "viewType": "documentVersion" }, "appVersion": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": "kjzl6hvfrbw6c8lieadu4bugco13jdp0j9agrrsflezai2uuhtzkv97xnantmdu", "property": "appVersionID" } } }, "AkashaBeamStream": { "appID": { "type": "streamid", "required": false, "immutable": true }, "active": { "type": "boolean", "required": true, "immutable": false, "indexed": true }, "beamID": { "type": "streamid", "required": true, "immutable": true, "indexed": true }, "status": { "type": "reference", "refType": "enum", "refName": "AkashaBeamStreamModerationStatus", "required": false, "immutable": false, "indexed": true }, "createdAt": { "type": "datetime", "required": true, "immutable": true, "indexed": true }, "moderationID": { "type": "streamid", "required": false, "immutable": true, "indexed": true }, "beam": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": "kjzl6hvfrbw6c5rvaehvw3bo06g91zzskdmqcamf87cou0c3rcjfga8otgn1dmh", "property": "beamID" } }, "moderation": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": null, "property": "moderationID" } } }, "AkashaBlockStorage": { "kind": { "type": "reference", "refType": "enum", "refName": "AkashaBlockStorageBlockDef", "required": false, "immutable": false, "indexed": true }, "nsfw": { "type": "boolean", "required": false, "immutable": true, "indexed": true }, "active": { "type": "boolean", "required": true, "immutable": false, "indexed": true }, "blockID": { "type": "streamid", "required": true, "immutable": true, "indexed": true }, "content": { "type": "list", "required": true, "immutable": true, "item": { "type": "reference", "refType": "object", "refName": "BlockLabeledValue", "required": true, "immutable": true } }, "createdAt": { "type": "datetime", "required": true, "immutable": true, "indexed": true }, "appVersionID": { "type": "streamid", "required": true, "immutable": true, "indexed": true }, "block": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": "kjzl6hvfrbw6c9zkwodo2ez8d5ja8poazi1fcq3krhk1g8l26lhpm5e4ktxd49w", "property": "blockID" } }, "author": { "type": "view", "viewType": "documentAccount" }, "version": { "type": "view", "viewType": "documentVersion" }, "appVersion": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": "kjzl6hvfrbw6c8lieadu4bugco13jdp0j9agrrsflezai2uuhtzkv97xnantmdu", "property": "appVersionID" } } }, "AkashaContentBlock": { "kind": { "type": "reference", "refType": "enum", "refName": "AkashaContentBlockBlockDef", "required": false, "immutable": false, "indexed": true }, "nsfw": { "type": "boolean", "required": false, "immutable": true, "indexed": true }, "active": { "type": "boolean", "required": true, "immutable": false, "indexed": true }, "content": { "type": "list", "required": true, "immutable": true, "item": { "type": "reference", "refType": "object", "refName": "BlockLabeledValue", "required": true, "immutable": true } }, "createdAt": { "type": "datetime", "required": true, "immutable": true, "indexed": true }, "appVersionID": { "type": "streamid", "required": true, "immutable": true, "indexed": true }, "author": { "type": "view", "viewType": "documentAccount" }, "version": { "type": "view", "viewType": "documentVersion" }, "appVersion": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": "kjzl6hvfrbw6c8lieadu4bugco13jdp0j9agrrsflezai2uuhtzkv97xnantmdu", "property": "appVersionID" } } }, "AkashaContentBlockInterface": { "nsfw": { "type": "boolean", "required": false, "immutable": true }, "active": { "type": "boolean", "required": true, "immutable": false }, "content": { "type": "list", "required": true, "immutable": false, "item": { "type": "reference", "refType": "object", "refName": "BlockLabeledValue", "required": true, "immutable": false } }, "createdAt": { "type": "datetime", "required": true, "immutable": true }, "appVersionID": { "type": "streamid", "required": true, "immutable": true }, "author": { "type": "view", "viewType": "documentAccount" }, "version": { "type": "view", "viewType": "documentVersion" }, "appVersion": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": "kjzl6hvfrbw6c8lieadu4bugco13jdp0j9agrrsflezai2uuhtzkv97xnantmdu", "property": "appVersionID" } } }, "AkashaContentBlockStream": { "active": { "type": "boolean", "required": true, "immutable": false, "indexed": true }, "status": { "type": "reference", "refType": "enum", "refName": "AkashaContentBlockStreamModerationStatus", "required": false, "immutable": false, "indexed": true }, "blockID": { "type": "streamid", "required": true, "immutable": true, "indexed": true }, "createdAt": { "type": "datetime", "required": true, "immutable": true, "indexed": true }, "moderationID": { "type": "streamid", "required": false, "immutable": true, "indexed": true }, "block": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": "kjzl6hvfrbw6camingc354x7fs0zfvcdntuls7514mom4gpzntbv0gtyaeqduwg", "property": "blockID" } }, "moderation": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": null, "property": "moderationID" } } }, "AkashaFollow": { "profileID": { "type": "streamid", "required": true, "immutable": true, "indexed": true }, "isFollowing": { "type": "boolean", "required": true, "immutable": false, "indexed": true }, "did": { "type": "view", "viewType": "documentAccount" }, "profile": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": "kjzl6hvfrbw6c8iuza101yr8ovi9pu4qub5ghbeqhr1g15xv6xm1bkeuof4dxxd", "property": "profileID" } } }, "AkashaFollowInterface": { "profileID": { "type": "streamid", "required": true, "immutable": true }, "isFollowing": { "type": "boolean", "required": true, "immutable": false }, "did": { "type": "view", "viewType": "documentAccount" }, "profile": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": "kjzl6hvfrbw6c8iuza101yr8ovi9pu4qub5ghbeqhr1g15xv6xm1bkeuof4dxxd", "property": "profileID" } } }, "AkashaIndexStreamInterface": { "active": { "type": "boolean", "required": true, "immutable": false }, "createdAt": { "type": "datetime", "required": true, "immutable": true }, "moderationID": { "type": "streamid", "required": false, "immutable": true }, "moderation": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": null, "property": "moderationID" } } }, "AkashaIndexedStream": { "active": { "type": "boolean", "required": true, "immutable": false, "indexed": true }, "status": { "type": "reference", "refType": "enum", "refName": "AkashaIndexedStreamModerationStatus", "required": false, "immutable": false, "indexed": true }, "stream": { "type": "streamid", "required": true, "immutable": true, "indexed": true }, "createdAt": { "type": "datetime", "required": true, "immutable": true, "indexed": true }, "indexType": { "type": "string", "required": true, "immutable": true, "indexed": true }, "indexValue": { "type": "string", "required": true, "immutable": true, "indexed": true }, "streamType": { "type": "reference", "refType": "enum", "refName": "AkashaIndexedStreamStreamType", "required": false, "immutable": false, "indexed": true }, "moderationID": { "type": "streamid", "required": false, "immutable": true, "indexed": true }, "moderation": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": null, "property": "moderationID" } }, "streamView": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": null, "property": "stream" } } }, "AkashaInterestsStream": { "value": { "type": "string", "required": true, "immutable": true, "indexed": true }, "active": { "type": "boolean", "required": true, "immutable": false, "indexed": true }, "status": { "type": "reference", "refType": "enum", "refName": "AkashaInterestsStreamModerationStatus", "required": false, "immutable": false, "indexed": true }, "createdAt": { "type": "datetime", "required": true, "immutable": true, "indexed": true }, "labelType": { "type": "string", "required": true, "immutable": true, "indexed": true }, "moderationID": { "type": "streamid", "required": false, "immutable": true, "indexed": true }, "moderation": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": null, "property": "moderationID" } } }, "AkashaProfile": { "name": { "type": "string", "required": true, "immutable": false, "indexed": true }, "nsfw": { "type": "boolean", "required": false, "immutable": true, "indexed": true }, "appID": { "type": "streamid", "required": true, "immutable": true }, "links": { "type": "list", "required": false, "immutable": false, "item": { "type": "reference", "refType": "object", "refName": "ProfileLinkSource", "required": false, "immutable": false } }, "avatar": { "type": "reference", "refType": "object", "refName": "ProfileImageVersions", "required": false, "immutable": false }, "createdAt": { "type": "datetime", "required": true, "immutable": true, "indexed": true }, "background": { "type": "reference", "refType": "object", "refName": "ProfileImageVersions", "required": false, "immutable": false }, "description": { "type": "string", "required": false, "immutable": false }, "appVersionID": { "type": "streamid", "required": true, "immutable": true }, "app": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": "kjzl6hvfrbw6c7mp2kgev6yk8hrxqkwj28l92a74x3p6wi1gcms00yx9ckxsokn", "property": "appID" } }, "did": { "type": "view", "viewType": "documentAccount" }, "appVersion": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": "kjzl6hvfrbw6c8lieadu4bugco13jdp0j9agrrsflezai2uuhtzkv97xnantmdu", "property": "appVersionID" } }, "followers": { "type": "view", "viewType": "relation", "relation": { "source": "queryConnection", "model": "kjzl6hvfrbw6cb893zwezpclu033att8nq0oatc21cns6ryr1dubpfeczla9xml", "property": "profileID" } }, "followersCount": { "type": "view", "viewType": "relation", "relation": { "source": "queryCount", "model": "kjzl6hvfrbw6cb893zwezpclu033att8nq0oatc21cns6ryr1dubpfeczla9xml", "property": "profileID" } } }, "AkashaProfileInterests": { "topics": { "type": "list", "required": true, "immutable": false, "item": { "type": "reference", "refType": "object", "refName": "ProfileLabeled", "required": true, "immutable": false } }, "did": { "type": "view", "viewType": "documentAccount" } }, "AkashaProfileInterestsInterface": { "topics": { "type": "list", "required": true, "immutable": false, "item": { "type": "reference", "refType": "object", "refName": "ProfileLabeled", "required": true, "immutable": false } }, "did": { "type": "view", "viewType": "documentAccount" } }, "AkashaProfileInterface": { "name": { "type": "string", "required": true, "immutable": false }, "nsfw": { "type": "boolean", "required": false, "immutable": true }, "appID": { "type": "streamid", "required": true, "immutable": true }, "links": { "type": "list", "required": false, "immutable": false, "item": { "type": "reference", "refType": "object", "refName": "ProfileLinkSource", "required": false, "immutable": false } }, "avatar": { "type": "reference", "refType": "object", "refName": "ProfileImageVersions", "required": false, "immutable": false }, "createdAt": { "type": "datetime", "required": true, "immutable": true }, "background": { "type": "reference", "refType": "object", "refName": "ProfileImageVersions", "required": false, "immutable": false }, "description": { "type": "string", "required": false, "immutable": false }, "appVersionID": { "type": "streamid", "required": true, "immutable": true }, "app": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": "kjzl6hvfrbw6c7mp2kgev6yk8hrxqkwj28l92a74x3p6wi1gcms00yx9ckxsokn", "property": "appID" } }, "did": { "type": "view", "viewType": "documentAccount" }, "appVersion": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": "kjzl6hvfrbw6c8lieadu4bugco13jdp0j9agrrsflezai2uuhtzkv97xnantmdu", "property": "appVersionID" } } }, "AkashaProfileStream": { "appID": { "type": "streamid", "required": false, "immutable": true }, "active": { "type": "boolean", "required": true, "immutable": false, "indexed": true }, "status": { "type": "reference", "refType": "enum", "refName": "AkashaProfileStreamModerationStatus", "required": false, "immutable": false, "indexed": true }, "createdAt": { "type": "datetime", "required": true, "immutable": true, "indexed": true }, "profileID": { "type": "streamid", "required": true, "immutable": true, "indexed": true }, "moderationID": { "type": "streamid", "required": false, "immutable": true, "indexed": true }, "profile": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": "kjzl6hvfrbw6c8iuza101yr8ovi9pu4qub5ghbeqhr1g15xv6xm1bkeuof4dxxd", "property": "profileID" } }, "moderation": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": null, "property": "moderationID" } } }, "AkashaReflect": { "nsfw": { "type": "boolean", "required": false, "immutable": false, "indexed": true }, "tags": { "type": "list", "required": false, "immutable": true, "item": { "type": "string", "required": false, "immutable": true } }, "active": { "type": "boolean", "required": true, "immutable": false, "indexed": true }, "beamID": { "type": "streamid", "required": true, "immutable": true, "indexed": true }, "content": { "type": "list", "required": true, "immutable": true, "item": { "type": "reference", "refType": "object", "refName": "ReflectProviderValue", "required": true, "immutable": true } }, "isReply": { "type": "boolean", "required": false, "immutable": true, "indexed": true }, "mentions": { "type": "list", "required": false, "immutable": true, "item": { "type": "streamid", "required": false, "immutable": true } }, "createdAt": { "type": "datetime", "required": true, "immutable": true, "indexed": true }, "reflection": { "type": "streamid", "required": false, "immutable": true, "indexed": true }, "beam": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": "kjzl6hvfrbw6c5rvaehvw3bo06g91zzskdmqcamf87cou0c3rcjfga8otgn1dmh", "property": "beamID" } }, "author": { "type": "view", "viewType": "documentAccount" }, "version": { "type": "view", "viewType": "documentVersion" }, "reflectionView": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": null, "property": "reflection" } } }, "AkashaReflectInterface": { "nsfw": { "type": "boolean", "required": false, "immutable": false }, "tags": { "type": "list", "required": false, "immutable": false, "item": { "type": "string", "required": false, "immutable": false } }, "active": { "type": "boolean", "required": true, "immutable": false }, "beamID": { "type": "streamid", "required": true, "immutable": true }, "content": { "type": "list", "required": true, "immutable": false, "item": { "type": "reference", "refType": "object", "refName": "ReflectProviderValue", "required": true, "immutable": false } }, "isReply": { "type": "boolean", "required": false, "immutable": true }, "mentions": { "type": "list", "required": false, "immutable": false, "item": { "type": "streamid", "required": false, "immutable": false } }, "createdAt": { "type": "datetime", "required": true, "immutable": true }, "reflection": { "type": "streamid", "required": false, "immutable": true }, "beam": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": "kjzl6hvfrbw6c5rvaehvw3bo06g91zzskdmqcamf87cou0c3rcjfga8otgn1dmh", "property": "beamID" } }, "author": { "type": "view", "viewType": "documentAccount" }, "version": { "type": "view", "viewType": "documentVersion" }, "reflectionView": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": null, "property": "reflection" } } }, "AkashaReflectStream": { "active": { "type": "boolean", "required": true, "immutable": false, "indexed": true }, "beamID": { "type": "streamid", "required": true, "immutable": false, "indexed": true }, "status": { "type": "reference", "refType": "enum", "refName": "AkashaReflectStreamModerationStatus", "required": false, "immutable": false, "indexed": true }, "isReply": { "type": "boolean", "required": false, "immutable": false, "indexed": true }, "replyTo": { "type": "streamid", "required": false, "immutable": false, "indexed": true }, "createdAt": { "type": "datetime", "required": true, "immutable": true, "indexed": true }, "moderationID": { "type": "streamid", "required": false, "immutable": true, "indexed": true }, "reflectionID": { "type": "streamid", "required": true, "immutable": true, "indexed": true }, "moderation": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": null, "property": "moderationID" } }, "reflection": { "type": "view", "viewType": "relation", "relation": { "source": "document", "model": "kjzl6hvfrbw6c9aglcacfejq5fxzy0pxc8eraoyy03b9lv2mlx5o9u85zqnrhf5", "property": "reflectionID" } } }, "AppImageSource": { "src": { "type": "uri", "required": true, "immutable": false }, "width": { "type": "integer", "required": false, "immutable": false }, "height": { "type": "integer", "required": false, "immutable": false } }, "AppLinkSource": { "href": { "type": "uri", "required": true, "immutable": false }, "label": { "type": "string", "required": false, "immutable": false } }, "AppProviderValue": { "value": { "type": "string", "required": true, "immutable": false }, "property": { "type": "string", "required": true, "immutable": false }, "provider": { "type": "string", "required": true, "immutable": false } }, "BeamBlockRecord": { "order": { "type": "integer", "required": true, "immutable": false }, "blockID": { "type": "streamid", "required": true, "immutable": false } }, "BeamEmbeddedType": { "label": { "type": "string", "required": true, "immutable": false }, "embeddedID": { "type": "streamid", "required": true, "immutable": false } }, "BeamLabeled": { "value": { "type": "string", "required": true, "immutable": false }, "labelType": { "type": "string", "required": true, "immutable": false } }, "BlockLabeledValue": { "label": { "type": "string", "required": true, "immutable": false }, "value": { "type": "string", "required": true, "immutable": false }, "propertyType": { "type": "string", "required": true, "immutable": false } }, "ProfileImageSource": { "src": { "type": "uri", "required": true, "immutable": false }, "width": { "type": "integer", "required": true, "immutable": false }, "height": { "type": "integer", "required": true, "immutable": false } }, "ProfileImageVersions": { "default": { "type": "reference", "refType": "object", "refName": "ProfileImageSource", "required": true, "immutable": false }, "alternatives": { "type": "list", "required": false, "immutable": false, "item": { "type": "reference", "refType": "object", "refName": "ProfileImageSource", "required": false, "immutable": false } } }, "ProfileLabeled": { "value": { "type": "string", "required": true, "immutable": false }, "labelType": { "type": "string", "required": true, "immutable": false } }, "ProfileLinkSource": { "href": { "type": "uri", "required": true, "immutable": false }, "label": { "type": "string", "required": false, "immutable": false } }, "ReflectProviderValue": { "label": { "type": "string", "required": true, "immutable": false }, "value": { "type": "string", "required": true, "immutable": false }, "propertyType": { "type": "string", "required": true, "immutable": false } } }, "enums": { "AkashaAppApplicationType": ["APP", "PLUGIN", "WIDGET", "OTHER"], "AkashaAppsStreamModerationStatus": ["REMOVED", "IN_REVIEW", "SUSPENDED", "NSFW", "OK", "OTHER"], "AkashaBeamStreamModerationStatus": ["REMOVED", "IN_REVIEW", "SUSPENDED", "NSFW", "OK", "OTHER"], "AkashaBlockStorageBlockDef": ["TEXT", "RTF", "FORM", "IMAGE", "ANIMATED_IMAGE", "VIDEO", "BOOL", "EMOJI", "FORM_DATA", "OTHER"], "AkashaContentBlockBlockDef": ["TEXT", "RTF", "FORM", "IMAGE", "ANIMATED_IMAGE", "VIDEO", "BOOL", "EMOJI", "FORM_DATA", "OTHER"], "AkashaContentBlockStreamModerationStatus": ["REMOVED", "IN_REVIEW", "SUSPENDED", "NSFW", "OK", "OTHER"], "AkashaIndexedStreamModerationStatus": ["REMOVED", "IN_REVIEW", "SUSPENDED", "NSFW", "OK", "OTHER"], "AkashaIndexedStreamStreamType": ["BEAM", "REFLECT", "PROFILE", "APP", "EXTENSION", "PLUGIN", "WIDGET", "OTHER"], "AkashaInterestsStreamModerationStatus": ["REMOVED", "IN_REVIEW", "SUSPENDED", "NSFW", "OK", "OTHER"], "AkashaProfileStreamModerationStatus": ["REMOVED", "IN_REVIEW", "SUSPENDED", "NSFW", "OK", "OTHER"], "AkashaReflectStreamModerationStatus": ["REMOVED", "IN_REVIEW", "SUSPENDED", "NSFW", "OK", "OTHER"] }, "accountData": { "akashaApp": { "type": "set", "name": "AkashaApp" }, "akashaAppInterfaceList": { "type": "connection", "name": "AkashaAppInterface" }, "akashaAppList": { "type": "connection", "name": "AkashaApp" }, "akashaAppRelease": { "type": "set", "name": "AkashaAppRelease" }, "akashaAppReleaseInterfaceList": { "type": "connection", "name": "AkashaAppReleaseInterface" }, "akashaAppReleaseList": { "type": "connection", "name": "AkashaAppRelease" }, "akashaAppsStream": { "type": "set", "name": "AkashaAppsStream" }, "akashaAppsStreamList": { "type": "connection", "name": "AkashaAppsStream" }, "akashaBeamInterfaceList": { "type": "connection", "name": "AkashaBeamInterface" }, "akashaBeamList": { "type": "connection", "name": "AkashaBeam" }, "akashaBeamStream": { "type": "set", "name": "AkashaBeamStream" }, "akashaBeamStreamList": { "type": "connection", "name": "AkashaBeamStream" }, "akashaBlockStorage": { "type": "set", "name": "AkashaBlockStorage" }, "akashaBlockStorageList": { "type": "connection", "name": "AkashaBlockStorage" }, "akashaContentBlockInterfaceList": { "type": "connection", "name": "AkashaContentBlockInterface" }, "akashaContentBlockList": { "type": "connection", "name": "AkashaContentBlock" }, "akashaContentBlockStream": { "type": "set", "name": "AkashaContentBlockStream" }, "akashaContentBlockStreamList": { "type": "connection", "name": "AkashaContentBlockStream" }, "akashaFollow": { "type": "set", "name": "AkashaFollow" }, "akashaFollowInterfaceList": { "type": "connection", "name": "AkashaFollowInterface" }, "akashaFollowList": { "type": "connection", "name": "AkashaFollow" }, "akashaIndexStreamInterfaceList": { "type": "connection", "name": "AkashaIndexStreamInterface" }, "akashaIndexedStream": { "type": "set", "name": "AkashaIndexedStream" }, "akashaIndexedStreamList": { "type": "connection", "name": "AkashaIndexedStream" }, "akashaInterestsStream": { "type": "set", "name": "AkashaInterestsStream" }, "akashaInterestsStreamList": { "type": "connection", "name": "AkashaInterestsStream" }, "akashaProfile": { "type": "node", "name": "AkashaProfile" }, "akashaProfileInterests": { "type": "node", "name": "AkashaProfileInterests" }, "akashaProfileInterestsInterfaceList": { "type": "connection", "name": "AkashaProfileInterestsInterface" }, "akashaProfileInterfaceList": { "type": "connection", "name": "AkashaProfileInterface" }, "akashaProfileStream": { "type": "set", "name": "AkashaProfileStream" }, "akashaProfileStreamList": { "type": "connection", "name": "AkashaProfileStream" }, "akashaReflectInterfaceList": { "type": "connection", "name": "AkashaReflectInterface" }, "akashaReflectList": { "type": "connection", "name": "AkashaReflect" }, "akashaReflectStream": { "type": "set", "name": "AkashaReflectStream" }, "akashaReflectStreamList": { "type": "connection", "name": "AkashaReflectStream" } } };
//# sourceMappingURL=runtime-definition.js.map