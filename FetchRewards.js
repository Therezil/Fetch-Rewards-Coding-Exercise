const transactions = [];

function addTransaction() {
    let userText = document.getElementById("userInput1").value;
    transactions.push(userText)

    if (userText == "") {
        document.getElementById("output1").innerHTML = "Invalid Transaction"
    } else {
        document.getElementById("output1").innerHTML = "Transaction Added!"
    }
}

function spendPoints() {
    let userText = document.getElementById("userInput2").value;

    if (userText == "") {
        document.getElementById("output2").innerHTML = "Invalid Input"
    } else {
        document.getElementById("output2").innerHTML = "Points Spent!"
    }
}

function returnBalances() {
    let userText = document.getElementById("userInput3").value;

    if (userText == "") {
        document.getElementById("output3").innerHTML = "Invalid Transaction"
    } else {
        document.getElementById("output3").innerHTML = "Transaction Added!"
    }
}