// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {DeployCMNft} from "../script/DeployCMNft.s.sol";
import {CMNft} from "../src/ColorMaskNft.sol";
import {Test, console} from "forge-std/Test.sol";
import {StdCheats} from "forge-std/StdCheats.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CMNftTest is StdCheats, Test {
    string private _baseUri =
        "https://signet.ordinals.com/content/91a2560406b9922353f5fe463ee79a59ca0cff4fd0de54b1c55f0530b32273e1i0?hseed=";

    CMNft public basicNft;
    DeployCMNft public deployer;

    function setUp() public {
        deployer = new DeployCMNft();
        basicNft = deployer.run();
    }

    function testUrl() public view {
        string memory hSeed = "NzvbXGYPR2r084Qg";
        string memory url = string.concat(
            "data:application/json;,",
            string(
                abi.encodePacked(
                    '{"name":"ColorMask", "description":"',
                    basicNft.getDescription(),
                    '","image": "',
                    string.concat(basicNft.getBaseImageUri(), hSeed),
                    '","animation_url":"',
                    string.concat(basicNft.getBaseUri(), hSeed),
                    '"}'
                )
            )
        );
        console.log("url: ", url);
    }

    function testConvert() public view {
        string memory addr = Strings.toHexString(uint160(msg.sender), 20);
        console.log("addr: ", addr);
    }

    function testSource() public view {
        string memory source = "const address = args[0];" "const apiResponse = await Functions.makeHttpRequest({"
            "url: `https://apit.artsat.pro/app/seed/mint?address=${address}`" "});" "if (apiResponse.error) {"
            "throw Error(`Request failed:${JSON.stringify(apiResponse, null, 2)}`);" "}" "const { data } = apiResponse;"
            "if (!data || !data.data || !data.data.hSeed) {" "throw new Error('Invalid response: hSeed is missing');"
            "}" "return Functions.encodeString(data.data.hSeed);";
        console.log("source: ", source);
    }
}
