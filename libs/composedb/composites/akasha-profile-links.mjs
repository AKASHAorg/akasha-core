
export default function compose(akashaFollowIdInterface, akashaProfileId){
 return `interface AkashaFollowInterface @loadModel(id: "${akashaFollowIdInterface}") {
  id: ID!
}


type AkashaProfile @loadModel(id: "${akashaProfileId}") {
  id: ID!
  followers: [AkashaFollowInterface] @relationFrom(model: "AkashaFollowInterface", property: "profileID")
  followersCount: Int! @relationCountFrom(model: "AkashaFollowInterface", property: "profileID")
}`
}


