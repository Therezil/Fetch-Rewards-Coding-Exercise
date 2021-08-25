/** 
 *  JavaScript file for Fetch Rewards programming challenge 
 *  Author: Jakob Paquette
 */
const transactions = []; // Array used to store the transactions

/**
 *  Adds a transaction to the transactions array
 */
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

/**
 *  Spends points redeemed and adds points spent to transaction array
 */
function spendPoints() {
    let userText = document.getElementById("userInput2").value;
    let pointDeductions = [];
    let date = new Date();

    // Check to make sure user input is not empty
    if (userText == "") {
        document.getElementById("output2").innerHTML = "Invalid Input";
    } 
    
    // Redeems points that want to be spent
    else {
        // Gets amount of points to be spent
        let colIdx = userText.indexOf(":");
        let pointsSpent = parseInt(userText.slice(colIdx + 1, -1));

        // Gets array of transactions sorted by timestamp. Oldest first
        let sortedTransactions = sortTransactions(JSON.parse(JSON.stringify(transactions)));
        let negativeTransactions = [];
        
        // Gets negative transactions from sorted array to adjust current balance amounts
        for (let i = 0; i < sortedTransactions.length; i++) {
            if (sortedTransactions[i]["points"] < 0) {
                negativeTransactions.push(JSON.parse(JSON.stringify(sortedTransactions[i])));
                sortedTransactions[i]["points"] = 0;
            }
        }

        // Updates current points amount in sorted array
        for (let i = 0; i < negativeTransactions.length; i++) {
            for (let j = 0; j < sortedTransactions.length; j++) {
                // Checks to make sure that current points to be adjusted is not the same transaction in the sorted list as the negative list.
                // Also checks to see if points to be updated is greater than points in current transaction and removes the points from
                // the current transaction if it is.
                if (negativeTransactions[i]["payer"] == sortedTransactions[j]["payer"] && negativeTransactions[i]["timestamp"] != sortedTransactions[j]["timestamp"] 
                    && (negativeTransactions[i]["points"] * -1) > sortedTransactions[j]["points"] && sortedTransactions[j]["points"] != 0) {
                    sortedTransactions[j]["points"] = 0;
                    negativeTransactions[i]["points"] += sortedTransactions[j]["points"];
                } 
                // If the amount of points to be removed from current points is less than current points than it updates current points with correct value.
                // Also checks that they are not the same transaction.
                else if (negativeTransactions[i]["payer"] == sortedTransactions[j]["payer"] && negativeTransactions[i]["timestamp"] != sortedTransactions[j]["timestamp"]
                    && sortedTransactions[j]["points"] != 0) {
                    sortedTransactions[j]["points"] += negativeTransactions[i]["points"];
                    negativeTransactions[i]["points"] = 0;
                }
            }
        }

        // Removes points from current transactions based on amount to be redeemed and adds transactions to transaction list
        for (let i = 0; i < sortedTransactions.length; i++) {
            // If points to be redeemed is greater than amount of points in current transaction than sets points in transaction to 0
            // and continues to remove points from later transactions.
            if (pointsSpent > sortedTransactions[i]["points"] && sortedTransactions[i]["points"] > 0) {
                pointsSpent -= sortedTransactions[i]["points"];
                let temp = {"payer" : sortedTransactions[i]["payer"], "points" : (sortedTransactions[i]["points"] * -1)};
                pointDeductions.push(temp);
                // Adds negative transaction of redeemed points to overall transaction list
                temp["timestamp"] = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "T" 
                    + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "Z";
                transactions.push(temp);
                sortedTransactions[i]["points"] = 0;
            } 
            // If points to be redeemed is less than or equal to amount of points in current transaction then sets points to be redeemed to 0
            // and updates current points to correct value.
            else if (pointsSpent != 0 && sortedTransactions[i]["points"] > 0) {
                let temp = {"payer" : sortedTransactions[i]["payer"], "points" : (pointsSpent * -1)};
                sortedTransactions[i]["points"] -= pointsSpent;
                pointsSpent = 0;
                pointDeductions.push(temp);
                // Adds negative transaction of redeemed points to overall transaction list
                temp["timestamp"] = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "T" 
                    + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "Z";
                transactions.push(temp);
            }

            // If all points have been redeemed then exit the loop
            if (pointsSpent == 0) {
                break;
            }
        }

        document.getElementById("output2").innerHTML = JSON.stringify(pointDeductions);
    }
}

/**
 *  Returns current balances for all payers in transaction array
 */
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