//begin delete selection////////////////////////////////////////////////////////////////////
const DeleteSelectionBtn = document.getElementById("deleteSelection");
const xhr = new XMLHttpRequest();

DeleteSelectionBtn.addEventListener('click', function () {
    console.log('deleteSelection button clicked')
    let ResTblBdy = document.getElementById('resTblBdy');
    let rows = ResTblBdy.getElementsByTagName('tr');
    if (rows.length > 0 && localStorage.length > 0) {
        console.log('rows==>', rows)
        //console.log('rows.parentNode.rowIndex==>', rows.parentNode.rowIndex)
        console.log('rows.parentNode==>', rows.parentNode)
        //let retrievedCellData = JSON.parse(localStorage.getItem("clickedRowData"));
        let retrievedCellData = localStorage.getItem("clickedRowData");
        console.log('retrievedCellData~~~>', retrievedCellData)

        //confirm('ARE YOU SURE?');
        if (confirm('ARE YOU SURE') == true) {
            //set up listener to process completed requests
            xhr.onreadystatechange = function () {
                //process return data
                if (xhr.status >= 200 && xhr.status < 300) {
                    //what to do when req successful
                    console.log('successful request==>', xhr);
                } else {
                    //what to do if req fails
                    console.log('request failed');
                }
                //code that runs regardless of req status
                console.log('this runs regardless of req status')
            }
            //create and send POST req
            //1st argument is req type (GET, POST, PUT, DELETE, etc )
            //2nd argument is endpoint URI
            xhr.open('POST', '/dbEdit/deleteSelection')
            //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
            xhr.setRequestHeader('Content-Type', 'application/json')
            xhr.send(retrievedCellData)

            //location.reload();//reload page
            window.location.replace('/dbEdit');//redirect to /dbEdit page (from /dbEdit/results)
        }
    }
})
//end delete selection////////////////////////////////////////////////////////////////////