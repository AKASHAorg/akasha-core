export default function compose (
  akashaWorldConfigExtensionInterface,
  akashaApp,
  akashaWorldConfigInterface,
  akashaWorldConfig,
  akashaWorldMetaInfoInterface,
  akashaWorld,
) {

  return `interface AkashaWorldConfigExtensionInterface @loadModel(id: "${ akashaWorldConfigExtensionInterface }") {
    id: ID!
  }


  type AkashaApp @loadModel(id: "${ akashaApp }") {
    id: ID!
    worldConfigs: [AkashaWorldConfigExtensionInterface] @relationFrom(model: "AkashaWorldConfigExtensionInterface", property: "extensionID")
    worldsConfigsCount: Int! @relationCountFrom(model: "AkashaWorldConfigExtensionInterface", property: "extensionID")
  }

  interface AkashaWorldConfigInterface @loadModel(id: "${ akashaWorldConfigInterface }") {
    id: ID!
  }

    interface AkashaWorldMetaInfoInterface @loadModel(id: "${ akashaWorldMetaInfoInterface }") {
    id: ID!
  }

  type AkashaWorldConfig @loadModel(id: "${ akashaWorldConfig }") {
    id: ID!
    extensions: [AkashaWorldConfigExtensionInterface] @relationFrom(model: "AkashaWorldConfigExtensionInterface", property: "worldConfigID")
  }


  type AkashaWorld @loadModel(id: "${ akashaWorld }") {
    id: ID!
    configInfo: [AkashaWorldConfigInterface] @relationFrom(model: "AkashaWorldConfigInterface", property: "worldID")
    metaInfo: [AkashaWorldMetaInfoInterface] @relationFrom(model: "AkashaWorldMetaInfoInterface", property: "worldID")
  }
  `;
}

