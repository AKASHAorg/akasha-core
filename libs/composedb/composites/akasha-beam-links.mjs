export default function compose (akashaBeamId, akashaReflectIdInterface) {
    return `
interface AkashaReflectInterface @loadModel(id: "${akashaReflectIdInterface}") {
  id: ID!
}

type AkashaBeam @loadModel(id: "${akashaBeamId}") {
  id: ID!
  reflections: [AkashaReflectInterface] @relationFrom(model: "AkashaReflectInterface", property: "beamID")
  reflectionsCount: Int! @relationCountFrom(model: "AkashaReflectInterface", property: "beamID")
}
`
}
