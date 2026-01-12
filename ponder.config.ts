import { createConfig } from "ponder";
import { http } from "viem";

import { HybridAllocatorAbi } from "./abis/HybridAllocatorAbi";

export default createConfig({
  ordering: "multichain",
  networks: {
    mainnet: { chainId: 1, transport: http(process.env.PONDER_RPC_URL_1) },
    sepolia: { chainId: 11155111, transport: http(process.env.PONDER_RPC_URL_11155111) },
    base: { chainId: 8453, transport: http(process.env.PONDER_RPC_URL_8453) },
    baseSepolia: { chainId: 84532, transport: http(process.env.PONDER_RPC_URL_84532) },
    arbitrum: { chainId: 42161, transport: http(process.env.PONDER_RPC_URL_42161) },
    arbitrumSepolia: { chainId: 421614, transport: http(process.env.PONDER_RPC_URL_421614) },
    optimism: { chainId: 10, transport: http(process.env.PONDER_RPC_URL_10) },
    optimismSepolia: { chainId: 11155420, transport: http(process.env.PONDER_RPC_URL_11155420) },
    unichain: { chainId: 130, transport: http(process.env.PONDER_RPC_URL_130) },
    unichainSepolia: { chainId: 1301, transport: http(process.env.PONDER_RPC_URL_1301) },
  },
  contracts: {
    HybridAllocator: {
      abi: HybridAllocatorAbi,
      address: "0xa110cE8BFD2Bb33fd7dB4804f9b8736fE4d05A4B",
      network: {
        mainnet: { startBlock: 24042093 },
        sepolia: { startBlock: 9868943 },
        base: { startBlock: 39652362 },
        baseSepolia: { startBlock: 35979265 },
        arbitrum: { startBlock: 412283377 },
        arbitrumSepolia: { startBlock: 225928853 },
        optimism: { startBlock: 145247763 },
        optimismSepolia: { startBlock: 37962052 },
        unichain: { startBlock: 35344987 },
        unichainSepolia: { startBlock: 39241317 },
      },
    },
  },
  blocks: {
    // Block tracking for cross-indexer consistency checks (24-hour retention)
    BlockTracker: {
      network: {
        mainnet: { startBlock: 24042093, interval: 1 },
        sepolia: { startBlock: 9868943, interval: 1 },
        base: { startBlock: 39652362, interval: 1 },
        baseSepolia: { startBlock: 35979265, interval: 1 },
        arbitrum: { startBlock: 412283377, interval: 1 },
        arbitrumSepolia: { startBlock: 225928853, interval: 1 },
        optimism: { startBlock: 145247763, interval: 1 },
        optimismSepolia: { startBlock: 37962052, interval: 1 },
        unichain: { startBlock: 35344987, interval: 1 },
        unichainSepolia: { startBlock: 39241317, interval: 1 },
      },
    },
  },
});
