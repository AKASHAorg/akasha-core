export default function compose (akashaAppInterface, akashaWorldInterface) {
  return `interface AkashaAppInterface @loadModel(id: "${ akashaAppInterface }") {
    id: ID!
  }

  interface AkashaWorldInterface @loadModel(id: "${ akashaWorldInterface }") {
    id: ID!
  }

  interface AkashaWorldConfigInterface
  @createModel(
    description: "AKASHA World Config interface"
  )
  {
    createdAt: DateTime! @immutable
    creator: DID! @documentAccount
    active: Boolean!

    homepageExtension: StreamID! @documentReference(model: "AkashaAppInterface")
    layoutExtension: StreamID! @documentReference(model: "AkashaAppInterface")
    registryExtension: StreamID! @documentReference(model: "AkashaAppInterface")

    worldID: StreamID! @documentReference(model: "AkashaWorldInterface") @immutable
    world: AkashaWorldInterface! @relationDocument(property: "worldID")
  }

  type AkashaWorldConfig implements AkashaWorldConfigInterface
  @createModel(
    accountRelation: SET,
    accountRelationFields: ["worldID", "active"],
    description: "AKASHA World Config"
  )
  @createIndex(fields:[{path:["active"]}])
  @createIndex(fields:[{path:["createdAt"]}])
  @createIndex(fields:[{path:["worldID"]}])
  @createIndex(fields:[{path:["homepageExtension"]}])
  @createIndex(fields:[{path:["layoutExtension"]}])
  @createIndex(fields:[{path:["registryExtension"]}])
  {
    createdAt: DateTime! @immutable
    creator: DID! @documentAccount
    active: Boolean!

    homepageExtension: StreamID! @documentReference(model: "AkashaAppInterface")
    layoutExtension: StreamID! @documentReference(model: "AkashaAppInterface")
    registryExtension: StreamID! @documentReference(model: "AkashaAppInterface")

    worldID: StreamID! @documentReference(model: "AkashaWorldInterface") @immutable
    world: AkashaWorldInterface! @relationDocument(property: "worldID")
  }

  type SocialLink{
    name: String! @string(minLength: 2, maxLength: 48)
    href: URI!
  }

  interface AkashaWorldMetaInfoInterface
  @createModel(
    description: "Meta Info Interface for a world"
  )
  {
    description: String @string(minLength: 3, maxLength: 420)
    keywords: [String] @string(maxLength: 48) @list(maxLength: 32)

    guidelinesUrl: URI

    socialLinks: [SocialLink] @list(maxLength: 12)

    worldID: StreamID! @documentReference(model: "AkashaWorldInterface") @immutable
    world: AkashaWorldInterface! @relationDocument(property: "worldID")
  }

  type AkashaWorldMetaInfo implements AkashaWorldMetaInfoInterface
  @createModel(
    accountRelation: SET,
    description: "Meta Info for a world",
    accountRelationFields: ["worldID"]
  )
  @createIndex(fields:[{ path:["guidelinesUrl"]}])
  @createIndex(fields: [{ path: ["worldID"] }])
  {
    description: String @string(minLength: 3, maxLength: 420)
    keywords: [String] @string(maxLength: 48) @list(maxLength: 32) # the indexing should happen afterwards

    guidelinesUrl: URI

    socialLinks: [SocialLink] @list(maxLength: 12)

    worldID: StreamID! @documentReference(model: "AkashaWorldInterface") @immutable
    world: AkashaWorldInterface! @relationDocument(property: "worldID")
  }
  `;
}
