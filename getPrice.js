let price = require('./live-prices'); 
let db = require('./database');

async function getPrices(productCodes, accountId) {
    const prices = {};

    const productIdToSKUs = await db.getSKUs(productCodes);
    const skus = productIdToSKUs.map(x=> x.sku);

    // get prices matching products from live prices
    const live_prices = price.getPrices(skus, accountId);

    // if we have multiple live prices for a product, take the lowest price
    for(const {id, sku} of productIdToSKUs) {
        const livePricesForSku = live_prices.filter(x => x.sku === sku).map(x => x.price);
        if(livePricesForSku.length === 0) {
            continue;
        }
        const minPrice = Math.min(...livePricesForSku);
        prices[sku] = minPrice;
    }
    // if every product code has a price, return them now
     
    const databasePrices = await db.getDatabasePrices(productCodes, accountId);
    
    // fecth the public/private prices from the database for the products that don't yet have a price
    for(const {id, sku} of productIdToSKUs) {
        if(prices[sku]) {
            continue;
        }
        const dbPricesForProduct = databasePrices.filter(x => x.product_id === id).map(x => x.value);
        const minPrice = Math.min(...dbPricesForProduct);
        prices[sku] = minPrice;
    }

    return prices;
}

async function main() {
    const prices = await getPrices([3, 4], "ZJURRWEKLFDEBE");
    console.log(prices);
}

main();