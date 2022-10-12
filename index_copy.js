//BUGS 
// something is not correct as in testcase 6 (index 5) it is showing multiple entries for 
// WH1 records 5-7 and 3
// Check if same thing is happening in any other case.

// if first lot is not fulfilling the order and second lot also not fulfilling
// in that case check if first lot and second lot combinedly can fulfill the request.

const testData = require('./testData');

// this method will create map warehouseCOde:[{channelSku1:quantity},{channelSku1:quantity}]
const segregateDataWarehouseWise = (responseFromInventoryMaster, quantityRequired) => {
    console.log(`responseFromInventoryMaster`);
    // console.log(responseFromInventoryMaster);
    console.log(Object.keys(quantityRequired));
    let skusArr = Object.keys(quantityRequired);
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
        console.log(entry.warehouseCode);
        console.log('map.get(entry.warehouseCode)');
        console.log(map.get(entry.warehouseCode));
        if (map.get(entry.warehouseCode) == undefined) {
            let obj = {};
            obj.channelSku = entry.pk;
            obj.quantity = entry.quantity;
            map.set(entry.warehouseCode, [obj]);
        } else {
            let skuArr = map.get(entry.warehouseCode);
            for (let i = 0; i < skuArr.length; i++) {
                console.log(skuArr[i].channelSku == entry.pk);
                if (skuArr[i].channelSku == entry.pk) {
                    skuArr[i].quantity = entry.quantity;
                }
            }
            map.set(entry.warehouseCode, skuArr);
        }
    }
    console.log(`map`);
    console.log(map);
    return map;
}

/* const segregateDataWarehouseWise = (responseFromInventoryMaster) => {
    console.log(`responseFromInventoryMaster`);
    // console.log(responseFromInventoryMaster);
    let map = new Map();
    for (const entry of responseFromInventoryMaster) {
        console.log(entry.warehouseCode);
        console.log('map.get(entry.warehouseCode)');
        console.log(map.get(entry.warehouseCode));
        if (map.get(entry.warehouseCode) == undefined) {
            let obj = {};
            obj.channelSku = entry.pk;
            obj.quantity = entry.quantity;
            map.set(entry.warehouseCode, [obj]);
        } else {
            let skuArr = map.get(entry.warehouseCode);
            let obj = {};
            obj.channelSku = entry.pk;
            obj.quantity = entry.quantity;
            skuArr.push(obj);
            map.set(entry.warehouseCode, skuArr);
        }
    }
    console.log(`map`);
    console.log(map);
    return map;
} */

const addStocksOfTwoObjects = async (obj1, obj2, quantityRequired) => {
    const warehouseCode1 = obj1.warehouseCode;
    const warehouseCode2 = obj2.warehouseCode;
    // getting array containing skus and quantities
    const arr1 = obj1.value;
    const arr2 = obj2.value;
    let fullFlag = true;
    let partialFlag = false;
    let result = {}
    result.warehouseCode = [...warehouseCode1, ...warehouseCode2];
    result.value = []
    result.warehouseCount = result.warehouseCode.length;
    result.quantityPresent = 'none';
    for (let i = 0; i < arr1.length; i++) {
        const channelSku1 = arr1[i]?.['channelSku'];
        const channelSku2 = arr2[i]?.['channelSku'];
        const quantity1 = arr1[i]['quantity'];
        const quantity2 = arr2[i]['quantity'];
        result.value.push({ "channelSku": channelSku1, "quantity": quantity1 + quantity2 });
        if ((channelSku1 && quantityRequired[channelSku1] <= quantity1 + quantity2) ||
            (channelSku2 && quantityRequired[channelSku2] <= quantity1 + quantity2)) {
            partialFlag = true;

        } else {
            fullFlag = false;
        }
    }

    if (fullFlag) {
        result.quantityPresent = 'full_with_multi_WH';

    } else if (partialFlag) {
        result.quantityPresent = 'partial';
    }
    return result;

}

const isRequestedQuantityPresent = async (obj, quantityRequired) => {
    // const warehouseCode = obj.warehouseCode[0];
    const arr = obj.value;
    let fullFlag = true;
    let partialFlag = false;
    let result = {}
    result.quantity = {}
    result.quantityPresent = 'none';
    for (let i = 0; i < arr.length; i++) {
        const channelSku = arr[i]['channelSku'];
        const quantity = arr[i]['quantity'];
        result.quantity[channelSku] = quantity;
        console.log(quantityRequired[channelSku]);
        console.log(quantity);
        if (quantityRequired[channelSku] == quantity) {
            partialFlag = true;

        } else {
            fullFlag = false;
        }
    }
    result.warehouseCodes = obj.warehouseCode[0];
    result.warehouseCount = 1;
    if (fullFlag) {
        result.quantityPresent = 'full';
    } else if (partialFlag) {
        result.quantityPresent = 'partial';
    }
    return result;

}

const arrayEqual = (arr1, arr2) => {
    if (arr1.length != arr2.length) return false;
    // let arr1 = warehouseList1.split(',');
    // let arr2 = warehouseList2.split(',');
    // arr1 = sortArr(arr1);
    // arr2 = sortArr(arr2);
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] != arr2[i])
            return false;
    }
    return true;
}

const doesWarehouseCombinationAlreadyExists = (warehouseCombinations, currentArr) => {
    // currentArr = sortArr(currentArr);
    currentArr = currentArr.sort();
    for (let i = 0; i < warehouseCombinations.length; i++) {
        if (arrayEqual(warehouseCombinations[i], currentArr)) {
            return true;
        }
    }
    return false;
}
const getAllPartialAndCompleteCombinations = async (warehouseArrWithThresholdEntries, quantityRequired) => {
    // this array will contain all the warehouse combinations visited
    // it will will prevent same warehouse combinations WH1,WH2,WH3 and WH1,WH3,WH2 
    let warehouseCombinations = [];
    for (let i = 0; i < warehouseArrWithThresholdEntries.length; i++) {
        warehouseCombinations.push(warehouseArrWithThresholdEntries[i].warehouseCode);
    }

    let loopinArr = [...warehouseArrWithThresholdEntries];
    let result = [];
    // if any full order is found, no need to store partial order
    let addPartialOrder = true;
    let bestPartialOrder = { warehouseCount: 100000 };
    let bestFullOrder = { warehouseCount: 100000 };
    while (warehouseArrWithThresholdEntries.length > 0) {
        const outerObj = warehouseArrWithThresholdEntries.shift();
        // loopinArr.shift();
        // check if individual warehaouse is fulfilling the required quantity
        const quantityPresentObj = await isRequestedQuantityPresent(outerObj, quantityRequired);
        if (quantityPresentObj.quantityPresent == 'full') {
            if (bestFullOrder.warehouseCount > quantityPresentObj.warehouseCount) {
                bestFullOrder = quantityPresentObj;
            }
            result.push(quantityPresentObj);
            break;
        } else if (quantityPresentObj.quantityPresent == 'partial' && addPartialOrder) {
            if (bestPartialOrder.warehouseCount > quantityPresentObj.warehouseCount) {
                bestPartialOrder = quantityPresentObj;
            }
            // warehouseArrWithThresholdEntries.push(sumObj)
            result.push(quantityPresentObj);
        }
        for (let i = 0; i < loopinArr.length; i++) {
            const innerObj = loopinArr[i];
            console.log(outerObj.warehouseCode);
            console.log(innerObj.warehouseCode);
            if (outerObj.warehouseCode.includes(innerObj.warehouseCode[0]))
                continue;
            const combinationExists = doesWarehouseCombinationAlreadyExists(warehouseCombinations, [...outerObj.warehouseCode, ...innerObj.warehouseCode]);
            if (combinationExists)
                continue;
            const sumObj = await addStocksOfTwoObjects(innerObj, outerObj, quantityRequired);
            console.log('sumObj');
            console.log(sumObj.value[0]);
            console.log(sumObj.value[1]);
            console.log('warehouse combinations going to be added');
            console.log(sumObj.warehouseCode);
            // const combinationExists = doesWarehouseCombinationAlreadyExists(warehouseCombinations, sumObj.warehouseCode);
            // if (!combinationExists) {
            warehouseCombinations.push(sumObj.warehouseCode.sort());
            /*  if (sumObj.quantityPresent == 'none' || sumObj.quantityPresent == 'partial') {
                 warehouseArrWithThresholdEntries.push(sumObj)
             }
             if (sumObj.quantityPresent == 'partial' || sumObj.quantityPresent == 'full') {
                 result.push(sumObj);
             } */
            if (sumObj.quantityPresent == 'none') {
                warehouseArrWithThresholdEntries.push(sumObj)
            } else if (sumObj.quantityPresent == 'partial' && addPartialOrder) {
                if (bestPartialOrder.warehouseCount > sumObj.warehouseCount) {
                    bestPartialOrder = sumObj;
                }
                warehouseArrWithThresholdEntries.push(sumObj)
                result.push(sumObj);
            } else if (sumObj.quantityPresent == 'full') {
                // result.push(sumObj);
                if (bestFullOrder.warehouseCount > sumObj.warehouseCount) {
                    bestFullOrder = sumObj;
                }
                if (addPartialOrder)
                    result = [];
                result.push(sumObj);
                addPartialOrder = false;
                // return result;
            }
            // }
        }
    }

    console.log(bestPartialOrder);
    console.log(bestFullOrder);
    if (bestFullOrder.warehouseCount < 100000)
        return [bestFullOrder];
    /* if (bestPartialOrder.warehouseCount < 100000)
        return [bestPartialOrder]; */

    return result;

}
const areAllOrderPartial = async (orders) => {
    for (let i = 0; i < orders.length; i++) {
        if (orders[i].quantityPresent == 'full')
            return false;
    }
    return true;
}
const allocateWarehouse = async (warehouseMap, quantityRequired, warehouseThreshold) => {
    let i = 0;
    // let map = new Map();
    let arr = [];
    let allPartialOrders = [];
    for (const [key, value] of warehouseMap) {
        // map.set(key, value);
        arr.push({ "warehouseCode": [key], value });
        i++;
        if (i % warehouseThreshold == 0) {
            const warehouseList = await getAllPartialAndCompleteCombinations(arr, quantityRequired,);
            // await getAllPartialAndCompleteCombinations(map);
            if (warehouseList.length > 0) {
                // if warehouse contains all the partial orders store them somewhere and 
                // continue the process
                // if in the end no order is full use partial orders to make a full order if possible
                console.log(`warehouseList`);
                console.log(warehouseList);
                if (await areAllOrderPartial(warehouseList)) {
                    allPartialOrders = [...allPartialOrders, ...warehouseList];
                } else {
                    return warehouseList;
                }
            }
            arr = [];
        }
    }
    const warehouseList = await getAllPartialAndCompleteCombinations(arr, quantityRequired,);
    if (await areAllOrderPartial(warehouseList)) {
        allPartialOrders = [...allPartialOrders, ...warehouseList];
    } else {
        return warehouseList;
    }
    // put logic for completing the order using partial orders and return the final result.
    // else return order is unfulfillable.
}


const results = testData.testcases[2]
const quantityRequired = { "1000000033873": 30, "1000000033874": 10 };
const warehouseMap = segregateDataWarehouseWise(results, quantityRequired);

console.log(warehouseMap);
const warehouseList = allocateWarehouse(warehouseMap, quantityRequired, 5);