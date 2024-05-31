"use client"

import { Image } from "antd";
import { ConnectButton } from '@rainbow-me/rainbowkit';
export default function Home() {
  return (
    // tailwind css 全屏 黑色 居中
    <div className="h-screen bg-black flex flex-col items-center justify-center">
      <Image src="/hero-logo.png" alt="hero-logo" />
      <h1
        style={{
          fontSize: "38px",
          lineHeight: "36px",
          marginBottom: "30px",
          fontWeight: "500",
          color: "#fff",
        }}
      >
        ColorMask
      </h1>
      <h1
        style={{
          fontSize: "38px",
          lineHeight: "36px",
          marginBottom: "30px",
          fontWeight: "500",
          color: "#fff",
        }}
      >
        彩谱
      </h1>
      <h2
        style={{
          fontSize: "14x",
          marginBottom: "30px",
          fontWeight: "400",
          color: "#aeaeae",
        }}
      >
        A Generative Art on Bitcoin
      </h2>
      <h2
        style={{
          fontSize: "14x",
          marginBottom: "30px",
          fontWeight: "400",
          color: "#aeaeae",
        }}
      >
        或许是您的第一个比特币艺术NFT
      </h2>
      <ConnectButton></ConnectButton>
      {/* <button
          style={{
            textTransform: "uppercase",
            fontWeight: 400,
            fontSize: "16px",
            letterSpacing: "1px",
            borderRadius: "3px",
            height: "70px",
            padding: "10px 35px",
          }}
          className="text-white bg-orange-700 hover:bg-black transition-all duration-700 hover:text-orange-700"
        >
          Connect Wallet <br />
          连接Unisat钱包
        </button> */}
    </div>
  );
}
