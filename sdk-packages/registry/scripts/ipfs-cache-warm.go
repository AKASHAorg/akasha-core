package main

import (
  "bufio"
  "flag"
  "fmt"
  shell "github.com/ipfs/go-ipfs-api"
  "log"
  "os"
  "time"
)

func main() {
  filePath := flag.String("path", "entries.json", "file containing ipfs hashes")
  apiServ := flag.String("api", "127.0.0.1:5001", "ipfs api listening")
  flag.Parse()
  // Where your local node is running on localhost:5001
  sh := shell.NewShell(*apiServ)
  sh.SetTimeout(30 * time.Second)
  fmt.Print("connected to ipfs api \n")
  fmt.Printf("trying %s \n", *filePath)
  buf, err := os.Open(*filePath)

  if err != nil {
    log.Fatal(err)
  }
  defer buf.Close()
  fmt.Printf("opened %s \n", *filePath)
  snl := bufio.NewScanner(buf)
  for snl.Scan() {
    ipfsHash := snl.Text()
    fmt.Printf("fetching %s \n", ipfsHash)
    cc, err := sh.ObjectGet(ipfsHash[1 : len(ipfsHash)-1]) //quotes
    if err != nil {
      fmt.Printf("error: %s \n", err)
    }
    fmt.Printf("Finished %v %s \n", cc, ipfsHash)
    err1 := sh.Pin(ipfsHash[1 : len(ipfsHash)-1]) // also pin
    if err1 != nil {
      fmt.Printf("error: %v \n", err)
    } else {
      fmt.Printf("Finished pinning %s \n", ipfsHash)
    }
  }

  err = snl.Err()
  if err != nil {
    log.Fatal(err)
  }
}
