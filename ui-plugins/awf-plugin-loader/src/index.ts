import * as singleSpa from "single-spa"

export interface IPlugin {
  name: string
  services: Array<any>
  loadingFn: () => Promise<any>
  activeWhen: (location: Location) => boolean
}

class AppLoader {
  config: object
  plugins: IPlugin[]
  constructor(config: object) {
    this.config = config
    this.plugins = []
  }
  registerPlugin(plugin: IPlugin, pluginConfig?: any): void {
    this.plugins.push(plugin)
    if (this._validatePlugin(plugin)) {
      const pluginId = plugin.name.toLowerCase().replace(" ", "-")
      let domEl = document.getElementById(`${pluginId}`)
      const rootEl = document.getElementById("root")
      if (!domEl && rootEl) {
        domEl = document.createElement("div")
        domEl.id = pluginId
        rootEl.appendChild(domEl)
      }
      singleSpa.registerApplication(plugin.name, plugin.loadingFn, plugin.activeWhen, {
        ...this.config,
        ...pluginConfig,
        domElement: domEl,
      })
      console.info(`[awf-plugin-loader]: ${plugin.name} registered!`)
    } else {
      throw new Error(`[awf-plugin-loader]: Plugin ${plugin.name} is not valid`)
    }
  }
  _validatePlugin(plugin: IPlugin): boolean {
    if (Array.isArray(plugin.services)) {
      // check services and return false if they are not ok
      return true
    }
    return true
  }
  start() {
    console.info("[awf-plugin-loader]: starting single spa")
    singleSpa.start()
  }
}

export default AppLoader
