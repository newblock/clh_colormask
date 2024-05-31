import {instance} from "@/http/eth/instance"
// import{IOrderSave,IOrderExecute} from "./IV1"

// 以太坊
export const getSeedCode = (address:string)=>{
    return instance.get("seed/create",{
        params:{
            address,
        }
    })
}

export const lockSeedCode = (data:FormData)=>{
    return instance.post("seed/lock",data)
}

export const unlockSeedCode = (address:string)=>{
    return instance.post("seed/unlock",undefined,{
        params:{
            address
        }
    })
}

export const getNftImage = (address:string)=>{
    return instance.get("seed/address",{
        params:{
            address,
        }
    })
    
}

// 后端给合约调用的
// export const mintSeedCode = (address:string)=>{
//     return instance.get("seed/mint",{
//         params:{
//             address,
//         }
//     })
// }
