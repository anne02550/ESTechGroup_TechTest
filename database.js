let mysql = require('mysql');
let connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '12345678',
  database : 'trial'
});
 
connection.connect();

//  function take in sku from import.csv, return product id 
function getProductId (sku) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM trial.products WHERE sku = ?', [sku], function (error, results, fields) {
            if (error) reject(error);    
            resolve(results[0].id)
        })
    });
}

// function take in account reference from import.csv, return account ID
function getAccountId (account_ref) {
    return new Promise((resolve, reject) => {
        if(account_ref == '') {
            return resolve(null)
        }
        connection.query('SELECT * FROM trial.accounts WHERE external_reference = ?', [account_ref], function (error, results, fields) {
            if (error) reject(error);    
            resolve(results[0].id)
        });
    });
}

// function take in user reference from import.csv, return user ID
function getUserId (user_ref) {
    return new Promise((resolve, reject) => {
        if(user_ref == '') {
            return resolve(null)
        }
        connection.query('SELECT * FROM trial.users WHERE external_reference = ?', [user_ref], function (error, results, fields) {
            if (error) reject(error);    
            resolve(results[0].id)
        });
    });
}

// function insert new price row into the database 

function insertPrice (data) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO trial.prices (product_id, account_id, user_id, quantity, value, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)', [data.product_id, data.account_id, data.user_id, data.quantity, data.value, new Date(), new Date()], function (error, results, fields) {
            if (error) reject(error);    
            resolve();
        });
    });
};

//  function get sku from database, filter by a list of ID in case many products are given.
function getSKUs(productCodes) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT id, sku FROM trial.products WHERE id in (${productCodes.join(",")})`, function (error, results, fields) {
        if (error) reject(error);    
        return resolve(results);
        });
    });
}

// function selecting public or private price. A product price in the database with no account id is considered a public price and a match for all queries. A product price with an account ID should match exactly and not be used for pricing without an account ID.
function getDatabasePrices(productCodes, accountId) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM trial.prices
                          WHERE product_id in (${productCodes.join(",")})
                          and (account_id = ? or account_id is null);`, [accountId],
                          function (error, results, fields) {
                                if (error) reject(error);    
                            return resolve(results);
            });
        });
}

module.exports = { getProductId, getAccountId, getUserId, insertPrice, getSKUs, getDatabasePrices}
