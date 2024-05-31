// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {FunctionsClient} from "@chainlink/contracts/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/functions/v1_0_0/libraries/FunctionsRequest.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CMNft is ERC721, FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    error TokenUriNotFound();
    error UnexpectedRequestID(bytes32 requestId);
    error InsufficientFunds();

    mapping(uint256 => string) private _tokenIdToHSeed;
    uint256 private _tokenCounter = 0;

    bytes32 private _donID;
    address private _router;
    uint64 private _subscriptionId;
    string private _source;
    uint256 private _serviceFee = 0.01 ether;

    mapping(bytes32 => address) private _requestIdToAddr;

    string private _baseUri =
        "https://signet.ordinals.com/content/91a2560406b9922353f5fe463ee79a59ca0cff4fd0de54b1c55f0530b32273e1i0?hseed=";

    string private _baseImageUri = "https://apit.artsat.pro/static/seed/";

    string private _description = string(
        abi.encodePacked(
            "About ColorMask\\n",
            "Welcome to the captivating world of the ColorMask, where art transcends the boundaries of color and symbolism. Each piece in this series is a unique exploration of the intricate dance between vibrant hues and enigmatic masks. ColorMask is a celebration of the emotional and narrative depth that colors can convey, while the masks serve as gateways to hidden stories and concealed identities. Immerse yourself in the fusion of vivid palettes and elusive personas, as ColorMask Series invites you to experience art beyond the surface, a journey into the soul of colors and the mysteries they unveil.\\n\\n",
            unicode"《彩谱》\\n",
            unicode"欢迎开启您的《彩谱》艺术之旅：彩谱中文意味着彩色的脸谱，是象征京剧中的脸谱，表达了对悠久中华艺术文明的致敬。 作品艺术超越了色彩和象征的界限，也超越着时空的界限。 该系列中的每件作品都是对丰富色彩和神秘面具之间复杂舞蹈的独特探索。 《彩谱》是对颜色所能传达的情感和叙事深度的庆祝，而面具则是通往隐藏故事和隐秘身份的钥匙。 沉浸于生动的色彩和优雅的算法抽象曲线之美，《彩谱》系列邀请您体验超越表面的艺术， 踏入色彩灵魂深处并开启探索自我的神奇之旅。"
        )
    );

    uint32 private _gasLimit = 300000;

    event Response(bytes32 indexed requestId, string indexed hSeed, bytes response, bytes err);

    constructor(string memory source, bytes32 donID, address router, uint64 subscriptionId)
        ERC721("ColorMask", "CM")
        FunctionsClient(router)
        ConfirmedOwner(msg.sender)
    {
        _donID = donID;
        _router = router;
        _subscriptionId = subscriptionId;
        _source = source;
    }

    receive() external payable {}

    function mint() external payable returns (bytes32 requestId) {
        if (msg.value < _serviceFee) {
            revert InsufficientFunds();
        }
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(_source);

        string[] memory args = new string[](1);
        args[0] = Strings.toHexString(uint160(msg.sender), 20);
        req.setArgs(args);

        requestId = _sendRequest(req.encodeCBOR(), _subscriptionId, _gasLimit, _donID);
        _requestIdToAddr[requestId] = msg.sender;
        return requestId;
    }

    function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
        address addr = _requestIdToAddr[requestId];
        if (addr == address(0)) {
            revert UnexpectedRequestID(requestId);
        }

        string memory hSeed = string(response);
        if (err.length == 0) {
            _tokenIdToHSeed[_tokenCounter] = hSeed;
            _safeMint(addr, _tokenCounter);
            _tokenCounter = _tokenCounter + 1;
        }

        // Emit an event to log the response
        emit Response(requestId, hSeed, response, err);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (ownerOf(tokenId) == address(0)) {
            revert TokenUriNotFound();
        }
        string memory hSeed = _tokenIdToHSeed[tokenId];
        string memory url = string.concat(
            "data:application/json;,",
            string(
                abi.encodePacked(
                    '{"name":"Color Mask #',
                    Strings.toString(tokenId),
                    '", "description":"',
                    _description,
                    '","image": "',
                    string.concat(_baseImageUri, hSeed),
                    '","animation_url":"',
                    string.concat(_baseUri, hSeed),
                    '"}'
                )
            )
        );

        return url;
    }

    function withdrawETH(address payable to, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Address: insufficient balance");
        (bool success,) = to.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    function withdrawUnexpectedERC20(address token, address to, uint256 amount) external onlyOwner {
        IERC20(token).transfer(to, amount);
    }

    /* *****************
        Get/Set method
    ***************** */

    function setBaseImageUri(string memory newBaseUri) external onlyOwner {
        _baseImageUri = newBaseUri;
    }

    function setDescription(string memory description) external onlyOwner {
        _description = description;
    }

    function setSource(string memory newSource) external onlyOwner {
        _source = newSource;
    }

    function setBaseUri(string memory newBaseUri) external onlyOwner {
        _baseUri = newBaseUri;
    }

    function setGasLimit(uint32 newGasLimit) external onlyOwner {
        _gasLimit = newGasLimit;
    }

    function setServiceFee(uint256 serviceFee) external onlyOwner {
        _serviceFee = serviceFee;
    }

    function getBaseImageUri() public view returns (string memory) {
        return _baseImageUri;
    }

    function getDescription() public view returns (string memory) {
        return _description;
    }

    function getSource() public view returns (string memory) {
        return _source;
    }

    function getBaseUri() public view returns (string memory) {
        return _baseUri;
    }

    function getGasLimit() public view returns (uint32) {
        return _gasLimit;
    }
}
