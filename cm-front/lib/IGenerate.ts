import {type Color} from "p5" 
export interface IBlistItem {
    x:number,
    w:number,
    h:number,
    c:Color,
    rlist:number[],
    isFill:number,
}

export type IBlist = IBlistItem[]