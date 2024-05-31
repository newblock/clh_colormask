-include .env

.PHONY: all test clean deploy fund help install snapshot format anvil verify

DEFAULT_ANVIL_KEY := 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

all: clean remove install update build

# Clean the repo
clean  :; forge clean

# Remove modules
remove :; rm -rf .gitmodules && rm -rf .git/modules/* && rm -rf lib && touch .gitmodules && git add . && git commit -m "modules"

install :; forge install smartcontractkit/chainlink@contracts-v1.0.0 --no-commit && forge install Cyfrin/foundry-devops@0.1.0 --no-commit && forge install foundry-rs/forge-std@v1.7.0 --no-commit && forge install openzeppelin/openzeppelin-contracts@v4.8.3 --no-commit

# Update Dependencies
update:; forge update

build :; forge build --extra-output-files abi

test :; forge test 

snapshot :; forge snapshot

format :; forge fmt

anvil :; anvil -m 'test test test test test test test test test test test junk' --steps-tracing --block-time 1

NETWORK_ARGS := --rpc-url http://localhost:8545 --private-key $(DEFAULT_ANVIL_KEY) --broadcast

ifeq ($(findstring --network fuji,$(ARGS)),--network fuji)
	NETWORK_ARGS := --rpc-url $(FUJI_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --legacy -vvvv
endif

deploy:
	@forge script script/DeployCMNft.s.sol:DeployCMNft $(NETWORK_ARGS)

mint:
	@forge script script/DeployCMNft.s.sol:MintNft ${NETWORK_ARGS} 

gas:
	@forge script script/DeployCMNft.s.sol:SetGasFee ${NETWORK_ARGS}

source:
	@forge script script/DeployCMNft.s.sol:SetSource ${NETWORK_ARGS}	

desc:
	@forge script script/DeployCMNft.s.sol:SetDesc ${NETWORK_ARGS}	


# forge verify-contract 0x842164C93F84d8ec18Eabff5Cb2266107F73883e src/ColorMaskNft.sol:CMNft --verifier-url 'https://api.routescan.io/v2/network/testnet/evm/43113/etherscan' --etherscan-api-key HGBXSBEWRV2TIT5J8BSI82JRU3BACBIAUR --num-of-optimizations 200 --compiler-version 0.8.19 --constructor-args $(cast abi-encode "constructor(string,bytes32,address,uint64)" "const address = args[0];" 0x66756e2d6176616c616e6368652d66756a692d31000000000000000000000000 0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0 8688) --chain-id 43113