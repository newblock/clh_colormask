export type UpdateStateType<T> = (newState: Partial<T>)=> void;
export interface StatePropsType <T>{
    updateState: T
}



export type OrderStateType = { 
    address: string ; 
    feeRate: number ; 
    hSeed: string   
}

export type EthStateType = { 
    hSeed: string   
}

export type UpdateOrderStateType = UpdateStateType<OrderStateType>

export type UpdateEthStateType = UpdateStateType<EthStateType>

export type OrderStatePropsType  = StatePropsType<UpdateOrderStateType>

export type EthStatePropsType  = StatePropsType<UpdateEthStateType>

export interface MintStatePropsType {
    getImageHandle: () => Promise<Blob | boolean>
    updateHandle: () => void
    state: EthStateType
}