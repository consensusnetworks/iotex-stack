package main

import (
	"fmt"
	"os"
)

const (
	Mainnet = "mainnet"
	Testnet = "testnet"
)

func main() {
	crawler := NewCrawler(Mainnet)

	chainMeta, err := crawler.GetChainMetadata()

	crawler.Save(chainMeta, "chain_meta.json")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	blocksMeta, err := crawler.GetBlocksMetadata(1, 500)

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	crawler.Save(blocksMeta, "blocks.json")

	actions, err := crawler.GetActions(1, 500)

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	crawler.Save(actions, "actions.json")

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	fmt.Println("done")
}
