localStorage.clear();

/**We need a way to decode html entities (turn stuff like &amp; back to &). Here is a method to do that,
 * as well as the opposite (encode html entities; i.e. turn & into &amp;)
 *v*/ ///////////////////////////////////////////////////////////////////////////////////////////////////////
(function (window) {
  window.htmlentities = {
    /**
     * Converts a string to its html characters completely.
     *
     * @param {String} str String with unescaped HTML characters
     **/
    encode: function (str) {
      var buf = [];

      for (var i = str.length - 1; i >= 0; i--) {
        buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
      }

      return buf.join('');
    },
    /**
     * Converts an html characterSet into its original character.
     *
     * @param {String} str htmlSet entities
     **/
    decode: function (str) {
      return str.replace(/&#(\d+);/g, function (match, dec) {
        return String.fromCharCode(dec);
      });
    }
  };
})(window);
/*^*/ /////////////////////////////////////////////////////////////////////////////////////////////////////////////



//begin table highlighter////////////////////////////////////////////////////////////////////
const ResTblBdy = document.getElementById("resTblBdy");
let currentDate = new Date();
console.log('currentDate==>', currentDate)

receiverEmailAddrArray = [];
vendorNameArray = [];

function highlight_row() {
  let cells = ResTblBdy.getElementsByTagName('td'); //targets all cells in table
  let rows = ResTblBdy.getElementsByTagName('tr'); //targets all rows in table
  let rowsArray = [...rows];

  for (let i = 0; i < cells.length; i++) { //loop through all table cells
    // Take each cells
    // console.log('cells[' + i + ']', cells[i])
    //let cells = cells[i];
    // console.log('cells[' + i + '][' + i + ']', cells[i][i])
    //console.log('cells[' + i + '].innerHTML', cells[i].innerHTML)
    // console.log('cells[i].parentNode==>', cells[i].parentNode)
    // console.log('cells[i].parentNode.childNodes==>', cells[i].parentNode.childNodes)
    // console.log('cells[i].parentNode.childNodes[0].innerHTML==>', cells[i].parentNode.childNodes[0].innerHTML)
    let ediname = cells[i].parentNode.childNodes[2];
    let issdate = cells[i].parentNode.childNodes[3];
    let need = cells[i].parentNode.childNodes[4];
    let updated = cells[i].parentNode.childNodes[5];
    let cmnts = cells[i].parentNode.childNodes[7];
    let andcmnts = cells[i].parentNode.childNodes[8]; //placeholder for andrea comment highlights
    let vndeml = cells[i].parentNode.childNodes[9]; //vendor email column cells
    // console.log('issdate.innerHTML==>', issdate.innerHTML)
    let cellDate = new Date(issdate.innerHTML);


    if (ediname.innerHTML.toLowerCase().includes('no edi id')) {
      ediname.style.backgroundColor = "yellow";
    }
    if (Date.dateDiff('w', cellDate, currentDate) > 24) { //if issue date of cat is more than 6 months old
      issdate.style.backgroundColor = "orange"
    }
    if ((Date.dateDiff('w', cellDate, currentDate) <= 24) ||
      (cmnts.innerHTML.toLowerCase().includes('ignore auto-email')) ||
      (cmnts.innerHTML.toLowerCase().includes('not in edi')) ||
      (cmnts.innerHTML.toLowerCase().includes('get vendor email')) ||
      (cmnts.innerHTML.toLowerCase().includes('discont')) ||
      (need.innerHTML.toLowerCase().includes('periodicity')) ||
      (cmnts.innerHTML.toLowerCase().includes('requested cat'))) {
      cells[i].parentNode.style.display = "none";
      //if issue date of cat is <= 6 months old OR vendor is being discontinued, OR
      //vendor may have low periodicity of catalog updates, DO NOT SHOW THEM
    }
    // if (vndeml.style.display != "none") {
    //   receiverEmailAddrArray.push(vndeml.innerHTML)
    // }
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
    if (cmnts.innerHTML.toLowerCase().includes('not in edi') || cmnts.innerHTML.toLowerCase().includes('not in titus') || cmnts.innerHTML.toLowerCase().includes('problem:')) {
      cmnts.style.backgroundColor = "#ffb3ca";
    }
    if (cmnts.innerHTML.toLowerCase().includes('solved:')) {
      cmnts.style.backgroundColor = "#ccffcc";
    }
    if (cmnts.innerHTML.toLowerCase().includes('requested cat')) {
      cells[i].parentNode.style.backgroundColor = "#ccd9ff";
    }
    if (cmnts.innerHTML.toLowerCase().includes('discont')) {
      cells[i].parentNode.style.backgroundColor = "#999966";
    }
    if (cmnts.innerHTML.toLowerCase().includes('question:')) {
      cells[i].parentNode.style.backgroundColor = "#ffdb4b";
    }
    if (cmnts.innerHTML.toLowerCase().includes('todo')) {
      cells[i].parentNode.style.backgroundColor = "#ff0000";
    }
    if (cmnts.innerHTML.toLowerCase().includes('ignore auto-email')) {
      cells[i].parentNode.style.backgroundColor = "#ffcc99";
    }


    let clickCounter = 0; //set click counter for how many times a row has been clicked on to 0

    // do something on onclick event for cells
    cells[i].onclick = function (event) {
      localStorage.clear(); //remove any previous cells data

      let cellStorage = [];

      // Get the row id where the cells exists
      console.log('cells[i].parentNode==>', cells[i].parentNode)
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

  for (let r = 0; r < rows.length; r++) { //loop through all table rows

    let rowStyle = window.getComputedStyle(rowsArray[r]).getPropertyValue('display');
    console.log('rowStyle==>', rowStyle)
    if (rowStyle != 'none') {
      receiverEmailAddrArray.push(htmlentities.encode(rowsArray[r].childNodes[9].innerHTML)); //encodes anything like
      //&amp; to &
      vendorNameArray.push(htmlentities.encode(rowsArray[r].childNodes[1].innerHTML)); //encodes anything like
      //&amp; to &
      console.log('htmlentities.encode(rowsArray[r].childNodes[1].innerHTML)==>', htmlentities.encode(rowsArray[r].childNodes[1].innerHTML))
    }
  }

  console.log('receiverEmailAddrArray==>', receiverEmailAddrArray)
  console.log('vendorNameArray==>', vendorNameArray)

  function populateForm() {
    let autoEmailVndNmInput = document.getElementById('autoEmailVndNm');
    let autoEmailVndEmailInput = document.getElementById('autoEmailVndEmail');

    autoEmailVndNmInput.value = vendorNameArray;
    autoEmailVndEmailInput.value = receiverEmailAddrArray;
  }
  populateForm();

} //end of function
window.onload = highlight_row;
//end table highlighter////////////////////////////////////////////////////////////////////