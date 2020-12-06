const prices = require('./live_prices.json');

// fucntion getting price from live_prices.json that match account id and sku of the given product.
// "2. Any price in the JSON (live price) should win over any price in the database so long as it is a match for product and account (use null if no account is provided). If there is no match in the JSON pricing file use the database lowest matching price rule.""
function getPrices(skus, account_id) {
    account_id = account_id || undefined;
    return prices.filter(x => skus.includes(x.sku) && x.account === account_id);
}

module.exports = {getPrices};