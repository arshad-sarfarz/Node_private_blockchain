const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const BlockChain = require('./BlockChain.js');

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
                    var myBlock = await myBlockChain.getBlock(blockIndex);
                    return res.json(myBlock);
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
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.app.post("/block", async (req, res) => {
            var newBlock = req.body;
            if (newBlock == null || newBlock.body == null || newBlock.body == ""){
                return res.status(400).json("{message: 'Block data not provided in correct format'}");
            }
            else {
                var myBlockChain;
                try{
                    myBlockChain = new BlockChain.Blockchain();
                    var result = await myBlockChain.addBlock(newBlock);    
                    return res.status(201).json(result);
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