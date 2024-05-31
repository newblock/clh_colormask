"use client"
import { getAllFeeRates } from "@/http/mempool"
import React, { useState, useEffect,useMemo } from 'react'
import { Button, Slider, Input, Space } from 'antd';
import {useBtnWalletStore} from "@/store/useBtnWalletStore"
import {OrderStatePropsType} from "@/type/State"

const GasContainer: React.FC<OrderStatePropsType>= ({updateState})=> {
    const account = useBtnWalletStore((state) => state.account)
    const [data, setData] = useState({
        minfee:0,
        midfee:0,
        maxfee:0,
    });
    const [active,setActive] = useState(0)
    type KeyType = 'minfee' | 'midfee' | 'maxfee'
    const initList = [
        {key:'minfee',value:0,text:'Low'},
        {key:'midfee',value:0,text:'Normal'},
        {key:'maxfee',value:0,text:'Fast'},
    ]
    const list = useMemo(()=>{
        return initList.map((item)=>{
            return {...item,value: data[item.key as KeyType]}
        })
    },[data])
    const setFeeRate = (feeRate:number)=>{
        updateState({feeRate})
        setActive(feeRate)
    }
    useEffect(()=>{
        const fetchData = async () => {
            getAllFeeRates().then((res)=>{
                const hourFee = res.data.hourFee
                const value = {
                    minfee:~~(hourFee*0.85),
                    midfee:~~(hourFee*1.1),
                    maxfee:~~(hourFee*1.5),
                }
                setData(value);
                setFeeRate(value.minfee)
            }).catch((error)=>{
                console.log(error)
            })
        };
        fetchData();
    },[])
    return (
      <>
        <Space style={{width:"100%"}} direction="vertical">
        <Input value={account?.address}></Input>
        <div className="feerates flex justify-between">
            <p>Select a feerate (sats/vB)</p>
            {
                list.map((item:typeof list[number]) => {
                    return (
                        <div className="fee minfee" key={item.key}>
                            <Button 
                                type={item.value === active?'primary':'default'}
                                onClick={()=>setFeeRate(item.value)}
                            >
                                {item.value}
                            </Button>
                            <div className="name">{item.text}</div>
                        </div>
                    )
                })
            }
        </div>
        <div>
            <label>sats/vB: <span id="sats_per_byte">{active}</span></label>
            <Slider 
                min={25}
                max={200}
                value={active}
                onChange={(val)=> setFeeRate(val)}
            />
        </div>
        </Space>
      </>
    );
  }

export default GasContainer