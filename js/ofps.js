// ==UserScript==
// @name Office Football Pool Enhanced Standings
// @version 2.0
// @namespace http://github.com/ethanhart
// @description Add some additional features to the Office Football Pool standings page
// @author Ethan Hart (ethan.john.hart@gmail.com)
// ==/UserScript==

var table = document.getElementById("bstandings");
var tablelen = table.rows.length;

function getIntValue(value) {
    //console.log("init val: ")
    //console.log(value)
    str_value = value.replace('&nbsp;', '').replace(',', '');
    int_value = parseInt(str_value, 10);
    //console.log("new val: ")
    //console.log(int_value)
    return int_value;
}

function addAverageRow(mean, meanRisked) {
    var tr = document.getElementsByTagName('thead')[0].children[0]; //Get the table header (only works if it's the first header in the page)

    // Create the Delta header element and add some functionality/formatting
    var th = document.createElement('th');  //Create the element for the new header entry
    th.style.textAlign = "Right";
    var delta_a = document.createElement('a') //Create attribute sub-element
    delta_a.innerHTML = "Delta";
    delta_a.href = "javascript:void(4);";

    th.appendChild(delta_a)  // Add the a element
    //tr.insertBefore(th, tr.children[3]);  // Insert the new header element into the header
    //tr.append(th, tr.children[4]);  // Insert the new header element into the header
    tr.append(th);  // Insert the new header element into the header

    for (var i = 0, row; row = table.rows[i]; i++) {
        if (row.cells[2].innerHTML.includes('Not active')){table.deleteRow(i);}
        //if (row.cells[2].textContent.includes('Not active')){table.deleteRow(i);}
        //if (row.cells[0].innerHTML == '0'){table.deleteRow(i);}
        //if (row.cells.length == 3){table.deleteRow(i)}
    }
    for (var i = 0, row; row = table.rows[i]; i++) {
        if (row.cells[2].innerHTML.includes('Not active')){table.deleteRow(i);}
    }


    // Modify the onclick events to properly reflect new header sequence
    // NOTE: Sorting seems to work ok for most fields except for 4 ("Risked"). Cannot reverse sorting.
    //tr.children[3].children[0].setAttribute('onclick', "sortTable('bstandings', 3, true, true, false, false, 'numeric')");
    //tr.children[3].href = "javascript:void(3);";
    tr.children[4].children[0].setAttribute('onclick', "sortTable('bstandings', 4, true, true, false, false, 'numeric')");
    //tr.children[4].href = "javascript:void(4);";
    //tr.children[4].setAttribute('onclick', "sortTable('bstandings', 4, true, true, true, false, 'numeric')");
    //tr.children[4].children[0].setAttribute('onclick', "sortTable('bstandings', 4, true, true, true, false, 'numeric')");

    // UNSED SECTION SAVED FOR POSTERITY
    //delta_a.setAttribute("href": "javascript:void(3);");
    //delta_a.onclick = "sortTable('bstandings',3, true, true);";
    //delta_a.onclick = "sortTable('bstandings',3, true, true)";
    //th.onclick = "sortTable('bstandings',3, true, true, false, false, 'numeric',);";
    //delta_a.addEvent("onclick": "sortTable('bstandings',3, true, true, false, false, 'numeric')");
    //th.onclick="sortTable('bstandings',3, true, true, false, false, 'numeric',);";
    //th.children[0].setAttribute('onclick', "sortTable('bstandings', 3, true, true)");
    //th.children[0].setAttribute('onclick', "sortTable('bstandings', 3, true, false, false, false, 'numeric')");
    //tr.children[4].children[0].setAttribute('onclick', "sortTable('bstandings', 4)");

    for (var i = 0, row; row = table.rows[i]; i++) {
        //console.log(row.cells)
        if (row.cells[2].innerHTML.includes('Not active')){continue;}
        if (row.cells[2].textContent.includes('Not active')){continue;}
        if (row.cells.length == 3){
        table.deleteRow()
        //row.insertCell(3);
        //row.insertCell(4);
        }
        row.insertCell(4);
        //if (row.cells[0].innerHTML == '0'){continue;}
        //if (row.cells[2].innerHTML.includes('Not')){table.deleteRow(i);}
        //if (row.cells.length == 3){table.deleteRow(i);}
        //var new_picks_cell = row.insertCell(4);
        //var orig_picks = row.cells[3].innerHTML;
        //new_picks_cell.innerHTML = orig_picks;
        var cell_user_delta = row.cells[4]
        var cell_user_shares = row.cells[2]
        //var cell_user_risked = row.cells[4]
        var value = getIntValue(cell_user_shares.innerHTML);
        cell_user_delta.innerHTML = value - mean;
        //cell_user_risked.style.textAlign ="Right";
        if (value < mean) {
            cell_user_shares.style.backgroundColor = "crimson";
            cell_user_delta.style.backgroundColor = "indianred";
        } else {
            cell_user_shares.style.backgroundColor = "forestgreen";
            cell_user_delta.style.backgroundColor = "mediumseagreen";
        }

        //var risked_value = getIntValue(cell_user_risked.innerHTML);
        //if (risked_value < meanRisked) {
            //cell_user_risked.style.backgroundColor = "lightcoral";
        //} else {
            //cell_user_risked.style.backgroundColor = "lightgreen";
        //}
    }

    for (var i = 0, row; row = table.rows[i]; i++) {
        if (row.cells[2].innerHTML.includes('Not active')){table.deleteRow(i);}
    }
    // create "Average" row
    var row = table.insertRow();
    var cell_no = row.insertCell(0);
    var cell_username = row.insertCell(1);
    var cell_shares = row.insertCell(2);
    var cell_picks = row.insertCell(3);
    var cell_delta = row.insertCell(4);
    cell_shares.innerHTML = numberWithCommas(mean);
    cell_shares.style.backgroundColor = "yellow";
    cell_no.style.backgroundColor = "yellow";
    cell_username.style.backgroundColor = "yellow";
    cell_username.innerHTML = "Average";
    cell_picks.innerHTML = "Avg. Shares";
    cell_picks.innerHTML = numberWithCommas(meanRisked);
    //cell_picks.innerHTML = 0.0;
    cell_delta.innerHTML = 0.0;
    cell_delta.style.backgroundColor = "yellow";
    cell_picks.style.backgroundColor = "yellow";
    cell_delta.style.textAlign = "Right";
    cell_picks.style.textAlign = "Right";
    cell_shares.style.textAlign = "Right";
}

function numberWithCommas(x) {
    // Reformat number with commas
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

function getAverageShares(field) {
    //Given a field number, get the average for that column
    var total = [];
    var to_remove = 0;
    for (var i = 0, row; row = table.rows[i]; i++) {
        //console.log(row.cells[0])
        if (row.cells[0].innerHTML == '0'){to_remove++; continue;}
        var cell = row.cells[field]  // Specify field by var instead of hardcoded field
        var value = getIntValue(cell.innerHTML);
        if (!(isNaN(value))) {
            total.push(value);
        }
    }

    var sum = total.reduce(function(a, b) { return a + b; });
    var mean = Number((sum/(tablelen-to_remove)).toFixed(0));
    return mean;
}

meanShares = getAverageShares(2)  // Average shares total

//Only get "Risked" shares if the field exists (i.e. previous years)
var header_val = document.getElementsByTagName('thead')[0].children[0].children[3].textContent; //Get the table header (only works if it's the first header in the page)
if (header_val.includes('Risked')){
  meanRisked = getAverageShares(3); // Average shares risked
} else {var meanRisked = '';}

addAverageRow(meanShares, meanRisked)

// Re-sort the table with Average included
var script = document.createElement('script');
script.innerHTML = "sortTable('bstandings', 2, true, true)";
document.body.appendChild(script);
