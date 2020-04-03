// localStorage.clear();
localStorage.removeItem('clickedRowData');
//begin table highlighter////////////////////////////////////////////////////////////////////
const ResTblBdy = document.getElementById("resTblBdy");
let currentDate = new Date();
console.log('currentDate==>', currentDate)

function highlight_row() {
    let cells = ResTblBdy.getElementsByTagName('td'); //targets all cells in table
    let rows = ResTblBdy.getElementsByTagName('tr'); //targets all rows in table
    console.log('cells.length==>', cells.length)
    console.log('rows.length==>', rows.length)

    for (let i = 0; i < cells.length; i++) { //loop through all table cells
        // Take each cells
        console.log('cells[' + i + ']', cells[i])
        //let cells = cells[i];
        console.log('cells[' + i + '][' + i + ']', cells[i][i])
        //console.log('cells[' + i + '].innerHTML', cells[i].innerHTML)
        console.log('cells[i].parentNode==>', cells[i].parentNode)
        console.log('cells[i].parentNode.childNodes==>', cells[i].parentNode.childNodes)
        console.log('cells[i].parentNode.childNodes[0].innerHTML==>', cells[i].parentNode.childNodes[0].innerHTML)
        // let ediname = cells[i].parentNode.childNodes[2];
        // let issdate = cells[i].parentNode.childNodes[3];
        // let need = cells[i].parentNode.childNodes[4];
        // let updated = cells[i].parentNode.childNodes[5];
        // let reporter = cells[i].parentNode.childNodes[6];
        // let cmnts = cells[i].parentNode.childNodes[7];
        // let userCmnts = cells[i].parentNode.childNodes[8];
        // console.log('issdate.innerHTML==>', issdate.innerHTML)
        // let cellDate = new Date(issdate.innerHTML);

        let ediname = cells[i].parentNode.childNodes[3];
        let issdate = cells[i].parentNode.childNodes[4];
        let need = cells[i].parentNode.childNodes[5];
        let updated = cells[i].parentNode.childNodes[6];
        let comments1 = cells[i].parentNode.childNodes[7];
        let comments2 = cells[i].parentNode.childNodes[8];
        let comments3 = cells[i].parentNode.childNodes[9];
        // let cmnts = cells[i].parentNode.childNodes[7];
        let andcmnts = cells[i].parentNode.childNodes[10]; //placeholder for andrea comment highlights
        let nathancmnts = cells[i].parentNode.childNodes[11]; //placeholder for andrea comment highlights
        let vndeml = cells[i].parentNode.childNodes[12]; //vendor email column cells
        // console.log('issdate.innerHTML==>', issdate.innerHTML)
        let cellDate = new Date(issdate.innerHTML);

        console.log(`ediname|cellDate|dateDiff==> ${ediname.innerHTML}|${cellDate}|${Date.dateDiff('w', cellDate, currentDate)}`)


        if (ediname.innerHTML.toLowerCase().includes('no edi id')) {
            ediname.style.backgroundColor = "yellow";
        }
        if (Date.dateDiff('w', cellDate, currentDate) > 24) { //if issue date of cat is more than 6 months old
            issdate.style.backgroundColor = "orange"
        }
        if (issdate.innerHTML.toLowerCase().includes('not in titus')) {
            issdate.style.backgroundColor = "yellow";
        }
        if (need.innerHTML.toLowerCase() == 'yes' || need.innerHTML == '?') {
            need.style.backgroundColor = "yellow";
        }
        if (need.innerHTML.toLowerCase() == 'no') {
            need.style.backgroundColor = "#ccffcc";
        }
        if (need.innerHTML.toLowerCase().includes('periodicity')) {
            need.style.backgroundColor = "#c296c7";
        }
        if (updated.innerHTML.toLowerCase() == 'no' || updated.innerHTML == '?') {
            updated.style.backgroundColor = "yellow";
        }
        if (updated.innerHTML.toLowerCase() == 'yes') {
            updated.style.backgroundColor = "#ccffcc";
        }
        if (comments1.innerHTML.toLowerCase().includes('wholesale updated')) {
            comments1.style.backgroundColor = "#00aaaa";
        }
        if (comments1.innerHTML.toLowerCase().includes('retail updated')) {
            comments1.style.backgroundColor = "#00ffcc";
        }
        if (comments1.innerHTML.toLowerCase() == 'need wholesale imw') {
            comments1.style.backgroundColor = "#ffeecc";
        }
        if (comments2.innerHTML.toLowerCase().includes('not in edi') || comments2.innerHTML.toLowerCase().includes('not in titus') || comments2.innerHTML.toLowerCase().includes('problem:')) {
            comments2.style.backgroundColor = "#ffb3ca";
        }
        if (comments2.innerHTML.toLowerCase().includes('solved:')) {
            comments2.style.backgroundColor = "#ccffcc";
        }
        if (comments2.innerHTML.toLowerCase().includes('requested cat')) {
            cells[i].parentNode.style.backgroundColor = "#ccd9ff";
        }
        if (comments2.innerHTML.toLowerCase().includes('discont')) {
            cells[i].parentNode.style.backgroundColor = "#999966";
        }
        if (comments2.innerHTML.toLowerCase().includes('question:')) {
            cells[i].parentNode.style.backgroundColor = "#ffdb4b";
        }
        if (comments2.innerHTML.toLowerCase().includes('todo')) {
            cells[i].parentNode.style.backgroundColor = "#ff0000";
        }
        if (comments2.innerHTML.toLowerCase().includes('ignore auto-email')) {
            cells[i].parentNode.style.backgroundColor = "#ffcc99";
        }
        if (comments3.innerHTML.toLowerCase().includes('sent retail review')) {
            comments3.style.backgroundColor = "#ffab00";
        }
        if (comments3.innerHTML.toLowerCase().includes('need retail imw')) {
            comments3.style.backgroundColor = "#ff8533";
        }
        if (comments3.innerHTML.toLowerCase().includes('retail updated')) {
            comments3.style.backgroundColor = "#00ffcc";
        }
        //00ffcc


        let clickCounter = 0; //set click counter for how many times a row has been clicked on to 0

        // do something on onclick event for cells
        cells[i].onclick = function (event) {
            // localStorage.clear(); //remove any previous cells data
            localStorage.removeItem('clickedRowData'); //remove any previous cells data

            let cellStorage = [];

            // Get the row id where the cells exists
            console.log('cells[i].parentNode==>', cells[i].parentNode)
            // let rowId = cells[i].parentNode.rowIndex - 1;
            let rowId = cells[i].parentNode.rowIndex - 1;
            console.log('rowId==>', rowId)

            let rowsNotSelected = ResTblBdy.getElementsByTagName('tr');
            for (let row = 0; row < rowsNotSelected.length; row++) {
                rowsNotSelected[row].classList.value = ""
            }

            console.log('0%2==>', 0 % 2)
            console.log('1%2==>', 1 % 2)
            console.log('2%2==>', 2 % 2)
            console.log('3%2==>', 3 % 2)
            console.log('4%2==>', 4 % 2)
            console.log('5%2==>', 5 % 2)
            console.log('6%2==>', 6 % 2)


            let rowSelected = ResTblBdy.getElementsByTagName('tr')[rowId];
            console.log('rowSelected==>', rowSelected)
            console.log('rowSelected.classList.value==>', rowSelected.classList.value)

            rowSelected.onclick = function () {

                console.log('rowSelected==>', rowSelected)
                console.log('rowSelected was clicked ' + (clickCounter++) + ' times')
                console.log('clickCounter==>', clickCounter)
                if (clickCounter % 2 == 0) { //if row is clicked an even number of times
                    rowSelected.classList.value = ""; //unhighlight it
                } else {
                    rowSelected.classList.value = "row-hilite-toggle"; //otherwise, highlight it
                }
            }

            //rowSelected.classList.toggle("row-hilite-toggle")


            for (j = 0; j < rowSelected.childNodes.length; j++) {
                console.log('rowSelected.childNodes[' + j + '].innerHTML==>', rowSelected.childNodes[j].innerHTML);
                cellStorage.push(rowSelected.childNodes[j].innerHTML);
                console.log('cellStorage', cellStorage);
            }

            localStorage.setItem("clickedRowData", JSON.stringify(cellStorage))
            console.log('localStorage==>', localStorage)
            console.log('cells[i].innerHTML==>', cells[i].innerHTML);

        }
    }

} //end of function
window.onload = highlight_row;
//end table highlighter////////////////////////////////////////////////////////////////////