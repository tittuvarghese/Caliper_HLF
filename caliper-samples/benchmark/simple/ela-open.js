'use strict';

module.exports.info  = 'opening accounts';

let account_array = [];
let txnPerBatch;
let initMoney;
let bc, contx;
module.exports.init = function(blockchain, context, args) {
    if(!args.hasOwnProperty('money')) {
        return Promise.reject(new Error('ela.createUser - \'money\' is missed in the arguments'));
    }

    if(!args.hasOwnProperty('txnPerBatch')) {
        args.txnPerBatch = 1;
    }
    txnPerBatch = args.txnPerBatch;
    bc = blockchain;
    contx = context;

    return Promise.resolve();
};

const dic = 'abcdefghijklmnopqrstuvwxyz';
/**
 * Generate string by picking characters from dic variable
 * @param {*} number character to select
 * @returns {String} string generated based on @param number
 */
function get26Num(number){
    let result = '';
    while(number > 0) {
        result += dic.charAt(number % 26);
        number = parseInt(number/26);
    }
    return result;
}

let prefix;
/**
 * Generate unique account key for the transaction
 * @returns {String} account key
 */
function generateAccount() {
    // should be [a-z]{1,9}
    if(typeof prefix === 'undefined') {
        prefix = get26Num(process.pid);
    }
    return prefix + get26Num(account_array.length+1);
}

/**
 * Generates simple workload
 * @returns {Object} array of json objects
 */
function generateWorkload() {
    let workload = [];
    for(let i= 0; i < txnPerBatch; i++) {
        let acc_id = generateAccount();
        account_array.push(acc_id);

        if (bc.bcType === 'fabric') {
          let data = {
            user_id : "ELP-USR001",
            name: {
              first_name: "Joan",
              last_name: "Smith"
            },
            email : "user@org1.ela.com",
            phone_number : "+91-9876543211",
            profile_image : "profile_image_url_ipfs_2",
            role : "producer"
          }
          workload.push({
              chaincodeFunction: 'createUser',
              chaincodeArguments: [acc_id, JSON.stringify(data)],
          });
        }
    }
    return workload;
}

module.exports.run = function() {
    let args = generateWorkload();
    return bc.invokeSmartContract(contx, 'ela', 'v0', args, 100);
};

module.exports.end = function() {
    return Promise.resolve();
};

module.exports.account_array = account_array;
