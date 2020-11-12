export interface IModule {
  src: string;
  name: string;
  moduleName: string;
}

class ScriptLoader {
  public loadedCount: number;
  public subscribers: { [key: string]: ((module: any) => void)[] };
  private loadedModules: string[];
  constructor() {
    this.loadedCount = 0;
    this.loadedModules = [];
    this.subscribers = {};
  }
  private async loadModule(name: string, moduleName: string) {
    // @ts-ignore
    await __webpack_init_sharing__('default');
    const container: {
      init: () => Promise<any>;
      get: (module: string) => Promise<any>;
    } = window[name];

    // @ts-ignore
    await container.init(__webpack_share_scopes__.default);
    return (await container.get(moduleName))();
  }

  public subscribe(namespace, handler) {
    if (this.subscribers[namespace]) {
      this.subscribers[namespace].push(handler);
    } else {
      this.subscribers[namespace] = [handler];
    }
  }
  private onModuleLoaded(module, namespace) {
    this.subscribers[namespace].forEach(sub => sub(module));
  }
  public async loadModules(modules: IModule[], type) {
    modules.forEach(async module => {
      const { src, name, moduleName } = module;
      try {
        const isLoaded = await this.loadScript(src);
        if (isLoaded) {
          const moduleObject = await this.loadModule(name, moduleName);
          if (!this.loadedModules.includes(src)) {
            this.loadedModules.push(src);
            this.onModuleLoaded(moduleObject, type);
          }
        }
      } catch (err) {
        if (err) {
          console.error(err);
        }
        console.error('failed to load module. Script loading error!', src);
      }
    });
  }
  private async loadScript(script: string) {
    return new Promise((resolve, reject) => {
      const onLoad = () => {
        return resolve(true);
      };
      const onError = () => () => {
        return reject();
      };
      this.writeScript(script, onLoad, onError);
    });
  }

  private writeScript(src: string, onLoad, onError) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = src;
    script.addEventListener('load', onLoad.bind(this));
    script.addEventListener('error', onError(src));
    const head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
  }
}
export default ScriptLoader;
