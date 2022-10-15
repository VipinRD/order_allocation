const getDataFromInventoryMaster = async (entity, channelName, channelSkus, warehouseChannelCodes) => {
    /* const data = {
        channelSkus: channelSkus,
        channelName: channelName,
        entity: entity,
        fulfillmentByWarehouse: warehouseChannelCodes
    };
    const url = process.env.INVENTORY_API;
    const config = {
        method: 'post',
        url: url,
        data: data,
        headers: {
            "Content-Type": "application/json"
        }
    };

    const response = await axios(config);
    const resultArr = response?.data?.data?.results;
    if (resultArr && resultArr.length > 0)
        return resultArr;
    return null; */

    return [

        {
            "quantity": 0,
            "warehouseCode": "WH1",
            "sku": "1000000033873",
            "warehouseName": "Bengaluru INCREFF",
        },
        {
            "quantity": 0,
            "warehouseCode": "WH2",
            "sku": "1000000033873",
            "warehouseName": "Bengaluru INCREFF",
        },
        {
            "quantity": 5,
            "warehouseCode": "WH3",
            "sku": "1000000033873",
            "warehouseName": "Bengaluru INCREFF",
        },
        {
            "quantity": 35,
            "warehouseCode": "WH4",
            "sku": "1000000033873",
            "warehouseName": "Bengaluru INCREFF",
        },
        {
            "quantity": 0,
            "warehouseCode": "WH5",
            "sku": "1000000033873",
            "warehouseName": "Bengaluru INCREFF",
        },

        {
            "quantity": 10,
            "warehouseCode": "WH4",
            "sku": "1000000033874",
            "warehouseName": "Bengaluru INCREFF",
        }, {
            "quantity": 13,
            "warehouseCode": "WH5",
            "sku": "1000000033874",
            "warehouseName": "Bengaluru INCREFF",
        },


        {
            "quantity": 10,
            "warehouseCode": "WH3",
            "sku": "1000000033875",
            "warehouseName": "Bengaluru INCREFF",
        },
        {
            "quantity": 10,
            "warehouseCode": "WH3",
            "sku": "1000000033876",
            "warehouseName": "Bengaluru INCREFF",
        },
        {
            "quantity": 3,
            "warehouseCode": "WH1",
            "sku": "1000000033877",
            "warehouseName": "Bengaluru INCREFF",
        },
        {
            "quantity": 3,
            "warehouseCode": "WH2",
            "sku": "1000000033877",
            "warehouseName": "Bengaluru INCREFF",
        }
    ];
};

const getKeysFromQuantityRequired = async (quantityRequired) => {
    let skus = [];
    for (const item of quantityRequired) {
        skus.push(item.channelSku);
    }
    return skus;
};
/* const getValuesFromQuantityRequired = async (quantityRequired) => {
    let quantities = [];
    for (const item of quantityRequired) {
        quantities.push(item.quantity);
    }
    return quantities;
}; */
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

                if (skuArr[i].channelSku == entry.sku) {
                    skuArr[i].quantity = entry.quantity;
                    break;
                }
            }
            map.set(entry.warehouseCode, skuArr);
        }
    }
    if (map.size > 0)
        return map;
    return null;
};

//This method will create map (matrix) if a warehouse is capable of serving one item completely
// value will be placed 1, if not then 0
const availabilityMatrix = async (warehaouseMap, quantityRequired) => {
    let map = new Map(JSON.parse(JSON.stringify([...warehaouseMap])));
    for (const [key, value] of map) {
        for (let i = 0; i < value.length; i++) {
            for (const item of quantityRequired) {
                const skuFromWareHouse = value[i].channelSku;
                const skuFromQuantityRequired = item.channelSku;
                const quantityReqForSku = item.quantity;
                const quantityAvailableForSku = value[i].quantity;
                if (skuFromWareHouse == skuFromQuantityRequired) {
                    if (quantityReqForSku > quantityAvailableForSku)
                        value[i].quantity = 0;
                    else
                        value[i].quantity = 1;
                }
            }
        }
        map.set(key, value);
    }

    /*  for (const [key, value] of map) {
         for (let i = 0; i < value.length; i++) {
             if (value[i].quantity > 0)
                 value[i].quantity = 1;
         }
         map.set(key, value);
     } */
    return map;

};

const filterAvailabilityMatrixForBundle = async (availabilityMap, oneBundle) => {
    let returnMap = new Map();
    for (const [key, value] of availabilityMap) {
        for (let i = 0; i < value.length; i++) {
            for (const item of oneBundle) {
                const skuFromWareHouse = value[i].channelSku;
                const skuFromQuantityRequired = item.channelSku;
                if (skuFromWareHouse == skuFromQuantityRequired) {
                    const entry = returnMap.get(key);
                    if (entry == undefined) {
                        returnMap.set(key, [value[i]]);
                    } else {
                        entry.push(value[i]);
                        returnMap.set(key, entry);
                    }
                }
            }
        }
    }

    return returnMap;
};

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
        };
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
    // copy remianing warehouses to warehaouseToBeSorted
    for (const warehouse of tempWarehaouseToBeSorted) {
        if (warehouse != '') {
            warehaouseToBeSorted.push(warehouse);
        }
    }

    let quantities = [];
    for (const warehouse of warehaouseToBeSorted) {
        const data = warehouseMap.get(warehouse);
        for (const datum of data) {
            if (datum.channelSku == sku) {
                quantities.push(datum.quantity);
            }
        }
    }

    let temp = [...quantities];
    temp.sort((a, b) => b - a);

    for (const item of temp) {
        for (let i = 0; i < quantities.length; i++) {

            if (quantities[i] > 0 && item > 0 && item == quantities[i]) {
                quantityAvailableForSku += quantities[i];
                warehouseAddedToOrder.push(warehaouseToBeSorted[i]);
                quantities[i] = -1;
                break;
            }
        }
        if (quantityAvailableForSku >= quantityReqForSku) {
            return {
                warehouseList: warehouseAddedToOrder,
                orderFulfillable: true
            };
        }
    }
    return {
        warehouseList: warehouseAddedToOrder,
        orderFulfillable: false
    };
};

const isOrderFulfillableInThreshold = async (skusQuantitySumArr) => {
    for (const element of skusQuantitySumArr) {
        if (element == 0)
            return false;
    }
    return true;
};
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

};

const prepareData = async (warehouseCode, warehouseData, order) => {
    let warehouseObj = { serviceable_items: [] };
    warehouseObj["warehouse_code"] = warehouseCode;

    for (const warehouseDatum of warehouseData) {
        const sku = warehouseDatum.channelSku;
        const quantity = warehouseDatum.quantity;
        warehouseObj.serviceable_items.push({ [sku]: quantity });
    }

    order.serviceable_warehouses.push(warehouseObj);
    return order;
};

const getSkusNotServed = async (order, quantityRequired) => {
    let skusNotServed = [];
    let allSkus = await getKeysFromQuantityRequired(quantityRequired);
    let skusServed = [];
    const serviceableWarehouses = order.serviceable_warehouses;

    for (const serviceableWarehouse of serviceableWarehouses) {
        const serviceableItemsArr = serviceableWarehouse.serviceable_items;
        for (const serviceableItem of serviceableItemsArr) {
            for (const quantityReq of quantityRequired) {
                const sku = quantityReq.channelSku;
                if (serviceableItem[sku] >= quantityReq.quantity) {
                    skusServed.push(sku);
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

};

/* const addUnfulfillableItems = async (sku, quantityReqforSku, order) => {
    const obj = { [sku]: quantityReqforSku };
    order.unfulfillable_items.push(obj);
    return order;
}; */

//This function will return list of unsurved skus if isBundle is false and all skus are not found in exisiting 
//warehouses
const existingWarehouseFulFillCurrentSku = async (existingWarehouseCodes, warehouseMap, quantityRequired, isBundle) => {
    let skuFoundInAnyWarehouse = [];
    let skuFoundInSameWarehouse = [];

    for (const existingWarehouseCode of existingWarehouseCodes) {
        const warehouseDetails = warehouseMap.get(existingWarehouseCode);
        skuFoundInSameWarehouse = [];
        for (const warehouse of warehouseDetails) {
            for (const quantityReq of quantityRequired) {
                if (warehouse.channelSku == quantityReq.channelSku && warehouse.quantity >= quantityReq.quantity) {
                    skuFoundInSameWarehouse.push(quantityReq.channelSku);
                    skuFoundInAnyWarehouse.push(quantityReq.channelSku);
                }
            }
        }

        if (isBundle && skuFoundInSameWarehouse.length == quantityRequired.length) {
            return true;
        }
    }
    if (isBundle) {
        if (skuFoundInSameWarehouse.length == quantityRequired.length) {
            return true;
        } else {
            return false;
        }
    } else if (skuFoundInAnyWarehouse.length > 0) {
        let temp = [];
        for (const qr of quantityRequired) {
            let found = false;
            for (const skuFound of skuFoundInAnyWarehouse) {
                if (qr.channelSku == skuFound) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                temp.push(qr);
            }
        }
        return temp;
    } else {
        return quantityRequired;
    }
};

const warehouseAllocation = async (availabilityMap, warehouseMap, quantityRequired, existingWarehouseCodes, isBundle) => {
    let skusArr = await getKeysFromQuantityRequired(quantityRequired);
    let warehouseNameArr = [...availabilityMap.keys()];
    let order = {
        "serviceable_warehouses": [],
        "unfulfillable_items": []
    };
    order.order_serviceable = true;

    let foundInExisitngWareHouse = false;
    if (existingWarehouseCodes && existingWarehouseCodes.length > 0) {
        // call function to check if existingWarehouse can fulfill for current skus getwarehouseCode
        // set foundInExisitngWareHouse = true
        const warehouseFound = await existingWarehouseFulFillCurrentSku(existingWarehouseCodes, warehouseMap, quantityRequired, isBundle);
        if (isBundle) {
            if (warehouseFound) {
                foundInExisitngWareHouse = true;
                return [];
            }
        } else {
            //if isBundle is false it means function will return list of unsurved skus
            if (warehouseFound.length == 0) {
                foundInExisitngWareHouse = true;
                return [];
            } else {
                quantityRequired = warehouseFound;
                availabilityMap = await filterAvailabilityMatrixForBundle(availabilityMap, quantityRequired);
            }
        }

    }

    let notDone = true;
    let { skusQuantitySumArr, warehouseQuantitySumArr } = await getRowColumnSum(availabilityMap, skusArr, warehouseNameArr);
    //  If service is possible using all items in one warehouse or atleat one item/warehouse is possible in one threshold
    // 1. check if every skusQuantitySumArr element is non zero then only order is fulfillable in this threshold
    // a. check from starting which warehouseQuantitySumArr is having max value, So it can serve max items
    // b. get remaining skus index, for all zero value
    // index from top to bottom

    // isOrderFulfillableInThreshold will check if the ordered quantity is present in atleat one warehouse
    // Ex. sku1 is present in WH3, sk2 is presnt in WH1 so order will be(WH1, WH3)

    if (await isOrderFulfillableInThreshold(skusQuantitySumArr) && !foundInExisitngWareHouse) {
        while (notDone) {
            const warehouseCode = await getWarehouseWithMaxSkus(warehouseQuantitySumArr, availabilityMap);
            const warehouseData = warehouseMap.get(warehouseCode);
            order = await prepareData(warehouseCode, warehouseData, order);
            skusArr = await getSkusNotServed(order, quantityRequired);
            if (skusArr.length == 0) {
                notDone = false;
                break;
            }
            let temp = await getRowColumnSum(availabilityMap, skusArr, warehouseNameArr);
            skusQuantitySumArr = temp.skusQuantitySumArr;
            warehouseQuantitySumArr = temp.warehouseQuantitySumArr;
        }
        if (isBundle && order.serviceable_warehouses.length > 1) {
            order = {
                "serviceable_warehouses": [],
                "unfulfillable_items": []
            };
            order.order_serviceable = false;
            for (const sku of await getKeysFromQuantityRequired(quantityRequired))
                order.unfulfillable_items.push(sku);
            return order;
        }
        return order;
    } else if (!foundInExisitngWareHouse && !isBundle) {
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
            console.log(`temp`);
            console.log(temp);
            if (!temp.orderFulfillable) {
                order.order_serviceable = false;
                order.unfulfillable_items.push(sku);
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
            return order;
        }
        return order;
    }
    order.order_serviceable = false;
    for (const sku of skusArr)
        order.unfulfillable_items.push(sku);
    return order;
};

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
};

const allocateWarehouse = async (availabilityMap, warehouseMap, quantityRequired, warehouseThreshold) => {
    // sort as per quantity in desc order
    quantityRequired.sort((a, b) => b.quantity - a.quantity);

    let i = 0;
    let availabilityeMapAsPerThreshold = new Map();
    let allPartialOrders = [];
    let noMatchFound = false;
    for (const [key, value] of availabilityMap) {
        availabilityeMapAsPerThreshold.set(key, value);
        i++;

        if (i % warehouseThreshold == 0) {
            const finalWarehouseList = await findWarehouseForOrder(availabilityeMapAsPerThreshold, warehouseMap, quantityRequired);
            if (Object.keys(finalWarehouseList).length == 0) {
                noMatchFound = true;
            }
            else {
                noMatchFound = false;
            }
            if (!finalWarehouseList.order_serviceable) {
                allPartialOrders.push(finalWarehouseList);
            } else {
                return finalWarehouseList;
            }
            availabilityeMapAsPerThreshold = new Map();
        }
    }

    if (availabilityeMapAsPerThreshold.size > 0) {
        const finalWarehouseList = await findWarehouseForOrder(availabilityeMapAsPerThreshold, warehouseMap, quantityRequired);
        if (Object.keys(finalWarehouseList).length == 0) {
            noMatchFound = true;
        }
        else {
            noMatchFound = false;
        }
        if (!finalWarehouseList.order_serviceable) {
            allPartialOrders.push(finalWarehouseList);
        } else {
            return finalWarehouseList;
        }
    }
    if (noMatchFound) {
        let skusArr = await getKeysFromQuantityRequired(quantityRequired);
        let order = {
            "serviceable_warehouses": [],
            "unfulfillable_items": []
        };

        order.order_serviceable = false;
        for (const sku of skusArr)
            order.unfulfillable_items.push(sku);
        return order;
    }

    if (allPartialOrders.length > 0) {
        return allPartialOrders[0];
    }
    return [];
};

const isOrderTypeServable = async (orderType, warehouseData) => {
    // let orderTypeServable;
    if (orderType.toLowerCase() == 'b2b')
        return warehouseData['is_b2b_enabled'];
    else if (orderType.toLowerCase() == 'b2c')
        return warehouseData['is_b2c_enabled'];
    else if (orderType.toLowerCase() == 'hnb')
        return warehouseData['is_hnb_enabled'];
};

const getCommonWarehouses = async (warehouseCodes, fulfillmentByWarehouse) => {
    let result = [];
    if (fulfillmentByWarehouse != null && fulfillmentByWarehouse.length > 0) {
        for (const warehouse of fulfillmentByWarehouse) {
            for (const warehouseCode of warehouseCodes) {
                if (warehouse == warehouseCode) {
                    result.push(warehouse);
                    break;
                }
            }
        }
        return result;
    } else {
        return warehouseCodes;
    }
};
const getWarehouseChannelCodeFromRedis = async (entity, channelName, warehouseCode) => {
    const key_name = `gb:${process.env.STAGE}:entity:${entity}:warehouse_channel:${channelName}`;
    let data;
    try {
        data = await getDataFromRedis(key_name);
    } catch (error) {
        logger.response({
            traces: [`${key_name}`],
            event: "GET_DATA_REDIS_ERROR",
            message: error,
        });
    }
    const redisData = data ? JSON.parse(data) : false;
    if (redisData) {
        const locationCodeList = redisData.location_code_list;
        for (const locationCode of locationCodeList) {
            if (warehouseCode == locationCode.warehouse_code)
                return locationCode.warehouse_channel_code;
        }
    }
    return null;
};

const getWarehouseChannelCodesToBeSearched = async (reqBody) => {
    const orderAddress = reqBody.order_address;
    const stateCode = orderAddress.state_code;
    const fulfillmentByWarehouse = reqBody.fulfillment_by_warehouse;
    const orderType = reqBody.order_type;
    const entity = reqBody.entity;
    const channelName = reqBody.channelName;
    const key_name = `gb:${process.env.STAGE}:warehouse-priority:${stateCode}`;
    let data;
    try {
        data = await getDataFromRedis(key_name);
    } catch (error) {
        logger.response({
            traces: [`${key_name}`],
            event: "GET_DATA_REDIS_ERROR",
            message: error
        });
        return null;
    }
    const warehouseDataWithPriorities = data ? JSON.parse(data) : false;

    if (!warehouseDataWithPriorities) {
        logger.response({
            traces: [`${key_name}`],
            event: "NO_WAREHOUSE_FOUND",
            message: 'No warehouse found',
        });
        return null;
    }
    let warehouseCodes = [];
    if (warehouseDataWithPriorities && warehouseDataWithPriorities.length > 0)
        for (const warehouseData of warehouseDataWithPriorities) {
            // warehouseCodes.push(warehouseData['warehouse_code']);
            const orderTypeServable = await isOrderTypeServable(orderType, warehouseData);
            if (orderTypeServable) {
                warehouseCodes.push(warehouseData['warehouse_code']);
            }
        }
    if (warehouseCodes.length == 0) {
        logger.response({
            traces: [`${key_name}`],
            event: "NO_WAREHOUSE_CODES_FOUND",
            message: 'No warehouse codes found',
        });
        return null;
    }
    warehouseCodes = await getCommonWarehouses(warehouseCodes, fulfillmentByWarehouse);
    if (warehouseCodes && warehouseCodes.length == 0) {
        logger.response({
            traces: [`${key_name}`],
            event: "NO_WAREHOUSE_CODE_FOUND",
            message: 'No warehouse code found',
        });
    }
    let warehouseChannelCodeFromRedis = [];
    for (const warehouseCode of warehouseCodes) {
        const warehouseChannelCode = await getWarehouseChannelCodeFromRedis(entity, channelName, warehouseCode);
        if (warehouseChannelCode)
            warehouseChannelCodeFromRedis.push(warehouseChannelCode);
    }

    if (warehouseChannelCodeFromRedis && warehouseChannelCodeFromRedis.length == 0) {
        logger.response({
            traces: [`${key_name}`],
            event: "NO_WAREHOUSE_FOUND_AGAINNST_REDIS_KEY",
            message: 'No warehouse found against redis key.',
        });
        return null;
    }
    return warehouseChannelCodeFromRedis;
};

const createMapForBundleSku = async (quantityRequired) => {
    const map = new Map();
    for (const oneItemQuantityRequired of quantityRequired) {
        const entry = map.get(oneItemQuantityRequired.bundleSku);
        if (entry == undefined) {
            map.set(oneItemQuantityRequired.bundleSku, [oneItemQuantityRequired]);
        } else {
            entry.push(oneItemQuantityRequired);
            map.set(oneItemQuantityRequired.bundleSku, entry);

        }
    }
    return map;
};

const getFinalWarehouseList = async (finalWarehouseList, warehouseList) => {
    let result = {
        "serviceable_warehouses": [],
        "unfulfillable_items": [],
        order_serviceable: true
    };

    if (finalWarehouseList && Object.keys(finalWarehouseList).includes('order_serviceable'))
        result.order_serviceable = finalWarehouseList.order_serviceable;
    if (warehouseList && Object.keys(warehouseList).includes('order_serviceable'))
        result.order_serviceable = result.order_serviceable && warehouseList.order_serviceable;
    if (finalWarehouseList && finalWarehouseList.serviceable_warehouses) {
        for (const item of finalWarehouseList.serviceable_warehouses) {
            result.serviceable_warehouses.push(item);
        }
        for (const item of finalWarehouseList.unfulfillable_items) {
            result.unfulfillable_items.push(item);
        }
    }

    if (warehouseList && warehouseList.serviceable_warehouses) {
        for (const item of warehouseList.serviceable_warehouses) {
            result.serviceable_warehouses.push(item);
        }
        for (const item of warehouseList.unfulfillable_items) {
            result.unfulfillable_items.push(item);
        }
    }
    return result;
};

const prepareQuantityAsPerOrderForBundles = async (finalWarehouseList, bundledQuantityRequired) => {
    for (const bundle of bundledQuantityRequired.values()) {

        for (const warehouse of finalWarehouseList.serviceable_warehouses) {
            let serviceableItems = warehouse.serviceable_items;
            let skucount = 0;
            let quantityFoundcount = 0;
            let objIndex = [];
            let skusFound = [];
            for (let objInArr = 0; objInArr < serviceableItems.length; objInArr++) {
                if (skucount == bundle.length) break;
                for (const quantityToCompare of bundle) {
                    const sku = quantityToCompare.channelSku;
                    if (serviceableItems[objInArr][quantityToCompare.channelSku]) {
                        skucount++;
                        objIndex.push(objInArr);
                        skusFound.push(sku);
                        if (serviceableItems[objInArr][sku] >= quantityToCompare.quantity) {
                            quantityFoundcount++;
                            if (quantityFoundcount == bundle.length) {

                                for (let i = 0; i < objIndex.length; i++) {
                                    serviceableItems[objIndex[i]][skusFound[i]] = bundle[i].quantity;
                                }
                                break;
                            }
                        }
                    }
                }
            }
            if (skucount > 0 && quantityFoundcount != bundle.length) {

                for (let i = 0; i < objIndex.length; i++) {
                    serviceableItems[objIndex[i]][skusFound[i]] = 0;
                }
            }
        }
    }
    return finalWarehouseList;
};

const prepareQuantityAsPerOrder = async (finalWarehouseList, quantityToCompareForFinalOrder) => {
    for (const warehouse of finalWarehouseList.serviceable_warehouses) {
        let serviceableItems = warehouse.serviceable_items;
        for (let item of serviceableItems) {
            for (const quantityToCompare of quantityToCompareForFinalOrder) {
                const sku = quantityToCompare.channelSku;
                if (item[sku] > 0) {
                   /*  if (finalWarehouseList.unfulfillable_items.includes(sku)) {
                        item[sku] = 0;
                    } else */ if (item[sku] >= quantityToCompare.quantity) {
                        item[sku] = quantityToCompare.quantity;
                        quantityToCompare.quantity = 0;
                    } else {
                        quantityToCompare.quantity -= item[sku];
                    }
                    break;
                }
            }
        }
    }
    return finalWarehouseList;
};
const getOrderAllocation = async (reqBody) => {
    let quantityRequired = [];
    let skusArr = [];
    let orderItems = reqBody.order_items;
    let isBundlePresent = false;
    for (let item of orderItems) {
        let itemTemp = {};
        itemTemp.channelSku = item.sku;
        itemTemp.quantity = item.qty;
        itemTemp.bundleSku = item.bundleSku;
        if (item.bundleSku) {
            isBundlePresent = true;
            itemTemp.bundleSku = item.bundleSku;
        } else {
            itemTemp.bundleSku = null;
        }
        skusArr.push(item.sku);
        quantityRequired.push(itemTemp);
    }
    const quantityToCompareForFinalOrder = [...JSON.parse(JSON.stringify([...quantityRequired]))];
    const entity = reqBody.entity;
    const channelName = reqBody.channelName;

    const warehouseChannelCodes = await getWarehouseChannelCodesToBeSearched(reqBody);
    if (!warehouseChannelCodes) {
        return null;
    }

    const warehouseThreshold = 5;
    let results = await getDataFromInventoryMaster(entity, channelName, skusArr, warehouseChannelCodes);
    if (!results) {
        return null;
    }
    const warehouseMap = await segregateDataWarehouseWise(results, quantityRequired);
    if (!warehouseMap) {
        return null;
    }
    const availabilityMap = await availabilityMatrix(warehouseMap, quantityRequired);
    const warehouseList = await allocateWarehouse(availabilityMap, warehouseMap, quantityRequired, warehouseThreshold);
    const bundledQuantityRequired = await createMapForBundleSku(quantityToCompareForFinalOrder);

    let finalWarehouseList;
    if (isBundlePresent)
        finalWarehouseList = await prepareQuantityAsPerOrderForBundles(warehouseList, bundledQuantityRequired);
    else
        finalWarehouseList = await prepareQuantityAsPerOrder(warehouseList, quantityToCompareForFinalOrder);
    return finalWarehouseList;
};


const findWarehouseForOrder = async (availabilityeMapAsPerThreshold, warehouseMap, quantityRequired) => {
    let existingWareHouses = [];
    let finalWarehouseList = {};
    const bundledQuantityRequired = await createMapForBundleSku(quantityRequired);
    for (const key of bundledQuantityRequired.keys()) {
        const oneBundle = bundledQuantityRequired.get(key);
        let isBundle = oneBundle[0].bundleSku != undefined;
        const filterAvailabilityMatrix = await filterAvailabilityMatrixForBundle(availabilityeMapAsPerThreshold, oneBundle);
        const warehouseList = await warehouseAllocation(filterAvailabilityMatrix, warehouseMap, oneBundle, existingWareHouses, isBundle);
        if (warehouseList && Object.keys(warehouseList).length > 0)
            finalWarehouseList = await getFinalWarehouseList(finalWarehouseList, warehouseList);

        existingWareHouses = [];
        if (finalWarehouseList && Object.keys(finalWarehouseList).length > 0)
            for (const item of finalWarehouseList.serviceable_warehouses) {
                existingWareHouses.push(item.warehouse_code);
            }
    }
    return finalWarehouseList;
}

const printList = async (list) => {
    if (list && Object.keys(list).length > 0) {
        console.log('############################################################################');
        for (const warehouse of list.serviceable_warehouses)
            console.log(warehouse);
        for (const warehouse of list.unfulfillable_items)
            console.log(warehouse);
        console.log(`list.order_serviceable ${list.order_serviceable}`);
    }
    console.log('############################################################################');

};

module.exports = { getOrderAllocation };