export default function compose (akashaBeamId) {
    return `
type ProviderValue{
  propertyType: String! @string(minLength: 2, maxLength: 100)
  label: String! @string(minLength: 6, maxLength: 100)
  value: String! @string(minLength: 3, maxLength: 3000)
}

type AkashaBeam @loadModel(id: "${akashaBeamId}") {
  id: ID!
}

type AkashaReflect @createModel(accountRelation: LIST, description: "A Reflection on a Beam v0.1") @createIndex(fields:[{path:"active"}, {path: "createdAt"}, {path: "reflection"}, {path: "isReply"}, {path: "nsfw"}]) {
    beamID: StreamID! @documentReference(model: "AkashaBeam")
    beam: AkashaBeam! @relationDocument(property: "beamID")
    author: DID! @documentAccount
    content: [ProviderValue!]! @list(maxLength: 10)
    tags: [String] @list(maxLength: 10) @string(minLength:3, maxLength: 32)
    mentions: [StreamID] @list(maxLength: 10)
    version: CommitID! @documentVersion
    reflection: StreamID
    isReply: Boolean
    active: Boolean!
    createdAt: DateTime!
    nsfw: Boolean
}`
}
