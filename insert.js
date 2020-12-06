const {getProductId, getAccountId, getUserId, insertPrice} = require("./database");
const {getRows} = require("./read");


async function main() {
    const rows = await getRows();

    for (const row of rows) {
        console.log(row.sku)
        const priceRow = {
            product_id: await getProductId(row.sku),
            account_id: await getAccountId(row.account_ref),
            user_id: await getUserId(row.user_ref),
            quantity: row.quantity,
            value: row.value
        }
        await insertPrice(priceRow)
    }  
};

main();