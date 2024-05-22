
export default function compose(akashaAppReleaseIdInterface){
 return `interface AkashaAppReleaseInterface @loadModel(id: "${akashaAppReleaseIdInterface}") {
  id: ID!
}

type BlockLabeledValue{
  propertyType: String! @string(minLength: 2, maxLength: 100)
  label: String! @string(minLength: 6, maxLength: 100)
  value: String! @string(minLength: 3, maxLength: 6000)
}

enum BlockDef{
  TEXT,
  RTF,
  FORM,
  IMAGE,
  ANIMATED_IMAGE,
  VIDEO,
  BOOL,
  EMOJI,
  FORM_DATA,
  OTHER
}

interface AkashaContentBlockInterface
 @createModel(description: "AKASHA Content Block interface") {
    content: [BlockLabeledValue!]! @list(maxLength: 20) @immutable
    appVersionID: StreamID! @documentReference(model: "AkashaAppReleaseInterface") @immutable
    appVersion: AkashaAppReleaseInterface! @relationDocument(property: "appVersionID")
    version: CommitID! @documentVersion
    active: Boolean!
    createdAt: DateTime! @immutable
    author: DID! @documentAccount
    # kind: BlockDef! @immutable
    nsfw: Boolean @immutable
 }

# model builder
type AkashaContentBlock implements AkashaContentBlockInterface
  @createModel(accountRelation: LIST, description: "AKASHA Basic Content Block v0.4.0")
  @createIndex(fields:[{path:["active"]}])
  @createIndex(fields:[{path:["createdAt"]}])
  @createIndex(fields:[{path:["kind"]}])
  @createIndex(fields:[{path:["nsfw"]}])
  @createIndex(fields:[{path:["appVersionID"]}])
  @createIndex(fields:[{path:["appVersionID"]}, {path:["kind"]}, {path:["createdAt"]}, {path:["nsfw"]}]){
    content: [BlockLabeledValue!]! @list(maxLength: 20) @immutable
    appVersionID: StreamID! @documentReference(model: "AkashaAppReleaseInterface") @immutable
    appVersion: AkashaAppReleaseInterface! @relationDocument(property: "appVersionID")
    version: CommitID! @documentVersion
    active: Boolean!
    createdAt: DateTime! @immutable
    author: DID! @documentAccount
    kind: BlockDef! @immutable
    nsfw: Boolean @immutable
}

type AkashaBlockStorage implements AkashaContentBlockInterface
  @createModel(accountRelation: SET, description: "AKASHA Block Storage v0.4.0", accountRelationFields: ["blockID"])
  @createIndex(fields:[{path:["active"]}])
  @createIndex(fields:[{path:["createdAt"]}])
  @createIndex(fields:[{path:["kind"]}])
  @createIndex(fields:[{path:["nsfw"]}])
  @createIndex(fields:[{path:["appVersionID"]}])
  @createIndex(fields:[{path:["blockID"]}])
  @createIndex(fields:[{path:["appVersionID"]}, {path:["kind"]}, {path:["createdAt"]}, {path:["nsfw"]}])
  @createIndex(fields:[{path:["blockID"]}, {path:["kind"]}, {path:["createdAt"]}, {path:["nsfw"]}])
  {
    blockID: StreamID! @documentReference(model: "AkashaContentBlock")
    block: AkashaContentBlock! @relationDocument(property: "blockID")
    content: [BlockLabeledValue!]! @list(maxLength: 20)
    appVersionID: StreamID! @documentReference(model: "AkashaAppReleaseInterface") @immutable
    appVersion: AkashaAppReleaseInterface! @relationDocument(property: "appVersionID")
    version: CommitID! @documentVersion
    active: Boolean!
    createdAt: DateTime! @immutable
    author: DID! @documentAccount
    kind: BlockDef! @immutable
    nsfw: Boolean @immutable
}
`
}
