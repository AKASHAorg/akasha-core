(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === 'object' && typeof module === 'object') module.exports = factory();
  else if (typeof define === 'function' && define.amd) define('AkashaSDK', [], factory);
  else if (typeof exports === 'object') exports['AkashaSDK'] = factory();
  else root['AkashaSDK'] = factory();
})(window, function() {
  return (window['webpackJsonpAkashaSDK'] = window['webpackJsonpAkashaSDK'] || []).push([
    [0],
    {
      /***/ 0: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 1: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 10: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 11: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 12: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 13: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 14: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 15: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 16: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 17: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 18: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 19: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ '1B2A': /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        const tslib_1 = __webpack_require__('D57K');

        const R = tslib_1.__importStar(__webpack_require__('BrWA'));

        const utils_1 = __webpack_require__('L8uV'); // base class that should be extended in order to create an AKASHA sdk module

        class IAkashaModule {
          constructor() {
            this.logger = utils_1.logger.child({
              sdkModule: this.name,
            });
          }

          get name() {
            return this._name();
          }

          static getServiceName(moduleName, providerName) {
            return `${moduleName}=>${providerName}`;
          }

          static exportToChannel(serviceNames, serviceRegistry) {
            return R.pick(serviceNames, serviceRegistry);
          }

          wrapService(service, name) {
            const registeredMethods = service;
            const log = this.logger; // calls .bind.apply which is incompatible with ()=>
            // tslint:disable-next-line:only-arrow-functions

            return function() {
              log.info(`service < ${name} > was initialized.`);
              return registeredMethods();
            };
          }

          startServices(di) {
            this.init(di);

            const services = this._registerServices(di);

            for (const provider of services) {
              const providerInit = utils_1.toNamedService(provider.name, provider.service);
              const serviceMethods = providerInit.service(
                utils_1.callService(di),
                this.logger.child({
                  service: providerInit.name,
                }),
              );
              const wrappedService = this.wrapService(
                utils_1.registerServiceMethods(serviceMethods),
                providerInit.name,
              );
              const serviceName = IAkashaModule.getServiceName(this.name, providerInit.name);
              di.register(serviceName, wrappedService);
            }
          }
        }

        exports.IAkashaModule = IAkashaModule;

        /***/
      },

      /***/ '1sNp': /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        const tslib_1 = __webpack_require__('D57K');

        const jsonschema_web3_1 = tslib_1.__importDefault(__webpack_require__('9iH2'));

        const constants_1 = __webpack_require__('Uc15');

        const service = (invoke, log) => {
          const validator = new jsonschema_web3_1.default();

          const getValidator = async () => validator;

          return {
            getValidator,
          };
        };

        exports.default = {
          name: constants_1.VALIDATOR_SERVICE,
          service,
        };

        /***/
      },

      /***/ 2: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 20: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 21: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 22: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 23: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 24: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 25: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 26: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 27: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 28: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 29: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ '2SgV': /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        const constants_1 = __webpack_require__('WERN');

        const settings = [
          [constants_1.DB_SYNC_ENDPOINT, 'http://localhost:3000/db'],
          [constants_1.DB_NAME, 'akashadb_alpha0'],
          [constants_1.DB_PASSWORD, 'SOMELONGPASSWORD123asdasdasda'],
        ];
        exports.default = settings;

        /***/
      },

      /***/ 3: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 30: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 31: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 32: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 33: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 34: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 35: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 36: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 37: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 38: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ '3T4H': /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });
        const settingsSchema = {
          title: 'settings schema',
          description: 'contains all the application settings for each ethAddress',
          version: 0,
          type: 'object',
          properties: {
            ethAddress: {
              type: 'string',
              index: true,
            },
            moduleName: {
              type: 'string',
            },
            services: {
              type: 'array',
              uniqueItems: true,
              items: {
                type: 'array',
                maxItems: 2,
                minItems: 2,
                items: {
                  type: 'string',
                  encrypted: true,
                },
              },
            },
          },
          attachments: {
            encrypted: true,
          },
        };
        exports.default = settingsSchema;

        /***/
      },

      /***/ 4: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ '4JNR': /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        const tslib_1 = __webpack_require__('D57K');

        const constants_1 = tslib_1.__importDefault(__webpack_require__('Bd5f'));

        const IAkashaModule_1 = __webpack_require__('1B2A');

        const utils_1 = __webpack_require__('L8uV');

        const cache_service_1 = tslib_1.__importDefault(__webpack_require__('VDE/'));

        const constants_2 = tslib_1.__importStar(__webpack_require__('Uc15'));

        const ipfs_service_1 = tslib_1.__importDefault(__webpack_require__('ADmB'));

        const settings_1 = tslib_1.__importDefault(__webpack_require__('e3Mj'));

        const validator_service_1 = tslib_1.__importDefault(__webpack_require__('1sNp'));

        const web3_utils_service_1 = tslib_1.__importDefault(__webpack_require__('rmAn'));

        const web3_service_1 = tslib_1.__importDefault(__webpack_require__('SXg7'));

        class CommonsModule extends IAkashaModule_1.IAkashaModule {
          async init(di) {
            const settingsObj = {
              moduleName: constants_2.moduleName,
              values: settings_1.default,
            };
            const { setSettings } = utils_1.callService(di)(constants_1.default.SETTINGS_SERVICE);
            setSettings(settingsObj);
          }

          availableServices() {
            return IAkashaModule_1.IAkashaModule.exportToChannel(
              [
                constants_2.WEB3_UTILS_SERVICE,
                constants_2.VALIDATOR_SERVICE,
                constants_2.WEB3_SERVICE,
              ],
              constants_2.default,
            );
          }

          _name() {
            return constants_2.moduleName;
          }

          _registerServices(di) {
            return [
              cache_service_1.default,
              ipfs_service_1.default,
              validator_service_1.default,
              web3_service_1.default,
              web3_utils_service_1.default,
            ];
          }
        }

        exports.CommonsModule = CommonsModule;

        function registerModule() {
          return new CommonsModule();
        }

        exports.default = registerModule;

        /***/
      },

      /***/ 5: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 6: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 7: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ '7E9Q': /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        const tslib_1 = __webpack_require__('D57K');

        const constants_1 = tslib_1.__importDefault(__webpack_require__('Bd5f'));

        const IAkashaModule_1 = __webpack_require__('1B2A');

        const utils_1 = __webpack_require__('L8uV');

        const constants_2 = tslib_1.__importStar(__webpack_require__('WERN'));

        const db_service_1 = tslib_1.__importDefault(__webpack_require__('T0n4'));

        const settings_1 = tslib_1.__importDefault(__webpack_require__('2SgV'));

        const settings_attachment_service_1 = tslib_1.__importDefault(__webpack_require__('LTux'));

        class DBModule extends IAkashaModule_1.IAkashaModule {
          availableServices() {
            return IAkashaModule_1.IAkashaModule.exportToChannel(
              [constants_2.DB_SETTINGS_ATTACHMENT],
              constants_2.default,
            );
          }

          _name() {
            return constants_2.moduleName;
          }

          _registerServices(di) {
            return [db_service_1.default, settings_attachment_service_1.default];
          }

          init(di) {
            const settingsObj = {
              moduleName: constants_2.moduleName,
              values: settings_1.default,
            };
            const { setSettings } = utils_1.callService(di)(constants_1.default.SETTINGS_SERVICE);
            setSettings(settingsObj);
          }
        }

        exports.DBModule = DBModule;

        function registerModule() {
          return new DBModule();
        }

        exports.default = registerModule;

        /***/
      },

      /***/ 8: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ 9: /***/ function(module, exports) {
        /* (ignored) */
        /***/
      },

      /***/ '9N3V': /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        const tslib_1 = __webpack_require__('D57K');

        const DIContainer_1 = tslib_1.__importDefault(__webpack_require__('yE3s'));

        const R = tslib_1.__importStar(__webpack_require__('BrWA'));

        const constants_1 = __webpack_require__('Bd5f');

        const IAkashaModule_1 = __webpack_require__('1B2A');

        const settings_service_1 = tslib_1.__importDefault(__webpack_require__('q0yz'));

        class CoreModule extends IAkashaModule_1.IAkashaModule {
          availableServices() {
            return {};
          } // tslint:disable-next-line:no-empty

          init(di) {
            R.T();
          }

          _registerServices() {
            return [settings_service_1.default];
          }

          _name() {
            return constants_1.moduleName;
          }
        } // create the dependency injection container and the cache list handler

        function bootstrapFactory() {
          const di = new DIContainer_1.default();
          const coreModule = new CoreModule();
          coreModule.startServices(di); // these instances are required to instantiate the packages used for building the akasha-sdk

          return di;
        }

        exports.default = bootstrapFactory;

        /***/
      },

      /***/ '9zGa': /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        const rxjs_1 = __webpack_require__('DtyJ'); // service consumer

        function callService(service, payload) {
          return rxjs_1.defer(() => {
            return rxjs_1.scheduled(rxjs_1.from(service(payload)), rxjs_1.asapScheduler);
          });
        }

        exports.default = callService;

        /***/
      },

      /***/ ADmB: /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        const tslib_1 = __webpack_require__('D57K');

        const constants_1 = tslib_1.__importStar(__webpack_require__('Uc15')); // import ipfsSettings from './ipfs.settings';
        // tslint:disable-next-line:no-var-requires

        const IPFS = __webpack_require__('11t/');

        const service = (invoke, log) => {
          const getInstance = async refresh => {
            let ipfsNode;
            const stash = await invoke(constants_1.default[constants_1.CACHE_SERVICE]).getStash();
            ipfsNode = stash.get(constants_1.default[constants_1.IPFS_SERVICE]);

            if (ipfsNode && !refresh) {
              log.info('reusing existing ipfs instance');
              return ipfsNode;
            }

            ipfsNode = await IPFS.create({
              start: false,
            });
            stash.set(constants_1.default[constants_1.IPFS_SERVICE], ipfsNode);
            log.info('ipfs node instantiated');
            return ipfsNode;
          };

          return {
            getInstance,
          };
        };

        exports.default = {
          name: constants_1.IPFS_SERVICE,
          service,
        };

        /***/
      },

      /***/ BTOX: /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        }); // tslint:disable-next-line:no-var-requires

        const LRU = __webpack_require__('p/lO');

        class Stash {
          constructor(options) {
            this.cache = new LRU(options);
          }

          get entries() {
            return this.cache;
          }

          get(key) {
            return this.cache.get(key);
          }

          set(key, value) {
            this.cache.set(key, value);
          }

          remove(key) {
            this.cache.del(key);
          }
        }

        exports.default = Stash;

        /***/
      },

      /***/ Bd5f: /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        const utils_1 = __webpack_require__('L8uV');

        exports.SETTINGS_SERVICE = 'SETTINGS_SERVICE';
        exports.moduleName = 'core';
        const servicePath = utils_1.buildServicePath(exports.moduleName);
        const services = Object.freeze({
          [exports.SETTINGS_SERVICE]: servicePath(exports.SETTINGS_SERVICE),
        });
        exports.default = services;

        /***/
      },

      /***/ 'C/Fq': /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });
        /**
         *
         * @param servicePath
         */

        const channelCaller = servicePath => {
          return {
            get(target, property) {
              return target(servicePath, property);
            },
          };
        }; // ex createCallableService(["module", "SERVICE"], {send(path, payload)=>true)
        // returns callable = { service: ProxyService }
        // can be used like: callable.service(payload)

        function createCallableService(servicePath, channelSend) {
          const handler = channelCaller(servicePath);
          return new Proxy(channelSend, handler);
        }

        exports.createCallableService = createCallableService;
        /**
         *
         * @param currentModule
         * @param channelSend
         */

        function extractCallableServices(currentModule, channelSend) {
          const exportedCommonServices = {};
          const services = currentModule.availableServices();

          for (const serviceName of Object.keys(services)) {
            const servicePath = services[serviceName];
            exportedCommonServices[serviceName.toLowerCase()] = createCallableService(
              servicePath,
              channelSend,
            );
          }

          return {
            [currentModule.name]: exportedCommonServices,
          };
        }

        exports.extractCallableServices = extractCallableServices;
        /**
         *
         * @param modules
         * @param channelSend
         */

        function buildModuleServiceChannels(modules, channelSend) {
          const channels = {};

          for (const currentModule of modules) {
            const extractedServices = extractCallableServices(currentModule, channelSend);
            Object.assign(channels, extractedServices);
          }

          return channels;
        }

        exports.buildModuleServiceChannels = buildModuleServiceChannels;

        function startServices(modules, di) {
          for (const moduleInstance of modules) {
            moduleInstance.startServices(di);
          }
        }

        exports.startServices = startServices;

        /***/
      },

      /***/ L8uV: /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        const tslib_1 = __webpack_require__('D57K');

        const pino_1 = tslib_1.__importDefault(__webpack_require__('gh0z'));

        const R = tslib_1.__importStar(__webpack_require__('BrWA'));

        const IAkashaModule_1 = __webpack_require__('1B2A');

        exports.logger = pino_1.default({
          browser: {
            asObject: true,
          },
        }); // to not import explicit the module interface just for getting the serviceName

        function getServiceName(service) {
          return R.identity(
            IAkashaModule_1.IAkashaModule.getServiceName(service.moduleName, service.providerName),
          );
        }

        exports.getServiceName = getServiceName; // ex: getService(di, ["commons_module", "ipfs"])

        function getService(di, servicePath) {
          const [moduleName, providerName] = servicePath;
          return R.identity(
            di.getService(
              getServiceName({
                moduleName,
                providerName,
              }),
            ),
          );
        }

        exports.getService = getService; // execute call on service function

        function _callService(di, servicePath) {
          const service = getService(di, servicePath);
          return R.identity(service);
        }

        function callService(di) {
          return R.curry(_callService)(di);
        }

        exports.callService = callService;

        function toNamedService(name, service) {
          if (!name || !service) {
            throw new Error(`Service ${name} must provide name and service attributes`);
          }

          return R.identity(
            Object.freeze({
              name,
              service,
            }),
          );
        }

        exports.toNamedService = toNamedService;

        function registerServiceMethods(methods) {
          return R.partial(R.identity, [Object.freeze(methods)]);
        }

        exports.registerServiceMethods = registerServiceMethods;

        function _buildServicePath(moduleName, serviceName) {
          return [moduleName, serviceName];
        }

        function buildServicePath(moduleName) {
          return R.curry(_buildServicePath)(moduleName);
        }

        exports.buildServicePath = buildServicePath; // create a function around an object type service

        function createServiceMethod(method) {
          return R.partial(R.identity, [method]);
        }

        exports.createServiceMethod = createServiceMethod;

        function invokeServiceMethod(method) {
          return R.curry(R.invoker(1, method));
        }

        exports.invokeServiceMethod = invokeServiceMethod;

        function _callServiceMethod(di, servicePath, method, args) {
          const service = callService(di)(servicePath);
          const callMethod = invokeServiceMethod(method);
          return callMethod(args, service);
        }

        exports.callServiceMethod = R.curry(_callServiceMethod); // es2019

        function fromEntries(entries) {
          return R.fromPairs(entries);
        }

        exports.fromEntries = fromEntries;

        function toEntries(obj) {
          return R.toPairs(obj);
        }

        exports.toEntries = toEntries;

        function toCurried(fn) {
          return R.curry(fn);
        }

        exports.toCurried = toCurried;

        /***/
      },

      /***/ L9ln: /***/ function(module, exports, __webpack_require__) {
        'use strict';
        // inspired from https://github.com/web3connect/web3connect

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        exports.ConnectToInjected = async () => {
          let provider = null;
          const currentWindow = window;

          if (currentWindow.ethereum) {
            provider = currentWindow.ethereum;

            try {
              await currentWindow.ethereum.enable();
            } catch (error) {
              throw new Error('User Rejected');
            }
          } else if (currentWindow.web3) {
            provider = currentWindow.web3.currentProvider;
          } else {
            throw new Error('No Web3 Provider found');
          }

          return provider;
        };

        function getChainId(network) {
          const infuraChainIds = {
            mainnet: 1,
            ropsten: 3,
            rinkeby: 4,
            goerli: 5,
            kovan: 42,
          };
          const chainId = infuraChainIds[network];

          if (!chainId) {
            throw new Error(`Invalid or unknown chainId for network=${network}`);
          }

          return chainId;
        }

        exports.ConnectToWalletConnect = (WalletConnectProvider, opts) => {
          return new Promise(async (resolve, reject) => {
            let bridge = 'https://bridge.walletconnect.org';
            let qrcode = true;
            let infuraId = '';
            let chainId = 1;

            if (opts) {
              bridge = opts.bridge || bridge;
              qrcode = typeof opts.qrcode !== 'undefined' ? opts.qrcode : qrcode;
              infuraId = opts.infuraId || '';
              chainId = opts.network ? getChainId(opts.network) : 1;
            }

            const provider = new WalletConnectProvider({
              bridge,
              qrcode,
              infuraId,
              chainId,
            });
            await provider.enable();
            resolve(provider);
          });
        };

        /***/
      },

      /***/ LTux: /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        const tslib_1 = __webpack_require__('D57K');

        const settings_1 = tslib_1.__importDefault(__webpack_require__('aOj4'));

        const constants_1 = tslib_1.__importStar(__webpack_require__('WERN'));

        const settings_attachment_1 = __webpack_require__('voiI');

        const service = (invoke, log) => {
          const { getDB } = invoke(constants_1.default[constants_1.DB_SERVICE]); // @Todo: get address from current session

          const getSettingsDoc = async ethAddress => {
            const akashaDB = await getDB();
            const settingsDoc = await akashaDB[settings_1.default.name]
              .findOne({
                $and: [
                  {
                    moduleName: {
                      $eq: constants_1.moduleName,
                    },
                  },
                  {
                    ethAddress: {
                      $eq: ethAddress,
                    },
                  },
                ],
              })
              .exec();
            return settingsDoc;
          }; // @Todo: add initial record if there are no results
          // idea: when you run for the first time the sdk there should be an initial migration

          const get = async args => {
            const settingsDoc = await getSettingsDoc(args.ethAddress);

            if (settingsDoc) {
              return settings_attachment_1.getSettingsAttachment(settingsDoc, args.id);
            }

            return settingsDoc;
          };

          const put = async args => {
            const settingsDoc = await getSettingsDoc(args.ethAddress);
            return settings_attachment_1.putSettingsAttachment(settingsDoc, args.obj);
          };

          const deleteSettings = async args => {
            const settingsDoc = await getSettingsDoc(args.ethAddress);
            return settings_attachment_1.removeSettingAttachment(settingsDoc, args.id);
          };

          return {
            get,
            put,
            deleteSettings,
          };
        };

        exports.default = {
          name: constants_1.DB_SETTINGS_ATTACHMENT,
          service,
        };

        /***/
      },

      /***/ SXg7: /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        const tslib_1 = __webpack_require__('D57K');

        const constants_1 = tslib_1.__importDefault(__webpack_require__('Bd5f'));

        const ethers_1 = __webpack_require__('xhKp');

        const constants_2 = __webpack_require__('Uc15');

        const constants_3 = tslib_1.__importStar(__webpack_require__('Uc15'));

        const provider_1 = tslib_1.__importDefault(__webpack_require__('YdJJ'));

        const service = (invoke, log) => {
          const regen = async provider => {
            const cacheService = invoke(constants_3.default[constants_3.CACHE_SERVICE]);
            log.info('returning a new ethers provider instance');
            const { getSettings } = invoke(constants_1.default.SETTINGS_SERVICE);
            const web3Provider = await provider_1.default(getSettings, provider);
            const stash = await cacheService.getStash();
            stash.set(constants_3.default[constants_2.WEB3_SERVICE], web3Provider);
            return web3Provider;
          }; // to force regen() on the next web3 call

          const destroy = async () => {
            const stash = await invoke(constants_3.default[constants_3.CACHE_SERVICE]).getStash();
            stash.remove(constants_3.default[constants_2.WEB3_SERVICE]);
          }; // fetch an existing instance or create web3Provider

          const web3 = async provider => {
            const stash = await invoke(constants_3.default[constants_3.CACHE_SERVICE]).getStash();
            const web3Provider = stash.get(constants_3.default[constants_2.WEB3_SERVICE]);

            if (!web3Provider) {
              return await regen(provider);
            }

            log.info('reusing an existing ethers provider instance');
            return web3Provider;
          };

          const getWeb3Instance = async () => {
            const stash = await invoke(constants_3.default[constants_3.CACHE_SERVICE]).getStash();
            return stash.get(constants_3.default[constants_2.WEB3_SERVICE]);
          }; // wrapper

          const wallet = async () => ethers_1.ethers.Wallet;

          return {
            regen,
            destroy,
            wallet,
            web3,
            getWeb3Instance,
          };
        };

        exports.default = {
          name: constants_2.WEB3_SERVICE,
          service,
        };

        /***/
      },

      /***/ T0n4: /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        const tslib_1 = __webpack_require__('D57K');

        const constants_1 = tslib_1.__importDefault(__webpack_require__('Bd5f'));

        const rxdb_1 = tslib_1.__importDefault(__webpack_require__('5nT9'));

        const collections_1 = tslib_1.__importDefault(__webpack_require__('shJP'));

        const constants_2 = __webpack_require__('WERN');

        const connect_1 = tslib_1.__importDefault(__webpack_require__('abl0'));

        const service = (invoke, log) => {
          let akashaDB;

          const dbConnect = async (refresh = false) => {
            if (!refresh && rxdb_1.default.isRxDatabase(akashaDB)) {
              log.info('reusing existing DB connection');
              return akashaDB;
            }

            const { getSettings } = invoke(constants_1.default.SETTINGS_SERVICE);
            const dbSettings = await getSettings(constants_2.moduleName);

            if (!dbSettings.hasOwnProperty(constants_2.DB_PASSWORD)) {
              throw new Error('Set a db password before using the service.');
            }

            const db = await connect_1.default(
              dbSettings[constants_2.DB_NAME],
              dbSettings[constants_2.DB_PASSWORD],
            );
            akashaDB = await collections_1.default(db);
            return akashaDB;
          };

          return {
            getDB: dbConnect,
          };
        };

        exports.default = {
          name: constants_2.DB_SERVICE,
          service,
        };

        /***/
      },

      /***/ Uc15: /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        const utils_1 = __webpack_require__('L8uV');

        exports.VALIDATOR_SERVICE = 'VALIDATOR_SERVICE';
        exports.CACHE_SERVICE = 'CACHE_SERVICE';
        exports.WEB3_SERVICE = 'WEB3_SERVICE';
        exports.WEB3_WALLET_SERVICE = 'WEB3_WALLET_SERVICE';
        exports.WEB3_UTILS_SERVICE = 'WEB3_UTILS_SERVICE';
        exports.IPFS_SERVICE = 'IPFS_SERVICE';
        var EthProviders;

        (function(EthProviders) {
          EthProviders[(EthProviders['None'] = 0)] = 'None';
          EthProviders[(EthProviders['Web3Injected'] = 1)] = 'Web3Injected';
          EthProviders[(EthProviders['WalletConnect'] = 2)] = 'WalletConnect';
        })((EthProviders = exports.EthProviders || (exports.EthProviders = {}))); // ethereum chain id

        exports.ETH_NETWORK = 'eth_network'; // used for displaying images

        exports.IPFS_GATEWAY = 'ipfs_gateway'; // value to check when the web3 connector should connect to the existing web3 provider(like Metamask)

        exports.WEB3_PROVIDER = 'WEB3_PROVIDER';
        exports.moduleName = 'commons';
        const servicePath = utils_1.buildServicePath(exports.moduleName); // for service consumers

        const services = {
          [exports.VALIDATOR_SERVICE]: servicePath(exports.VALIDATOR_SERVICE),
          [exports.CACHE_SERVICE]: servicePath(exports.CACHE_SERVICE),
          [exports.WEB3_SERVICE]: servicePath(exports.WEB3_SERVICE),
          [exports.WEB3_UTILS_SERVICE]: servicePath(exports.WEB3_UTILS_SERVICE),
          [exports.IPFS_SERVICE]: servicePath(exports.IPFS_SERVICE),
        };
        exports.default = services;

        /***/
      },

      /***/ 'VDE/': /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        const tslib_1 = __webpack_require__('D57K');

        const Stash_1 = tslib_1.__importDefault(__webpack_require__('BTOX'));

        const constants_1 = __webpack_require__('Uc15');

        const service = (invoke, log) => {
          const stash = new Stash_1.default({
            max: 512,
            maxAge: 1000 * 60 * 60,
          });

          const getStash = async () => stash;

          return {
            getStash,
          };
        };

        exports.default = {
          name: constants_1.CACHE_SERVICE,
          service,
        };

        /***/
      },

      /***/ WERN: /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        const utils_1 = __webpack_require__('L8uV');

        exports.DB_SERVICE = 'DB_SERVICE';
        exports.DB_SYNC_ENDPOINT = 'db_sync_endpoint';
        exports.DB_PASSWORD = 'db_password';
        exports.DB_NAME = 'db_name';
        exports.DB_SETTINGS_ATTACHMENT = 'SETTINGS_ATTACHMENT';
        exports.moduleName = 'db';
        const servicePath = utils_1.buildServicePath(exports.moduleName);
        const services = Object.freeze({
          [exports.DB_SERVICE]: servicePath(exports.DB_SERVICE),
          [exports.DB_SETTINGS_ATTACHMENT]: servicePath(exports.DB_SETTINGS_ATTACHMENT),
        });
        exports.default = services;

        /***/
      },

      /***/ YdJJ: /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        const tslib_1 = __webpack_require__('D57K');

        const web3_provider_1 = tslib_1.__importDefault(__webpack_require__('K2f6'));

        const ethers_1 = __webpack_require__('xhKp');

        const constants_1 = __webpack_require__('Uc15');

        const provider_utils_1 = __webpack_require__('L9ln');

        async function getProvider(getSettings, provider = constants_1.EthProviders.None) {
          let ethProvider;
          const moduleSettings = await getSettings(constants_1.moduleName);
          const networkSettings = moduleSettings.hasOwnProperty(constants_1.ETH_NETWORK);

          if (!networkSettings) {
            throw new Error(`Must provide an ${constants_1.ETH_NETWORK} value.`);
          }

          const network = moduleSettings[constants_1.ETH_NETWORK];

          if (provider === constants_1.EthProviders.None) {
            return ethers_1.ethers.getDefaultProvider(network);
          }

          if (provider === constants_1.EthProviders.Web3Injected) {
            ethProvider = await provider_utils_1.ConnectToInjected();
          }

          if (provider === constants_1.EthProviders.WalletConnect) {
            ethProvider = await provider_utils_1.ConnectToWalletConnect(web3_provider_1.default, {
              infuraId: '21f3771ff3814c3db46dfcd216c9e672',
              network,
            });
          }

          return new ethers_1.ethers.providers.Web3Provider(ethProvider);
        }

        exports.default = getProvider;

        /***/
      },

      /***/ aOj4: /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        const tslib_1 = __webpack_require__('D57K');

        const utils_1 = __webpack_require__('L8uV');

        const settings_1 = tslib_1.__importDefault(__webpack_require__('3T4H'));

        const settingsDocMethods = {
          getSettingsObject() {
            return utils_1.fromEntries(this.services);
          },
        };
        const settingsCollectionMethods = {
          async getAllSettings(ethAddress) {
            return await this.find()
              .where('ethAddress')
              .equals(ethAddress)
              .exec();
          },
        };
        exports.default = {
          name: 'settings',
          schema: settings_1.default,
          methods: settingsDocMethods,
          statics: settingsCollectionMethods,
        };

        /***/
      },

      /***/ abl0: /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        const tslib_1 = __webpack_require__('D57K');

        const pouchdb_adapter_http_1 = tslib_1.__importDefault(__webpack_require__('JdHe'));

        const pouchdb_adapter_idb_1 = tslib_1.__importDefault(__webpack_require__('E8IT'));

        const rxdb_1 = tslib_1.__importDefault(__webpack_require__('5nT9')); // load plugins

        rxdb_1.default.plugin(pouchdb_adapter_idb_1.default);
        rxdb_1.default.plugin(pouchdb_adapter_http_1.default);
        /**
         *
         * @param name
         * @param password, must be at least 8 characters long
         * @param adapter, can be one of 'idb' or 'memory'
         */

        function dbConnect(name, password, adapter = 'idb') {
          return rxdb_1.default.create({
            adapter,
            multiInstance: true,
            name,
            password,
            queryChangeDetection: true,
          });
        }

        exports.default = dbConnect;

        /***/
      },

      /***/ e3Mj: /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        const constants_1 = __webpack_require__('Uc15');

        const ipfs_settings_1 = __webpack_require__('n2Ol');

        const settings = [
          [constants_1.ETH_NETWORK, 'rinkeby'],
          [constants_1.IPFS_GATEWAY, ipfs_settings_1.ipfsGateway],
        ];
        exports.default = settings;

        /***/
      },

      /***/ kWQs: /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        const tslib_1 = __webpack_require__('mrSG');

        const utils_1 = __webpack_require__('L8uV');

        const service_caller_1 = tslib_1.__importDefault(__webpack_require__('9zGa')); // @Todo: document this magical code @_@

        function init(di) {
          const invoke = utils_1.callServiceMethod(di); // call any registered service and create an Observable

          const send = (servicePath, method, args) => {
            // @Todo: handle unresolved methods
            const service = invoke(servicePath)(method);
            return service_caller_1.default(service, args);
          };

          return {
            send: utils_1.toCurried(send),
          };
        }

        exports.default = init;

        /***/
      },

      /***/ mwqp: /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        const tslib_1 = __webpack_require__('mrSG');

        const sdk_common_1 = tslib_1.__importDefault(__webpack_require__('4JNR'));

        const sdk_core_1 = tslib_1.__importDefault(__webpack_require__('9N3V'));

        const sdk_db_1 = tslib_1.__importDefault(__webpack_require__('7E9Q'));

        const channel_1 = tslib_1.__importDefault(__webpack_require__('kWQs'));

        const utils_1 = __webpack_require__('C/Fq');

        const start = (mList, di, sendChanel) => {
          utils_1.startServices(mList, di); // build the module services for the sdk consumer

          return utils_1.buildModuleServiceChannels(mList, sendChanel);
        };

        module.exports = function init(
          options = {
            start: true,
          },
        ) {
          const di = sdk_core_1.default();
          const commonModule = sdk_common_1.default();
          const dbModule = sdk_db_1.default();
          let modules = {}; // list of all the registered modules for the sdk

          const modulesList = [commonModule, dbModule]; // general channel to send service calls

          const channel = channel_1.default(di);

          if (options.start) {
            modules = start(modulesList, di, channel.send);
          }

          const baseReturnedObj = {
            di,
            channel: channel.send,
          }; // for the case when options.start is false the start function is returned

          const startFn = options.start
            ? {
                modules,
              }
            : {
                start,
                modulesList,
              };
          return Object.assign({}, baseReturnedObj, startFn);
        };

        /***/
      },

      /***/ n2Ol: /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });
        const DEFAULT_CIRCUIT_RELAYS = [
          '/p2p-circuit/ipfs/QmSgTsiHrubEkLKEvdEjNtWHRasU1dUSgPfMjJpkR8KkBU',
          '/p2p-circuit/ipfs/QmUjM53zcSRhsA8BCK28DchCdSJCNmEU6W6jPJHiSgxwTW',
          '/p2p-circuit/ipfs/QmTfTyKZXjzRo2C8NV6p21HCsxZF54Mm5cZ9GsfY3zpG3T',
          '/p2p-circuit/ipfs/QmTMSgsyw3zzVbcQnkoN5SRZk7WYUMorJ7EqkqVBLgn13i',
          '/p2p-circuit/ipfs/QmYfXRuVWMWFRJxUSFPHtScTNR9CU2samRsTK15VFJPpvh',
        ];
        const AKASHA_BOOTSTRAP_PEERS = [
          '/dns4/akasha.online/tcp/443/wss/ipfs/QmSgTsiHrubEkLKEvdEjNtWHRasU1dUSgPfMjJpkR8KkBU',
          '/dns4/akasha.observer/tcp/443/wss/ipfs/QmUjM53zcSRhsA8BCK28DchCdSJCNmEU6W6jPJHiSgxwTW',
        ];
        const IPFS_BOOTSTRAP_PEERS = [
          '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
          '/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
          '/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
          '/dns4/sgp-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu',
          '/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
          '/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
          '/dns4/node0.preload.ipfs.io/tcp/443/wss/ipfs/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
          '/dns4/node1.preload.ipfs.io/tcp/443/wss/ipfs/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
        ];
        const DEFAULT_IPFS_CONFIG = {
          Bootstrap: IPFS_BOOTSTRAP_PEERS.concat(AKASHA_BOOTSTRAP_PEERS).concat(
            DEFAULT_CIRCUIT_RELAYS,
          ),
        };
        exports.ipfsGateway = 'https://gateway.ipfs.io/ipfs';
        exports.default = DEFAULT_IPFS_CONFIG;

        /***/
      },

      /***/ q0yz: /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        const constants_1 = __webpack_require__('Bd5f');

        const utils_1 = __webpack_require__('L8uV');

        const service = (invoke, log) => {
          const settingsSymbol = Symbol('setting$'); // global container for settings

          const coreSettings = {
            [settingsSymbol]: new Map(),
          };

          const getSettings = async moduleName => {
            return utils_1.fromEntries(coreSettings[settingsSymbol].get(moduleName));
          };

          const setSettings = async settings => {
            coreSettings[settingsSymbol].set(settings.moduleName, settings.values);
          };

          return {
            getSettings,
            setSettings,
          };
        };

        exports.default = {
          name: constants_1.SETTINGS_SERVICE,
          service,
        };

        /***/
      },

      /***/ rmAn: /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        const ethers_1 = __webpack_require__('xhKp');

        const constants_1 = __webpack_require__('Uc15');

        const service = (invoke, log) => {
          const getUtils = async () => ethers_1.utils;

          return {
            getUtils,
          };
        };

        exports.default = {
          name: constants_1.WEB3_UTILS_SERVICE,
          service,
        };

        /***/
      },

      /***/ shJP: /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        const tslib_1 = __webpack_require__('D57K');

        const settings_1 = tslib_1.__importDefault(__webpack_require__('aOj4'));

        async function initCollections(db) {
          const registeredCollections = [settings_1.default];

          for (const collectionObj of registeredCollections) {
            await db.collection(collectionObj);
          }

          return db;
        }

        exports.default = initCollections;

        /***/
      },

      /***/ voiI: /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        async function getSettingsAttachment(doc, id) {
          const settings = await doc.getAttachment(id);

          if (settings) {
            return settings.getStringData();
          }

          return settings;
        }

        exports.getSettingsAttachment = getSettingsAttachment; // @example obj = {id: 'myThemeIdentifier', data: JSON.stringify({colors: ['red', 'blue']}), type: 'string'}

        function putSettingsAttachment(doc, obj) {
          return doc.putAttachment(obj);
        }

        exports.putSettingsAttachment = putSettingsAttachment;

        async function removeSettingAttachment(doc, id) {
          const setting = await doc.getAttachment(id);

          if (setting) {
            return setting.remove();
          }
        }

        exports.removeSettingAttachment = removeSettingAttachment;

        /***/
      },

      /***/ yE3s: /***/ function(module, exports, __webpack_require__) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        const tslib_1 = __webpack_require__('D57K');

        const bottlejs_1 = tslib_1.__importDefault(__webpack_require__('RS7G'));

        class DIContainer {
          constructor() {
            this.sp = new bottlejs_1.default('RuntimeDIContainer');
          }

          get serviceProvider() {
            return this.sp;
          }

          getService(serviceName) {
            return this.sp.container[serviceName];
          }

          register(serviceName, service) {
            this.sp.service(serviceName, service);
          }
        }

        exports.default = DIContainer;

        /***/
      },
    },
    [['mwqp', 1, 2]],
  ]);
});
//# sourceMappingURL=akasha.main.90c7eea33584cd3f3675.js.map
