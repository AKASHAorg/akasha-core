export default function compose(akashaAppIdInterface){
 return `interface AkashaAppInterface @loadModel(id: "${akashaAppIdInterface}") {
  id: ID!
}

type AppProviderValue{
  provider: String! @string(minLength: 6, maxLength: 100)
  property: String! @string(minLength: 2, maxLength: 40)
  value: String! @string(minLength: 3, maxLength: 2000)
}

interface AkashaAppReleaseInterface
  @createModel(description: "AKASHA Application releases interface") {
    applicationID: StreamID! @documentReference(model: "AkashaAppInterface")
    application: AkashaAppInterface! @relationDocument(property: "applicationID") @immutable
    version: String! @string(minLength:2, maxLength: 16) @immutable
    source: URI! @immutable
    createdAt: DateTime! @immutable
    meta: [AppProviderValue] @list(maxLength: 16)
}

type AkashaAppRelease implements AkashaAppReleaseInterface
  @createModel(accountRelation: SET, description: "AKASHA Application releases list v0.3.1", accountRelationFields: ["applicationID", "version"])
  @createIndex(fields:[{path:"version"}])
  @createIndex(fields:[{path:"createdAt"}])
  @createIndex(fields:[{path:"applicationID"}]){
    applicationID: StreamID! @documentReference(model: "AkashaAppInterface")
    application: AkashaAppInterface! @relationDocument(property: "applicationID") @immutable
    version: String! @string(minLength:2, maxLength: 16) @immutable
    source: URI! @immutable
    createdAt: DateTime! @immutable
    meta: [AppProviderValue] @list(maxLength: 16)
}`
}

