## Local Development Setup

To start local development, you need a local running Ceramic node. Luckily, the steps to set one up is very simple.

- Set up a local Ceramic Node <sup>1</sup>
  1. Follow this [detailed guide](https://composedb.js.org/docs/0.4.x/set-up-your-environment) from ComposeDB that shows you how to install and configure relevant packages for running a local Ceramic node.
  2. To check that you have everything installed correctly, run `npx @ceramicnetwork/cli daemon` in your Terminal and if you see the following message `IMPORTANT: Ceramic API running on 0.0.0.0:7007'`, you have successfully set up your local Ceramic node 🚀.


- Set up env values for building all the AKASHA Core packages
  1. Create a new file `.env` at the root of the project with the contents of [env.example](./.env.example).
  2. Follow the comments from the example env file on how to fill in the values.
  3. From the root of this project run `npm run build:all` to start building all packages.

- To test the playground ethereum-world example application
  1. Run `npm run start:feed-app`
  2. Visit `https://localhost:8131/` to check out the app.

- Tips:
  1. Run `npm run pack:ui` if you're only making changes to the UI packages to save time rebuilding.
  2. Run `npm run install:clean` if you need to delete all traces of the current build and rebuild from scratch.
  
[1]: In the future, we will provide a public node for Ceramic connection and this step will no longer be needed.