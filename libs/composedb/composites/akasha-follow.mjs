
export default function compose(akashaProfileIdInterface){
  return `interface AkashaProfileInterface @loadModel(id: "${akashaProfileIdInterface}"){
    id: ID!
  }

  interface AkashaFollowInterface
    @createModel(description: "AKASHA Following interface") {
      isFollowing: Boolean!
      profileID: StreamID! @documentReference(model: "AkashaProfileInterface") @immutable
      profile: AkashaProfileInterface! @relationDocument(property: "profileID")
      did: DID! @documentAccount
}

  type AkashaFollow implements AkashaFollowInterface
    @createModel(accountRelation: SET, description: "Following list v0.4.0",  accountRelationFields: ["profileID"])
    @createIndex(fields:[{path:["isFollowing"]}])
    @createIndex(fields:[{path:["profileID"]}])
    @createIndex(fields:[{path:["profileID"]}, {path:["isFollowing"]}])
     {
      isFollowing: Boolean!
      profileID: StreamID! @documentReference(model: "AkashaProfileInterface") @immutable
      profile: AkashaProfileInterface! @relationDocument(property: "profileID")
      did: DID! @documentAccount
  }`
}

