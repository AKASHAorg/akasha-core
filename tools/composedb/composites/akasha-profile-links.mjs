
export default function compose(akashaFollowId, akashaProfileId){
 return `type AkashaFollow @loadModel(id: "${akashaFollowId}") {
  id: ID!
}


type AkashaProfile @loadModel(id: "${akashaProfileId}") {
  id: ID!
  followers: [AkashaFollow] @relationFrom(model: "AkashaFollow", property: "profileID")
  followersCount: Int! @relationCountFrom(model: "AkashaFollow", property: "profileID")
}`
}


