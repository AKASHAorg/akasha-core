export default function compose (akashaBeamId, akashaProfileId, akashaContentBlockId, akashaReflectId, akashaAppId) {

  return `
type AkashaBeam @loadModel(id: "${akashaBeamId}") {
  id: ID!
}

type AkashaContentBlock @loadModel(id: "${akashaContentBlockId}") {
  id: ID!
}

type AkashaProfile @loadModel(id: "${akashaProfileId}") {
  id: ID!
}

type AkashaReflect @loadModel(id: "${akashaReflectId}") {
  id: ID!
}

type AkashaApp @loadModel(id: "${akashaAppId}") {
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

type AkashaBeamStream @createModel(accountRelation: SET, description: "Moderated Beams list v0.2",  accountRelationFields: ["beamID"]) @createIndex(fields:[{path: "active"},{path: "beamID"}, {path: "createdAt"}, {path: "status"}, {path: "moderationID"}]){
  beamID: StreamID! @documentReference(model: "AkashaBeam")
  beam: AkashaBeam! @relationDocument(property: "beamID")
  active: Boolean!
  createdAt: DateTime!
  status: ModerationStatus
  moderationID: StreamID
}

type AkashaContentBlockStream @createModel(accountRelation: SET, description: "Moderated Content Blocks v0.2", accountRelationFields: ["blockID"]) @createIndex(fields:[{path: "active"},{path: "blockID"}, {path: "createdAt"}, {path: "status"}, {path: "moderationID"}]){
  blockID: StreamID! @documentReference(model: "AkashaContentBlock")
  block: AkashaContentBlock! @relationDocument(property: "blockID")
  active: Boolean!
  createdAt: DateTime!
  status: ModerationStatus
  moderationID: StreamID
}

type AkashaReflectStream @createModel(accountRelation: SET, description: "Moderated Beam Reflections v0.2.1", accountRelationFields: ["reflectionID"]) @createIndex(fields:[{path: "active"},{path: "reflectionID"}, {path: "createdAt"}, {path: "status"}, {path: "moderationID"}, {path: "beamID"},  {path: "isReply"},  {path: "replyTo"}]){
  reflectionID: StreamID! @documentReference(model: "AkashaReflect")
  reflection: AkashaReflect! @relationDocument(property: "reflectionID")
  beamID: StreamID! @documentReference(model: "AkashaBeam")
  replyTo: StreamID
  isReply: Boolean
  active: Boolean!
  createdAt: DateTime!
  status: ModerationStatus
  moderationID: StreamID
}

type AkashaProfileStream @createModel(accountRelation: SET, description: "Moderated Profiles list v0.2", accountRelationFields: ["profileID"]) @createIndex(fields:[{path: "active"},{path: "profileID"}, {path: "createdAt"}, {path: "status"}, {path: "moderationID"}]){
  profileID: StreamID! @documentReference(model: "AkashaProfile")
  profile: AkashaProfile! @relationDocument(property: "profileID")
  active: Boolean!
  createdAt: DateTime!
  status: ModerationStatus
  moderationID: StreamID
}


type AkashaInterestsStream @createModel(accountRelation: SET, description: "Moderated Interests suggestion list v0.2", accountRelationFields: ["labelType", "value"]) @createIndex(fields:[{path: "active"},{path: "labelType"}, {path: "value"}, {path: "createdAt"}, {path: "status"}, {path: "moderationID"}]){
  labelType: String! @string(maxLength: 30)
  value: String! @string(minLength:2, maxLength: 60)
  active: Boolean!
  createdAt: DateTime!
  status: ModerationStatus
  moderationID: StreamID
}


type AkashaAppsStream @createModel(accountRelation: SET, description: "Moderated Apps suggestion list v0.2", accountRelationFields: ["applicationID"]) @createIndex(fields:[{path: "active"},{path: "applicationID"}, {path: "createdAt"}, {path: "status"}, {path: "moderationID"}]){
  applicationID: StreamID! @documentReference(model: "AkashaApp")
  application: AkashaApp! @relationDocument(property: "applicationID")
  active: Boolean!
  createdAt: DateTime!
  status: ModerationStatus
  moderationID: StreamID
}

type AkashaIndexedStream @createModel(accountRelation: SET, description: "Indexed Content v0.2", accountRelationFields: ["stream","indexType", "indexValue"]) @createIndex(fields:[{path: "active"}, {path: "createdAt"}, {path: "status"}, {path: "moderationID"}, {path: "stream"}, {path: "streamType"}, {path: "indexType"}, {path: "indexValue"}]){
  active: Boolean!
  createdAt: DateTime!
  status: ModerationStatus
  stream: StreamID!
  streamType: StreamType!
  moderationID: StreamID
  indexType: String! @string(maxLength: 30)
  indexValue: String! @string(minLength:2, maxLength: 90)
}
  `

}
