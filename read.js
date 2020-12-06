const fs = require('fs');
const csv = require('csv-parser')

async function getRows () {
    const columns = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream('import.csv')
        .pipe(csv())
        .on('data', function (row) {  
            const column = {
                sku: row.sku,
                account_ref: row.account_ref,
                user_ref: row.user_ref,
                quantity: row.quantity,
                value: row.value,
            }
            columns.push(column)
        })
        .on('end', function () {
            resolve(columns)
        });
    });
};

module.exports = { getRows };
