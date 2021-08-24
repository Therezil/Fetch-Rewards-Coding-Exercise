/** 
 *  JavaScript file for Fetch Rewards programming challenge 
 *  Author: Jakob Paquette
 */
const transactions = []; // Array used to store the transactions

function addTransaction() {
    let userText = document.getElementById("userInput1").value;  // Get the transaction to be added

    // Check to make sure string isn't empty. Could do more checking to make sure string is in proper format with correct data
    if (userText == "") {
        document.getElementById("output1").innerHTML = "Invalid Transaction";
    } else {
        // Parsing the input string into and object to be pushed into the transactions array
        let j = 0;
        let transaction = {};
        for (let i = 0; i < userText.length; i++) {
            if (userText[i] == ',') {
                let temp = userText.slice(j, i);
                j = i + 1;

                // Adding the payer section
                if (temp.includes("payer")) {
                    let colIdx = temp.indexOf(":");
                    let name = temp.slice(colIdx + 3, -1);
                    transaction["payer"] = name;
                }  

                // Adding the points section
                else {
                    let colIdx = temp.indexOf(":");
                    let pointsValue = parseInt(temp.slice(colIdx + 1));
                    transaction["points"] = pointsValue;
                }
            } 

            // Adding the timestamp section
            else if (i == userText.length - 1) {
                let temp = userText.slice(j, i);

                let colIdx = temp.indexOf(":");
                let time = temp.slice(colIdx + 3, -2);
                transaction["timestamp"] = time;
            }
        }

        // Push the transaction into the array and let the user know the transaction has been added
        transactions.push(transaction);
        document.getElementById("output1").innerHTML = "Transaction Added!";
    }
}

function spendPoints() {
    let userText = document.getElementById("userInput2").value;
    let pointDeductions = [];
    let date = new Date();

    if (userText == "") {
        document.getElementById("output2").innerHTML = "Invalid Input";
    } else {
        let colIdx = userText.indexOf(":");
        let pointsSpent = parseInt(userText.slice(colIdx + 1, -1));

        let sortedTransactions = sortTransactions(JSON.parse(JSON.stringify(transactions)));
        let negativeTransactions = [];
        
        for (let i = 0; i < sortedTransactions.length; i++) {
            if (sortedTransactions[i]["points"] < 0) {
                negativeTransactions.push(JSON.parse(JSON.stringify(sortedTransactions[i])));
                sortedTransactions[i]["points"] = 0;
            }
        }

        for (let i = 0; i < negativeTransactions.length; i++) {
            for (let j = 0; j < sortedTransactions.length; j++) {
                if (negativeTransactions[i]["payer"] == sortedTransactions[j]["payer"] && negativeTransactions[i]["timestamp"] != sortedTransactions[j]["timestamp"] 
                    && (negativeTransactions[i]["points"] * -1) > sortedTransactions[j]["points"] && sortedTransactions[j]["points"] != 0) {
                    sortedTransactions[j]["points"] = 0;
                    negativeTransactions[i]["points"] += sortedTransactions[j]["points"];
                } else if (negativeTransactions[i]["payer"] == sortedTransactions[j]["payer"] && negativeTransactions[i]["timestamp"] != sortedTransactions[j]["timestamp"]
                    && sortedTransactions[j]["points"] != 0) {
                    sortedTransactions[j]["points"] += negativeTransactions[i]["points"];
                    negativeTransactions[i]["points"] = 0;
                }
            }
        }

        for (let i = 0; i < sortedTransactions.length; i++) {
            if (pointsSpent > sortedTransactions[i]["points"] && sortedTransactions[i]["points"] > 0) {
                pointsSpent -= sortedTransactions[i]["points"];
                let temp = {"payer" : sortedTransactions[i]["payer"], "points" : (sortedTransactions[i]["points"] * -1)};
                pointDeductions.push(temp);
                temp["timestamp"] = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "T" 
                    + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "Z";
                transactions.push(temp);
                sortedTransactions[i]["points"] = 0;
            } else if (pointsSpent != 0 && sortedTransactions[i]["points"] > 0) {
                let temp = {"payer" : sortedTransactions[i]["payer"], "points" : (pointsSpent * -1)};
                sortedTransactions[i]["points"] -= pointsSpent;
                pointsSpent = 0;
                pointDeductions.push(temp);
                temp["timestamp"] = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "T" 
                    + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "Z";
                transactions.push(temp);
            }
        }

        document.getElementById("output2").innerHTML = JSON.stringify(pointDeductions);
    }
}

function returnBalances() {
    let pointBalances = {};

    // Loop through transactions and add up points
    for (let i = 0; i < transactions.length; i++) {
        // If the name is already in pointBalances just add it
        if (transactions[i]["payer"] in pointBalances) {
            pointBalances[transactions[i]["payer"]] += transactions[i]["points"];
        } 
        
        // Else add the name to pointBalances
        else {
            pointBalances[transactions[i]["payer"]] = transactions[i]["points"];
        }
    }

    // Display final balances
    document.getElementById("output3").innerHTML = JSON.stringify(pointBalances);
}

/**
 * Quick sort method used from https://gist.github.com/Rajatm544/52ae92ae7fb6d91fd0bb6aece31fef27#file-quicksort-js
 * Adapted to sort based on timestamp
 * 
 * @param {array of transactions to be sorted} sortedTransactions 
 * @param {left partition} left 
 * @param {right partition} right 
 * @returns 
 */
function sortTransactions(sortedTransactions, left = 0, right = sortedTransactions.length - 1) {
    if (left < right) {
        let pivotIdx = quickSort(sortedTransactions, left, right);

        sortTransactions(sortedTransactions, left, pivotIdx - 1);

        sortTransactions(sortedTransactions, pivotIdx + 1, right);
    }

    return sortedTransactions;
}

/**
 * Quick Sort method used from https://gist.github.com/Rajatm544/52ae92ae7fb6d91fd0bb6aece31fef27#file-quicksort-js 
 * Adapted to sort based on timestamp
 * 
 * @param {array to be sorted} array 
 * @param {start index} start 
 * @param {end index} end 
 */
function quickSort(array, start = 0, end = array.length - 1) {
    let pivot = array[start]["timestamp"];
    let swapIdx = start;

    for (let i = start + 1; i <= end; i++) {
        if (array[i]["timestamp"] < pivot) {
            swapIdx++;
            [array[i], array[swapIdx]] = [array[swapIdx], array[i]];
        }
    }

    [array[swapIdx], array[start]] = [array[start], array[swapIdx]];

    return swapIdx;
}