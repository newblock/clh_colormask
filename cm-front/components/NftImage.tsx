"use client"
import { Image, Space, Typography} from 'antd';
import React,{useState,forwardRef, useImperativeHandle} from 'react';
import { getNftImage } from "@/http/eth";
import {useAccountEffect,useAccount} from "wagmi"
import { config } from '@/config';
const { Title } = Typography;

const NftImage = forwardRef((props, ref) => {
    useImperativeHandle(ref, ()=>({
        updateNftImage(){
            getNftImageHandle()
        }
    }))
    const [images,setImages] = useState([])
    const {address,isConnected} = useAccount()
    const getNftImageHandle = async()=>{
        const {data:{hSeeds}} = await getNftImage(address!)
        setImages(hSeeds)
    }
    useAccountEffect({
        onConnect(data) {
            if(!isConnected)return
            getNftImageHandle()
        },
        onDisconnect() {
          console.log('Disconnected!')
        },
      })

    return (
        images.length ?  <>  
            <Title level={5} style={{color:"#a77415"}} className='m-4'>您已经拥有的NFT</Title>
            <div className='flex'>
                <Image.PreviewGroup>
                    <Space>
                    {
                        images.map((item,index) => {
                            return <Image width={100} src={`${config.ethStaticUrl}${item}`} alt={`nft-${index}`} key={index}></Image>
                        })
                    }
                    </Space>
                </Image.PreviewGroup>
            </div>
        </>:null
    );
})
NftImage.displayName = 'NftImage';
export default NftImage

