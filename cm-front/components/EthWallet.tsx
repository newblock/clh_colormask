"use client";

import {getDefaultConfig,RainbowKitProvider} from '@rainbow-me/rainbowkit';

import { http, WagmiProvider } from 'wagmi'
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
    sepolia,
    avalancheFuji
} from 'wagmi/chains';

import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";

const config = getDefaultConfig({
    appName: 'ColorMask',
    projectId: 'YOUR_PROJECT_ID',
    chains: [avalancheFuji, mainnet, polygon, optimism, arbitrum, base, zora,...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),],
    ssr: true,
    transports: {
        [avalancheFuji.id]: http(),
        [polygon.id]: http(),
        [mainnet.id]: http(),
        [sepolia.id]: http(),
      },
});

const queryClient = new QueryClient();

export default function Providers({children}: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}