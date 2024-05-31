"use client";
import React from "react";
import Script from 'next/script';
import { Layout, Space, Image } from "antd";

const { Header, Footer } = Layout;

const items = [
  "主页 HOME |",
  "艺术 ART |",
  "铭刻 MINT |",
  "关于 ABOUT |",
  "白名单 VERIFY |",
  "团队 TEAM",
].map((item, index) => ({
  key: String(index + 1),
  label: item,
}));

function App({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout>
      <Header
        style={{
          padding: "0 200px",
          backgroundColor: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* <script src="https://ordinals.com/content/c94db3e74ba9feb5a7320719656b2f3687ef4a7e8f8c39c3fee13b072b4dd3d5i0" async></script> */}
      <Script src="/p5.min.js"></Script>
      <Script src="/draw_s.js"></Script>
      <Image src="/logo.png" width={30} alt="logo"></Image>
        <Space size={20}>
          {items.map((item) => (
            <a href="#" key={item.key}>
              {item.label}
            </a>
          ))}
        </Space>
      </Header>

      {children}
      <Footer
        style={{
          textAlign: "center",
          marginTop: "20px",
          backgroundColor: "#000",
        }}
      >
        <div className="w-full h-56 flex flex-col items-center justify-center">
          <Image width={80} height={80} src="/hero-logo.png" alt="hero-logo.png" />
          <h1
            style={{
              fontSize: "28px",
              color: "#fff",
            }}
          >
            BAStudio
          </h1>
        </div>
        <hr className="mb-10" />
        <span className="text-white">
          ©{"Copyright BAStudio. All Rights Reserved"}
        </span>
        <div className="text-white">Supported by BootstrapMade & Ordinals</div>
      </Footer>
    </Layout>
  );
}

export default App;
