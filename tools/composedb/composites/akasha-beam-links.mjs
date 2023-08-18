export default function compose (akashaBeamId, akashaReflectId) {
    return `
type AkashaReflect @loadModel(id: "${akashaReflectId}") {
  id: ID!
}

type AkashaBeam @loadModel(id: "${akashaBeamId}") {
  id: ID!
  reflections: [AkashaReflect] @relationFrom(model: "AkashaReflect", property: "beamID")
  reflectionsCount: Int! @relationCountFrom(model: "AkashaReflect", property: "beamID")
}
`
}
