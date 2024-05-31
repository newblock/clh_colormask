// console.log(import.meta.env)
let mempoolNetwork = 'signet/'; // mainnet: '', 'signet/', 'testnet/'

export const config = {
	cmServerUrl: `https://mempool.space/${mempoolNetwork}`,
	btnServerUrl: "http://39.101.140.3:3000/api/",
	ethServerUrl: "https://apit.artsat.pro/app/",
	contractAddress: "0xDB77589A2661111F02BdC761b12Ae302b40c8c7b" as `0x${string}`,
	ethStaticUrl: "https://apit.artsat.pro/static/seed/"
}

