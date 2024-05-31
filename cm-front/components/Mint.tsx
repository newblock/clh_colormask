"use client"
import { useWriteContract,useAccount } from 'wagmi'
import { Button,message,notification,Space } from 'antd';
import { abi } from '@/abi'
import {MintStatePropsType} from "@/type/State"
import React from 'react';
import { lockSeedCode } from "@/http/eth";
import {unlockSeedCode} from "@/http/eth";
import { ethers } from 'ethers';
import { config } from '@/config';

const Mint :React.FC<MintStatePropsType>= ({getImageHandle,updateHandle,state}) => {
    const [api, nContextHolder] = notification.useNotification();
    const [messageApi, mContextHolder] = message.useMessage();
    const { writeContract } = useWriteContract()
    const { address, isConnected } = useAccount();
    const goBtn = ()=>{
        const { hSeed } = state
        window.open(`https://signet.ordinals.com/content/91a2560406b9922353f5fe463ee79a59ca0cff4fd0de54b1c55f0530b32273e1i0?hseed=${hSeed}`)
    }
    const goProcess = ()=>{
        window.open(`https://testnet.snowtrace.io/address/${config.contractAddress}`)
    }
    const openNotification = () => {
        const key = `open${Date.now()}`;
        const btn = (
          <Space>
            <Button type="primary" size="small" onClick={goProcess}>
              查看进度
            </Button>
            <Button type="primary" size="small" onClick={goBtn}>
              BTC铭文
            </Button>
          </Space>
        );
        api.open({
          message: 'NFT MINT 成功',
          description:
            '您可以查看NFT上链进度以及BTC铭文',
          btn,
          key,
          duration: 0,
        });
      };
    const mint =   () => {
        writeContract({
            abi,
            address: config.contractAddress,
            functionName: 'mint',
            value: ethers.parseEther('0.01')
        },{
            onSuccess: async () => {
                openNotification()
                messageApi.open({
                    type: 'success',
                    content: 'Nft Mint 成功',
                });
                const res =  await getImageHandle()
                if(res){
                    try {
                        const formData = new FormData()
                        formData.append('address', address!)
                        formData.append('image', res as Blob)
                        await lockSeedCode(formData)
                        updateHandle()
                    } catch (error) {
                        console.log(error)
                    }
                }
            },
            onError: (err) => {
                messageApi.open({
                    type: 'error',
                    content: 'Nft Mint 失败',
                });
                unlockSeedCode(address!)
            },
        })
    }
    return (
        <>  
            {nContextHolder}
            {mContextHolder}
            <div className='flex justify-center my-4 bg-white py-4'>
                <Button style={{
                    background: "#a77415",
                    color:"#fff",
                    width:"100px",
                    height:"80px",
                }} disabled={!isConnected} onClick={mint}>
                    MINT 
                    <br></br>
                    铭刻
                </Button>
            </div>
        </>
    );
}
export default Mint
