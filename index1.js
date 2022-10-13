const { getOrderAllocation } = require("./orderAllocation");
const { getTestData } = require('./testData');
const test = async () => {
    const req = {
        "channelName": "mehraki_erp",
        "entity": "me02",
        "order_items": [
            {
                "sku": "1000000033873",
                "bundleSku": "1234",
                "qty": 25
            },
            {
                "sku": "1000000033874",
                "bundleSku": "1234",
                "qty": 8
            },
            {
                "sku": "1000000033875",
                "bundleSku": "1235",
                "qty": 6
            },
            {
                "sku": "1000000033876",
                "bundleSku": "1235",
                "qty": 5
            }
            ,
            {
                "sku": "1000000033877",
                "qty": 2
            }
        ],
        "order_address": {
            "pin_code": "600001",
            "state": "Tamil Nadu",
            "state_code": "TN"
        },
        "fulfillment_by_warehouse": [],
        "order_type": "b2c"
    }
    const tests = await getTestData();
    let i = 1;
    for (const test of tests) {
        console.log('TESTCASE START !!!!!!!!!!!!!!!!!!!!!!!!!    ' + (i));
        let list = await getOrderAllocation(req, test);
        console.log('TESTCASE !!!!!!!!!!!!!!!!!!!!!!!!!    ' + (i++));
        console.log(`list 47`);
        // console.log(list);
        await printOrder(list);
    }
}

const printOrder = async (order) => {
    console.log('######################################################################');
    console.log(`order.order_serviceable  ${order.order_serviceable}`);
    console.log('serviceable_warehouses');
    for (const item of order.serviceable_warehouses) {
        console.log(item.warehouse_code);
        console.log(item.serviceable_items);
    }
    console.log('unfulfillable_items');
    for (const item of order.unfulfillable_items) {
        console.log(item);
    }

    console.log('######################################################################');
}
test();