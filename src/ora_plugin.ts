import { Web3PluginBase, Contract, ContractAbi, validator } from "web3";
import { Models, PromptAddresses } from "./types";
import { PromptABI } from "./prompt_abi";

export class ORAPlugin extends Web3PluginBase {
  public pluginNamespace: string;
  public defaultPromptAbi: ContractAbi;

  public constructor(options?: {
    pluginNamespace?: string;
    defaultPromptAbi?: ContractAbi
  }) {
    super();
    this.pluginNamespace = options?.pluginNamespace ?? 'ora'
    this.defaultPromptAbi = options?.defaultPromptAbi ?? PromptABI
  }

  public async getAIResult(
    promptAddress: PromptAddresses,
    modelId: Models,
    prompt: string
    promptAbi: ContractAbi = this.defaultPromptAbi,
  ) {

    if (!validator.isAddress(promptAddress)) {
			throw new Error(
				`Provided priceFeedAddress is not a valid address: ${promptAddress}`,
			);
		}

    const contract: Contract<typeof PromptABI> = new Contract(
      promptAbi,
      promptAddress
    )

    contract.link(this)

    if(contract.methods.getAIResult !== undefined){
      return contract.methods.getAIResult(modelId, prompt).call();
    }

    throw new Error(
      "Unable to get AI result. Provided abi doesn't have getAIResult method."
    )
  }
}

// Module Augmentation
declare module 'web3' {
  interface Web3Context {
    template: ORAPlugin;
  }
}
