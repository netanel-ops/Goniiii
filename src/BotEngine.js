import { ethers } from "ethers";

export default class BotEngine {
  constructor(signer, tokenAddress, routerAddress) {
    this.signer = signer;
    this.tokenAddress = tokenAddress;
    this.routerAddress = routerAddress;
    this.contract = new ethers.Contract(
      routerAddress,
      [
        "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) payable returns (uint[] memory amounts)",
        "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) returns (uint[] memory amounts)"
      ],
      signer
    );
  }

  async buyETH(amountInETH) {
    try {
      const tx = await this.contract.swapExactETHForTokens(
        0,
        [ethers.constants.AddressZero, this.tokenAddress],
        await this.signer.getAddress(),
        Math.floor(Date.now() / 1000) + 60 * 10,
        { value: ethers.utils.parseEther(amountInETH.toString()) }
      );
      await tx.wait();
      return tx;
    } catch (err) {
      console.error("BUY ERROR:", err);
      throw err;
    }
  }

  async sellToken(amountInTokens) {
    try {
      const tx = await this.contract.swapExactTokensForETH(
        ethers.utils.parseUnits(amountInTokens.toString(), 18),
        0,
        [this.tokenAddress, ethers.constants.AddressZero],
        await this.signer.getAddress(),
        Math.floor(Date.now() / 1000) + 60 * 10
      );
      await tx.wait();
      return tx;
    } catch (err) {
      console.error("SELL ERROR:", err);
      throw err;
    }
  }

  async startBot({ amount, delay, mode, cycles }) {
    for (let i = 0; i < cycles; i++) {
      if (mode === "BUY" || mode === "BOTH") await this.buyETH(amount);
      if (mode === "BOTH") await new Promise(r => setTimeout(r, delay * 1000));
      if (mode === "SELL" || mode === "BOTH") await this.sellToken(amount);
      await new Promise(r => setTimeout(r, delay * 1000));
    }
  }
}
