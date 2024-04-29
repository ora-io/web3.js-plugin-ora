import { Web3, core } from "web3";
import { Models, ORAPlugin, PromptAddresses } from "../src";

describe("TemplatePlugin Tests", () => {
  it("should register TemplatePlugin plugin on Web3Context instance", () => {
    const web3Context = new core.Web3Context("http://127.0.0.1:8545");
    web3Context.registerPlugin(new ORAPlugin());
    expect(web3Context.ora).toBeDefined();
  });

  describe("TemplatePlugin method tests", () => {
    const requestManagerSendSpy = jest.fn();

		// let web3Context: Web3;

    // let consoleSpy: jest.SpiedFunction<typeof global.console.log>;

    let web3: Web3;

    beforeAll(() => {
      web3 = new Web3("http://127.0.0.1:8545");
      web3.registerPlugin(new ORAPlugin());
      web3.ora.requestManager.send = requestManagerSendSpy;
      // consoleSpy = jest.spyOn(global.console, "log").mockImplementation();
    });

    // afterAll(() => {
    //   consoleSpy.mockRestore();
    // });

    it("should call TempltyPlugin test method with expected param", async () => {
      const inputs = [
        {
          "internalType": "uint256",
          "name": "modelId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "prompt",
          "type": "string"
        }
      ]
      const encodedFunctionCall = web3.eth.abi.encodeFunctionCall({ name: 'getAIResult', type: 'function', inputs: inputs }, [Models.STABLE_DIFFUSION, "Generate image of btc"]);

      await web3.ora.getAIResult(PromptAddresses.MAINNET, Models.STABLE_DIFFUSION, "Generate image of btc");
      // expect(consoleSpy).toHaveBeenCalledWith(PromptAddresses.MAINNET, Models.STABLE_DIFFUSION, "Generate image of btc");
      expect(requestManagerSendSpy).toHaveBeenCalledWith({
        method: 'eth_call',
				params: [
					{
						data: encodedFunctionCall,
            input: encodedFunctionCall,
						// input: web3.eth.abi.encodeParameters(['uint256', 'string'], [Models.STABLE_DIFFUSION, "Generate image of btc"]),
						to: PromptAddresses.MAINNET,
					},
					'latest',
				],
      })
    });
  });
});
