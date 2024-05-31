"use client";

import { ConnectButton, Connector } from '@ant-design/web3';
import { BitcoinWeb3ConfigProvider, UnisatWallet, XverseWallet, useBitcoinWallet } from '@ant-design/web3-bitcoin';
import {useBtnWalletStore} from "@/store/useBtnWalletStore"
import { Space } from 'antd';
import { useEffect } from 'react';

const Out: React.FC = () => {
  const { account } = useBitcoinWallet();
  const setAccount = useBtnWalletStore((state) => state.setAccount);
  useEffect(()=>{
    if(account){
      setAccount(account)
    }
  },[account])
  return null;
};
const App: React.FC = () => {
  return (
    <BitcoinWeb3ConfigProvider wallets={[XverseWallet(), UnisatWallet()]}>
      <Space>
        <Connector
          modalProps={{
            group: false,
            mode: 'simple',
          }}
        >
          <ConnectButton />
        </Connector>
        <Out></Out>
      </Space>
    </BitcoinWeb3ConfigProvider>
  );
};

export default App;