
export default function compose(akashaProfileId){
  return `type AkashaProfile @loadModel(id: "${akashaProfileId}"){
    id: ID!
  }


  type AkashaFollow @createModel(accountRelation: SET, description: "Following list v0.2",  accountRelationFields: ["profileID"]) @createIndex(fields:[{path:"isFollowing"}, {path:"profileID"}]) {
    isFollowing: Boolean!
    profileID: StreamID! @documentReference(model: "AkashaProfile")
    profile: AkashaProfile! @relationDocument(property: "profileID")
    did: DID! @documentAccount
  }`
}

