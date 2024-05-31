
"use client"
import React, {useRef,useEffect,forwardRef,useImperativeHandle} from "react"
import {Button,message} from "antd";
import {getSeedCode} from "@/http/eth"
import {useAccountEffect,useAccount} from "wagmi"
import { EthStatePropsType } from "@/type/State";

const Generate = forwardRef((props:EthStatePropsType, ref) => {
    const [messageApi, contextHolder] = message.useMessage();
    useImperativeHandle(ref, () => ({
        getStop (){
            return new Promise((resolve,reject)=>{
                let count = 0
                const isStop = setInterval(()=>{
                    count ++ 
                    if(is_stop){
                        resolve(true)
                        clearInterval(isStop)
                    }
                    if(count === 60){
                        reject(false)
                        clearInterval(isStop)
                        messageApi.open({
                            type: 'error',
                            content: '没有查询到画布结束',
                        });
                    }
                 },1000)
            })
        },
        getImage(){
            return new Promise((resolve,reject)=>{
                try {
                    (window.get()!.canvas as HTMLCanvasElement).toBlob((blob)=>{
                        resolve(new Blob([blob!], { type: "image/png" }))
                    })
                } catch (error) {
                    reject(false)
                    messageApi.open({
                        type: 'error',
                        content: '生成截图报错',
                    });
                }
            })
        },
        resetGenerate(){
            handleGenerate()
        }
      }));
    const account = useAccount()
    const containerRef = useRef(null)
    useEffect(()=>{
        window.setup = function(){
            const canvas = window.createCanvas( 800, 800 );
            canvas.id('mycanvas');
            canvas.parent(containerRef.current!);
            // const  g_wimg = get();
            // console.log(g_wimg) 
        }
        window.draw = function () {
            window.renderMain();
            // var wImg = document.getElementById('walletImg');
            // wImg.src = p.get().canvas.toDataURL();
            // g_wimg = get();
        }
    })
    useAccountEffect({
        onConnect(data) {
            handleGenerate()
        },
        onDisconnect() {
          console.log('Disconnected!')
        },
      })
    async function handleGenerate(){
        if(!account.address) return
        const {data:{hSeed}} = await getSeedCode(account.address)
        props.updateState({hSeed})
        setTimeout(() => {
            window.initData(hSeed);
        }, 300);
    }

    return (
            <div
                style={{
                    minHeight: 380,
                    borderRadius: 10,
                    background: "#fff",
                    padding:"20px 0"
                }}
            >
                {contextHolder}
                <div 
                    id="image-container"
                    ref={containerRef}
                    className="flex justify-center"
                    style={{
                        height: 800,
                    }}
                >
                </div>
                <div className="flex justify-center m-4">
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
})
Generate.displayName = 'Generate';
export default Generate
