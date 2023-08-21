// This is an auto-generated file, do not edit manually
export const definition = {"models":{"AkashaApp":{"id":"kjzl6hvfrbw6caribi34q9q1g0i23a6i0bhj7yuaglq159hh0ij1zd1wcytr85z","accountRelation":{"type":"list"}},"AkashaAppRelease":{"id":"kjzl6hvfrbw6c9k153j74evzm1jpc35uy18dunva0y452kypx7v90qryykutvjc","accountRelation":{"type":"list"}},"AkashaReflect":{"id":"kjzl6hvfrbw6c69qet9yp40qj9y0gj6b9y6f44klzd24sf6rutv1x7waj9oshtw","accountRelation":{"type":"list"}},"AkashaBeam":{"id":"kjzl6hvfrbw6c8wwniweysnm1vsse05a60c1rho0dugyauf8uqq469xitdxy3ia","accountRelation":{"type":"list"}},"AkashaProfile":{"id":"kjzl6hvfrbw6c9l8sxje9238fz8hx6u6whu9njmww96wn04c6uj0lillf9jygno","accountRelation":{"type":"single"}},"AkashaContentBlock":{"id":"kjzl6hvfrbw6c81zkhwf9gwvg4w7hlhzmggfbmyjapze5lzc8c7pcnm8igdg0hf","accountRelation":{"type":"list"}},"AkashaBlockStorage":{"id":"kjzl6hvfrbw6c98st5kg2b2tjql9ajp0bqeokw8ef204srccsf6oxgca4dy81fa","accountRelation":{"type":"list"}},"AkashaFollow":{"id":"kjzl6hvfrbw6cabzd9nz2wlwcfo6yoethcv7gi3n43vo9yof5bl5gb72j6pyb6j","accountRelation":{"type":"list"}},"AkashaProfileInterests":{"id":"kjzl6hvfrbw6c6vy9jjafizy9bf7b7fzs209ydpzydb9ka681j8tflqqz87xnpm","accountRelation":{"type":"single"}},"AkashaInterestsStream":{"id":"kjzl6hvfrbw6c81vduz2waz3mqw43lgiuqdlfnce25i8ykxuc1xt9xiogevyn13","accountRelation":{"type":"list"}},"AkashaAppsStream":{"id":"kjzl6hvfrbw6c9qoc2qubo05nf8asemojfq5gf568pxlwtjqmb7ek2juulyp1iz","accountRelation":{"type":"list"}},"AkashaProfileStream":{"id":"kjzl6hvfrbw6c775w8t59cg4794c7zegh2e6wbestrdtj3dp7tjdp8o7fnzng37","accountRelation":{"type":"list"}},"AkashaReflectStream":{"id":"kjzl6hvfrbw6cb0qpyyncj7t7cju648hwat4gibsmz25hyzpddk81uuwos9qvz1","accountRelation":{"type":"list"}},"AkashaContentBlockStream":{"id":"kjzl6hvfrbw6c7x35xcrzkucy4ricynqrk0j4wu054io8qp8wf1fjht5tbgpcm1","accountRelation":{"type":"list"}},"AkashaBeamStream":{"id":"kjzl6hvfrbw6c5f09eefr8mkcgjth0o95jffqft1eoa5ylefte8grkrrxgo2rwk","accountRelation":{"type":"list"}}},"objects":{"AkashaApp":{"name":{"type":"string","required":true,"indexed":true},"licence":{"type":"string","required":true},"keywords":{"type":"list","required":false,"item":{"type":"string","required":false},"indexed":true},"createdAt":{"type":"datetime","required":true,"indexed":true},"description":{"type":"string","required":true},"displayName":{"type":"string","required":true,"indexed":true},"contributors":{"type":"list","required":false,"item":{"type":"did","required":false}},"applicationType":{"type":"reference","refType":"enum","refName":"AkashaAppApplicationType","required":false,"indexed":true},"author":{"type":"view","viewType":"documentAccount"},"releases":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c9k153j74evzm1jpc35uy18dunva0y452kypx7v90qryykutvjc","property":"applicationID"}},"releasesCount":{"type":"view","viewType":"relation","relation":{"source":"queryCount","model":"kjzl6hvfrbw6c9k153j74evzm1jpc35uy18dunva0y452kypx7v90qryykutvjc","property":"applicationID"}}},"AkashaAppRelease":{"source":{"type":"cid","required":true},"version":{"type":"string","required":true,"indexed":true},"createdAt":{"type":"datetime","required":true,"indexed":true},"applicationID":{"type":"streamid","required":true,"indexed":true},"application":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6caribi34q9q1g0i23a6i0bhj7yuaglq159hh0ij1zd1wcytr85z","property":"applicationID"}}},"AkashaReflectProviderValue":{"value":{"type":"string","required":true},"property":{"type":"string","required":true},"provider":{"type":"string","required":true}},"AkashaReflect":{"nsfw":{"type":"boolean","required":false,"indexed":true},"tags":{"type":"list","required":false,"item":{"type":"string","required":false},"indexed":true},"active":{"type":"boolean","required":true,"indexed":true},"beamID":{"type":"streamid","required":true},"content":{"type":"list","required":true,"item":{"type":"reference","refType":"object","refName":"AkashaReflectProviderValue","required":true}},"isReply":{"type":"boolean","required":true,"indexed":true},"mentions":{"type":"list","required":false,"item":{"type":"streamid","required":false},"indexed":true},"createdAt":{"type":"datetime","required":true,"indexed":true},"reflection":{"type":"streamid","required":false,"indexed":true},"beam":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c8wwniweysnm1vsse05a60c1rho0dugyauf8uqq469xitdxy3ia","property":"beamID"}},"author":{"type":"view","viewType":"documentAccount"},"version":{"type":"view","viewType":"documentVersion"}},"AkashaBeamBlockRecord":{"order":{"type":"integer","required":true},"blockID":{"type":"streamid","required":true}},"AkashaBeam":{"nsfw":{"type":"boolean","required":false,"indexed":true},"tags":{"type":"list","required":false,"item":{"type":"string","required":false},"indexed":true},"active":{"type":"boolean","required":true,"indexed":true},"content":{"type":"list","required":true,"item":{"type":"reference","refType":"object","refName":"AkashaBeamBlockRecord","required":true}},"mentions":{"type":"list","required":false,"item":{"type":"streamid","required":false},"indexed":true},"createdAt":{"type":"datetime","required":true,"indexed":true},"embeddedBeam":{"type":"streamid","required":false},"author":{"type":"view","viewType":"documentAccount"},"version":{"type":"view","viewType":"documentVersion"},"reflections":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c69qet9yp40qj9y0gj6b9y6f44klzd24sf6rutv1x7waj9oshtw","property":"beamID"}},"reflectionsCount":{"type":"view","viewType":"relation","relation":{"source":"queryCount","model":"kjzl6hvfrbw6c69qet9yp40qj9y0gj6b9y6f44klzd24sf6rutv1x7waj9oshtw","property":"beamID"}}},"AkashaProfileLinkSource":{"href":{"type":"uri","required":true},"label":{"type":"string","required":false}},"AkashaProfileImageSource":{"src":{"type":"uri","required":true},"width":{"type":"integer","required":true},"height":{"type":"integer","required":true}},"AkashaProfileImageVersions":{"default":{"type":"reference","refType":"object","refName":"AkashaProfileImageSource","required":true},"alternatives":{"type":"list","required":false,"item":{"type":"reference","refType":"object","refName":"AkashaProfileImageSource","required":false}}},"AkashaProfile":{"name":{"type":"string","required":true,"indexed":true},"nsfw":{"type":"boolean","required":false,"indexed":true},"links":{"type":"list","required":false,"item":{"type":"reference","refType":"object","refName":"AkashaProfileLinkSource","required":false}},"avatar":{"type":"reference","refType":"object","refName":"AkashaProfileImageVersions","required":false},"createdAt":{"type":"datetime","required":true,"indexed":true},"background":{"type":"reference","refType":"object","refName":"AkashaProfileImageVersions","required":false},"description":{"type":"string","required":false},"did":{"type":"view","viewType":"documentAccount"},"followers":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6cabzd9nz2wlwcfo6yoethcv7gi3n43vo9yof5bl5gb72j6pyb6j","property":"profileID"}}},"AkashaContentBlockLabeledValue":{"label":{"type":"string","required":true},"value":{"type":"string","required":true},"propertyType":{"type":"string","required":true}},"AkashaContentBlock":{"kind":{"type":"reference","refType":"enum","refName":"AkashaContentBlockBlockDef","required":false,"indexed":true},"nsfw":{"type":"boolean","required":false,"indexed":true},"active":{"type":"boolean","required":true,"indexed":true},"content":{"type":"list","required":true,"item":{"type":"reference","refType":"object","refName":"AkashaContentBlockLabeledValue","required":true}},"createdAt":{"type":"datetime","required":true,"indexed":true},"appVersionID":{"type":"streamid","required":true},"author":{"type":"view","viewType":"documentAccount"},"version":{"type":"view","viewType":"documentVersion"},"appVersion":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c9k153j74evzm1jpc35uy18dunva0y452kypx7v90qryykutvjc","property":"appVersionID"}}},"AkashaBlockStorageLabeledValue":{"label":{"type":"string","required":true},"value":{"type":"string","required":true},"propertyType":{"type":"string","required":true}},"AkashaBlockStorage":{"kind":{"type":"reference","refType":"enum","refName":"AkashaBlockStorageBlockStorageDef","required":false,"indexed":true},"active":{"type":"boolean","required":true,"indexed":true},"blockID":{"type":"streamid","required":true},"content":{"type":"list","required":true,"item":{"type":"reference","refType":"object","refName":"AkashaBlockStorageLabeledValue","required":true}},"createdAt":{"type":"datetime","required":true,"indexed":true},"appVersionID":{"type":"streamid","required":true},"block":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c81zkhwf9gwvg4w7hlhzmggfbmyjapze5lzc8c7pcnm8igdg0hf","property":"blockID"}},"author":{"type":"view","viewType":"documentAccount"},"version":{"type":"view","viewType":"documentVersion"},"appVersion":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c9k153j74evzm1jpc35uy18dunva0y452kypx7v90qryykutvjc","property":"appVersionID"}}},"AkashaFollow":{"profileID":{"type":"streamid","required":true,"indexed":true},"isFollowing":{"type":"boolean","required":true,"indexed":true},"did":{"type":"view","viewType":"documentAccount"},"profile":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c9l8sxje9238fz8hx6u6whu9njmww96wn04c6uj0lillf9jygno","property":"profileID"}}},"AkashaProfileInterestsLabeled":{"value":{"type":"string","required":true},"labelType":{"type":"string","required":true}},"AkashaProfileInterests":{"topics":{"type":"list","required":true,"item":{"type":"reference","refType":"object","refName":"AkashaProfileInterestsLabeled","required":true},"indexed":true},"did":{"type":"view","viewType":"documentAccount"}},"AkashaInterestsStream":{"value":{"type":"string","required":true,"indexed":true},"active":{"type":"boolean","required":true,"indexed":true},"status":{"type":"reference","refType":"enum","refName":"AkashaInterestsStreamModerationStatus","required":false,"indexed":true},"createdAt":{"type":"datetime","required":true,"indexed":true},"labelType":{"type":"string","required":true,"indexed":true},"moderationID":{"type":"streamid","required":false,"indexed":true}},"AkashaAppsStream":{"active":{"type":"boolean","required":true,"indexed":true},"status":{"type":"reference","refType":"enum","refName":"AkashaAppsStreamModerationStatus","required":false,"indexed":true},"createdAt":{"type":"datetime","required":true,"indexed":true},"moderationID":{"type":"streamid","required":false,"indexed":true},"applicationID":{"type":"streamid","required":true,"indexed":true},"application":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6caribi34q9q1g0i23a6i0bhj7yuaglq159hh0ij1zd1wcytr85z","property":"applicationID"}}},"AkashaProfileStream":{"active":{"type":"boolean","required":true,"indexed":true},"status":{"type":"reference","refType":"enum","refName":"AkashaProfileStreamModerationStatus","required":false,"indexed":true},"createdAt":{"type":"datetime","required":true,"indexed":true},"profileID":{"type":"streamid","required":true,"indexed":true},"moderationID":{"type":"streamid","required":false,"indexed":true},"profile":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c9l8sxje9238fz8hx6u6whu9njmww96wn04c6uj0lillf9jygno","property":"profileID"}}},"AkashaReflectStream":{"active":{"type":"boolean","required":true,"indexed":true},"beamID":{"type":"streamid","required":true,"indexed":true},"status":{"type":"reference","refType":"enum","refName":"AkashaReflectStreamModerationStatus","required":false,"indexed":true},"createdAt":{"type":"datetime","required":true,"indexed":true},"moderationID":{"type":"streamid","required":false,"indexed":true},"reflectionID":{"type":"streamid","required":true,"indexed":true},"reflection":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c69qet9yp40qj9y0gj6b9y6f44klzd24sf6rutv1x7waj9oshtw","property":"reflectionID"}}},"AkashaContentBlockStream":{"active":{"type":"boolean","required":true,"indexed":true},"beamID":{"type":"streamid","required":true,"indexed":true},"status":{"type":"reference","refType":"enum","refName":"AkashaContentBlockStreamModerationStatus","required":false,"indexed":true},"blockID":{"type":"streamid","required":true,"indexed":true},"createdAt":{"type":"datetime","required":true,"indexed":true},"moderationID":{"type":"streamid","required":false,"indexed":true},"block":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c81zkhwf9gwvg4w7hlhzmggfbmyjapze5lzc8c7pcnm8igdg0hf","property":"blockID"}}},"AkashaBeamStream":{"active":{"type":"boolean","required":true,"indexed":true},"beamID":{"type":"streamid","required":true,"indexed":true},"status":{"type":"reference","refType":"enum","refName":"AkashaBeamStreamModerationStatus","required":false,"indexed":true},"createdAt":{"type":"datetime","required":true,"indexed":true},"moderationID":{"type":"streamid","required":false,"indexed":true},"beam":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c8wwniweysnm1vsse05a60c1rho0dugyauf8uqq469xitdxy3ia","property":"beamID"}}}},"enums":{"AkashaAppApplicationType":["APP","PLUGIN","WIDGET","OTHER"],"AkashaContentBlockBlockDef":["TEXT","FORM","OTHER"],"AkashaBlockStorageBlockStorageDef":["TEXT","BOOL","EMOJI","FORM_DATA","OTHER"],"AkashaInterestsStreamModerationStatus":["REMOVED","IN_REVIEW","SUSPENDED","NSFW","OK","OTHER"],"AkashaAppsStreamModerationStatus":["REMOVED","IN_REVIEW","SUSPENDED","NSFW","OK","OTHER"],"AkashaProfileStreamModerationStatus":["REMOVED","IN_REVIEW","SUSPENDED","NSFW","OK","OTHER"],"AkashaReflectStreamModerationStatus":["REMOVED","IN_REVIEW","SUSPENDED","NSFW","OK","OTHER"],"AkashaContentBlockStreamModerationStatus":["REMOVED","IN_REVIEW","SUSPENDED","NSFW","OK","OTHER"],"AkashaBeamStreamModerationStatus":["REMOVED","IN_REVIEW","SUSPENDED","NSFW","OK","OTHER"]},"accountData":{"akashaAppList":{"type":"connection","name":"AkashaApp"},"akashaAppReleaseList":{"type":"connection","name":"AkashaAppRelease"},"akashaReflectList":{"type":"connection","name":"AkashaReflect"},"akashaBeamList":{"type":"connection","name":"AkashaBeam"},"akashaProfile":{"type":"node","name":"AkashaProfile"},"akashaContentBlockList":{"type":"connection","name":"AkashaContentBlock"},"akashaBlockStorageList":{"type":"connection","name":"AkashaBlockStorage"},"akashaFollowList":{"type":"connection","name":"AkashaFollow"},"akashaProfileInterests":{"type":"node","name":"AkashaProfileInterests"},"akashaInterestsStreamList":{"type":"connection","name":"AkashaInterestsStream"},"akashaAppsStreamList":{"type":"connection","name":"AkashaAppsStream"},"akashaProfileStreamList":{"type":"connection","name":"AkashaProfileStream"},"akashaReflectStreamList":{"type":"connection","name":"AkashaReflectStream"},"akashaContentBlockStreamList":{"type":"connection","name":"AkashaContentBlockStream"},"akashaBeamStreamList":{"type":"connection","name":"AkashaBeamStream"}}}