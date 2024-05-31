import {instance} from "@/http/btn/instance"
import{IOrderSave,IOrderExecute} from "./IV1"

export const getSeedCode = (address:string)=>{
    return instance.post("nft/create-seed",undefined,{
        params:{
            address,
        }
    })
}

export const saveOrder = (data:IOrderSave)=>{
    return instance.post("order/save",data)
}

export const executeOrder = (data:IOrderExecute)=>{
    return instance.put("order/execute",data)
}

export const validateOrder = (inscriptionsId:string)=>{
    return instance.get("nft/validate",{
        params:{
            inscriptionsId,
        }
    })
}


