export default function compose(akashaBlockContentId, akashaAppReleaseId){
 return `type AkashaContentBlock @loadModel(id: "${akashaBlockContentId}") {
  id: ID!
}

type AkashaAppRelease @loadModel(id: "${akashaAppReleaseId}") {
  id: ID!
}

type LabeledValue{
  propertyType: String! @string(minLength: 2, maxLength: 100)
  label: String! @string(minLength: 6, maxLength: 100)
  value: String! @string(minLength: 3, maxLength: 2000)
}

enum BlockStorageDef{
  TEXT,
  BOOL,
  EMOJI,
  FORM_DATA,
  OTHER
}

type AkashaBlockStorage @createModel(accountRelation: LIST, description: "AKASHA Block Storage v0.1") @createIndex(fields:[{path:"active"}, {path: "createdAt"}, {path: "kind"}]) {
  blockID: StreamID! @documentReference(model: "AkashaContentBlock")
  block: AkashaContentBlock! @relationDocument(property: "blockID")
  content: [LabeledValue!]! @list(maxLength: 20)
  appVersionID: StreamID! @documentReference(model: "AkashaAppRelease")
  appVersion: AkashaAppRelease! @relationDocument(property: "appVersionID")
  version: CommitID! @documentVersion
  active: Boolean!
  createdAt: DateTime!
  author: DID! @documentAccount
  kind: BlockStorageDef!
}`
}


