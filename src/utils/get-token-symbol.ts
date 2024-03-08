import { ethers } from "ethers";
import ERC20ABI from "../constants/erc20-abi.json";

export async function getTokenSymbol(tokenAddress: string, rpcUrl: string): Promise<string> {
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const contractInstance = new ethers.Contract(tokenAddress, ERC20ABI, provider);
  return await contractInstance.symbol();
}
