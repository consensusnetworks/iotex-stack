package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"time"

	"github.com/iotexproject/iotex-proto/golang/iotexapi"
)

func init() {
	_, err := os.ReadDir("./output")

	if err != nil {
		fmt.Println("output directory not found, creating it")
		err = os.Mkdir("./output", 0755)
		if err != nil {
			fmt.Println("error creating output directory")
			os.Exit(1)
		}
	}
}

type Crawler struct {
	CreatedAt time.Time      `json:"created_at"`
	Net       string         `json:"net"`
	Service   GetInfoService `jsion:"-"`
}

func NewCrawler(net string) *Crawler {
	service := NewGetInfoService("", fmt.Sprintf("api.%s.iotex.one:443", net), true)

	return &Crawler{
		CreatedAt: time.Now(),
		Net:       net,
		Service:   service,
	}
}

func (c *Crawler) GetChainMetadata() (*iotexapi.GetChainMetaResponse, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()

	meta, err := c.Service.GetChainMeta(ctx, &iotexapi.GetChainMetaRequest{})

	if err != nil {
		return nil, err
	}

	return meta, nil
}

func (c *Crawler) GetBlocksMetadata(start, count int) (*iotexapi.GetBlockMetasResponse, error) {

	if start == 0 {
		start = 1
	}

	if count == 0 {
		count = 1
	}

	blockMetasRequest := &iotexapi.GetBlockMetasRequest{
		Lookup: &iotexapi.GetBlockMetasRequest_ByIndex{
			ByIndex: &iotexapi.GetBlockMetasByIndexRequest{
				Start: uint64(start),
				Count: uint64(count),
			},
		},
	}
	BlockMetasResponse, err := c.Service.GetBlockMetas(context.Background(), blockMetasRequest)

	if err != nil {
		return nil, err
	}

	return BlockMetasResponse, nil
}

func (c *Crawler) Save(data interface{}, file string) error {
	json, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}

	err = ioutil.WriteFile(fmt.Sprintf("./output/%s", file), json, 0644)
	if err != nil {
		return err
	}

	return nil
}

func (c *Crawler) GetActions(start, count int) (*iotexapi.GetActionsResponse, error) {

	if start == 0 {
		start = 1
	}

	if count == 0 {
		count = 1
	}

	getActionsRequest := &iotexapi.GetActionsRequest{
		Lookup: &iotexapi.GetActionsRequest_ByIndex{
			ByIndex: &iotexapi.GetActionsByIndexRequest{
				Start: uint64(start),
				Count: uint64(count),
			},
		},
	}
	getActionsResponse, err := c.Service.GetActions(context.Background(), getActionsRequest)

	if err != nil {
		fmt.Println(err)
	}

	return getActionsResponse, err
}
