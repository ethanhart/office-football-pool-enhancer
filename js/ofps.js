// ==UserScript==
// @name Office Football Pool Enhanced Standings
// @version 0.1
// @namespace http://github.com/ethanhart
// @description Add some additional features to the Office Football Pool standings page
// @author Ethan Hart (ethan.john.hart@gmail.com)
// ==/UserScript==

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
    var tr = document.getElementById('standingsTable').tHead.children[0], th = document.createElement('th');
    th.innerHTML = "Delta";
    tr.insertBefore(th, tr.children[3]);
    
    for (var i = 0, row; row = table.rows[i]; i++) {
        var new_picks_cell = row.insertCell(4);
        var orig_picks = row.cells[3].innerHTML;
        new_picks_cell.innerHTML = orig_picks;
        var cell_user_delta = row.cells[3]
        var cell_user_shares = row.cells[2]
        var value = getIntValue(cell_user_shares.innerHTML);
        cell_user_delta.innerHTML = value - mean;
        cell_user_delta.innerHTML = value - mean;
        if (value < mean) {
            cell_user_shares.style.backgroundColor = "red";
            cell_user_delta.style.backgroundColor = "red";
        } else {
            cell_user_shares.style.backgroundColor = "green";
            cell_user_delta.style.backgroundColor = "green";
        }
    }

    // create "Average" row
    var row = table.insertRow();
    var cell_no = row.insertCell(0);
    var cell_username = row.insertCell(1);
    var cell_shares = row.insertCell(2);
    var cell_delta = row.insertCell(3);
    var cell_picks = row.insertCell(4);
    cell_shares.innerHTML = mean;
    cell_shares.style.backgroundColor = "yellow";
    cell_username.innerHTML = "Average";
    cell_picks.innerHTML = "This is the average number of shares";
    cell_delta.innerHTML = 0;
    cell_delta.style.backgroundColor = "yellow";
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
// Re-sort the table with Average included
var script = document.createElement('script');
script.innerHTML = "sortTable('bstandings', 2, true, true)";
document.body.appendChild(script);
