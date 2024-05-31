import {instance} from "@/http/mempool/instance"

export const getAllFeeRates = ()=>{
    return instance.get("api/v1/fees/recommended")
}