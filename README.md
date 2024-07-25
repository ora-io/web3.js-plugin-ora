# Web3.js ORA Plugin

![ES Version](https://img.shields.io/badge/ES-2020-yellow)
![Node Version](https://img.shields.io/badge/node-18.x-green)

This is a [web3.js](https://github.com/web3/web3.js) `4.x` plugin for interacting with ORA Ethereum contracts.

## Prerequisites

-   :gear: [NodeJS](https://nodejs.org/) (LTS/Fermium)
-   :toolbox: [Yarn](https://yarnpkg.com/)

## Installation

```bash
yarn add @ora-io/web3-plugin-ora
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

### Configure .env file

In order to interact with the blockchain through web3js plugin you need to setup environment variables. To do that, copy `.env.example` into `.env` and add values for `PRIVATE_KEY` and `RPC_URL`.

### Registering the Plugin with a web3.js Instance

After importing `ORAPlugin` from `@ora-io/web3-plugin-ora` and `Web3` from `web3`, register an instance of `ORAPlugin` with an instance of `Web3` like so:

```typescript
import { Web3 } from 'web3';
import dotenv from 'dotenv';
import {Models, ORAPlugin, PromptAddresses} from '@ora-io/web3-plugin-ora';

dotenv.config();

const web3 = new Web3(process.env.RPC_URL);
const oraPlugin = new ORAPlugin(PromptAddresses.SEPOLIA);

web3.registerPlugin(oraPlugin);
```



More information about registering web3.js plugins can be found [here](https://docs.web3js.org/docs/guides/web3_plugin_guide/plugin_users#registering-the-plugin).

### Plugin Methods

ORAPlugin supports method for getting AI inference results from all supported chains. When interacting with the plugin, users need to specify which chain to interact with.

#### `estimateFee`

```typescript
public async estimateFee(
    modelId: Models
)
```
`estimateFee` method is used to determine amount of wei necessary for oracle to execute callback and return inference result. Estimated fee is passed as a value for `calculateAIResult` function call.

**Input:**
- `modelId` - specifies AI model for fee estimation

#### `calculateAIResult`

```typescript
public async calculateAIResult(
    from: string,
    modelId: Models,
    prompt: string,
    estimatedFee: string,
)
```

`calculateAIResult` interacts with Onchain AI Oracle (OAO), requesting AI inference.

**Input:**
- `from` - specifies the sender of the transaction (connected wallet address)
- `modelId` - id of the AI model that should be called
- `prompt` - custom prompt for inference request
- `estimatedFee` - result of `estimateFee` method


#### `getAIResult`

```typescript
public async getAIResult(
    modelId: Models,
    prompt: string
)
```

`getAIResult` is used to query inference result for the specific prompt and modelId.

**Inputs:**

- `modelId` - speficies the AI model which will return inference results
- `prompt` - user prompt string for the inference call

Under the hood, this method is calling the `getAIResult` on the Prompt contract for the specified model and prompt.

### Sample code to interact with OAO

 Tutorial on how to interact with ORA's Onchain AI Oracle can be found [here](https://docs.ora.io/doc/oao-onchain-ai-oracle/develop-guide/tutorials/interaction-with-oao-tutorial).

```typescript
import { Web3 } from 'web3';
import dotenv from 'dotenv';
import {Models, ORAPlugin, PromptAddresses} from '@ora-io/web3-plugin-ora';

dotenv.config();

const web3 = new Web3(process.env.RPC_URL);

const oraPlugin = new ORAPlugin(PromptAddresses.SEPOLIA);
web3.registerPlugin(oraPlugin);

const acc = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY : "")
web3.eth.accounts.wallet.add(acc);

const PROMPT = "Generate image of an alien that explores the world"

const estimatedFee = await web3.ora.estimateFee(Models.STABLE_DIFFUSION);
console.log("Estimated fee: ", estimatedFee)
await web3.ora.calculateAIResult(acc.address, Models.STABLE_DIFFUSION, PROMPT, Number(estimatedFee).toString())

setTimeout(async () => {
    const inferenceResult = await web3.ora.getAIResult(Models.STABLE_DIFFUSION, PROMPT);
    console.log("Inference result: ", inferenceResult)
}, 20000);
```

To interact with ORA's web3js plugin you need to follow next steps:
1. register ORA plugin to web3js
2. add wallet to web3js context, in order to sign blockchain transactions
3. estimate fee for the OAO callback (`estimateFee`)
4. initiate inference request (`calculateAIResult`)
5. check the inference result (`getAIResult`)

In this example we interacted with StableDiffusion model, hence the result is a CID of an image stored on ipfs. You can check generated image here: https://ipfs.io/ipfs/QmbaJs2fcbr4dfD5Mf8pJu7xvheGbQEksRtVN4ryEL8THp

You can experiment by changing modelId and prompt to get different inferences from all supported models.

## Found an issue or have a question or suggestion

-   If you found an issue or have a question or suggestion [submit an issue](https://github.com/ora-io/web3.js-plugin-ora/issues) or join us on [Discord](https://discord.gg/fg5ygkgy)

## Run the tests

1. Clone the repo
2. Run `yarn` to install dependencies
    - If you receive the following warning, please remove the file `package-lock.json` and make sure to run `yarn` to install dependencies instead of `npm i`:

```console
warning package-lock.json found. Your project contains lock files generated by tools other than Yarn. It is advised not to mix package managers in order to avoid resolution inconsistencies caused by unsynchronized lock files. To clear this warning, remove package-lock.json.
```

3. Run the tests:
 - `yarn test`: Runs test against the network specified by RPC_URL
   
## Useful links

-   [web3.js Documentation](https://docs.web3js.org/)
-   [ORA Documentation](https://docs.ora.io/doc)
