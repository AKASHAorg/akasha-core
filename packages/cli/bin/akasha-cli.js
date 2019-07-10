'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var initSdk = _interopDefault(require('@akashaproject/sdk'));
var constants = require('@akashaproject/sdk-core/lib/constants');
var constants$1 = require('@akashaproject/sdk-common/lib/constants');
var IAkashaModule = require('@akashaproject/sdk-core/lib/IAkashaModule');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var inquirer = require('inquirer');
var chalk = require('chalk');
(function () {
    return __awaiter(this, void 0, void 0, function () {
        var tools, input, ipfsNode, web3Provider, exitCli, wallet, network, blockNumber, walletProvider, mnemonic, ethAddress, EXIT, SIGN_MESSAGE, VERIFY_MESSAGE, handler, message, signedMsg, messageV, utilsProvider, ethAddress_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tools = initSdk();
                    return [4 /*yield*/, tools.start()];
                case 1:
                    _a.sent();
                    console.log(chalk.green('AKASHA-SDK cli is ready!'));
                    return [4 /*yield*/, inquirer.prompt([
                            {
                                type: 'confirm',
                                name: 'startIpfs',
                                message: 'Start js-ipfs instance?'
                            }
                        ])];
                case 2:
                    input = _a.sent();
                    if (!input.startIpfs) return [3 /*break*/, 4];
                    ipfsNode = tools.di.getService(IAkashaModule.IAkashaModule.getServiceName(constants$1.moduleName, constants.IPFS_SERVICE));
                    return [4 /*yield*/, ipfsNode.start()];
                case 3:
                    _a.sent();
                    console.log(chalk.cyan('ipfs node started! :D'));
                    _a.label = 4;
                case 4:
                    web3Provider = tools.di.getService(IAkashaModule.IAkashaModule.getServiceName(constants$1.moduleName, constants.WEB3_SERVICE_PROVIDER));
                    return [4 /*yield*/, web3Provider.getNetwork()];
                case 5:
                    network = _a.sent();
                    return [4 /*yield*/, web3Provider.getBlockNumber()];
                case 6:
                    blockNumber = _a.sent();
                    console.log(chalk.green('connected to ethereum<<<', network.name, '>>>network on block:', blockNumber));
                    walletProvider = tools.di.getService(IAkashaModule.IAkashaModule.getServiceName(constants$1.moduleName, constants.WEB3_WALLET));
                    mnemonic = 'satisfy fault total balcony danger traffic apology faint chat enemy claim equip';
                    wallet = walletProvider.fromMnemonic(mnemonic);
                    return [4 /*yield*/, wallet.getAddress()];
                case 7:
                    ethAddress = _a.sent();
                    console.log(chalk.green('eth key loaded:', ethAddress));
                    EXIT = 'exit';
                    SIGN_MESSAGE = 'sign message';
                    VERIFY_MESSAGE = 'verify message';
                    _a.label = 8;
                case 8:
                    if (!!exitCli) return [3 /*break*/, 18];
                    return [4 /*yield*/, inquirer.prompt([
                            {
                                type: 'list',
                                name: 'option',
                                message: 'Select an action',
                                choices: [SIGN_MESSAGE, VERIFY_MESSAGE, EXIT]
                            }
                        ])];
                case 9:
                    handler = _a.sent();
                    exitCli = (handler.option === EXIT);
                    if (!(handler.option === EXIT && ipfsNode)) return [3 /*break*/, 11];
                    console.log(chalk.blue('[ipfs] closing...'));
                    return [4 /*yield*/, ipfsNode.stop()];
                case 10:
                    _a.sent();
                    console.log(chalk.blue('[ipfs] closed!'));
                    _a.label = 11;
                case 11:
                    if (!(handler.option === SIGN_MESSAGE)) return [3 /*break*/, 14];
                    return [4 /*yield*/, inquirer.prompt([
                            {
                                type: 'input',
                                name: 'value',
                                message: 'Message to be signed:'
                            }
                        ])];
                case 12:
                    message = _a.sent();
                    return [4 /*yield*/, wallet.signMessage(message.value)];
                case 13:
                    signedMsg = _a.sent();
                    console.log(chalk.italic('original message:', message.value), chalk.yellow('signed message: ', signedMsg));
                    _a.label = 14;
                case 14:
                    if (!(handler.option === VERIFY_MESSAGE)) return [3 /*break*/, 17];
                    return [4 /*yield*/, inquirer.prompt([
                            {
                                type: 'input',
                                name: 'raw',
                                message: 'Original message:'
                            },
                            {
                                type: 'input',
                                name: 'sig',
                                message: 'Signature:'
                            }
                        ])];
                case 15:
                    messageV = _a.sent();
                    utilsProvider = tools.di.getService(IAkashaModule.IAkashaModule.getServiceName(constants$1.moduleName, constants.WEB3_UTILS));
                    return [4 /*yield*/, utilsProvider.verifyMessage(messageV.raw, messageV.sig)];
                case 16:
                    ethAddress_1 = _a.sent();
                    console.log(chalk.red('Signed by:', ethAddress_1));
                    _a.label = 17;
                case 17: return [3 /*break*/, 8];
                case 18: return [2 /*return*/];
            }
        });
    });
})();
