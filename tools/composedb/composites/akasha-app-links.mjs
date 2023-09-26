export default function compose(akashaAppReleaseId, akashaAppId){
 return `type AkashaAppRelease @loadModel(id: "${akashaAppReleaseId}") {
  id: ID!
}

type AkashaApp @loadModel(id: "${akashaAppId}") {
  id: ID!
  releases: [AkashaAppRelease] @relationFrom(model: "AkashaAppRelease", property: "applicationID")
  releasesCount: Int! @relationCountFrom(model: "AkashaAppRelease", property: "applicationID")
}`
}


