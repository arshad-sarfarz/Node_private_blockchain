# Connecting Private Blockchain to Front-End Client via APIs

ExpressJS framework is used for creating REST APIs.

## Getting Started

ChainData folder has been intentionally deleted. Also mock blocks are not created by default. 
Hence the user needs to create blocks using the POST end point.


### Installing

Please run npm install to have the following prerequisites installed
1. "body-parser": "^1.18.3",
2. "crypto-js": "^3.1.9-1",
3. "express": "^4.16.4",
4. "level": "^4.0.0"
5. "bitcoinjs-lib": "^4.0.3",
6. "bitcoinjs-message": "^2.0.0",
7. "hex2ascii": "0.0.3",
8. "lodash": "^4.17.11"

### End Point Documentation

Following end points are implemented
1. **POST** /requestValidation - Web API POST endpoint to validate request with JSON response. The input should be provided in the following format.  
  { "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL" }
The response will be provided in the following format
{
    "walletAddress": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
    "requestTimeStamp": "1544451269",
    "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1544451269:starRegistry",
    "validationWindow": 300
}

2. **POST** /message-signature/validate - Web API POST endpoint validates message signature with JSON response. The input should be provided in the following format.  
  {
  "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
  "signature":"H8K4+1MvyJo9tcr2YN2KejwvX1oqneyCH+fsUL1z1WBdWmswB9bijeFfOfMqK68kQ5RO6ZxhomoXQG3fkLaBl+Q="
  }
  The response will be provided in the following format
  {
      "registerStar": true,
      "status": {
          "address": "156Paqko4U8AN9x2ThJaN8qM9ie9hk3FVu",
          "requestTimeStamp": "1550865582",
          "message": "156Paqko4U8AN9x2ThJaN8qM9ie9hk3FVu:1550865582:starRegistry",
          "validationWindow": 13,
          "messageSignature": true
      }
  }

3. **POST** /block - Web API POST endpoint with JSON response that submits the Star information to be saved in the Blockchain. Add a new block to the Blockchain with Star Information. The input should be provided in the following format.  
  {
      "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
      "star": {
                  "dec": "68° 52' 56.9",
                  "ra": "16h 29m 1.0s",
                  "story": "Found star using https://www.google.com/sky/"
              }
  }
  The response will be provided in the following format
  {
      "hash": "8098c1d7f44f4513ba1e7e8ba9965e013520e3652e2db5a7d88e51d7b99c3cc8",
      "height": 1,
      "body": {
          "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
          "star": {
              "ra": "16h 29m 1.0s",
              "dec": "68° 52' 56.9",
              "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
          }
      },
      "time": "1544455399",
      "previousBlockHash": "639f8e4c4519759f489fc7da607054f50b212b7d8171e7717df244da2f7f2394"
  }


4. **GET** /block/{blockHeight} - Get star block by star block height with JSON response.
   Parameters: blockHeight - Star Block Height of the block to be returned
  The response will be provided in the following format
  {
    "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
    "height": 1,
    "body": {
      "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
      "star": {
        "ra": "16h 29m 1.0s",
        "dec": "-26° 29' 24.9",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https://www.google.com/sky/"
      }
    },
    "time": "1532296234",
    "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
  }

5. **GET** /block/stars/hash:[HASH] - Get Star block by hash with JSON response.
   Parameters: HASH - Hash of the block to be returned
  The response will be provided in the following format
  {
    "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
    "height": 1,
    "body": {
      "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
      "star": {
        "ra": "16h 29m 1.0s",
        "dec": "-26° 29' 24.9",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https://www.google.com/sky/"
      }
    },
    "time": "1532296234",
    "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
  }

6. **GET** /block/stars/address:[ADDRESS] - Get Star block by wallet address (blockchain identity) with JSON response.
   Parameters: ADDRESS - Wallet Address of the block to be returned
  The response will be provided in the following format
  [
    {
      "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
      "height": 1,
      "body": {
        "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
        "star": {
          "ra": "16h 29m 1.0s",
          "dec": "-26° 29' 24.9",
          "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
          "storyDecoded": "Found star using https://www.google.com/sky/"
        }
      },
      "time": "1532296234",
      "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
    },
    {
      "hash": "6ef99fc533b9725bf194c18bdf79065d64a971fa41b25f098ff4dff29ee531d0",
      "height": 2,
      "body": {
        "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
        "star": {
          "ra": "17h 22m 13.1s",
          "dec": "-27° 14' 8.2",
          "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
          "storyDecoded": "Found star using https://www.google.com/sky/"
        }
      },
      "time": "1532330848",
      "previousBlockHash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f"
    }
  ]

## Running the APIs

Run the command "node app.js" This will start the API on http://localhost:8000


## Versioning

V1.0


## Authors

* **Arshad Sarfarz**


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
