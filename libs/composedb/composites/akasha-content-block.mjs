
export default function compose(akashaAppReleaseIdInterface){
 return `interface AkashaAppReleaseInterface @loadModel(id: "${akashaAppReleaseIdInterface}") {
  id: ID!
}

type LabeledValue{
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
    content: [LabeledValue!]! @list(maxLength: 20) @immutable
    appVersionID: StreamID! @documentReference(model: "AkashaAppReleaseInterface") @immutable
    appVersion: AkashaAppReleaseInterface! @relationDocument(property: "appVersionID")
    version: CommitID! @documentVersion
    active: Boolean!
    createdAt: DateTime! @immutable
    author: DID! @documentAccount
    kind: BlockDef! @immutable
    nsfw: Boolean @immutable
 }

# model builder
type AkashaContentBlock implements AkashaContentBlockInterface
  @createModel(accountRelation: LIST, description: "AKASHA Basic Content Block v0.3")
  @createIndex(fields:[{path:"active"}, {path: "createdAt"}, {path: "kind"}, {path: "nsfw"}, {path: "appVersionID"}]) {
    content: [LabeledValue!]! @list(maxLength: 20) @immutable
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
  @createModel(accountRelation: SET, description: "AKASHA Block Storage v0.3", accountRelationFields: ["blockID"])
  @createIndex(fields:[{path:"active"}, {path: "createdAt"}, {path: "kind"}]) {
    blockID: StreamID! @documentReference(model: "AkashaContentBlock")
    block: AkashaContentBlock! @relationDocument(property: "blockID")
    content: [LabeledValue!]! @list(maxLength: 20)
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
