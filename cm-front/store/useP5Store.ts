import P5 from "p5"
// import { create } from 'zustand'
import { createStore } from 'zustand/vanilla'
interface IState {
    p5Ins: P5 | null,
    init:(sketch:(...args: any[])=>any)=>void
}
export const useP5Store = createStore<IState>((set) => ({
    p5Ins: null,
    init: (sketch:(...args: any[])=>any) => set({ p5Ins:  new P5(sketch)}),
}))