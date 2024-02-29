export default function compose(akashaAppId){
 return `type AkashaApp @loadModel(id: "${akashaAppId}") {
  id: ID!
}

type AkashaAppRelease @createModel(accountRelation: LIST, description: "AKASHA Application releases list v0.1") @createIndex(fields:[{path:"version"}, {path: "createdAt"}, {path: "applicationID"}]){
  applicationID: StreamID! @documentReference(model: "AkashaApp")
  application: AkashaApp! @relationDocument(property: "applicationID")
  version: String! @string(minLength:2, maxLength: 16)
  source: CID!
  createdAt: DateTime!
}`
}

