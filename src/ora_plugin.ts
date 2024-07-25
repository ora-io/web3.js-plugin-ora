import { Web3PluginBase, Contract, ContractAbi, validator } from "web3";
import { Models} from "./types";
import { PromptABI } from "./prompt_abi";

export class ORAPlugin extends Web3PluginBase {
  public pluginNamespace: string;
  public defaultPromptAbi: ContractAbi;
  public contract: Contract<typeof PromptABI>;

  public constructor(
    promptAddress: string,  
    options?: {
      pluginNamespace?: string;
      defaultPromptAbi?: ContractAbi;
    }
  ) {
    super();
    this.pluginNamespace = options?.pluginNamespace ?? 'ora'
    this.defaultPromptAbi = options?.defaultPromptAbi ?? PromptABI

    if (!validator.isAddress(promptAddress)) {
			throw new Error(
				`Provided priceFeedAddress is not a valid address: ${promptAddress}`,
			);
		}

    this.contract = new Contract(
      this.defaultPromptAbi,
      promptAddress
    )
  }

  public async getAIResult(
    modelId: Models,
    prompt: string
  ) {
    this.contract.link(this)
    
    if(this.contract.methods.getAIResult !== undefined){
      return this.contract.methods.getAIResult(modelId, prompt).call();
    }

    throw new Error(
      "Unable to get AI result. Provided abi doesn't have getAIResult method."
    )
  }

  public async estimateFee(
    modelId: Models
  ) {
    this.contract.link(this)

    if(this.contract.methods.estimateFee !== undefined){
      return await this.contract.methods.estimateFee(modelId).call();
    }

    throw new Error(
      "Unable to get AI result. Provided abi doesn't have getAIResult method."
    )
  }

  public async calculateAIResult(
    from: string,
    modelId: Models,
    prompt: string,
    estimatedFee: string,
  ) {
    this.contract.link(this)

    if(this.contract.methods.calculateAIResult !== undefined){
      return this.contract.methods.calculateAIResult(modelId, prompt).send({
        from,
        value: estimatedFee
      });
    }

    throw new Error(
      "Unable to get AI result. Provided abi doesn't have getAIResult method."
    )
  }

}

// Module Augmentation
declare module 'web3' {
  interface Web3Context {
    ora: ORAPlugin;
  }
}
