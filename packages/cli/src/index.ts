//remove comment after fixing shebang banner for rollup
//#!/usr/bin/env node
import initSdk from '@akashaproject/sdk'
import { IPFS_SERVICE, WEB3_SERVICE } from '@akashaproject/sdk-core/lib/constants';
import {moduleName as commonsModule} from '@akashaproject/sdk-common/lib/constants';
import { IAkashaModule } from '@akashaproject/sdk-core/lib/IAkashaModule';
const inquirer = require('inquirer');
const chalk = require('chalk');

(async function(){
  const tools = initSdk();
  await tools.start();
  console.log(chalk.green('AKASHA-SDK cli is ready!'));
  const input = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'startIpfs',
        message: 'Start js-ipfs instance?'
      }
    ]);

  let ipfsNode;
  if (input.startIpfs) {
    ipfsNode = tools.di.getService(IAkashaModule.getServiceName(commonsModule, IPFS_SERVICE));
    await ipfsNode.start();
    console.log(chalk.cyan("ipfs node started! :D"))
  }

  const handler = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'exitCli',
      message: 'exit app?'
    }
  ]);
  if (handler.exitCli && ipfsNode) {
    await ipfsNode.stop();
  }

})();
