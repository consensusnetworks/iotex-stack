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

	var net string
	var from int
	var to int

	app := &cli.App{
		Name: "crawler",
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:        "net",
				Value:       Testnet,
				Usage:       "network to crawl",
				Destination: &net,
			},
			&cli.IntFlag{
				Name:        "from",
				Value:       1,
				Usage:       "start block number",
				Destination: &from,
			},
			&cli.IntFlag{
				Name:        "to",
				Value:       2,
				Usage:       "end block number",
				Destination: &to,
			},
		},
		Commands: []cli.Command{
			{
				Name:  "actions",
				Usage: "get actions",
				Action: func(c *cli.Context) error {

					if to < from {
						log.Fatal("to must be greater than from")
						os.Exit(1)
					}

					crawler := NewCrawler(net)

					fmt.Println("crawling actions from ", from, " to ", to)

					actionsResponse, err := crawler.GetActions(from, to)

					if err != nil {
						log.Fatal(err)
						os.Exit(1)
					}

					crawler.Save(actionsResponse, "actions.json")

					if err != nil {
						log.Fatal(err)
						os.Exit(1)
					}

					return nil
				},
			},
		},
	}

	err := app.Run(os.Args)

	if err != nil {
		log.Fatal(err)
	}
}
