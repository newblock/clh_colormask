
let base_URL = 'https://api.artsat.pro'
// let btcNetwork = '';//主网: '/livenet', 测试网: '/testnet';
// base_URL += btcNetwork ;

let curnetwork = 'livenet' ;

let g_nftPrice = 120000 ;
let g_userLevel = 0 ;

let g_addressFund = null ;
let g_moneyAmount = 0 ;
let g_feeRate = 1 ;
let isPriceState = false ;
let g_isInscribed = true ;

let g_whiteStart  = 0;
let g_publicStart = 1712646000;//4月9日上午15点
let g_publicEnd   = 1716801600;//5月21日

// let g_whiteStart  = 1711800000 ;//1711848800
// let g_publicStart = 1712023200;
// let g_publicEnd   = 1712301600;

// 0 项目未开始
// 1 白名单开始
// 2 公售开始
// 3 公售结束
let g_curProjState = 0 ;
function getCurProjState()
{

  const curTimeStamp = ~~(new Date().getTime()/1000);
  console.log('curTime:',curTimeStamp);

  if(curTimeStamp < g_whiteStart)
  {
    g_curProjState = 0 ;
  }
  else if(curTimeStamp < g_publicStart)
  {
    g_curProjState = 1 ;
  }
  else if(curTimeStamp < g_publicEnd)
  {
    g_curProjState = 2 ;
  }
  else
  {
    g_curProjState = 3 ;
  }

  console.log('g_curProjState:',g_curProjState);

}

////////////////////////////////////////////////////
// 接口名称: inscribe
// 描述: 该接口用于记录用户的存款地址、交易ID和交易金额。
//
// 请求方式: POST
// 请求URL: /inscribe
//
// 请求参数:
//
// address (String): 用户的地址。
// moneyAddress (String): 存款地址。
// moneytxid (String): 交易ID。
//
// 返回值:
// txid (String): 成功记录的交易ID。
////////////////////////////////////////////////////
async function netInscribe(uniAddress,moneyaddress,moneytxid)
{
  if(!isValidTaprootAddress(uniAddress))
  {
    console.log('uniAddress 参数为无效地址！');
    return ;
  }
  let address = uniAddress ;

  console.log('ttt: netInscribe');

  var raw = JSON.stringify({
    "address": address,
    "moneyaddress": moneyaddress,
    "moneytxid": moneytxid
  });

  console.log(raw);

  let timestamp=Math.floor(Date.now() / 1000);//获取时间戳
  let str=raw+timestamp+"ApiSignKeyInsc2024";//签名内容
  let sign= CryptoJS.MD5(str).toString().toUpperCase();//签名

  var myHeaders = new Headers();
  myHeaders.append("Sign", sign);
  myHeaders.append("Timestamp", timestamp);
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Accept", "*/*");
  myHeaders.append("Connection", "keep-alive");

  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
  };
  let url_full = base_URL + '/v1/inscribe';

  try
  {
    const response = await fetch(url_full, requestOptions) ;
    const data = await response.json();
    if(data.status == 1)
    {
      resultTX = data.data.data;
      console.log(resultTX);
      // console.log('txID:',resultTX.commit_txid);
      // console.log('inscID:',resultTX.reveal_txid);

      return resultTX ;
    }
    console.log('data: netInscribe',data);
  }
  catch (error) 
  {
    console.error('Error netInscribe:', error);
  }
  return null ;
}
async function pushTXIDBack(uniAddress, moneyaddress, commitTX, revealTX, status)
{
  if(!isValidTaprootAddress(uniAddress))
  {
    console.log('uniAddress 参数为无效地址！');
    return ;
  }
  let address = uniAddress ;

  var raw = JSON.stringify({
    "address": address,
    "moneyaddress": moneyaddress,
    "cTx":commitTX,
    "rTx":revealTX,
    "status": status
  });

  console.log(raw);

  let timestamp=Math.floor(Date.now() / 1000);//获取时间戳
  let str=raw+timestamp+"ApiSignKeyInsc2024";//签名内容
  let sign= CryptoJS.MD5(str).toString().toUpperCase();//签名

  var myHeaders = new Headers();
  myHeaders.append("Sign", sign);
  myHeaders.append("Timestamp", timestamp);
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Accept", "*/*");
  myHeaders.append("Connection", "keep-alive");

  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
  };
  let url_full = base_URL + '/v1/save';

  try
  {
    const response = await fetch(url_full, requestOptions) ;
    return response ;
  }
  catch (error) 
  {
    console.error('Error pushTXIDBack:', error);
    return null ;
  }
}

function updatePUI()
{
  if(g_userLevel == 9)
  {
    g_nftPrice = 1000000;
    g_curProjState = 3 ;
  }
  let price = g_nftPrice;
  //console.log(satsToBitcoin(uniBalance.confirmed));
  let userState = '';
  
  console.log('g_userLevel:',g_userLevel);//addressPearlCount
  console.log('g_nftPrice:',price);//addressPearlCount

  if(price == 0 || g_userLevel == 2)
  {
    userState = '尊敬的藏家. <br>You Are VIP. <br><br>'+ 

    '舍南舍北皆春水，但见群鸥日日来。<br>'+
    '花径不曾缘客扫，蓬门今始为君开。<br>'+
    '盘飧市远无兼味，樽酒家贫只旧醅。<br>'+
    '肯与邻翁相对饮，隔篱呼取尽余杯。<br>'+

    '<br> Welcome To ColorMask  ';
  }
  // else if(g_userLevel == 1)
  // //else if(g_moneyAmount == 3000)
  // {
  //   price = price/2 ;
  //   userState = '您是珍珠的持有者. <br>You Are Pearl Horlder.';
  // }
  console.log(price);
  $('#mint_show_user_level').innerHTML = userState;
  $('#mint_show_nft_price').innerHTML = "价格 Price: "+ satsToBitcoin(price)+" BTC";
  console.log('isPriceSSS:',isPriceState);
  if(isPriceState)
  {
    $('#MintButton-uni').disabled = false ;
  }

  if(g_curProjState == 0)
  {
    $('#MintButton-uni').disabled = true ;
    $('#MintButton-uni').innerHTML = `服务器小憩中，铭刻将于4月1日20点继续.`;
  }
  else if(g_curProjState == 1)
  {
    if(g_userLevel == 9)
    {
      $('#MintButton-uni').disabled = true ;
      $('#MintButton-uni').innerHTML = `Currently in the whitelist release stage, the public release will begin at 15:00 on April 9st, Beijing time .
                                        <br>当前为白名单发售阶段，公开发售将于4月9日15点开始。`;
    }
    else
    {
      $('#MintButton-uni').disabled = false ;
      $('#MintButton-uni').innerHTML = `Mint<br>铭刻`;
    }
  }
  else if(g_curProjState == 2)
  {
    $('#MintButton-uni').disabled = false ;
    $('#MintButton-uni').innerHTML = `Mint<br>铭刻`;
  }
  else if(g_curProjState == 3)
  {
    $('#MintButton-uni').disabled = true ;
    $('#MintButton-uni').innerHTML = `发售已结束`;
  }

  // if(g_userLevel == 9)
  // {
  //   $('#MintButton-uni').disabled = true ;
  //   $('#MintButton-uni').innerHTML = `Currently in the whitelist release stage, the public release will begin at 15:00 on April 1st.
  //                                     <br>当前为白名单发售阶段，公开发售将于4月1日15点开始。`;
  // }
  // else
  // {
  //   $('#MintButton-uni').disabled = false ;
  //   $('#MintButton-uni').innerHTML = `Mint<br>铭刻`;
  // }
  //_0x36f362 = nftvalue;
}

async function getHashCodeByApi(uniAddress) 
{
    console.log('isOKAdd:',isValidTaprootAddress(uniAddress));
    if(!isValidTaprootAddress(uniAddress))
    {
      console.log('uniAddress 参数为无效地址！');
      return ;
    }
    getCurProjState();
    ///////////////////////////////////////////////////////
    let address = uniAddress ;
  
    let timestamp=Math.floor(Date.now() / 1000);//获取时间戳
    let str=""+timestamp+"ApiSignKeyInsc2024";//签名内容
    let sign= CryptoJS.MD5(str).toString().toUpperCase();//签名
  
    var myHeaders = new Headers();
    myHeaders.append("Sign", sign);
    myHeaders.append("Timestamp", timestamp);
    myHeaders.append("Accept", "*/*");
    myHeaders.append("Connection", "keep-alive");
  
    let requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    let url_full =  base_URL + '/v1/gethashcode?address=' + address;
  
    console.log(url_full);
    try
    {
      const response = await fetch(url_full, requestOptions) ;
      const data = await response.json();
      console.log(data);
      console.log('hashcode: ',data.data.hseed);
      initData(data.data.hseed);
    }
    catch (error) 
    {
      console.error('Error getHashCodeByApi:', error);
    }
}

async function getMoneyAddressByApi(uniAddress) {

    isPriceState = false ;
    let address = uniAddress;
    console.log('address:', address);

    let timestamp = Math.floor(Date.now() / 1000); //获取时间戳
    let str = "" + timestamp + "ApiSignKeyInsc2024"; //签名内容
    let sign = CryptoJS.MD5(str).toString().toUpperCase(); //签名

    var myHeaders = new Headers();
    myHeaders.append("Sign", sign);
    myHeaders.append("Timestamp", timestamp);
    myHeaders.append("Accept", "*/*");
    myHeaders.append("Connection", "keep-alive");

    let requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    //g_feeRate = 20 ;

    console.log('feeRate:',g_feeRate);

    let url_full = base_URL + '/v1/getmoneyaddress?address=' + address +'&feeRate='+g_feeRate;

    console.log(url_full);
    try
    {
      const response = await fetch(url_full, requestOptions) ;
      const data = await response.json();
      console.log(data);
      if(data.status == 1)
      {
        g_addressFund = data.data.moneyaddress ;
        g_moneyAmount = data.data.moneyamount ;
        g_userLevel = data.data.level ;
        g_nftPrice = data.data.fee ;
  
        console.log('g_addressFund: ', g_addressFund);
        console.log('g_moneyAmount：', g_moneyAmount);
  
        isPriceState = true ;
      }
      else if( data.status == 0 && data.code == 10020)
      {
        g_userLevel = 9 ;
        console.log(data.msg);
      }

      if(unisatInstalled)
      {
        if(g_isInscribed == true)
        {
            updatePUI();
        }
      }
      else
      {
        updateTempUI(g_moneyAmount, g_addressFund);
      }
    }
    catch (error) 
    {
      console.error('Error getMoneyAddressByApi:', error);
    }
}

// 更新二维码扫码
async function updateTempUI(totalFee,fundingAddress)
{
  if(g_userLevel == 9)
  {
    $("#div-mint-uni").style.display = "none";
    $("#collapseExample").style.display = "block";
    var html = `您的账号为非白名单地址，现在不能进行铭刻，请等待4月9日10点公售开启再试.`;

    $( '.mint_ui' ).innerHTML = html;
    return ;
  }

    //var sats_price = await satsToDollars( totalFee);
    //sats_price = Math.floor( sats_price * 100 ) / 100;
    //console.log(satsToBitcoin(fee + 1000 + nftvalue));
    $("#div-mint-uni").style.display = "none";
    $("#collapseExample").style.display = "block"
    var html = `<p>请向以下地址转入 ${satsToBitcoin(totalFee)} BTC 作文铭刻费用:</p><p>${fundingAddress}</p>`;
    $( '.mint_ui' ).innerHTML = html;
    var qr_value = "bitcoin:" + fundingAddress + "?amount=" + satsToBitcoin( totalFee );
    console.log( "qr:", qr_value );
    //$("#walletImg").style.display = 'none';
    $( '.mint_ui' ).append( createQR( qr_value ) );
    
    $( '.mint_ui' ).innerHTML += `<p class="checking_mempool">等待支付中...<span class="dots">.</span></p>`;
    // $( '.mint_ui' ).innerHTML += `<br/>`;
    $( '.mint_ui' ).append( createWalletImg( ) );
    //$( '.mint_ui' ).innerHTML += `<p class="checking_mempool">Checking the mempool<span class="dots">.</span></p>`;
    // $( '.mint_ui' ).innerHTML += `<p>1000 sats will go to the address</p><p>${fee} sats will go to miners as a mining fee</p>`;
    // $( '.mint_ui' ).innerHTML += `<p>${nftvalue} sats will go to art creator.</p>`;
}


async function finishShowInscInfo(txid,inscID)
{
    console.log(txid);

    //UI处理英文
    //var html = `<p style="background-color: white; color: black;">Success! Your file will shortly be inscribed on the bitcoin blockchain in this transaction:</p><p style="word-wrap: break-word;"><a href="https://mempool.space/testnet/tx/${txid}" target="_blank">https://mempool.space/testnet/tx/${txid}</a></p>`;
    //html += `<p style="background-color: white; color: black;">When your transaction confirms you can view it on the ordinals explorer here:</p><p style="word-wrap: break-word;"><a href="https://testnet.ordinals.com/inscription/${inscID}i0" target="_blank">https://testnet.ordinals.com/inscription/${inscID}i0</a></p>`;
    //中文
    var html = `<p style="background-color: white; color: black;">铭刻成功! 您可通过如下交易地址查看上链进度:</p><p style="word-wrap: break-word;"><a href="https://mempool.space/${mempoolNetwork}tx/${txid}" target="_blank">https://mempool.space/${mempoolNetwork}tx/${txid}</a></p>`;
    html += `<p style="background-color: white; color: black;">待链上信息确认后，可通过如下地址查看您的数字铭文艺术品:</p><p style="word-wrap: break-word;"><a href="https://ordinals.com/inscription/${inscID}i0" target="_blank">https://ordinals.com/inscription/${inscID}i0</a></p>`;
    html += `<p style="background-color: white; color: black;">亦可直接通过钱包查看铭文信息！</p>`;

    $( '#txmodel-body' ).innerHTML = html;
    var txModel = new bootstrap.Modal(document.getElementById('txModel'));
    txModel.show();

    // $('#MintButton-uni').disabled = false ;
    // $('#MintButton-uni').innerHTML = `Mint<br>铭刻`;
}

function showErrorCantactTG(address)
{
    console.log(address);
    //UI处理英文
    //var html = `<p style="background-color: white; color: black;">Success! Your file will shortly be inscribed on the bitcoin blockchain in this transaction:</p><p style="word-wrap: break-word;"><a href="https://mempool.space/testnet/tx/${txid}" target="_blank">https://mempool.space/testnet/tx/${txid}</a></p>`;
    //html += `<p style="background-color: white; color: black;">When your transaction confirms you can view it on the ordinals explorer here:</p><p style="word-wrap: break-word;"><a href="https://testnet.ordinals.com/inscription/${inscID}i0" target="_blank">https://testnet.ordinals.com/inscription/${inscID}i0</a></p>`;
    //中文
    var html = `<p style="background-color: white; color: black;">铭刻是发生错误，如您已支付手续费(gas), </p>
                <p style="word-wrap: break-word;">请到TG: <a href="https://t.me/colormasksat" target="_blank">t.me/colormasksat</a> 联系客服解决处理。</p>`;
    //html += `<p style="background-color: white; color: black;">请将 ${address} 地址提供给客服，以便处理。</p></p>`;
    html += `<p style="background-color: white; color: black;">给您带来不便，深表歉意!</p></p>`;

    $('#inscErrorModel-body' ).innerHTML = html;
    var txModel = new bootstrap.Modal(document.getElementById('inscErrorModel'));
    txModel.show();

    // $('#MintButton-uni').disabled = false ;
    // $('#MintButton-uni').innerHTML = `Mint<br>铭刻`;
}

async function getBasicInfo()
{
    const unisat = window.unisat;
    const [address] = await unisat.getAccounts();
    const publicKey = await unisat.getPublicKey();
    uniBalance = await unisat.getBalance();
    curnetwork = await unisat.getNetwork();
    console.log('curnetwork', curnetwork);
    console.log('tentnet address', address[0]);
};



// ////////////////////////////////////////////////////
// // 接口名称: gethashcode
// // 描述: 该接口用于根据用户的地址获取哈希码。
// //
// // 请求方式: GET
// // 请求URL: /gethashcode
// //
// // 请求参数:
// // address (String): 用户的地址。
// //
// // 返回值:
// // hseed (String): 用户的哈希码。
// ////////////////////////////////////////////////////

// function netGetHashCode(uniAddress)
// {
//   console.log('isOKAdd:',isValidTaprootAddress(uniAddress));
//   if(!isValidTaprootAddress(uniAddress))
//   {
//     console.log('uniAddress 参数为无效地址！');
//     return ;
//   }
//   ///////////////////////////////////////////////////////
//   let address = uniAddress ;

//   let timestamp=Math.floor(Date.now() / 1000);//获取时间戳
//   let str=""+timestamp+"ApiSignKeyInsc2024";//签名内容
//   let sign= CryptoJS.MD5(str).toString().toUpperCase();//签名

//   var myHeaders = new Headers();
//   myHeaders.append("Sign", sign);
//   myHeaders.append("Timestamp", timestamp);
//   myHeaders.append("Accept", "*/*");
//   myHeaders.append("Connection", "keep-alive");

//   let requestOptions = {
//     method: 'GET',
//     headers: myHeaders,
//   };
//   let url_full =  base_URL + '/v1/gethashcode?address=' + address;

//   fetch(url_full, requestOptions)
//     .then(response => response.json())
//     .then(data => {
//       // 在这里使用加载的JSON数据（data）
//       console.log(data.data);
//       console.log('hashcode: ',data.data.hseed);
//       initData(data.data.hseed);
//       //updatePUI();
//     })
//     .catch(error => {
//       console.error('Error getMoneyAddress:', error);
//     });
// }

// ////////////////////////////////////////////////////
// // 接口名称: getmoneyaddress
// // 描述: 该接口用于根据用户的地址获取存款地址和存款金额。
// //
// // 请求方式: GET
// // 请求URL: /getmoneyaddress
// //
// // 请求参数:
// // address (String): 用户的地址。
// //
// // 返回值:
// // moneyAddress (String): 
// // 用户的存款地址。
// // moneyAmount (Int): 
// // 用户的存款金额。
// ////////////////////////////////////////////////////
// async function netGetMoneyAddress(uniAddress)
// {
//   if(!isValidTaprootAddress(uniAddress))
//   {
//     console.log('uniAddress 参数为无效地址！');
//     return ;
//   }
//   ///////////////////////////////////////////////////////
//   let address = uniAddress ;
//   console.log('address:',address);

//   //console.log('ttt: netGetMoneyAddress');
//   let timestamp=Math.floor(Date.now() / 1000);//获取时间戳
//   let str=""+timestamp+"ApiSignKeyInsc2024";//签名内容
//   let sign= CryptoJS.MD5(str).toString().toUpperCase();//签名

//   var myHeaders = new Headers();
//   myHeaders.append("Sign", sign);
//   myHeaders.append("Timestamp", timestamp);
//   myHeaders.append("Accept", "*/*");
//   myHeaders.append("Connection", "keep-alive");

//   let requestOptions = {
//     method: 'GET',
//     headers: myHeaders,
//   };

//   let url_full = base_URL + '/v1/getmoneyaddress?address=' + address +'&feeRate='+g_feeRate;
//   //console.log(url_full);
  
//   fetch(url_full, requestOptions)
//     .then(response => response.json())
//     .then(data => {
//       // 在这里使用加载的JSON数据（data）
//       console.log(data);
//       g_addressFund = data.data.moneyaddress ;
//       g_moneyAmount = data.data.moneyamount ;
//       console.log(g_addressFund);
//       console.log('netGetMoneyAddress MONEY:',g_moneyAmount);
//       isPriceState = true ;
//       updatePUI();
//     })
//     .catch(error => {
//       console.error('Error getMoneyAddress:', error);
//     });
// }