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
        transactions.push(JSON.stringify(transaction));
        document.getElementById("output1").innerHTML = "Transaction Added!";
    }
}

function spendPoints() {
    let userText = document.getElementById("userInput2").value;

    if (userText == "") {
        document.getElementById("output2").innerHTML = "Invalid Input";
    } else {
        document.getElementById("output2").innerHTML = "Points Spent!";
    }
}

function returnBalances() {
    let userText = document.getElementById("userInput3").value;

    if (userText == "") {
        document.getElementById("output3").innerHTML = "Invalid Transaction";
    } else {
        document.getElementById("output3").innerHTML = "Transaction Added!";
    }
}