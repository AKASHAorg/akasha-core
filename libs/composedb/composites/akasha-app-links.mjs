export default function compose(akashaAppReleaseIdInterface, akashaAppId){
 return `interface AkashaAppReleaseInterface @loadModel(id: "${akashaAppReleaseIdInterface}") {
  id: ID!
}

type AkashaApp @loadModel(id: "${akashaAppId}") {
  id: ID!
  releases: [AkashaAppReleaseInterface] @relationFrom(model: "AkashaAppReleaseInterface", property: "applicationID")
  releasesCount: Int! @relationCountFrom(model: "AkashaAppReleaseInterface", property: "applicationID")
}`
}


