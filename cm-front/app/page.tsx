"use client"
import Generate from "@/components/ColorEthGenerate";
import Mint from "@/components/Mint";
import NftImage from "@/components/NftImage";
import { UpdateEthStateType } from "@/type/State";
import {Breadcrumb, Layout} from "antd";
import React,{useRef, useState} from "react";
const {Content} = Layout;
interface GenerateRef {
    getImage: () => Promise<Blob>;
    getStop: () => Promise<boolean>;
    resetGenerate: () => void;
}
interface NftImageComRef {
    updateNftImage: () => void;
}
  
export default function Home() {
    const generateCom = useRef<GenerateRef>()
    const nftImageCom = useRef<NftImageComRef>()
    const [state,setState] = useState({hSeed:''})
    const getImageHandle = async()=>{
        const isStop = await generateCom.current!.getStop()
        if(isStop){
            return await generateCom.current!.getImage()
        }else{
            return false
        }
    }
    const updateState:UpdateEthStateType = (newState)=>{
        setState(prevState => ({ ...prevState, ...newState }));
    }
    const updateHandle = () => {
        generateCom.current!.resetGenerate()
        nftImageCom.current!.updateNftImage()
    }
    return (
        <Content style={{margin: "0 auto",width:"1000px"}}>
            <Breadcrumb style={{margin: "16px 0"}}></Breadcrumb>
            <Generate ref={generateCom} updateState={updateState}></Generate>
            <Mint state={state} getImageHandle={getImageHandle} updateHandle={updateHandle} /> 
            <NftImage ref={nftImageCom}></NftImage>
        </Content>
    );
}