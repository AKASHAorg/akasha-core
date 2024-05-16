export default function compose (akashaBeamIdI, akashaProfileIdI, akashaContentBlockIdI, akashaReflectIdI, akashaAppIdI) {

  return `
interface AkashaBeamInterface @loadModel(id: "${akashaBeamIdI}") {
  id: ID!
}

interface AkashaContentBlockInterface @loadModel(id: "${akashaContentBlockIdI}") {
  id: ID!
}

interface AkashaProfileInterface @loadModel(id: "${akashaProfileIdI}") {
  id: ID!
}

interface AkashaReflectInterface @loadModel(id: "${akashaReflectIdI}") {
  id: ID!
}

interface AkashaAppInterface @loadModel(id: "${akashaAppIdI}") {
  id: ID!
}

enum ModerationStatus{
  REMOVED,
  IN_REVIEW,
  SUSPENDED,
  NSFW,
  OK,
  OTHER
}

enum StreamType{
  BEAM,
  REFLECT,
  PROFILE,
  APP,
  EXTENSION,
  PLUGIN,
  WIDGET,
  OTHER
}

interface AkashaIndexStreamInterface
@createModel(description: "AKASHA Index Stream Interface") {
  active: Boolean!
  createdAt: DateTime! @immutable
  # status: ModerationStatus
  moderationID: StreamID @documentReference(model: "Node") @immutable
  moderation: Node @relationDocument(property: "moderationID")
}

type AkashaBeamStream implements AkashaIndexStreamInterface
  @createModel(accountRelation: SET, description: "Moderated Beams list v0.3.1",  accountRelationFields: ["beamID"])
  @createIndex(fields:[{path: "active"}])
  @createIndex(fields:[{path: "beamID"}])
  @createIndex(fields:[{path: "createdAt"}])
  @createIndex(fields:[{path: "status"}])
  @createIndex(fields:[{path: "moderationID"}]){
    beamID: StreamID! @documentReference(model: "AkashaBeamInterface")
    beam: AkashaBeamInterface! @relationDocument(property: "beamID")
    active: Boolean!
    createdAt: DateTime! @immutable
    status: ModerationStatus
    moderationID: StreamID @documentReference(model: "Node") @immutable
    moderation: Node @relationDocument(property: "moderationID")
}

type AkashaContentBlockStream implements AkashaIndexStreamInterface
  @createModel(accountRelation: SET, description: "Moderated Content Blocks v0.3.1", accountRelationFields: ["blockID"])
  @createIndex(fields:[{path: "active"}])
  @createIndex(fields:[{path: "blockID"}])
  @createIndex(fields:[{path: "createdAt"}])
  @createIndex(fields:[{path: "status"}])
  @createIndex(fields:[{path: "moderationID"}]){
    blockID: StreamID! @documentReference(model: "AkashaContentBlockInterface")
    block: AkashaContentBlockInterface! @relationDocument(property: "blockID")
    active: Boolean!
    createdAt: DateTime! @immutable
    status: ModerationStatus
    moderationID: StreamID @documentReference(model: "Node") @immutable
    moderation: Node @relationDocument(property: "moderationID")
}

type AkashaReflectStream implements AkashaIndexStreamInterface
  @createModel(accountRelation: SET, description: "Moderated Beam Reflections v0.3.1", accountRelationFields: ["reflectionID"])
  @createIndex(fields:[{path: "active"}])
  @createIndex(fields:[{path: "reflectionID"}])
  @createIndex(fields:[{path: "createdAt"}])
  @createIndex(fields:[{path: "status"}])
  @createIndex(fields:[{path: "moderationID"}])
  @createIndex(fields:[{path: "beamID"}])
  @createIndex(fields:[{path: "isReply"}])
  @createIndex(fields:[{path: "replyTo"}]){
    reflectionID: StreamID! @documentReference(model: "AkashaReflectInterface")
    reflection: AkashaReflectInterface! @relationDocument(property: "reflectionID")
    beamID: StreamID! @documentReference(model: "AkashaBeamInterface")
    replyTo: StreamID
    isReply: Boolean
    active: Boolean!
    createdAt: DateTime! @immutable
    status: ModerationStatus
    moderationID: StreamID @documentReference(model: "Node") @immutable
    moderation: Node @relationDocument(property: "moderationID")
}

type AkashaProfileStream implements AkashaIndexStreamInterface
  @createModel(accountRelation: SET, description: "Moderated Profiles list v0.3.1", accountRelationFields: ["profileID"])
  @createIndex(fields:[{path: "active"}])
  @createIndex(fields:[{path: "profileID"}])
  @createIndex(fields:[{path: "createdAt"}])
  @createIndex(fields:[{path: "status"}])
  @createIndex(fields:[{path: "moderationID"}]){
    profileID: StreamID! @documentReference(model: "AkashaProfileInterface")
    profile: AkashaProfileInterface! @relationDocument(property: "profileID")
    active: Boolean!
    createdAt: DateTime! @immutable
    status: ModerationStatus
    moderationID: StreamID @documentReference(model: "Node") @immutable
    moderation: Node @relationDocument(property: "moderationID")
}


type AkashaInterestsStream implements AkashaIndexStreamInterface
  @createModel(accountRelation: SET, description: "Moderated Interests suggestion list v0.3.1", accountRelationFields: ["labelType", "value"])
  @createIndex(fields:[{path: "active"}])
  @createIndex(fields:[{path: "labelType"}])
  @createIndex(fields:[{path: "value"}])
  @createIndex(fields:[{path: "createdAt"}])
  @createIndex(fields:[{path: "status"}])
  @createIndex(fields:[{path: "moderationID"}]){
    labelType: String! @string(maxLength: 30)
    value: String! @string(minLength:2, maxLength: 60)
    active: Boolean!
    createdAt: DateTime! @immutable
    status: ModerationStatus
    moderationID: StreamID @documentReference(model: "Node") @immutable
    moderation: Node @relationDocument(property: "moderationID")
}


type AkashaAppsStream implements AkashaIndexStreamInterface
  @createModel(accountRelation: SET, description: "Moderated Apps suggestion list v0.3.1", accountRelationFields: ["applicationID"])
  @createIndex(fields:[{path: "active"}])
  @createIndex(fields:[{path: "applicationID"}])
  @createIndex(fields:[{path: "createdAt"}])
  @createIndex(fields:[{path: "status"}])
  @createIndex(fields:[{path: "moderationID"}]){
    applicationID: StreamID! @documentReference(model: "AkashaAppInterface")
    application: AkashaAppInterface! @relationDocument(property: "applicationID")
    active: Boolean!
    createdAt: DateTime! @immutable
    status: ModerationStatus
    moderationID: StreamID @documentReference(model: "Node") @immutable
    moderation: Node @relationDocument(property: "moderationID")
}

type AkashaIndexedStream implements AkashaIndexStreamInterface
  @createModel(accountRelation: SET, description: "Indexed Content v0.3.6", accountRelationFields: ["stream","indexType", "indexValue"])
  @createIndex(fields:[{path: "active"}, {path: "createdAt"}, {path: "status"}, {path: "moderationID"}, {path: "stream"}, {path: "streamType"}, {path: "indexType"}, {path: "indexValue"}]){
    active: Boolean!
    createdAt: DateTime!
    status: ModerationStatus
    stream: StreamID! @documentReference(model: "Node") @immutable
    streamView: Node! @relationDocument(property: "stream")
    streamType: StreamType!
    moderationID: StreamID @documentReference(model: "Node") @immutable
    moderation: Node @relationDocument(property: "moderationID")
    indexType: String! @string(maxLength: 30)
    indexValue: String! @string(minLength:2, maxLength: 90)
}
`
}
