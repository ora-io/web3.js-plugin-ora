import { Web3, core } from "web3";
import { Models, ORAPlugin, PromptAddresses } from "../src";
import dotenv from "dotenv"
dotenv.config();

jest.setTimeout(15000);
describe("TemplatePlugin Tests", () => {
  let acc: any;

  it("should register TemplatePlugin plugin on Web3Context instance", () => {
    const web3Context = new core.Web3Context(process.env.RPC_URL);
    web3Context.registerPlugin(new ORAPlugin(PromptAddresses.SEPOLIA));
    expect(web3Context.ora).toBeDefined();
  });

  describe("TemplatePlugin method tests", () => {
    let web3: Web3;

    beforeAll(() => {
      web3 = new Web3(process.env.RPC_URL);
      web3.registerPlugin(new ORAPlugin(PromptAddresses.SEPOLIA));
      acc = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY : "")
      web3.eth.accounts.wallet.add(acc);
    });

    it('should fetch the latest block number', async function () {
        const blockNumber = await web3.eth.getBlockNumber();
        console.log('Latest block number:', blockNumber);
        expect(blockNumber > 0);
    });

    it("should call TempltyPlugin test method with expected param", async () => {
      const result = await web3.ora.getAIResult(Models.STABLE_DIFFUSION, "generate some nice picture");
      expect(result).toBe("QmcpZuEv4LnNNLL4VVMW3ydxZkrdwJFuKkFnSQN27ZfQAY")
    });

    it('request AI inference', async () => {
      const estimatedFee = await web3.ora.estimateFee(Models.STABLE_DIFFUSION);
      await web3.ora.calculateAIResult(acc.address, Models.STABLE_DIFFUSION, "generate some nice picture", Number(estimatedFee).toString())
    })
  });
});
