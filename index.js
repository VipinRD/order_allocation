const testData = require('./testData');
const getKeysFromQuantityRequired = async (quantityRequired) => {
    let skus = [];
    for (const item of quantityRequired) {
        skus.push(item.channelSku);
    }
    return skus;
}
const getValuesFromQuantityRequired = async (quantityRequired) => {
    let quantities = [];
    for (const item of quantityRequired) {
        quantities.push(item.quantity);
    }
    return quantities;
}
// This method will create map warehouseCode:[{channelSku1:quantity},{channelSku2:quantity}]
const segregateDataWarehouseWise = async (responseFromInventoryMaster, quantityRequired) => {
    let skusArr = await getKeysFromQuantityRequired(quantityRequired);
    let map = new Map();
    for (const entry of responseFromInventoryMaster) {
        if (map.get(entry.warehouseCode) == undefined) {
            let arr = [];
            for (let i = 0; i < skusArr.length; i++) {
                let obj = {};
                obj.channelSku = skusArr[i];
                obj.quantity = 0;
                arr.push(obj);
            }
            map.set(entry.warehouseCode, arr);
        }
    }
    for (const entry of responseFromInventoryMaster) {
        if (map.get(entry.warehouseCode) == undefined) {
            let obj = {};
            obj.channelSku = entry.sku;
            obj.quantity = entry.quantity;
            map.set(entry.warehouseCode, [obj]);
        } else {
            let skuArr = map.get(entry.warehouseCode);
            for (let i = 0; i < skuArr.length; i++) {
                // console.log(skuArr[i].channelSku == entry.pk);
                if (skuArr[i].channelSku == entry.sku) {
                    skuArr[i].quantity = entry.quantity;
                    break;
                }
            }
            map.set(entry.warehouseCode, skuArr);
        }
    }
    return map;
}

//This method will create map (matrix) if a warehouse is capable of serving one item completely
// value will be placed 1, if not then 0
const availabilityMatrix = async (warehaouseMap, quantityRequired) => {
    let skusArr = await getKeysFromQuantityRequired(quantityRequired);
    let map = new Map(JSON.parse(JSON.stringify([...warehaouseMap])))
    for (const [key, value] of map) {
        for (let i = 0; i < value.length; i++) {
            for (item of quantityRequired) {

                const skuFromWareHouse = value[i].channelSku;
                const skuFromQuantityRequired = item.channelSku;
                const quantityReqForSku = item.quantity;
                const quantityAvailableForSku = value[i].quantity
                if (skuFromWareHouse == skuFromQuantityRequired && quantityReqForSku > quantityAvailableForSku) {
                    value[i].quantity = 0;
                }

            }
        }
        // console.log(value);
        map.set(key, value);
    }

    /* for (const [key, value] of map) {
        for (let i = 0; i < value.length; i++) {
            if (value[i].quantity > 0)
                value[i].quantity = 0
        }
        map.set(key, value);
        // console.log();
    } */
    for (const [key, value] of map) {
        for (let i = 0; i < value.length; i++) {
            if (value[i].quantity > 0)
                value[i].quantity = 1
        }
        map.set(key, value);
        // console.log();
    }

    /* console.log(`map`);
    console.log(map); */
    return map;
}

const sortQuantityRequiredInDesOrder = async (quantityRequired) => {
    const values = await getValuesFromQuantityRequired(quantityRequired)
    // const keys = await getValuesFromQuantityRequired(quantityRequired);
    const tempArr = [...values];
    let sortedArr = [];
    tempArr.sort((a, b) => b - a);
    for (const temp of tempArr) {
        for (let i = 0; i < quantityRequired.length; i++) {
            if (quantityRequired[i].quantity == temp) {
                const newObj = Object.assign({}, quantityRequired[i]);
                sortedArr.push(newObj);
                quantityRequired[i].quantity = -1;
            }
        }
    }
    return sortedArr;
}
const allocateWarehouse = async (availabilityMap, warehouseMap, quantityRequired, warehouseThreshold) => {
    quantityRequired = await sortQuantityRequiredInDesOrder(quantityRequired);
    let i = 0;
    // let map = new Map();
    let availabilityeMapAsPerThreshold = new Map();
    let allPartialOrders = [];
    for (const [key, value] of availabilityMap) {
        availabilityeMapAsPerThreshold.set(key, value);
        // arr.push({ "warehouseCode": [key], value });
        i++;
        if (i % warehouseThreshold == 0) {
            const warehouseList = await warehouseAllocation(availabilityeMapAsPerThreshold, warehouseMap, quantityRequired, allPartialOrders);
            // await getAllPartialAndCompleteCombinations(map);
            console.log(warehouseList[0].partialAllocation);
            if (warehouseList[0].partialAllocation) {
                allPartialOrders.push(warehouseList[0])
            } else {
                return warehouseList[0];
            }
            availabilityeMapAsPerThreshold = new Map();
        }
    }
    const warehouseList = await warehouseAllocation(availabilityeMapAsPerThreshold, warehouseMap, quantityRequired, allPartialOrders);
    // console.log(warehouseList);
    if (warehouseList[0].partialAllocation) {
        allPartialOrders.push(warehouseList[0])
    } else {
        return warehouseList[0];
    }
    // put logic for completing the order using partial orders and return the final result.
    if (allPartialOrders.length > 0) {
        return allPartialOrders[0];
    }
    // else return order is unfulfillable.
    return [];
}

const isOrderFulfillableInThreshold = async (skusQuantitySumArr) => {
    for (const element of skusQuantitySumArr) {
        if (element == 0)
            return false;
    }
    return true;
}
const getWarehouseWithMaxSkus = async (warehouseQuantitySumArr, availabilityMap) => {
    let maxValue = -1;
    let index = -1;
    for (let i = 0; i < warehouseQuantitySumArr.length; i++) {
        if (warehouseQuantitySumArr[i] > maxValue) {
            index = i;
            maxValue = warehouseQuantitySumArr[i];
        }
    }
    // return index;
    const keyArr = [...availabilityMap.keys()];
    return keyArr[index];

}
const prepareData = async (warehouseCode, warehouseData, order) => {
    // order.warehouseCount = order.warehouseCount + 1;
    let warehouseObj = { serviceable_items: [] };
    warehouseObj["warehouse_code"] = warehouseCode;

    for (const warehouseDatum of warehouseData) {
        const sku = warehouseDatum.channelSku;
        const quantity = warehouseDatum.quantity;
        console.log();
        warehouseObj.serviceable_items.push({ [sku]: quantity });
    }

    order.serviceable_warehouses.push(warehouseObj);
    return order;
}

const getSkusNotServed = async (order, quantityRequired) => {

    let skusNotServed = []
    let allSkus = await getKeysFromQuantityRequired(quantityRequired);
    let skusServed = [];
    const serviceableWarehouses = order.serviceable_warehouses;
    for (const serviceableWarehouse of serviceableWarehouses) {
        const serviceableItemsArr = serviceableWarehouse.serviceable_items;
        for (const serviceableItem of serviceableItemsArr) {
            const allSkus = Object.keys(serviceableItem);
            const allvalues = Object.values(serviceableItem);
            for (const sku of allSkus) {

                if (serviceableItem[sku] > 0) {
                    skusServed.push(sku)
                }
            }
        }
    }
    for (const skuServed of skusServed) {
        for (let i = 0; i < allSkus.length; i++) {
            if (allSkus[i] == skuServed)
                allSkus[i] = 0;
        }
    }
    for (const sku of allSkus) {
        if (sku != 0)
            skusNotServed.push(sku);
    }
    return skusNotServed;

}

const getWarehouseListForOrder = async (sku, quantityReqForSku, warehouseMap, warehaouseToBeSorted, warehouseAddedToOrder) => {
    let quantityAvailableForSku = 0;
    for (const warehouseCode of warehouseAddedToOrder) {
        const values = warehouseMap.get(warehouseCode);
        for (const item of values) {
            if (sku == item.channelSku)
                quantityAvailableForSku += item.quantity;
        }
    }
    if (quantityAvailableForSku >= quantityReqForSku) {
        return {
            warehouseList: warehouseAddedToOrder,
            orderFulfillable: true
        }
    }
    // remove already checked warehouse from warehaouseToBeSorted
    let tempWarehaouseToBeSorted = [...warehaouseToBeSorted];
    warehaouseToBeSorted = [];
    for (let i = 0; i < tempWarehaouseToBeSorted.length; i++) {
        for (const warehouse of warehouseAddedToOrder) {
            if (warehouse == tempWarehaouseToBeSorted[i]) {
                tempWarehaouseToBeSorted[i] = '';
            }
        }
    }
    for (const warehouse of tempWarehaouseToBeSorted) {
        if (warehouse != '') {
            warehaouseToBeSorted.push(warehouse);
        }
    }

    let sortedWarehouseByQuantityAvailableForSku = []
    let quantities = [];
    for (const warehouse of warehaouseToBeSorted) {
        const data = warehouseMap.get(warehouse);
        for (const datum of data) {
            if (datum.channelSku == sku) {
                quantities.push(datum.quantity)
            }
        }
    }

    let temp = [...quantities];
    temp.sort((a, b) => a - b);
    temp.reverse();

    // quantityAvailableForSku = 0;
    for (item of temp) {
        for (let i = 0; i < quantities.length; i++) {
            if (quantityAvailableForSku >= quantityReqForSku) {
                return {
                    warehouseList: warehouseAddedToOrder,
                    orderFulfillable: true
                }
            }
            if (item > 0 && item == quantities[i]) {
                quantityAvailableForSku += quantities[i];
                warehouseAddedToOrder.push(warehaouseToBeSorted[i]);
                quantities[i] = -1;
            }
        }
    }

    return {
        warehouseList: warehouseAddedToOrder,
        orderFulfillable: false
    }
}
const addUnfulfillableItems = async (sku, quantityReqforSku, order) => {
    const obj = { [sku]: quantityReqforSku }
    order.unfulfillable_items.push(obj);
    return order;

}
const warehouseAllocation = async (availabilityMap, warehouseMap, quantityRequired, partialOrderList) => {
    let skusArr = await getKeysFromQuantityRequired(quantityRequired);
    let warehouseNameArr = [...availabilityMap.keys()];
    let partialAllocation = false;
    let order = {
        "serviceable_warehouses": [],
        "unfulfillable_items": []
    }
    // order.values = []
    order.partialAllocation = partialAllocation;

    let notDone = true;
    let { skusQuantitySumArr, warehouseQuantitySumArr } = await getRowColumnSum(availabilityMap, skusArr, warehouseNameArr)
    //  If service is possible using all items in one warehouse or atleat one item/warehouse is possible in one threshold
    // 1. check if every skusQuantitySumArr element is non zero then only order is fulfillable in this threshold
    // a. check from starting which warehouseQuantitySumArr is having max value, So it can serve max items
    // b. get remaining skus index, for all zero value
    // index from top to bottom

    // isOrderFulfillableInThreshold will check if the ordered quantity is present in atleat one warehouse
    // Ex. sku1 is present in WH3, sk2 is presnt in WH1 so order will be(WH1, WH3)
    if (await isOrderFulfillableInThreshold(skusQuantitySumArr)) {
        while (notDone) {

            const warehouseCode = await getWarehouseWithMaxSkus(warehouseQuantitySumArr, availabilityMap);
            const warehouseData = warehouseMap.get(warehouseCode);
            order = await prepareData(warehouseCode, warehouseData, order);
            skusArr = await getSkusNotServed(order, quantityRequired);
            // console.log(skusArr);
            if (skusArr.length == 0) {
                notDone = false;
                break;
            }
            let temp = await getRowColumnSum(availabilityMap, skusArr, warehouseNameArr)
            skusQuantitySumArr = temp.skusQuantitySumArr;
            warehouseQuantitySumArr = temp.warehouseQuantitySumArr;
        }
        return [order];
    } else {
        //we will check if we can create order using multiple warehouse for one sku and then repeat
        // and each sku should be served
        let quantityReqforSku;
        let warehouseAddedToOrder = { warehouseList: [] };
        for (const sku of skusArr) {
            for (const item of quantityRequired) {
                if (item.channelSku == sku) {
                    quantityReqforSku = item.quantity;
                    break;
                }
            }
            const temp = await getWarehouseListForOrder(sku, quantityReqforSku, warehouseMap, [...availabilityMap.keys()], [...warehouseAddedToOrder.warehouseList]);
            if (!temp.orderFulfillable) {
                partialAllocation = true;
                order.partialAllocation = partialAllocation;
                order = await addUnfulfillableItems(sku, quantityReqforSku, order);
            } else {
                warehouseAddedToOrder = JSON.parse(JSON.stringify(temp));
            }
        }
        if (warehouseAddedToOrder.warehouseList.length > 0) {
            const warehouseCodes = warehouseAddedToOrder.warehouseList;
            for (const warehouseCode of warehouseCodes) {

                const warehouseData = warehouseMap.get(warehouseCode);
                order = await prepareData(warehouseCode, warehouseData, order);
            }
            return [order];
        }
        return [order]
    }
}

// This function will return the sum of rows and columns of matrix(availabilityMap)
const getRowColumnSum = async (availabilityMap, skuArr, warehouseNameArr) => {
    let warehouseQuantitySumArr = [];
    let skusQuantitySumArr = [];

    for (const warehouse of warehouseNameArr) {
        let columnSum = 0;
        const oneWarehouseRecord = availabilityMap.get(warehouse);
        for (let j = 0; j < oneWarehouseRecord.length; j++) {
            for (let i = 0; i < skuArr.length; i++) {
                if (skuArr[i] == oneWarehouseRecord[j].channelSku) {
                    columnSum += oneWarehouseRecord[j].quantity;
                    if (skusQuantitySumArr[j] != undefined) {
                        // console.log(skusQuantitySumArr[j]);
                        let temp = skusQuantitySumArr[j] + oneWarehouseRecord[j].quantity;
                        skusQuantitySumArr[j] = temp;
                    } else {

                        skusQuantitySumArr.push(oneWarehouseRecord[j].quantity);
                    }
                }
            }
        }
        warehouseQuantitySumArr.push(columnSum);
    }
    return { skusQuantitySumArr, warehouseQuantitySumArr };
}

const temp = async () => {
    /* let quantityRequired = [{ "channelSku": "1000000033874", "quantity": 10 }, { "channelSku": "1000000033873", "quantity": 30 }]
    const warehouseThreshold = 5;
    let results = testData.testcases[5];
    const warehouseMap = await segregateDataWarehouseWise(results, quantityRequired);
    const availabilityMap = await availabilityMatrix(warehouseMap, quantityRequired);
    const warehouseList = await allocateWarehouse(availabilityMap, warehouseMap, quantityRequired, warehouseThreshold);
    console.log(warehouseList); */
    for (let i = 0; i < testData.testcases.length; i++) {
        let quantityRequired = [{ "channelSku": "1000000033874", "quantity": 10 }, { "channelSku": "1000000033873", "quantity": 30 }]
        const warehouseThreshold = 5;
        let results = testData.testcases[i];
        console.log('TEST CASE ::: ' + i);
        const warehouseMap = await segregateDataWarehouseWise(results, quantityRequired);
        const availabilityMap = await availabilityMatrix(warehouseMap, quantityRequired);

        const warehouseList = await allocateWarehouse(availabilityMap, warehouseMap, quantityRequired, warehouseThreshold);

        console.log(warehouseList);
    }
    // TEST CASE 0
    // Expected: WH1
    // TEST CASE 1
    // Expected: WH3
    // TEST CASE 2
    // Expected: WH2,WH3
    // TEST CASE 3
    // Expected: WH2,WH3
    // TEST CASE 4(good)
    // Expected: WH6
    // TEST CASE 5
    // Expected: []
    // TEST CASE 6
    // Expected: []
    // TEST CASE 7
    // Expected: WH1,WH2,WH5
    // TEST CASE 8
    // Expected: WH1.WH2,WH5,WH4
    // TEST CASE 9
    // Expected: WH2,WH5
    // TEST CASE 10
    // Expected: WH6
    // TEST CASE 11
    // Expected: []
    // TEST CASE 12
    // Expected: []
    // TEST CASE 13
    // Expected: []


    /*
1. integrate warehuose allocation api
2. request payload will contain state code, get warehouse list from redis order-type b2b servicable(Suraj)
3. sahil about warehouse search using ware code
4. change request and response structure
5. testcase in jest.
6. race condition
7. repo by Ramesh
 
Questions Ramesh
1. Form where I will get channelName and entity? Safal
2. We should udate the db after preparing the order.
3. Can I acces redis as I am accessing dynamoDB? redis insight(cred : )
 
Sahil
1. Presently api is fetching on the basis of entity:channelName
2. If I want to fetch for a warehouse. Can I do that?
3. Can I acces redis as I am accessing dynamoDB?
 
Suraj
1. How to fetch warehouses from redis?
 
    */

}

temp();

const getDataFromInventoryMaster = async (entity, channelName, channelSkus) => {
    return [
        {
            quantity: 1,
            warehouseCode: 'wms',
            warehouseName: 'Bengaluru INCREFF',
            sku: '1000000033873'
        }]
}


const getOrderAllocation = async (reqBody) => {
    // let quantityRequired = [{ "channelSku": "1000000033874", "quantity": 10 }, { "channelSku": "1000000033873", "quantity": 30 }]
    let quantityRequired = [];
    let skusArr = [];
    let orderItems = reqBody.order_items
    for (let item of orderItems) {
        let itemTemp = {}
        console.log(`item`);
        console.log(item);
        itemTemp.channelSku = item.sku;
        itemTemp.quantity = item.qty;
        skusArr.push(item.sku);
        quantityRequired.push(itemTemp);
    }
    console.log(`quantityRequired`);
    console.log(quantityRequired);
    const orderAddress = reqBody.order_address;
    const stateCode = orderAddress.state_code;
    const fulfillmentByWarehouse = reqBody.fulfillment_by_warehouse;
    const entity = reqBody.entity;
    const channelName = reqBody.channelName;


    //redis setup
    // gb:prod:warehouse-priority: GJ
    //get data from redis

    const warehouseThreshold = 5;
    let results = await getDataFromInventoryMaster(entity, channelName, skusArr);
    console.log('HERE');
    console.log(results);

    const warehouseMap = await segregateDataWarehouseWise(results, quantityRequired);
    console.log('warehouseMap');
    console.log(warehouseMap);

    const availabilityMap = await availabilityMatrix(warehouseMap, quantityRequired);

    const warehouseList = await allocateWarehouse(availabilityMap, warehouseMap, quantityRequired, warehouseThreshold);
    console.log(warehouseList);

}
let x = {
    "channelName": "mehraki_erp",
    "entity": "me02",
    "order_items": [
        {
            "sku": "1000000033875",
            "qty": 12
        },
        {
            "sku": "1000000033873",
            "qty": 10
        },
        {
            "sku": "1000000033874",
            "qty": 8
        }
    ],
    "order_address": {
        "pin_code": "110010",
        "state": "Haryana",
        "state_code": "HR"
    },
    "fulfillment_by_warehouse": ["wms_ggn", "wms_goa"],
    "order_type": "b2b"
}
const temp1 = async (x) => {

    await getOrderAllocation(x);
}
// temp1(x);


// Converted the code from normal node project to serverless
// Added logic in service warehouse-details for passing a list of preffered warehouse and fetch data
// For this api discussed with Sahil
// Spoke to Safal regarding request payload change(add some more fields)
// Had a meeting with Suraj for getting warehouse priority-wise
// installed redis-insight
// started converting test data into test cases.
/*
1. integrate redis code 
    a. check if the environment is dev or prod
    b. fetch warehouses for a given stateCode
request payload will contain state code, get warehouse list from redis order - type b2b servicable(Suraj)

2. change response structure
3. put the code in repo by Ramesh
4. testcase in jest.
*/