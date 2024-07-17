// app/metadata.ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solana Ecommerce",
  description: "Ecommerce site to purchase crypto products.",
  metadataBase: new URL("https://solana-nft-minting-dapp-kaktos.vercel.app/"),
  openGraph: {
    title: "Solana Ecommerce",
    description: "Ecommerce site to purchase crypto products.",
    url: "https://solana-nft-minting-dapp-kaktos.vercel.app/",
    siteName: "Solana Ecommerce",
    images: [
      {
        url: "/kaktosSMB.png",
        width: 1260,
        height: 800,
      },
    ],
  },
  twitter: {
    site: `@KaktosSol`,
    creator: `@KaktosSol`,
    card: "summary",
  },
  category: "blockchain",
  icons: "/kaktosSMB.png",
};
