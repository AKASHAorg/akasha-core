
export default function compose(akashaProfileId){
  return `type AkashaProfile @loadModel(id: "${akashaProfileId}"){
    id: ID!
  }


  type AkashaFollow @createModel(accountRelation: LIST, description: "Following list") @createIndex(fields:[{path:"isFollowing"}]) {
    isFollowing: Boolean!
    profileID: StreamID! @documentReference(model: "AkashaProfile")
    profile: AkashaProfile! @relationDocument(property: "profileID")
    did: DID! @documentAccount
  }`
}

