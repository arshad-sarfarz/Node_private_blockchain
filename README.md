# Connecting Private Blockchain to Front-End Client via APIs

ExpressJS framework is used for creating REST APIs.

## Getting Started

ChainData folder has been intentionally deleted. Also not mock blocks are created by default. 
Hence the user needs to create blocks using the POST end point.


### Installing

Please run npm install to have the following prerequisites installed
1. "body-parser": "^1.18.3",
2. "crypto-js": "^3.1.9-1",
3. "express": "^4.16.4",
4. "level": "^4.0.0"

### End Point Documentation

Two end points are implemented
1. **GET** /block/{indexNumber} - Get Block by block index. Block index starts from 0.  
   Parameters: indexNumber - index number of the block to be returned

2. **POST** /block - Add a new block to the Blockchain. The Block should be provided in the following format.  
   {
     "body": "Block Data"
   }


## Running the APIs

Run the command "node app.js" This will start the API on http://localhost:8000


## Versioning

V1.0


## Authors

* **Arshad Sarfarz**


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
