// import { ORAPlugin} from './ora_plugin.ts';
// import { Web3 } from 'web3';
// import dotenv from 'dotenv';
// import { Models, PromptAddresses } from './types.ts';
// dotenv.config();

// const web3 = new Web3(process.env.RPC_URL);
// const oraPlugin = new ORAPlugin();

// web3.registerPlugin(oraPlugin);

// const myFunction = async () => {
//     const price = await web3.ora.getAIResult(PromptAddresses.MAINNET, Models.STABLE_DIFFUSION, "Generate image of btc");
//     console.log("Price: ", price)
// }

// async function main() {
//     await myFunction()
// }

// main().catch((e) => {
//     console.log(e);
//     return;
// })

// export default myFunction