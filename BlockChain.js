/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

    constructor() {
        this.bd = new LevelSandbox.LevelSandbox();
    }

    close() {
        return this.bd.closeLevelDB();
    }

    // Helper method to create a Genesis Block (always with height= 0)
    // This method will be called inside addBlock method when height=0 
    generateGenesisBlock(){
        var self = this;
        return new Promise(function(resolve, reject) {
            self.bd.getBlocksCount()
            .then((height)=>{
                if (height<=0){
                    var genBlock = new Block.Block("First Block in the chain - Genesis Block");
                    genBlock.height = 0;
                    // UTC timestamp
                    genBlock.time = new Date().getTime().toString().slice(0,-3);
                    // Block hash with SHA256 using newBlock and converting to a string
                    genBlock.hash = SHA256(JSON.stringify(genBlock)).toString();
                    self.bd.addDataToLevelDB(genBlock)
                    .then( (result) =>{
                        resolve("Genesis block successfully persisted in LevelDB");
                    })
                    .catch((err) => {
                        reject(err);
                    })
                }
                else{
                    resolve("Blockchain already exists");
                }
            })
            .catch((err)=>{
                reject(err);
            })
        });
            
    }

    // Get block height, it is a helper method that return the height of the blockchain
    getBlockHeight() {
        return this.bd.getBlocksCount();
    }

   
    // Add new block. It creates the genesis block if blockheight is 0
    async addBlock(newBlock) {
        try{
            var self = this;
            var blockHeight = await this.getBlockHeight(); 
            if (blockHeight<=0){
                console.log("Creating Genesis Block ");                    
                await self.generateGenesisBlock();
                blockHeight++;
            }
            newBlock.height = blockHeight;
            // UTC timestamp
            newBlock.time = new Date().getTime().toString().slice(0,-3);
            // previous block hash
            if(blockHeight > 0){
                var previousBlock = await this.getBlock(blockHeight-1);
                newBlock.previousBlockHash = previousBlock.hash;
            }
            // Block hash with SHA256 using newBlock and converting to a string
            newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
            // Adding block object to chain
            var result = await this.bd.addDataToLevelDB(newBlock); 
            return JSON.parse(result);
        }
        catch(e){
            console.log(e);
            throw e;
        }
    }

    // Get Block By Height
    getBlock(height) {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.bd.getLevelDBData(height)
                .then((result) =>{
                    var myBlock = JSON.parse(result);
                    resolve(myBlock);
                })
                .catch((err)=>{
                    reject(err);
                })
        });
    }

    // Validate if Block is being tampered by Block Height
    validateBlock(height) {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.getBlock(height)
                .then((result)=>{
                    var myBlock = result;
                    var HashToCheck = myBlock.hash; 
                    myBlock.hash = "";
                    var validBlockHash = SHA256(JSON.stringify(myBlock)).toString();
                    if(validBlockHash === HashToCheck) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                },(err)=>{
                    reject(err);
                })
                .catch((err)=>{
                    reject(err);
                })
        });
    }

    //Validate the complete chain including validating each block and 
    //also verifying if the previousblockhash of the current block is equal to hash of the previous block
    async validateChain() {
        try{
            var self = this;
            var blockHeight;
            self.promiseArray = [];
            self.errorArray = [];
            var blockHeight = await this.getBlockHeight();
            if (blockHeight > 0) {
                for (var index=0; index < blockHeight; index++){
                    var result = await this.validateBlock(index);
                    if (!result){
                        self.errorArray.push("Block not valid for index: " + index);
                    }
                    if (index>0){
                        var currentBlock = await this.getBlock(index);
                        var previousBlock = await this.getBlock(index-1);
                        if(currentBlock.previousBlockHash === previousBlock.hash) {
                        } else {
                            console.log(currentBlock);
                            console.log(previousBlock);
                            self.errorArray.push("Previous Hash not valid for Block with index: " + index);
                        }
                    }
                }
            } else {
                self.errorArray.push("Blockchain is Empty");
            }

            return new Promise(function(resolve, reject) {
                var promises = Promise.all(self.promiseArray);
                promises.then((result)=>{
                    resolve(self.errorArray);
                })
                .catch((err)=>{
                    self.errorArray.push(err);
                    reject(errorArray);
                });
            });
            
        }
        catch(e){
            console.log(e);
            reject(err);
        }
    }


    // Utility Method to Tamper a Block for Test Validation
    // This method is for testing purpose
    _modifyBlock(height, block) {
        let self = this;
        return new Promise( (resolve, reject) => {
            self.bd.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
                resolve(blockModified);
            }).catch((err) => { console.log(err); reject(err)});
        });
    }
   
}

module.exports.Blockchain = Blockchain;
