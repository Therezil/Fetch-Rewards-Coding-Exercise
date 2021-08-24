window.onload = function() {
    document.getElementById("button1").addEventListener("click", addTransaction)
        
    function addTransaction() {
        document.getElementById("test").innerHTML = 11;
    }
}