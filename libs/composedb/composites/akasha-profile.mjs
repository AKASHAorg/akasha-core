export default function compose(akashaAppIdInterface, akashaAppReleaseIdInterface) {
  return `type ProfileImageSource {
  width: Int! @int(min: 24, max: 8000)
  height: Int! @int(min: 24, max: 8000)
  src: URI!
}
type ProfileImageVersions{
  default: ProfileImageSource!
  alternatives: [ProfileImageSource] @list(maxLength: 12)
}

type ProfileLinkSource{
  label: String @string(maxLength: 24)
  href: URI!
}

type ProfileLabeled{
  labelType: String! @string(maxLength: 30)
  value: String! @string(minLength:2, maxLength: 60)
}

interface AkashaAppReleaseInterface @loadModel(id: "${ akashaAppReleaseIdInterface }") {
  id: ID!
}

interface AkashaAppInterface @loadModel(id: "${ akashaAppIdInterface }") {
  id: ID!

}

interface AkashaProfileInterestsInterface
  @createModel(description: "AKASHA Profile interests interface") {
    topics: [ProfileLabeled!]! @list(maxLength: 100)
    did: DID! @documentAccount
}

type AkashaProfileInterests implements AkashaProfileInterestsInterface
  @createModel(accountRelation: SINGLE, description: "Interests list v0.3.1"){
    topics: [ProfileLabeled!]! @list(maxLength: 100)
    did: DID! @documentAccount
}

interface AkashaProfileInterface @createModel(description: "AKASHA Profile interface v0.1.1") {
  name: String! @string(minLength: 3, maxLength: 50)
  avatar: ProfileImageVersions
  description: String @string(maxLength: 200)
  background: ProfileImageVersions
  links: [ProfileLinkSource] @list(maxLength: 20)
  did: DID! @documentAccount
  createdAt: DateTime! @immutable
  nsfw: Boolean @immutable
  appVersionID: StreamID! @documentReference(model: "AkashaAppReleaseInterface") @immutable
  appVersion: AkashaAppReleaseInterface! @relationDocument(property: "appVersionID")
  appID: StreamID! @documentReference(model: "AkashaAppInterface") @immutable
  app: AkashaAppInterface! @relationDocument(property: "appID")
}

type AkashaProfile implements AkashaProfileInterface
  @createModel(accountRelation: SINGLE, description: "AKASHA profile v0.5.1")
  @createIndex(fields:[{path:["name"]}])
  @createIndex(fields:[{path:["createdAt"]}])
  @createIndex(fields:[{path:["nsfw"]}])
  @createIndex(fields:[{path:["nsfw"]}, {path:["createdAt"]}, {path:["name"]}])
{
    name: String! @string(minLength: 3, maxLength: 50)
    avatar: ProfileImageVersions
    description: String @string(maxLength: 200)
    background: ProfileImageVersions
    links: [ProfileLinkSource] @list(maxLength: 20)
    did: DID! @documentAccount
    createdAt: DateTime! @immutable
    nsfw: Boolean @immutable
    appVersionID: StreamID! @documentReference(model: "AkashaAppReleaseInterface") @immutable
    appVersion: AkashaAppReleaseInterface! @relationDocument(property: "appVersionID")
    appID: StreamID! @documentReference(model: "AkashaAppInterface") @immutable
    app: AkashaAppInterface! @relationDocument(property: "appID")
}
`
}
