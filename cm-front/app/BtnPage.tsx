"use client"
import GasContainer from "@/components/GasContainer";
import Generate from "@/components/ColorGenerate";
// import Mint from "@/components/Mint";
import {Breadcrumb, Layout} from "antd";
import React,{useState} from "react";
import {OrderStateType,UpdateOrderStateType} from "@/type/State"
const {Content} = Layout;

export default function Home() {

const [state,setState] = useState<OrderStateType>({
        address:"",
        feeRate:0,
        hSeed:""
    })
    const updateState:UpdateOrderStateType =  (newState) => {
        setState(prevState => ({ ...prevState, ...newState }));
      };
    return (
        <Content style={{margin: "0 auto",width:"1000px"}}>
            <Breadcrumb style={{margin: "16px 0"}}></Breadcrumb>
            <Generate updateState={updateState}></Generate>
            <GasContainer updateState={updateState}></GasContainer>
            {/* <Mint />  */}
        </Content>
    );
}