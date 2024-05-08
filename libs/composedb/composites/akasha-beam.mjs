export default function compose(akashaContentBlockId, akashaProfileId){
  return `type AkashaContentBlock @loadModel(id: "${akashaContentBlockId}") {
  id: ID!
}


type BlockRecord{
  order: Int! @int(min: 0, max: 10)
  blockID: StreamID! @documentReference(model: "AkashaContentBlock")
 # block: ContentBlock! @relationDocument(property: "blockID")
}

type EmbeddedType{
  label: String! @string(minLength:3, maxLength: 32)
  embeddedID: StreamID!
}

type Labeled{
  labelType: String! @string(maxLength: 30)
  value: String! @string(minLength:2, maxLength: 60)
}

type AkashaProfile @loadModel(id: "${akashaProfileId}") {
  id: ID!
}

type AkashaBeam @createModel(accountRelation: LIST, description: "AKASHA Beam v0.1") @createIndex(fields:[{path:"active"}, {path: "createdAt"}, {path: "nsfw"}]) {
  author: DID! @documentAccount
  content: [BlockRecord!]! @list(maxLength: 10)
  tags: [Labeled] @list(maxLength: 10)
  mentions: [DID] @list(maxLength: 10)
  version: CommitID! @documentVersion
  embeddedStream: EmbeddedType
  active: Boolean!
  createdAt: DateTime!
  nsfw: Boolean
}
`
}

