export interface IOrderSave {
    address: string ; 
    feeRate: number ; 
    hSeed: string  
}

export interface IOrderExecute {
    orderId: string ; 
}