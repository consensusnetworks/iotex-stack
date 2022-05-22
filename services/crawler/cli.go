package main

import (
	"fmt"
	"log"
	"os"

	"github.com/urfave/cli"
)

const (
	Mainnet = "mainnet"
	Testnet = "testnet"
)

func main() {
	cli := &cli.App{
		Name: "crawl",
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:  "net",
				Value: "testnet",
				Usage: "network to crawl",
			},
			&cli.IntFlag{
				Name:  "from",
				Value: 1,
				Usage: "start block number",
			},
			&cli.IntFlag{
				Name:  "to",
				Value: 100,
				Usage: "end block number",
			},
		},
		Commands: []cli.Command{
			{
				Name:    "blocks",
				Aliases: []string{"b"},
				Usage:   "crawl blocks",
				Action: func(c *cli.Context) error {

					crawler := NewCrawler("testnet")

					from := c.Int("from")

					if from < 1 {
						log.Fatal("from must be greater than 0")
						os.Exit(1)
					}

					to := c.Int("to")

					if to < from {
						log.Fatal("to must be greater than from")
						os.Exit(1)
					}

					blocksMeta, err := crawler.GetBlocksMetadata(from, to)

					if err != nil {
						log.Fatal(err)
						os.Exit(1)
					}

					crawler.Save(blocksMeta, "blocks.json")
					fmt.Println("crawl blocks")
					return nil
				},
			},
			{
				Name:    "actions",
				Aliases: []string{"a"},
				Usage:   "crawl actions",
				Action: func(c *cli.Context) error {
					fmt.Println("crawl actions")
					return nil
				},
			},
		},
	}

	err := cli.Run(os.Args)

	if err != nil {
		log.Fatal(err)
	}
}
