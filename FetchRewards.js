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
    document.getElementById("output2").innerHTML = "11";
}

function returnBalances() {
    document.getElementById("output3").innerHTML = "11";
}