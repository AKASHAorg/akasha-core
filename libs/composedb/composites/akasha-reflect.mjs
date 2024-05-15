export default function compose (akashaBeamIdInterface) {
    return `
type ProviderValue{
  propertyType: String! @string(minLength: 2, maxLength: 100)
  label: String! @string(minLength: 6, maxLength: 100)
  value: String! @string(minLength: 3, maxLength: 3000)
}

interface AkashaBeamInterface @loadModel(id: "${akashaBeamIdInterface}") {
  id: ID!
}

interface AkashaReflectInterface @createModel(description: "A Reflection on a Beam interface") {
    beamID: StreamID! @documentReference(model: "AkashaBeamInterface") @immutable
    beam: AkashaBeamInterface! @relationDocument(property: "beamID")
    author: DID! @documentAccount
    content: [ProviderValue!]! @list(maxLength: 10) @immutable
    tags: [String] @list(maxLength: 10) @string(minLength:3, maxLength: 32) @immutable
    mentions: [StreamID] @list(maxLength: 10) @immutable
    version: CommitID! @documentVersion
    reflection: StreamID @documentReference(model: "Node") @immutable
    reflectionView: Node @relationDocument(property: "reflection")
    isReply: Boolean @immutable
    active: Boolean!
    createdAt: DateTime! @immutable
    nsfw: Boolean
}

type AkashaReflect implements AkashaReflectInterface
  @createModel(accountRelation: LIST, description: "A Reflection on a Beam v0.3")
  @createIndex(fields:[{path:"active"}, {path:"beamID"}, {path: "createdAt"}, {path: "reflection"}, {path: "isReply"}, {path: "nsfw"}]) {
    beamID: StreamID! @documentReference(model: "AkashaBeamInterface") @immutable
    beam: AkashaBeamInterface! @relationDocument(property: "beamID")
    author: DID! @documentAccount
    content: [ProviderValue!]! @list(maxLength: 10) @immutable
    tags: [String] @list(maxLength: 10) @string(minLength:3, maxLength: 32) @immutable
    mentions: [StreamID] @list(maxLength: 10) @immutable
    version: CommitID! @documentVersion
    reflection: StreamID @documentReference(model: "Node") @immutable
    reflectionView: Node @relationDocument(property: "reflection")
    isReply: Boolean @immutable
    active: Boolean!
    createdAt: DateTime! @immutable
    nsfw: Boolean
}`
}
