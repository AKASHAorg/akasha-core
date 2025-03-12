export default function compose (akashaAppInterface, akashaWorldConfigInterface) {
  return `interface AkashaAppInterface @loadModel(id: "${ akashaAppInterface }") {
    id: ID!
  }

  interface AkashaWorldConfigInterface @loadModel(id: "${ akashaWorldConfigInterface }") {
    id: ID!
  }

  interface AkashaWorldConfigExtensionInterface
  @createModel(
    description: "Extension Interface defined for a world v0.1"
  )
  {
    createdAt: DateTime! @immutable
    creator: DID! @documentAccount
    active: Boolean!

    worldConfigID: StreamID! @documentReference(model: "AkashaWorldConfigInterface") @immutable
    worldConfig: AkashaWorldConfigInterface! @relationDocument(property: "worldConfigID")

    extensionID: StreamID! @documentReference(model: "AkashaAppInterface") @immutable
    extension: AkashaAppInterface! @relationDocument(property: "extensionID")

    type: String @string(maxLength: 48)
    optional: Boolean

    position: Int @int(max: 1000)
  }


  type AkashaWorldConfigExtension implements AkashaWorldConfigExtensionInterface
  @createModel(
    accountRelation: SET,
    accountRelationFields: ["extensionID", "worldConfigID"],
    description: "Extension defined for a world v0.1"
  )
  @createIndex(fields:[{path:["createdAt"]}])
  @createIndex(fields:[{path:["worldConfigID"]}])
  @createIndex(fields:[{path:["extensionID"]}])
  @createIndex(fields:[{path:["type"]}])
  @createIndex(fields:[{path:["active"]}])
  @createIndex(fields:[{path:["optional"]}])
  @createIndex(fields:[{path:["position"]}])
  {
    createdAt: DateTime! @immutable
    creator: DID! @documentAccount
    active: Boolean!

    worldConfigID: StreamID! @documentReference(model: "AkashaWorldConfigInterface") @immutable
    worldConfig: AkashaWorldConfigInterface! @relationDocument(property: "worldConfigID")

    extensionID: StreamID! @documentReference(model: "AkashaAppInterface") @immutable
    extension: AkashaAppInterface! @relationDocument(property: "extensionID")

    type: String @string(maxLength: 48) # ex: PROFILE, AUTH, MODERATION, SOCIAL, NOTIFICATIONS
    optional: Boolean

    position: Int @int(max: 1000)
  }
  `;
}
