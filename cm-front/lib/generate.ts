import {useP5Store} from "@/store/useP5Store"
import p5 from "p5"
import {type IBlist,type IBlistItem} from "./IGenerate"

let gHashSeed = '' ;
//是否闪烁 0-1
let gIsFlash = 0 ;
//窗格画刷风格: 1-4 ; i : 0-3
//填充,fill,1;
//线框,stroke,2;
//线框填充混合, mix:3;
//点阵风格,point, 4;
let gBrushStyle = 0 ;
//月亮风格：0-4
let gMoonStyle = 0 ;
//背景颜色: 1-3; i : 0-2
let gBackColIdx =  0 ;
//调色板类型：1-6 ; i : 0-5
export let gPalleteNum = 0 ;
//建树数量：3-18
let gBuildNum = 0 ;
let gGC:p5.Graphics ;
//pointsize: 点的大小，随机值1-5
let rr = 0 ;
//内部变量
let gBackcol:p5.Color  ;
let blist:IBlist = [];
let backcol = ["#333333","#111111","#d6c6af"];
let pallist = [];
let isFillList = [];
let grsunstyle = 0 ;
export let urlcor_nourl = [
  "111111-ffe300-ffffff-ff0000-0000ff",
  "d6c6af-7c9885-033f63-28666e-b5b682-fedc97",
  "f4d58d-001427-8d0801-708d81-bf0603",
  "ccc5b9-403d39-fffcf2-252422-eb5e28",
  "ccc5b9-010001-d59a2e-3a568d-fcaa21",
  "001a68-010001-989388-a52a21-feae01-f2271e-f18906",
  "0c0c30-d888b8-bc22b4-1c39a2-eca62f-d9402f",
  "00388f-0c0c30-ff0042-f36d90-fab551-05b4d3",
  "f4d58d-801f3c-ce2e58-818488-38b4ad-33363d",
  "121314-7a340f-15a48d-f35635-eff1c0-b7c301"
];
let urlcor_nourl_back = [
    //"111111-e20c14-1010cb-fef025-ffffff",
  //"333333-fff3b0-335c67-540b0e-9e2a2b-e09f3e"
  //"000000-fca311-14213d-e5e5e5-eeeeee",  
];
let wnr = 40 ;
let hnr = 5  ;
let pr = 0.9 ;

let getMoonStyle = 0;

let p5Ins:p5
export function getP5(){
    p5Ins = useP5Store.getState().p5Ins as p5
}

/**
 * 为了开发方便，加默认不闪烁
 * p5Ins.noLoop();
 */
export function initData(hashseed:string){
    gGC = p5Ins.createGraphics(1200, 1200);
    initHashRamdom(hashseed);
    gGC.rectMode(p5Ins.CENTER);
    p5Ins.noLoop();
    // if(gIsFlash == 0)
    // {
    //   p5Ins.noLoop();
    // }
    let pallete = createPalette(urlcor_nourl[gPalleteNum]);
    gBackcol = pallete[0];
    pallete.splice(0,1);
    wnr = ~~p5Ins.random(5,45);
    console.log(wnr);
    hnr = ~~p5Ins.random(3,25);
    pr  = [0.9,1.0,1.2][~~p5Ins.random(3)];
    console.log(pr);
    blist = [];
    for(let i = 0 ; i < gBuildNum ; i++)
    {
      let x = ~~p5Ins.random(0.1*gGC.width,0.9*gGC.width) ;
      let w = ~~p5Ins.random(50,150) ;
      let h = ~~p5Ins.random(0.2*gGC.height,gGC.height*0.9) ;
      let c = pallete[~~p5Ins.random(pallete.length)];
  
      let wn = ~~( w * (1/wnr));//p5Ins.random(5,10);//
      let hn = ~~( h * (1/hnr));

      let isFill = ~~p5Ins.random(2);

      let rlist = [];
      for(let i = 0 ; i < hn ; i++)
      {
        for(let j = 0 ; j < wn ; j++)
        {
          let r = ~~(p5Ins.random(1)*10);
          rlist.push(r);
        }
      }
      blist.push({x,w,h,c,rlist,isFill});
    }
}

function stringToUniqueNumber(str:string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash >>> 0; // Convert to unsigned 32-bit integer
}
function initHashRamdom(hashseed:string)
{
    gHashSeed = hashseed ;

    p5Ins.randomSeed(stringToUniqueNumber(hashseed)); 

    getMoonStyleIndex();

    gIsFlash = p5Ins.random(10) < 1.5 ? 1 : 0 ;

    getMoonStyle = ~~p5Ins.random(0,4);

    gBrushStyle = ~~p5Ins.random(4);

    gPalleteNum = ~~p5Ins.random(urlcor_nourl.length);

    gBuildNum = ~~p5Ins.random(3,18);

    gBackColIdx = ~~p5Ins.random(backcol.length);

    rr = p5Ins.random(1,4);
}

export function createPalette(pallate_str:string) {
    let arr = pallate_str.split('-');
    const arr2 = []
    for (let i = 0; i < arr.length; i++) {
        arr2[i] = p5Ins.color('#' + arr[i]);
    }
    return arr2;
  }
function getMoonStyleIndex()
{
    let rstyle = p5Ins.random(100);

    if(rstyle < 35)
    {
      gMoonStyle = 0 ;
    }
    else if( rstyle < 50)
    {
      gMoonStyle = 1 ;
    }
    else if( rstyle < 55)
    {
      gMoonStyle = 4 ;
    }
    else if( rstyle < 75)
    {
      gMoonStyle = 2 ;
    }
    else 
    {
      gMoonStyle = 3 ;
    }
    return gMoonStyle ;
}




export function drawOrdiCity()
{
  p5Ins.background(gBackcol);
  for(let build of blist)
  {
    drawbuild(build);
  }

  drawSun();
  
  //console.log('style:',gBrushStyle);
  const width = 1000
  const height = 1000
  p5Ins.image(gGC, 0, 0, width, height);
}


function drawbuild(item:IBlistItem)
{
    const {x,w,h,c,rlist,isFill}=item
  let wn = ~~( w * (1/wnr));//p5Ins.random(5,10);//
  let hn = ~~( h * (1/hnr));

  let wstep = ~~(w / wn) ;
  let hstep = ~~(h / hn) ;

  let hw = w / 2 ;
  gGC.fill(gBackcol);
  gGC.noStroke();

  gGC.rect(x,gGC.height-h/2,hw*2,h);

  if(gBrushStyle == 0)
  {
    gGC.fill(c);
    gGC.noStroke();
  }
  else if(gBrushStyle == 1)
  {
    gGC.stroke(c);
    gGC.noFill();
  }
  else if(gBrushStyle == 2 ||  gBrushStyle==3)
  {
    if(isFill == 0)
    {
      gGC.fill(c);
      gGC.noStroke();
    }
    else
    {
      gGC.stroke(c);
      gGC.noFill();
    }
  }

  for(let i = 0 ; i < hn ; i++)
  {
    for(let j = 0 ; j < wn ; j++)
    {
      let p = p5Ins.map(i, 0, hn, 0, pr);
      let xx = (x-hw) + j * wstep + wstep / 2 ;
      let yy = (gGC.height-h) + i * hstep + hstep / 2 ;
      let r = rlist[i*wn+j];
      if(gIsFlash == 1)
      {
        r = p5Ins.random(10);
      }
      if(p < r/10)
      {
        if(wnr > 25 && gBrushStyle==3)
        {
          drawRectPT(xx, yy, wstep * 0.7, wstep*0.7, c )
        }
        else
        {
          console.log('gbr:',gBrushStyle);
          gGC.rect(xx, yy + 15 - p5Ins.pow(hnr,0.5), wstep * 0.7, wstep * 0.7);
        }
      }
    }
  }
}

function drawRectPT(sx:number, sy:number, w:number, h:number ,c:p5.Color)
{
  gGC.push();
  gGC.noFill();
  gGC.stroke(c);
  let n = ( 25 * 25 ) ;
  for(let i = 0 ; i < ~~(n/rr) ; i++)
  {
    let x = sx + p5Ins.random(-w/2,w/2);
    let y = sy + p5Ins.random(-h/2,h/2);
    let r = rr ;//p5Ins.random(0.5, 1.5);
    gGC.strokeWeight(r);
    gGC.point(x, y);
  }
  gGC.pop();
}

function drawRectPT2(sx:number, sy:number, w:number, h:number ,c:number)
{
  let step = 5 ;
  gGC.push();
  let wn = ~~(w / step) ;
  let hn = ~~(h / step) ;
  gGC.stroke(c);
  gGC.strokeWeight(2);
  for(let i = 0 ; i < hn ; i++)
  {
    for(let j = 0 ; j < wn ; j++)
    {
      let x = sx + j * step + p5Ins.random(-5,5);
      let y = sy + i * step + p5Ins.random(-5,5);;

      p5Ins.point(x,y);
      //ellipse(x,y,10,10);
      //rect(x, y, 5,5);
    }
  }
  gGC.pop();
}

function drawSun()
{
  const C_WIDTH = 100;
  const R_WIDTH = 150;
  const DIFF = 10;
  const C_COUNT = Math.round(C_WIDTH / DIFF);
  const R_COUNT = Math.round(R_WIDTH / DIFF);
  const OFFSET = (C_WIDTH / 2 + R_WIDTH / 2) / 2 + 8;

  let draw_count = C_COUNT;

  if(gMoonStyle == 0)
  {
      return ;
  }
  if(gMoonStyle == 1 || gMoonStyle == 4)
  {
    gGC.push();
    gGC.noStroke();

    gGC.translate(gGC.width-150, 100);
  
    gGC.fill(252, 163, 17, 256);
    if(gMoonStyle == 4)
    {
        p5Ins.fill(191, 6, 3, 256);
    }
    gGC.ellipse(0, OFFSET, R_WIDTH ,R_WIDTH );
    gGC.pop();
    return ;
  }

    while ( draw_count > 0 ) 
    {
      gGC.push();
      gGC.translate(gGC.width-150, 100);
      gGC.noStroke();
      for (let i = R_COUNT; i > draw_count; i--) 
      {
          //const alpha = p5Ins.map(i, 0, REFLECTION_COUNT - 1, 0, 255);
          const alpha = i < 256 ? i : 255;
          gGC.fill(252, 163, 17, alpha);
          //fill(240, 200, 120, alpha);

          if(gMoonStyle == 2)
          {
            gGC.ellipse(0, OFFSET, R_WIDTH - (DIFF * i),R_WIDTH - (DIFF * i));
          }
          else
          {
            gGC.ellipse(0, - (DIFF / 2 * i) + OFFSET, R_WIDTH - (DIFF * i),R_WIDTH - (DIFF * i));
          }
      }
      draw_count--;
      gGC.pop();
    }
}



export function getHtmlFormat()
{
    const htmlCode = 
    `<html lang="en"><head><meta ticker="OrdiCity" opt="mint" hashseed="${gHashSeed}"><meta prjattr="ordicity_attr" attrlist="isFlash_brushStyle_backColStyle_moonStyle_palNo_buildNum"><meta isFlash="${gIsFlash}" brushStyle="${gBrushStyle+1}" moonStyle="${gMoonStyle}" palNo="${gPalleteNum+1}" buildNum="${gBuildNum}">`
    +`<style> body {margin: 0;background: #000;overflow: hidden;} canvas {bottom: 0;height: 100vw;left: 0;margin: auto;max-height: 100vh;max-width: 100vh;position: absolute;right: 0;top: 0;width: 100vw;}</style>`
    +`&lt;script type="module">import * as fcompress from '/content/f815bd5c566c6e46de5cdb6ccb3a7043c63deeba61f4234baea84b602b0d4440i0';`
    +`async function getBaseFile(){const baser = await fetch('/content/255ce0c5a0d8aca39510da72e604ef8837519028827ba7b7f723b7489f3ec3a4i0');const bases = await baser.text();const base = fcompress.strFromU8(fcompress.gunzipSync(new Uint8Array(Array.from(atob(bases)).map((char) => char.charCodeAt(0)))));eval(base);}`
    +`getBaseFile();&lt/script>&lt;script type="text/javascript" src="/content/e17e9f982a23dd01edbf9d98452de190bf3e2eb504fc64f3f40e22e9a29c43d5i0">&lt/script></head>`
    +`&lt;body>&lt;canvas id="canvas">&lt;/canvas>&lt;script type="text/javascript">let hashseed = ${gHashSeed} ;`
    +`function setup(){createCanvas(1200, 1200);rectMode(CENTER);frameRate(1);initData(hashseed);}function draw(){drawOrdiCity();}`
    +`&lt;/script> &lt;/body></html>`;

    return htmlCode;
}