import { create } from 'zustand'


interface IAccount  {
    address:string,  
}
interface IState {
  account: IAccount
  setAccount:(val:IAccount) =>void
}
export const useBtnWalletStore = create<IState>((set) => ({
    account: {address:''},
    setAccount: (val:IAccount) => set(() => {
       return { account: {...val} }
      })
  }))