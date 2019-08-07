/* tslint:disable */
// remove comment after fixing shebang banner for rollup
// #!/usr/bin/env node
import commonServices, { WEB3_SERVICE } from '@akashaproject/sdk-common/lib/constants';
import { callService } from '@akashaproject/sdk-core/lib/utils';
import initSdk from '@akashaproject/sdk/lib';

// tslint:disable-next-line:no-var-requires
const inquirer = require('inquirer');
// tslint:disable-next-line:no-var-requires
const chalk = require('chalk');

(async () => {
  const tools = await initSdk();
  // tslint:disable-next-line:no-console
  console.log(tools.modules);
  console.log(chalk.green('AKASHA-SDK cli is ready!'));
  const invoke = callService(tools.di);
  const input = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'startIpfs',
      message: 'Start js-ipfs instance?'
    }
  ]);

  let ipfsNode, web3Provider, exitCli, wallet;
  if (input.startIpfs) {
    ipfsNode = invoke(commonServices.IPFS_SERVICE).ipfsNode;
    await ipfsNode.start();
    console.log(chalk.cyan('ipfs node started!'));
  }

  web3Provider = invoke(commonServices.WEB3_SERVICE).web3();
  const network = await web3Provider.getNetwork();
  const blockNumber = await web3Provider.getBlockNumber();
  console.log(
    chalk.green('connected to ethereum<<<', network.name, '>>>network on block:', blockNumber)
  );

  const consumeWeb3Provider = async function(provider) {
    console.log('web3 accessed from channel!');
    const gasPrice = await provider.getGasPrice();
    console.log(chalk.blue('gas price is', gasPrice));
  };

  const errorConsumer = function(err) {
    console.log(err);
  };

  //magic here...
  /*  const observable = tools.modules.commons.web3_service_provider();

  observable.subscribe(consumeWeb3Provider, errorConsumer);*/
  invoke(commonServices.WEB3_SERVICE).web3();
  invoke(commonServices.WEB3_SERVICE).web3();
  invoke(commonServices.WEB3_SERVICE).web3();
  const mnemonic =
    'satisfy fault total balcony danger traffic apology faint chat enemy claim equip';
  wallet = invoke(commonServices.WEB3_SERVICE)
    .wallet()
    .fromMnemonic(mnemonic);
  const ethAddress = await wallet.getAddress();
  console.log(chalk.green('eth key loaded:', ethAddress));
  const EXIT = 'exit';
  const SIGN_MESSAGE = 'sign message';
  const VERIFY_MESSAGE = 'verify message';

  while (!exitCli) {
    const handler = await inquirer.prompt([
      {
        type: 'list',
        name: 'option',
        message: 'Select an action',
        choices: [SIGN_MESSAGE, VERIFY_MESSAGE, EXIT]
      }
    ]);
    exitCli = handler.option === EXIT;
    if (handler.option === EXIT && ipfsNode) {
      console.log(chalk.blue('[ipfs] closing...'));
      await ipfsNode.stop();
      console.log(chalk.blue('[ipfs] closed!'));
    }

    if (handler.option === SIGN_MESSAGE) {
      const message = await inquirer.prompt([
        {
          type: 'input',
          name: 'value',
          message: 'Message to be signed:'
        }
      ]);
      const signedMsg = await wallet.signMessage(message.value);
      console.log(
        chalk.italic('original message:', message.value),
        chalk.yellow('signed message: ', signedMsg)
      );
    }

    if (handler.option === VERIFY_MESSAGE) {
      const messageV = await inquirer.prompt([
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
      ]);
      const utilsProvider = invoke(commonServices.WEB3_UTILS_SERVICE).utils;
      const ethAddressFound = await utilsProvider.verifyMessage(messageV.raw, messageV.sig);
      console.log(chalk.red('Signed by:', ethAddressFound));
    }
  }
})();
