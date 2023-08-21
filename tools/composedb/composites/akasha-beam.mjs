export default function compose(akashaContentBlockId, akashaProfileId){
  return `type AkashaContentBlock @loadModel(id: "${akashaContentBlockId}") {
  id: ID!
}


type BlockRecord{
  order: Int! @int(min: 0, max: 10)
  blockID: StreamID! @documentReference(model: "AkashaContentBlock")
 # block: ContentBlock! @relationDocument(property: "blockID")
}

type AkashaProfile @loadModel(id: "${akashaProfileId}") {
  id: ID!
}

type AkashaBeam @createModel(accountRelation: LIST, description: "AKASHA Beam") @createIndex(fields:[{path:"active"}, {path: "createdAt"}, {path: "tags"}, {path: "mentions"}, {path: "nsfw"}]) {
  author: DID! @documentAccount
  content: [BlockRecord!]! @list(maxLength: 10)
  tags: [String] @list(maxLength: 10) @string(minLength:3, maxLength: 32)
  mentions: [StreamID] @list(maxLength: 10)
  version: CommitID! @documentVersion
  embeddedBeam: StreamID
  active: Boolean!
  createdAt: DateTime!
  nsfw: Boolean
}
`
}

