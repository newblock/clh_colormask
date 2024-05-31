
"use client"
import {useRef,useState,useEffect, use} from "react"
import {Button,Spin} from "antd";
import {useP5Store} from "@/store/useP5Store"
import {initData, createPalette,gPalleteNum,urlcor_nourl,drawOrdiCity,getP5,getHtmlFormat}from "@/lib/generate"
import { Input } from 'antd';
import { TextAreaRef } from 'antd/lib/input/TextArea';
const { TextArea } = Input;
import {getSeedCode} from "@/http/btn"
import {useBtnWalletStore} from "@/store/useBtnWalletStore"


export default function Generate() {
    const account = useBtnWalletStore((state) => state.account)
    const containerRef = useRef(null)
    const terminal = useRef(null)
    const [terminalValue,setTerminalValue] = useState('')
    const [colorValue,setColorValue] = useState('')
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(()=>{
        if(account.address){
            const {init} = useP5Store.getState()
            init((p) => {
                p.setup = () => {
                    (async function(){
                        const canvas = p.createCanvas( 1000, 1000 );
                        canvas.id('mycanvas');
                        canvas.parent(containerRef.current!); 
                        // let rndSeed = ~~p.random(100000);
                        const {data:{hSeed:rndSeed}} = await getSeedCode(account.address)
                        // let rndSeed = ~~p.random(100000);
                        p.frameRate(1);
                        getP5()
                        initData(rndSeed);
                        setTerminalValue(getHtmlFormat())
                        p.draw = () => {
                            // setLoading(true)
                            drawOrdiCity();
                            // setLoading(false)
                        };
                    })()
                };
            })
        }
    },[account])
    async function handleGenerate(){
        if(!account.address){
            return 
        }
        const p5Ins = useP5Store.getState().p5Ins!
        const {data:{hSeed:rndSeed}} = await getSeedCode(account.address)
        // let rndSeed = ~~p5Ins.random(100000);
        p5Ins.loop();
        initData(rndSeed);
        setTerminalValue(getHtmlFormat())
        let colorList = createPalette(urlcor_nourl[gPalleteNum]);
        setColorValue(colorList[colorList.length - 1].toString())
    }
    function handleSelect(){
        ((terminal.current! as TextAreaRef).resizableTextArea?.textArea as HTMLTextAreaElement).select()
    }
    return (
            <div
                style={{
                    minHeight: 380,
                    background: "#fff",
                    borderRadius: 10,
                }}
            >
                <Spin spinning={loading}>
                    <div 
                        id="image-container"
                        ref={containerRef}
                        className="flex justify-center"
                        style={{
                            height: 800,
                        }}
                    >
                    </div>
                </Spin>
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
                <h3>Inscription</h3>
                <TextArea 
                    style={{
                        color:colorValue
                    }} 
                    readOnly 
                    ref={terminal}  
                    rows={10} 
                    placeholder="" 
                    value={terminalValue}
                    onFocus={handleSelect}
                    maxLength={10000} />
            </div>
            
    );
}

