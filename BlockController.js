const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const BlockChain = require('./BlockChain.js');
const MemPoolClass = require('./MemPool.js');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
        this.app = app;
        this.getBlockByIndex();
        this.postNewBlock();
        this.requestValidation();
        this.Validate();
        this.getStarsByHash();
        this.getStarsByAddress();
        this.memPool = new MemPoolClass.MemPool();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.app.get("/block/:index", async (req, res) => {
            var myBlockChain;
            try{
                myBlockChain = new BlockChain.Blockchain();
                var blockHeight = await myBlockChain.getBlockHeight();
                var blockIndex = req.params.index;
                if (blockIndex > blockHeight-1){
                    var jsonVal = { "message": "Block corresponding to height specified not found" };
                    return res.status(404).json(jsonVal);
                } else {
                    const hex2ascii = require('hex2ascii');
                    var myBlock = await myBlockChain.getBlock(blockIndex);
                    if (blockIndex>0){
                        myBlock.body.star.storyDecoded = hex2ascii(myBlock.body.star.story);
                    }
                    return res.json(myBlock);
                }
            }
            catch(e){
                var jsonVal = { "message": "Error occurred while fetching block by Index. Error is " + e };
                return res.status(500).json(jsonVal);
            }
            finally{
                if (myBlockChain != null){
                    myBlockChain.close();
                }
            }
        });
    }


    getStarsByHash() {
        this.app.get("/stars/hash::hashValue", async (req, res) => {
            var myBlockChain;
            try{
                myBlockChain = new BlockChain.Blockchain();
                var hashValue = req.params.hashValue;
                const hex2ascii = require('hex2ascii');
                var myBlock = await myBlockChain.getBlockByHash(hashValue);
                if (myBlock != null){
                    myBlock.body.star.storyDecoded = hex2ascii(myBlock.body.star.story);
                    return res.json(myBlock);
                } else {
                    return res.json({"message": "Block not found"});
                }
            }
            catch(e){
                var jsonVal = { "message": "Error occurred while fetching Stars by Hash. Error is " + e };
                return res.status(500).json(jsonVal);
            }
            finally{
                if (myBlockChain != null){
                    myBlockChain.close();
                }
            }
        });
    }

    getStarsByAddress() {
        this.app.get("/stars/address::Address", async (req, res) => {
            var myBlockChain;
            try{
                myBlockChain = new BlockChain.Blockchain();
                var address = req.params.Address;
                var myBlocks = await myBlockChain.getBlockByWalletAddress(address);
                if (myBlocks != null){
                    myBlocks.forEach( (block) => {
                        const hex2ascii = require('hex2ascii');
                        block.body.star.storyDecoded = hex2ascii(block.body.star.story);
                    });
                    return res.json(myBlocks);
                } else {
                    return res.json({"message": "Block not found"});
                }
            }
            catch(e){
                var jsonVal = { "message": "Error occurred while Stats by Address. Error is " + e };
                return res.status(500).json(jsonVal);
            }
            finally{
                if (myBlockChain != null){
                    myBlockChain.close();
                }
            }
        });
    }

    /**
     * Implement a POST Endpoint to add a request Validation, url: "/requestValidation"
     */
    requestValidation() {
        this.app.post("/requestValidation", (req, res) => {
            var request = req.body;
            if (request == null || request.address == null || request.address == ""){
                return res.status(400).json("{message: 'request data not provided in correct format'}");
            }
            else {
                let validationRequest = {}
                validationRequest.walletAddress = request.address;
                validationRequest.requestTimeStamp = new Date().getTime().toString().slice(0,-3);
                validationRequest.message = request.address + ":" + validationRequest.requestTimeStamp + ":" + "starRegistry";
                let timeLeft = 
                validationRequest.validationWindow = 300;
                let retVal = this.memPool.addARequestValidation(validationRequest);
                return res.status(201).json(retVal);
            }
        });
    }

    /**
     * Implement a POST Endpoint to add a request Validation, url: "/requestValidation"
     */
    Validate() {
        this.app.post("/message-signature/validate", (req, res) => {
            var request = req.body;
            if (request == null || request.address == null || request.address == "" || request.signature == "" || request.signature == ""){
                return res.status(400).json("{message: 'request data not provided in correct format'}");
            }
            else {
                var request = {}
                request.walletAddress = req.body.address;
                request.signature = req.body.signature;
                //console.log("Validate");
                //console.log(request);
                let retVal = this.memPool.validateRequestByWallet(request);
                return res.status(201).json(retVal);
            }
        });
    }

    
    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.app.post("/block", async (req, res) => {
            var newBlock = req.body;
            if (newBlock == null || newBlock.address == null || newBlock.address == "" || newBlock.star == null || newBlock.star == ""){
                return res.status(400).json("{message: 'Block data not provided in correct format'}");
            }
            else {
                var myBlockChain;
                try{
                    let isValid  = this.memPool.verifyAddressRequest(newBlock.address);
                    if (!isValid){
                        return res.status(600).json({"message" : "Not a validated request"});
                    } else {
                        myBlockChain = new BlockChain.Blockchain();
                        let formattedBlock = {};
                        newBlock.star.story = Buffer(newBlock.star.story).toString('hex');
                        formattedBlock.body = newBlock;
                        var result = await myBlockChain.addBlock(formattedBlock);
                        this.memPool.removeValidationRequest(newBlock.address);
                        this.memPool.removeValidRequest(newBlock.address);
                        return res.status(201).json(result);
                    }

                }
                catch(e){
                    var jsonVal = { "message": "Error occurred while fetching block details. Error is " + e };
                    return res.status(500).json(jsonVal);
                }
                finally{
                    if (myBlockChain != null){
                        myBlockChain.close();
                    }
                }
            }
        });
    }

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */
    initializeMockData() {
        if(this.blocks.length === 0){
            for (let index = 0; index < 10; index++) {
                let blockAux = new BlockClass.Block(`Test Data #${index}`);
                this.myBlockChain.addBlock(blockAux).then((result) => {
                    console.log(result);
                });
            }
        } else {
            console.log("Blockchain already contains blocks");
        }
    }

}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}