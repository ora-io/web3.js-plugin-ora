# Web3.js ORA Plugin

![ES Version](https://img.shields.io/badge/ES-2020-yellow)
![Node Version](https://img.shields.io/badge/node-18.x-green)
[![NPM Package][npm-image]][npm-url]

This is a [web3.js](https://github.com/web3/web3.js) `4.x` plugin for interacting with ORA Ethereum contracts.

## Prerequisites

-   :gear: [NodeJS](https://nodejs.org/) (LTS/Fermium)
-   :toolbox: [Yarn](https://yarnpkg.com/)

## Installation

```bash
yarn add @ora/web3.js-ora-plugin
```

## Using this plugin

### Installing Version `4.x` of `web3`

When adding the `web3` package to your project, make sure to use version `4.x`:

-   `npm i -S web3@4.0.3`
-   `yarn add web3@4.0.3`

> **_NOTE_**  
> If 4.x was already released, you are good to just use `web3` without appending anything to it.

To verify you have the correct `web3` version installed, after adding the package to your project (the above commands), look at the versions listed in your project's `package.json` under the `dependencies` section, it should contain version 4.x similar to:

```json
"dependencies": {
	"web3": "4.0.3"
}
```

### Registering the Plugin with a web3.js Instance

After importing `ORAPlugin` from `@ora/web3-plugin-ora` and `Web3` from `web3`, register an instance of `ORAPlugin` with an instance of `Web3` like so:

```typescript
import { ORAPlugin } from '@ora/web3-plugin-ora';
import { Web3 } from 'web3';

const web3 = new Web3('YOUR_PROVIDER_URL');
const oraPlugin = new ORAPlugin();

web3.registerPlugin(oraPlugin);
```

More information about registering web3.js plugins can be found [here](https://docs.web3js.org/docs/guides/web3_plugin_guide/plugin_users#registering-the-plugin).

### Plugin Methods

ORAPlugin supports method for getting AI inference results from all supported chains. When interacting with the plugin, users need to specify which chain to interact with.

#### `getAIResult`

```typescript
public async getAIResult(
    promptAddress: PromptAddresses,
    modelId: Models,
    prompt: string,
    promptAbi: ContractAbi = this.defaultPromptAbi,
): {
    result: string
}
```

`defaultPromptAbi` can be found [here](https://github.com/hadzija7/web3.js-plugin-ora/blob/master/src/prompt_abi.ts).

The `getAIResult` accepts several inputs:
- `promptAddress` - tells plugin which prompt contract to interact with
- `modelId` - speficies the AI model which will return inference resutls
- `prompt` - user prompt for the inference call
- `promptAbi` optional parameter for specifying the Prompt contract ABI (this parameter is defaulted to [defaultPromptAbi](https://github.com/hadzija7/web3.js-plugin-ora/blob/master/src/prompt_abi.ts)).

Under the hood, this method is calling the `getAIResult` on the Prompt contract for the specified model and prompt. Tutorial on how to interact with ORA's Onchain AI Oracle can be found [here](https://docs.ora.io/doc/oao-onchain-ai-oracle/develop-guide/tutorials/interaction-with-oao-tutorial).

```typescript
import { ORAPlugin, PromptAddresses, Models } from '@ora/web3-plugin-ora';
import { Web3 } from 'web3';

const web3 = new Web3('YOUR_PROVIDER_URL');
const oraPlugin = new ORAPlugin();

web3.registerPlugin(oraPlugin);

const inferenceResult = await web3.ora.getAIResult(PromptAddresses.MAINNET, Models.STABLE_DIFFUSION, "Generate image of btc");
console.log(inferenceResult)
```

## Found an issue or have a question or suggestion

-   :writing_hand: If you found an issue or have a question or suggestion [submit an issue](https://github.com/hadzija7/web3.js-plugin-ora/issues) or join us on [Discord](https://discord.gg/fg5ygkgy)

## Run the tests

1. Clone the repo
2. Run `yarn` to install dependencies
    - If you receive the following warning, please remove the file `package-lock.json` and make sure to run `yarn` to install dependencies instead of `npm i`:

```console
warning package-lock.json found. Your project contains lock files generated by tools other than Yarn. It is advised not to mix package managers in order to avoid resolution inconsistencies caused by unsynchronized lock files. To clear this warning, remove package-lock.json.
```

3. Run the tests:
    - `yarn test:unit`: Runs the mocked tests that do not make a network request using the [Jest](https://jestjs.io/) framework
    - End-to-end tests: Runs Webpack bundled tests that make a network request to the RPC provider `https://rpc.ankr.com/eth` and returns an actual response from `MainnetPriceFeeds.LinkEth` smart contract using the [Cypress](https://www.cypress.io/) framework
        - `yarn test:e2e:chrome`: Runs the tests using Chrome
        - `yarn test:e2e:electron`: Runs the tests using Electron
        - `yarn test:e2e:firefox`: Runs the tests using Firefox
    - Black box tests: Uses a published version of the plugin from [Verdaccio](https://verdaccio.org/) to run tests that make a network request to the RPC provider `https://rpc.ankr.com/eth` and returns an actual response from `MainnetPriceFeeds.LinkEth` smart contract using the [Jest](https://jestjs.io/) framework
        - NOTE The black box tests are setup to run within Github actions environment, but can be ran locally. The [black_box_test_helpers.sh](https://github.com/ChainSafe/web3.js-plugin-chainlink/blob/master/scripts/black_box_test_helpers.sh) script can be used to:
            - `start`: Start Verdaccio using a Docker container
            - `stop`: Kill the Docker container
            - `startBackgroundAndPublish`: Starts a headless Docker container and publishes the plugin package
            - `runTests`: `cd`s into the `test/black_box` directory, installs the black box package dependencies, and runs `yarn test` which will use Jest to run the tests
        - In addition to the `black_box_test_helpers.sh` script, the black box tests can be ran using the following `package.json` scripts:
            1. `yarn pre-black-box`: Calls `startBackgroundAndPublish` from the `black_box_test_helpers.sh` script
            2. `yarn test:black-box`: Calls `yarn pre-black-box` and `runTests` from the from the `black_box_test_helpers.sh` script
            3. `yarn post-black-box`: Calls `stop` from the `black_box_test_helpers.sh` script

## Useful links

-   [web3.js Documentation](https://docs.web3js.org/)
-   [ORA Documentation](https://docs.ora.io/doc)

## Package.json Scripts

| Script            | Description                                                                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| build             | Uses `tsc` to build package and dependent packages                                                                                           |
| build:web         | Uses `webpack` to build a browser ready build of the plugin in `dist` directory                                                              |
| clean             | Uses `rimraf` to remove `lib/` and `dist/`                                                                                                   |
| format            | Uses `prettier` to format the code                                                                                                           |
| lint              | Uses `eslint` to lint package                                                                                                                |
| lint:fix          | Uses `eslint` to check and fix any warnings                                                                                                  |
| post-black-box    | Uses `stop` from `black_box_test_helpers.sh` to kill running Verdaccio Docker container                                                      |
| pre-black-box     | Uses `startBackgroundAndPublish` from `black_box_test_helpers.sh` to start a Verdaccio Docker container and publish the plugin package to it |
| prebuild          | Calls `yarn clean`                                                                                                                           |
| prepare           | Installs [husky](https://github.com/typicode/husky)                                                                                          |
| test              | Uses `jest` to run unit tests                                                                                                                |
| test:black-box    | Calls `yarn pre-black-box` and `runTests` from `black_box_test_helpers.sh` to run black box tests                                            |
| test:coverage     | Uses `jest` to report test coverage                                                                                                          |
| test:e2e:chrome   | Users `cypress` to run `e2e` test in a Chrome environment                                                                                    |
| test:e2e:firefox  | Users `cypress` to run `e2e` test in a Firefox environment                                                                                   |
| test:e2e:electron | Users `cypress` to run `e2e` test in a Electron environment                                                                                  |
| test:unit         | Uses `jest` to run tests under `/test/unit`                                                                                                  |

[npm-image]: https://img.shields.io/npm/v/web3-core-method.svg
[npm-url]: https://npmjs.org/packages/web3
