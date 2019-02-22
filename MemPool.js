const _ = require("lodash")
const TimeoutRequestsWindowTime = 5*60*200;
const bitcoin = require('bitcoinjs-lib')

/**
 * Component to store temporary requests
 */

class MemPool{
    /**
     * Constructor
     */
    constructor(){
        this.validationRequests = [];
        this.validRequests = [];
        this.timeoutRequests = [];
    }

    /**
     * Store temporal validation request
     */
    addARequestValidation(temporaryRequest){
        //console.log(temporaryRequest);
        var self = this;
        let val = _.find(this.validationRequests,(request) => {
            //console.log("temporaryRequest.walletAddress = " + temporaryRequest.walletAddress + "     request.walletAddress=" + request.walletAddress);
            return temporaryRequest.walletAddress == request.walletAddress;
        })
        if (val == null){
            this.validationRequests.push(temporaryRequest);
            this.timeoutRequests[temporaryRequest.walletAddress] = setTimeout( 
                () => { self.removeValidationRequest(temporaryRequest.walletAddress) }, TimeoutRequestsWindowTime );
                return temporaryRequest;
        } else {
            //console.log("existing val");
            return val;
        }
    }

    /**
     * Remove temporal validation request
     */
    validateRequestByWallet(requestToValidate){
        let val = _.find(this.validationRequests,(request) => {
            //console.log("requestToValidate.walletAddress =" + requestToValidate.walletAddress + " request.walletAddress=" + request.walletAddress);
            return requestToValidate.walletAddress == request.walletAddress;
        })

        if (val != null){
            let timeLeft = this.verifyTimeLeft(val).validationWindow;
            if (timeLeft > 0){
                const bitcoinMessage = require('bitcoinjs-message'); 4
                let isValid = bitcoinMessage.verify(val.message, requestToValidate.walletAddress, requestToValidate.signature);
                if (isValid){

                    let valRequest = {
                        "registerStar": true,
                        "status": {
                            "address": requestToValidate.walletAddress,
                            "requestTimeStamp": val.requestTimeStamp,
                            "message": val.message,
                            "validationWindow": timeLeft,
                            "messageSignature": true
                        }
                    };
                    clearTimeout(this.timeoutRequests[requestToValidate.walletAddress]);
                    this.validRequests.push(valRequest);
                    return valRequest;
                }
            } else { 
                return {"message" : "request expired in memPool"};    
            }
    
        } else {
            return {"message" : "request not in memPool"};
        }
    }

    verifyTimeLeft(req){
        let timeElapse = (new Date().getTime().toString().slice(0,-3)) - req.requestTimeStamp;
        let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
        req.validationWindow = timeLeft;
        return req;
    }

    verifyAddressRequest(addressToValidate){
        let val = _.find(this.validationRequests,(request) => {
            return request.walletAddress == addressToValidate;
        })
        if (val != null){
            return true;
        } else {
            return false;
        }
    }

    /**
     * Remove temporal validation request
     * message-signature/validate
     */
    removeValidationRequest(walletAddressToRemove){
        console.log("removeValidationRequest");
        _.remove(this.validationRequests,(request) => {
            console.log("walletAddressToRemove=" + walletAddressToRemove + "     request.walletAddress=" + request.walletAddress);
            return walletAddressToRemove == request.walletAddress;
        })
        console.log(this.validationRequests);
    }
    

}

module.exports.MemPool = MemPool;