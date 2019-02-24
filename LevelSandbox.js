/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

    constructor() {
        this.db = level(chainDB);
    }

    // Get data from levelDB with key (Promise)
    getLevelDBData(key){
        let self = this;
        return new Promise(function(resolve, reject) {
            self.db.get(key, (err, value) => {
                if(err){
                    if (err.type == 'NotFoundError') {
                        reject(undefined);
                    }else {
                        console.log('Block ' + key + ' get failed', err);
                        reject(err);
                    }
                }else {
                    resolve(value);
                }
            });
        });
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.db.put(key, value, function(err) {
                if (err) {
                    console.log('Block ' + key + ' submission failed', err);
                    reject(err);
                }
                resolve(value);
            });
        });
    }

   
    // Method that return the height
    getBlocksCount() {
        let self = this;
        return new Promise(function(resolve, reject) {
          let i = 0;
          self.db.createReadStream()
          .on('data', function (data) {
            i++;
            })
          .on('error', function (err) {
            reject(err);
           })
           .on('close', function () {
            resolve(i);
          });          
        });
    }

    // Get block by hash
    getBlockByHash(hash) {
        let self = this;
        let block = null;
        return new Promise(function(resolve, reject){
            self.db.createValueStream()
            .on('data', function (data) {
                data = JSON.parse(data);
                if(data.hash === hash){
                    block = data;
                    resolve(block);                    
                }
            })
            .on('error', function (err) {
                reject(err)
            })
            .on('close', function () {
                resolve(block);
            });
        });
    }

    // Get block by hash
    getBlockByWalletAddress(address) {
        let self = this;
        let block = [];
        return new Promise(function(resolve, reject){
            self.db.createValueStream()
            .on('data', function (data) {
                data = JSON.parse(data);
                if(data.body.address === address){
                    block.push(data);
                }
            })
            .on('error', function (err) {
                reject(err)
            })
            .on('close', function () {
                resolve(block);
            });
        });
    }


    closeLevelDB() {
        this.db.close();
    }

    addDataToLevelDB(value) {
        let self = this;
        return new Promise(function(resolve, reject) {
            let i = 0;
            self.db.createReadStream().on('data', function(data) {
                i++;
            }).on('error', function(err) {
                reject(err);
            }).on('close', function() {
                console.log('Block #' + i);
                self.addLevelDBData(i, JSON.stringify(value))
                    .then((result) =>{
                        resolve(result);
                    })
                    .catch((err) => {
                        reject(err);
                    })
            });
       });
        
    }
    
}

module.exports.LevelSandbox = LevelSandbox;
