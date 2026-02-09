import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, hardhat } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
    chains: [hardhat, sepolia, mainnet],
    connectors: [
        injected(),
    ],
    transports: {
        [hardhat.id]: http(),
        [sepolia.id]: http(),
        [mainnet.id]: http(),
    },
})
