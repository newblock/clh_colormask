import type p5 from "p5"

declare interface global extends p5{
  initData:(code:string) => void;
}
declare global {
  var get:()=> ({  
    canvas: HTMLCanvasElement
  })
  var is_stop: boolean
  var initData: (code:string) => void;
  var renderMain: () => void;
  interface Window extends p5 {
    get:()=> ({  
      canvas: HTMLCanvasElement
    })
      renderMain: () => void;
      initData:(code:string) => void;
      is_stop:boolean
  }
}
export {};