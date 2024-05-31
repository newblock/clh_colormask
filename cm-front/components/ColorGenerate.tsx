
"use client"
import React, {useRef,useEffect,useState} from "react"
import {Button} from "antd";
import {getSeedCode} from "@/http/btn"
import {useBtnWalletStore} from "@/store/useBtnWalletStore"
import {OrderStatePropsType} from "@/type/State"
import { canvasToData } from "@/lib/canvasToData";


const Generate: React.FC<OrderStatePropsType> = ({updateState}) => {
    const account = useBtnWalletStore((state) => state.account)
    const containerRef = useRef(null)
    useEffect(()=>{
        // let canvasEle = null
        window.setup = function(){
            const canvas = window.createCanvas( 800, 800 );
            // canvasEle = canvas
            canvas.id('mycanvas');
            canvas.parent(containerRef.current!);
            // const  g_wimg = get();
            // console.log(g_wimg) 
        }
        window.draw = function () {
            const {account:account} = useBtnWalletStore.getState()
            if(account.address){
                window.renderMain();
            }
            // var wImg = document.getElementById('walletImg');
            // wImg.src = p.get().canvas.toDataURL();
            // g_wimg = get();
        }

        // 当画好时,调接口把图片传给后端, 通过全局变量 is_stop 判断
        if(window.is_stop !== undefined && window.is_stop !== null) {
            const timer = setInterval(() => {
                if(window.is_stop) {
                    // uploadImg(canvasEle)
                    clearInterval(timer)
                } 
              }, 200);
              // 清除定时器
              return () => clearInterval(timer);
        }
    },[])
    useEffect(()=>{
        console.info('handleGenerate')
        console.info(containerRef)
        handleGenerate()
    },[account])

    async function handleGenerate(){

        if(!account.address){
            return 
        }
        
        const {data:{hSeed}} = await getSeedCode(account.address)
        updateState({hSeed,address:account.address})
        window.initData(hSeed);
    }

    async function uploadImg (canvas: HTMLCanvasElement) {
        if(!canvas) return;
        const data = canvasToData(canvas)
        //等接口 调接口
        // await uploadApi(data)
    }

    return (
            <div
                style={{
                    minHeight: 380,
                    background: "#fff",
                    borderRadius: 10,
                }}
            >
                <div 
                    id="image-container"
                    ref={containerRef}
                    className="flex justify-center"
                    style={{
                        height: 800,
                    }}
                >
                </div>
                <div className="flex justify-center">
                    <Button
                        onClick={handleGenerate}
                        size="large"
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: "2px solid #000",
                        }}
                    >
                        {" "}
                        创作 Generate{" "}
                    </Button>
                </div>
            </div>
            
    );
}
export default Generate
