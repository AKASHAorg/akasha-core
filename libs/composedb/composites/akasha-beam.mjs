export default function compose(akashaContentBlockIdInterface, akashaAppIdInterface, akashaAppReleaseIdInterface){
  return `interface AkashaContentBlockInterface @loadModel(id: "${akashaContentBlockIdInterface}") {
  id: ID!
}

interface AkashaAppReleaseInterface @loadModel(id: "${ akashaAppReleaseIdInterface }") {
  id: ID!
}

interface AkashaAppInterface @loadModel(id: "${ akashaAppIdInterface }") {
  id: ID!

}

type BeamBlockRecord{
  order: Int! @int(min: 0, max: 10)
  blockID: StreamID! @documentReference(model: "AkashaContentBlockInterface")
  # block: AkashaContentBlockInterface! @relationDocument(property: "blockID")
}

type BeamEmbeddedType{
  label: String! @string(minLength:3, maxLength: 32)
  embeddedID : StreamID! @documentReference(model: "Node")
  # content: Node! @relationDocument(property: "embeddedID")
}

type BeamLabeled{
  labelType: String! @string(maxLength: 30)
  value: String! @string(minLength:2, maxLength: 60)
}

interface AkashaBeamInterface
 @createModel(description: "AKASHA Beam interface v0.1.0") {
    author: DID! @documentAccount
    content: [BeamBlockRecord!]! @list(maxLength: 10) @immutable
    tags: [BeamLabeled] @list(maxLength: 10) @immutable
    mentions: [DID] @list(maxLength: 10) @immutable
    version: CommitID! @documentVersion
    embeddedStream: BeamEmbeddedType @immutable
    active: Boolean!
    createdAt: DateTime! @immutable
    nsfw: Boolean
    appVersionID: StreamID! @documentReference(model: "AkashaAppReleaseInterface") @immutable
    appVersion: AkashaAppReleaseInterface! @relationDocument(property: "appVersionID")
    appID: StreamID! @documentReference(model: "AkashaAppInterface") @immutable
    app: AkashaAppInterface! @relationDocument(property: "appID")
 }

type AkashaBeam implements AkashaBeamInterface
  @createModel(accountRelation: LIST, description: "AKASHA Beam v0.5.1")
  @createIndex(fields:[{path:["active"]}])
  @createIndex(fields:[{path:["createdAt"]}])
  @createIndex(fields:[{path:["nsfw"]}])
  @createIndex(fields:[{path:["appID"]}])
  @createIndex(fields:[{path:["appVersionID"]}])
  @createIndex(fields:[{path:["active"]}, {path:["createdAt"]}, {path:["nsfw"]}]){
    author: DID! @documentAccount
    content: [BeamBlockRecord!]! @list(maxLength: 10) @immutable
    tags: [BeamLabeled] @list(maxLength: 10) @immutable
    mentions: [DID] @list(maxLength: 10) @immutable
    version: CommitID! @documentVersion
    embeddedStream: BeamEmbeddedType @immutable
    active: Boolean!
    createdAt: DateTime! @immutable
    nsfw: Boolean
    appVersionID: StreamID! @documentReference(model: "AkashaAppReleaseInterface") @immutable
    appVersion: AkashaAppReleaseInterface! @relationDocument(property: "appVersionID")
    appID: StreamID! @documentReference(model: "AkashaAppInterface") @immutable
    app: AkashaAppInterface! @relationDocument(property: "appID")
}
`
}

