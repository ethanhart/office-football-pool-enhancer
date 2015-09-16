// ==UserScript==
// @name Office Football Pool Enhanced Standings
// @version 0.1
// @namespace http://github.com/ethanhart
// @description Add some additional features to the Office Football Pool standings page
// @author Ethan Hart (ethan.john.hart@gmail.com)
// ==/UserScript==

/*
Version History

0.1 2015-09-15
    - Initial Version
    - Add Average shares
    - Highlight users shares to indicate +/- relative to mean

*/

var table = document.getElementById("bstandings");
var tablelen = table.rows.length;

function getIntValue(value) {
    console.log("init val: ")
    console.log(value)
    str_value = value.replace('&nbsp;', '').replace(',', '');
    int_value = parseInt(str_value, 10);
    console.log("new val: ")
    console.log(int_value)
    return int_value;
}

function addAverageRow(mean) {
    for (var i = 0, row; row = table.rows[i]; i++) {
        var cell = row.cells[2]
        var value = getIntValue(cell.innerHTML);
        if (value < mean) {
            cell.style.backgroundColor = "red";
        } else {
            cell.style.backgroundColor = "green";
        }
    }

    var row = table.insertRow();
    var cell_no = row.insertCell(0);
    var cell_username = row.insertCell(1);
    var cell_shares = row.insertCell(2);
    var cell_picks = row.insertCell(3);
    cell_shares.innerHTML = mean;
    cell_shares.style.backgroundColor = "yellow";
    cell_username.innerHTML = "Average";
    cell_picks.innerHTML = "This is the average number of shares";
}

function getAverageShares() {
    var total = [];
    for (var i = 0, row; row = table.rows[i]; i++) {
        var cell = row.cells[2]
        var value = getIntValue(cell.innerHTML);
        if (!(isNaN(value))) {
            total.push(value);
        }
    }
    var sum = total.reduce(function(a, b) { return a + b; });
    var mean = Number((sum/tablelen).toFixed(0));
    console.log(total)
    console.log(sum)
    console.log(mean)
    return mean;
}

meanShares = getAverageShares()
addAverageRow(meanShares)
