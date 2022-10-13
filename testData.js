// case 1
/*
        w1  w2  w3  w4  w5
73      0   0   0   30  0
74      0   0   0   10  0
75      0   0   6   7   0    
76      0   0   5   8   0
77      2   0   2   0   2

bundle[{73,74},{75,76}],no bundle 77
expected o/p = w4,w1
no bundle
expected o/p = w4,w1
===================================
// case 2
        w1  w2  w3  w4  w5
73      0   0   0   30  0
74      0   0   0   10  0
75      0   0   6   0   0    
76      0   0   5   8   0
77      2   0   0   0   2

bundle[{73,74},{75,76}],no bundle 77
expected o/p = w4,w1,w3
no bundle
expected o/p = w4,w1,w3
===================================


case 3
        w1  w2  w3  w4  w5
73      0   0   0   30  0
74      0   0   0   10  0
75      0   0   6   0   0    
76      0   0   5   0   0
77      2   0   0   0   2

bundle[{73,74},{75,76}],no bundle 77
expected o/p = w4,w3,w1
no bundle
expected o/p = w3,w4,w1,
===================================

case 4

        w1  w2  w3  w4  w5 w6   w7 
73      0   0   0   30  0   0   30
74      0   0   0   0   0   0   10
75      0   0   6   0   0   0   0 
76      0   0   5   0   0   0   0
77      2   0   0   0   2   0   0

bundle[{73,74},{75,76}],no bundle 77
expected o/p = w3,w1
UNFULFILLED
no bundle
expected o/p = w3,w1,w4
UNFULFILLED
===================================

case 5
        w1  w2  w3  w4  w5 w6   w7 
73      0   0   0   30  0   0   30
74      0   0   0   0   0   0   10
75      0   0   6   0   0   0   7 
76      0   0   5   0   0   0   0
77      2   2   0   2   0   0   0

bundle[{73,74},{75,76}],no bundle 77
expected o/p = w3,w1
no bundle
expected o/p = w7,w3,w1

===================================

case 6

        w1  w2  w3  w4  w5 w6   w7 
73      0   0   0   30  0   0   30
74      0   0   0   0   0   0   10
75      0   0   6   0   0   0   0 
76      0   0   5   0   0   0   0
77      2   0   0   0   0   0   2

bundle[{73,74},{75,76}],no bundle 77
expected o/p = w3,w1(UNFULFILLED)
no bundle
expected o/p = w7,w3

===================================
TEST CASE FOR UNFULFILABLE ORDERS
===================================

// case 7
/*
        w1  w2  w3  w4  w5
73      0   0   0   30  0
74      0   0   0   10  0
75      0   0   0   7   0    
76      0   0   5   0   0
77      2   0   2   0   2

bundle[{73,74},{75,76}],no bundle 77
expected o/p = w4,w1
UNFULFILLED
no bundle
expected o/p = w4,W3,w1
FULFILLED

===================================
// case 8
        w1  w2  w3  w4  w5
73      30  0   0   0   0
74      0   0   0   10  0
75      0   0   6   0   0    
76      0   0   5   8   0
77      2   0   0   0   2

bundle[{73,74},{75,76}],no bundle 77
expected o/p = w3,w1
UNFULFILLED
no bundle
expected o/p = w1,w3,w4
FULFILLED
===================================

case 9
        w1  w2  w3  w4  w5
73      0   0   0   30  0
74      0   0   0   10  0
75      0   0   6   0   0    
76      0   0   5   0   0
77      0   0   0   0   0

bundle[{73,74},{75,76}],no bundle 77
expected o/p = w4,w3
UNFULFILLED
no bundle
expected o/p = w4,w3
UNFULFILLED
===================================

case 10

        w1  w2  w3  w4  w5 w6   w7 
73      0   0   0   30  0   0   0
74      0   0   0   0   0   0   10
75      0   0   6   0   0   0   0 
76      0   0   0   5   0   0   0
77      2   0   0   0   2   0   0

bundle[{73,74},{75,76}],no bundle 77
expected o/p = w1
UNFULFILLED
no bundle
expected o/p = w3,w1,w4,w7
FULFILLED
===================================
// TESTING FOR EXACT QUANTITY REQUIRED IS RETURNED
case 11
        w1  w2  w3  w4  w5 w6   w7 
73      0   0   0   35  0   0   30
74      0   0   0   0   13  0   10
75      0   0   10  0   0   0   7 
76      0   0   10  0   0   0   5
77      3   3   0   2   0   0   2

bundle[{73,74},{75,76}],no bundle 77(NOT TESTED)
expected o/p = w7
no bundle
expected o/p = W3{0,0,6,5,0},W4{30,0,0,0,2},W5{0,13,0,0,0}

===================================
// TESTING FOR EXACT QUANTITY REQUIRED IS RETURNED, AND SPLIT

case 12

        w1  w2  w3  w4  w5 w6   w7 
73      0   0   0   30  0   20  20
74      0   0   0   9   0   6   6
75      0   0   6   4   0   3   4 
76      0   0   5   3   0   2   4
77      3   0   0   3   0   2   2

expected o/p = w4,w3
no bundle
expected o/p = w6{20,6,3,2,2}, w7{10,4,3,3,0}

===================================

// TESTING FOR EXACT QUANTITY REQUIRED IS RETURNED
case 13
        w1  w2  w3  w4  w5 w6   w7
73      0   0   5   35  0   0   30
74      0   0   0   0   13  0   10
75      0   0   10  0   0   0   7
76      0   0   10  0   0   0   5
77      3   3   0   2   0   0   2

bundle[{ 73, 74}, { 75, 76}], no bundle 77(NOT TESTED)
expected o / p = w7(getting w3,w4 unfulfillable)
no bundle
expected o / p = W3{ 5, 0, 6, 5, 0 },W4{ 25, 0, 0, 0, 2 },W5{ 0, 13, 0, 0, 0 }

===================================
case 14
        w1  w2  w3  w4  w5
73      0   0   5   35  0
74      0   0   0   10   13
75      0   0   10  0   0
76      0   0   10  0   0
77      3   3   0   0   0

bundle[{ 73, 74}, { 75, 76}], no bundle 77()
expected o / p = w4,w3,w1
no bundle
expected o / p = W3{ 5, 0, 6, 5, 0 },W4{ 25, 0, 0, 0, 2 },W5{ 0, 13, 0, 0, 0 }

===================================
case 15
        w1  w2  w3  w4  w5
73      20  24  30  35  20
74      7   8   7   10  13
75      4   4   10  3   2
76      4   4   10  3   3
77      3   3   1   1   1

bundle[{ 73, 74}, { 75, 76}], no bundle 77()
expected o / p = w4{25,8,0,0,0},w3{0,0,6,5,0},w1{0,0,0,0,2}
no bundle
expected o / p = W3{ 25, 0, 6, 5, 0 },W2{ 0, 8, 0, 0, 2 }

===================================

*/
// case 1
const case1 = [

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
        "quantity": 0,
        "warehouseCode": "WH3",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 30,
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
    },
    {
        "quantity": 6,
        "warehouseCode": "WH3",
        "sku": "1000000033875",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 7,
        "warehouseCode": "WH4",
        "sku": "1000000033875",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 7,
        "warehouseCode": "WH3",
        "sku": "1000000033876",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 8,
        "warehouseCode": "WH4",
        "sku": "1000000033876",
        "warehouseName": "Bengaluru INCREFF",
    },


    {
        "quantity": 2,
        "warehouseCode": "WH1",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 2,
        "warehouseCode": "WH3",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 2,
        "warehouseCode": "WH5",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
];

// case 2
const case2 = [

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
        "quantity": 0,
        "warehouseCode": "WH3",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 30,
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
    },
    {
        "quantity": 6,
        "warehouseCode": "WH3",
        "sku": "1000000033875",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 7,
        "warehouseCode": "WH3",
        "sku": "1000000033876",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 8,
        "warehouseCode": "WH4",
        "sku": "1000000033876",
        "warehouseName": "Bengaluru INCREFF",
    },


    {
        "quantity": 2,
        "warehouseCode": "WH1",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 2,
        "warehouseCode": "WH5",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
];

// case 3
const case3 = [

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
        "quantity": 0,
        "warehouseCode": "WH3",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 30,
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
    },
    {
        "quantity": 6,
        "warehouseCode": "WH3",
        "sku": "1000000033875",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 7,
        "warehouseCode": "WH3",
        "sku": "1000000033876",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 2,
        "warehouseCode": "WH1",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 2,
        "warehouseCode": "WH5",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
];

// case 4
const case4 = [

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
        "quantity": 0,
        "warehouseCode": "WH3",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 30,
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
        "quantity": 0,
        "warehouseCode": "WH6",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 30,
        "warehouseCode": "WH7",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 10,
        "warehouseCode": "WH7",
        "sku": "1000000033874",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 6,
        "warehouseCode": "WH3",
        "sku": "1000000033875",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 7,
        "warehouseCode": "WH3",
        "sku": "1000000033876",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 2,
        "warehouseCode": "WH1",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 2,
        "warehouseCode": "WH5",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
];

// case 5
const case5 = [

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
        "quantity": 0,
        "warehouseCode": "WH3",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 30,
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
        "quantity": 0,
        "warehouseCode": "WH6",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 30,
        "warehouseCode": "WH7",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 10,
        "warehouseCode": "WH7",
        "sku": "1000000033874",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 6,
        "warehouseCode": "WH3",
        "sku": "1000000033875",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 7,
        "warehouseCode": "WH7",
        "sku": "1000000033875",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 7,
        "warehouseCode": "WH3",
        "sku": "1000000033876",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 2,
        "warehouseCode": "WH1",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 2,
        "warehouseCode": "WH2",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 2,
        "warehouseCode": "WH4",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
];

// case 6
const case6 = [

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
        "quantity": 0,
        "warehouseCode": "WH3",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 30,
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
        "quantity": 0,
        "warehouseCode": "WH6",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 30,
        "warehouseCode": "WH7",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 10,
        "warehouseCode": "WH7",
        "sku": "1000000033874",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 6,
        "warehouseCode": "WH3",
        "sku": "1000000033875",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 7,
        "warehouseCode": "WH3",
        "sku": "1000000033876",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 2,
        "warehouseCode": "WH1",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 2,
        "warehouseCode": "WH7",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
];

// case 7
const case7 = [

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
        "quantity": 0,
        "warehouseCode": "WH3",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 30,
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
    },

    {
        "quantity": 7,
        "warehouseCode": "WH4",
        "sku": "1000000033875",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 7,
        "warehouseCode": "WH3",
        "sku": "1000000033876",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 2,
        "warehouseCode": "WH1",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 2,
        "warehouseCode": "WH3",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 2,
        "warehouseCode": "WH5",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
];

// case 8
const case8 = [

    {
        "quantity": 30,
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
        "quantity": 0,
        "warehouseCode": "WH3",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 0,
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
    },
    {
        "quantity": 6,
        "warehouseCode": "WH3",
        "sku": "1000000033875",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 7,
        "warehouseCode": "WH3",
        "sku": "1000000033876",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 8,
        "warehouseCode": "WH4",
        "sku": "1000000033876",
        "warehouseName": "Bengaluru INCREFF",
    },


    {
        "quantity": 2,
        "warehouseCode": "WH1",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 2,
        "warehouseCode": "WH5",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
];

// case 9
const case9 = [

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
        "quantity": 0,
        "warehouseCode": "WH3",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 30,
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
    },
    {
        "quantity": 6,
        "warehouseCode": "WH3",
        "sku": "1000000033875",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 7,
        "warehouseCode": "WH3",
        "sku": "1000000033876",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 0,
        "warehouseCode": "WH1",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 0,
        "warehouseCode": "WH5",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
];

// case 10
const case10 = [

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
        "quantity": 0,
        "warehouseCode": "WH3",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 30,
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
        "quantity": 0,
        "warehouseCode": "WH6",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 0,
        "warehouseCode": "WH7",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 10,
        "warehouseCode": "WH7",
        "sku": "1000000033874",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 6,
        "warehouseCode": "WH3",
        "sku": "1000000033875",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 7,
        "warehouseCode": "WH4",
        "sku": "1000000033876",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 2,
        "warehouseCode": "WH1",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 2,
        "warehouseCode": "WH5",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
];

// case 11
const case11 = [

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
        "quantity": 0,
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
        "quantity": 0,
        "warehouseCode": "WH6",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 30,
        "warehouseCode": "WH7",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 13,
        "warehouseCode": "WH5",
        "sku": "1000000033874",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 10,
        "warehouseCode": "WH7",
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
        "quantity": 7,
        "warehouseCode": "WH7",
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
        "quantity": 6,
        "warehouseCode": "WH7",
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
    },
    {
        "quantity": 2,
        "warehouseCode": "WH4",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 2,
        "warehouseCode": "WH7",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
];

// case 12
const case12 = [

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
        "quantity": 0,
        "warehouseCode": "WH3",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 30,
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
        "quantity": 20,
        "warehouseCode": "WH6",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 20,
        "warehouseCode": "WH7",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 9,
        "warehouseCode": "WH4",
        "sku": "1000000033874",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 6,
        "warehouseCode": "WH6",
        "sku": "1000000033874",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 6,
        "warehouseCode": "WH7",
        "sku": "1000000033874",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 6,
        "warehouseCode": "WH3",
        "sku": "1000000033875",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 4,
        "warehouseCode": "WH4",
        "sku": "1000000033875",
        "warehouseName": "Bengaluru INCREFF",
    }, {
        "quantity": 3,
        "warehouseCode": "WH6",
        "sku": "1000000033875",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 4,
        "warehouseCode": "WH7",
        "sku": "1000000033875",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 5,
        "warehouseCode": "WH3",
        "sku": "1000000033876",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 3,
        "warehouseCode": "WH4",
        "sku": "1000000033876",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 2,
        "warehouseCode": "WH6",
        "sku": "1000000033876",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 4,
        "warehouseCode": "WH7",
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
        "warehouseCode": "WH4",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 2,
        "warehouseCode": "WH6",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 2,
        "warehouseCode": "WH7",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
];

// case 13
const case13 = [

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
        "quantity": 0,
        "warehouseCode": "WH6",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 30,
        "warehouseCode": "WH7",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 13,
        "warehouseCode": "WH5",
        "sku": "1000000033874",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 10,
        "warehouseCode": "WH7",
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
        "quantity": 7,
        "warehouseCode": "WH7",
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
        "quantity": 6,
        "warehouseCode": "WH7",
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
    },
    {
        "quantity": 2,
        "warehouseCode": "WH4",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 2,
        "warehouseCode": "WH7",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
];
// case 14
const case14 = [

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
// case 15
const case15 = [

    {
        "quantity": 20,
        "warehouseCode": "WH1",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 24,
        "warehouseCode": "WH2",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 30,
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
        "quantity": 20,
        "warehouseCode": "WH5",
        "sku": "1000000033873",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 7,
        "warehouseCode": "WH1",
        "sku": "1000000033874",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 8,
        "warehouseCode": "WH2",
        "sku": "1000000033874",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 7,
        "warehouseCode": "WH3",
        "sku": "1000000033874",
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
        "quantity": 4,
        "warehouseCode": "WH1",
        "sku": "1000000033875",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 4,
        "warehouseCode": "WH2",
        "sku": "1000000033875",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 10,
        "warehouseCode": "WH3",
        "sku": "1000000033875",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 3,
        "warehouseCode": "WH4",
        "sku": "1000000033875",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 2,
        "warehouseCode": "WH5",
        "sku": "1000000033875",
        "warehouseName": "Bengaluru INCREFF",
    },

    {
        "quantity": 4,
        "warehouseCode": "WH1",
        "sku": "1000000033876",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 4,
        "warehouseCode": "WH2",
        "sku": "1000000033876",
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
        "warehouseCode": "WH4",
        "sku": "1000000033876",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 3,
        "warehouseCode": "WH5",
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
    },
    {
        "quantity": 1,
        "warehouseCode": "WH3",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 1,
        "warehouseCode": "WH4",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    },
    {
        "quantity": 1,
        "warehouseCode": "WH5",
        "sku": "1000000033877",
        "warehouseName": "Bengaluru INCREFF",
    }
];
const getTestData = async () => {

    return [case1, case2, case3, case4, case5, case6, case7, case8, case9, case10, case11, case12, case13, case14, case15];
}
module.exports = { getTestData }