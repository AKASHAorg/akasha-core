
export default function compose(akashaAppReleaseId){
 return `type AkashaAppRelease @loadModel(id: "${akashaAppReleaseId}") {
  id: ID!
}

type LabeledValue{
  propertyType: String! @string(minLength: 2, maxLength: 100)
  label: String! @string(minLength: 6, maxLength: 100)
  value: String! @string(minLength: 3, maxLength: 6000)
}

enum BlockDef{
  TEXT,
  FORM,
  OTHER
}

# model builder
type AkashaContentBlock @createModel(accountRelation: LIST, description: "AKASHA Basic Content Block v0.1") @createIndex(fields:[{path:"active"}, {path: "createdAt"}, {path: "kind"}, {path: "nsfw"}, {path: "appVersionID"}]) {
  content: [LabeledValue!]! @list(maxLength: 20)
  appVersionID: StreamID! @documentReference(model: "AkashaAppRelease")
  appVersion: AkashaAppRelease! @relationDocument(property: "appVersionID")
  version: CommitID! @documentVersion
  active: Boolean!
  createdAt: DateTime!
  author: DID! @documentAccount
  kind: BlockDef!
  nsfw: Boolean
}
`
}

