/*
 * Copyright 2022 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package main

import (
	"encoding/hex"
	"encoding/json"
	"fmt"
	"math/rand"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
    contractapi.Contract
}

// another example form the ChatGPT generated code
func (s *SmartContract) RandomHex() string {
    rand.Seed(time.Now().UnixNano())
    num := rand.Intn(0xffffff + 1)
    hexString := hex.EncodeToString([]byte{byte(num >> 16), byte(num >> 8), byte(num)})
    return hexString
}

func (s *SmartContract) ExampleMethod(ctx contractapi.TransactionContextInterface) error {
    hexString := s.RandomHex()
    fmt.Println(hexString)
    // Use the generated hexString in your smart contract logic
    return nil
}

// here is another ChatGPT generated example fo the Smart Contract
// This code example is refereeing to the above RandomHex function too.
type Asset struct {
    ID   string `json:"ID"`
    Name string `json:"name"`
}

func (s *SmartContract) CreateAsset(ctx contractapi.TransactionContextInterface, name string) error {
    hexString := s.RandomHex()
    asset := Asset{
        ID:   hexString,
        Name: name,
    }
    assetJSON, err := json.Marshal(asset)
    if err != nil {
        return err
    }
    err = ctx.GetStub().PutState(asset.ID, assetJSON)
    if err != nil {
        return fmt.Errorf("failed to put to world state. %v", err)
    }
    return nil
}

/*
//====================================================================================================

//Another example
func (s *SmartContract) ExampleMethod(ctx contractapi.TransactionContextInterface) error {
    hexString := s.RandomHex()
    fmt.Println(hexString)
    // Use the generated hexString in your smart contract logic
    // For example, you can combine it with a constant string
    myVariable := "D-OPS-" + hexString
    fmt.Println(myVariable)
    return nil
}
*/


/*
 //====================================================================================================
func main() {
    smartContract := new(SmartContract)
    err := contractapi.CreateNewChaincode(smartContract)
    if err != nil {
        fmt.Printf("Error creating chaincode: %s", err.Error())
        return
    }
}
*/
