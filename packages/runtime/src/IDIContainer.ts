// Dependency Injection Container Interface
export default interface IDIContainer {
  getService(serviceName: String | Object): CallableFunction
  register(serviceName: String | Object, service: CallableFunction): void
}
