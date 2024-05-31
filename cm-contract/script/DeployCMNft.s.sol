// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Script} from "forge-std/Script.sol";
import {CMNft} from "../src/ColorMaskNft.sol";
import {console} from "forge-std/console.sol";

contract DeployCMNft is Script {
    uint256 public DEFAULT_ANVIL_PRIVATE_KEY = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
    uint256 public deployerKey;
    string public source = "const address = args[0];" "const apiResponse = await Functions.makeHttpRequest({"
        "url: `https://apit.artsat.pro/app/seed/mint?address=${address}`" "});" "if (apiResponse.error) {"
        "throw Error(`Request failed:${JSON.stringify(apiResponse, null, 2)}`);" "}" "const { data } = apiResponse;"
        "if (!data || !data.data || !data.data.hSeed) {" "throw new Error('Invalid response: hSeed is missing');" "}"
        "return Functions.encodeString(data.data.hSeed);";

    function run() external returns (CMNft) {
        if (block.chainid == 31337) {
            deployerKey = vm.envUint("DEFAULT_ANVIL_KEY");
        } else {
            deployerKey = vm.envUint("PRIVATE_KEY");
        }

        vm.startBroadcast(deployerKey);
        // fuji
        CMNft nft = new CMNft(
            source,
            0x66756e2d6176616c616e6368652d66756a692d31000000000000000000000000,
            0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0,
            8688
        );

        // sepolia
        // CMNft nft = new CMNft(
        //     source,
        //     0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000,
        //     0xb83E47C2bC239B3bf370bc41e1459A34b41238D0,
        //     2784
        // );
        vm.stopBroadcast();

        return nft;
    }
}

contract MintNft is Script {
    function run() external {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        CMNft(payable(0xDB77589A2661111F02BdC761b12Ae302b40c8c7b)).mint{value: 0.01 ether}();
        vm.stopBroadcast();
    }
}

contract SetGasFee is Script {
    function run() external {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        CMNft(payable(0x842164C93F84d8ec18Eabff5Cb2266107F73883e)).setGasLimit(300000);
        vm.stopBroadcast();
    }
}

contract SetSource is Script {
    string public source = "const address = args[0];" "const apiResponse = await Functions.makeHttpRequest({"
        "url: `https://apit.artsat.pro/app/seed/mint?address=${address}`" "});" "if (apiResponse.error) {"
        "throw Error(`Request failed:${JSON.stringify(apiResponse, null, 2)}`);" "}" "const { data } = apiResponse;"
        "if (!data || !data.data || !data.data.hSeed) {" "throw new Error('Invalid response: hSeed is missing');" "}"
        "return Functions.encodeString(data.data.hSeed);";

    function run() external {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        CMNft(payable(0x842164C93F84d8ec18Eabff5Cb2266107F73883e)).setSource(source);
        vm.stopBroadcast();
    }
}

contract SetDesc is Script {
    string private _description = string(
        abi.encodePacked(
            "About ColorMask\\n",
            "Welcome to the captivating world of the ColorMask, where art transcends the boundaries of color and symbolism. Each piece in this series is a unique exploration of the intricate dance between vibrant hues and enigmatic masks. ColorMask is a celebration of the emotional and narrative depth that colors can convey, while the masks serve as gateways to hidden stories and concealed identities. Immerse yourself in the fusion of vivid palettes and elusive personas, as ColorMask Series invites you to experience art beyond the surface, a journey into the soul of colors and the mysteries they unveil.\\n\\n",
            unicode"《彩谱》\\n",
            unicode"欢迎开启您的《彩谱》艺术之旅：彩谱中文意味着彩色的脸谱，是象征京剧中的脸谱，表达了对悠久中华艺术文明的致敬。 作品艺术超越了色彩和象征的界限，也超越着时空的界限。 该系列中的每件作品都是对丰富色彩和神秘面具之间复杂舞蹈的独特探索。 《彩谱》是对颜色所能传达的情感和叙事深度的庆祝，而面具则是通往隐藏故事和隐秘身份的钥匙。 沉浸于生动的色彩和优雅的算法抽象曲线之美，《彩谱》系列邀请您体验超越表面的艺术， 踏入色彩灵魂深处并开启探索自我的神奇之旅。"
        )
    );

    function run() external {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        CMNft(payable(0x842164C93F84d8ec18Eabff5Cb2266107F73883e)).setDescription(_description);
        vm.stopBroadcast();
    }
}
