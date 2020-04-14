function populateForm() {
    let prKyInput = document.getElementById('prKy')
    let vndNmInput = document.getElementById('vndNm')
    let ediNmInput = document.getElementById('ediNm')
    let issuDtInput = document.getElementById('issuDt')
    let ndNwCtInput = document.getElementById('ndNwCt')
    let updtwLtstInput = document.getElementById('updtwLtst')
    let cmnt1Input = document.getElementById('cmnt1')
    let cmnt2Input = document.getElementById('cmnt2')
    let cmnt3Input = document.getElementById('cmnt3')
    let andrInput = document.getElementById('andr')
    let nathanInput = document.getElementById('nathan')
    let vndEmlInput = document.getElementById('vndEml')


    //v//retrieve data from clicked table row (frontend)/////////////////////////
    prKyInput.value = JSON.parse(localStorage.getItem("clickedRowData"))[0]
    vndNmInput.value = JSON.parse(localStorage.getItem("clickedRowData"))[2]
    ediNmInput.value = JSON.parse(localStorage.getItem("clickedRowData"))[3]
    issuDtInput.value = JSON.parse(localStorage.getItem("clickedRowData"))[4]
    ndNwCtInput.value = JSON.parse(localStorage.getItem("clickedRowData"))[5]
    updtwLtstInput.value = JSON.parse(localStorage.getItem("clickedRowData"))[6]
    cmnt1Input.value = JSON.parse(localStorage.getItem("clickedRowData"))[7]
    cmnt2Input.value = JSON.parse(localStorage.getItem("clickedRowData"))[8]
    cmnt3Input.value = JSON.parse(localStorage.getItem("clickedRowData"))[9]
    andrInput.value = JSON.parse(localStorage.getItem("clickedRowData"))[10]
    nathanInput.value = JSON.parse(localStorage.getItem("clickedRowData"))[11]
    vndEmlInput.value = JSON.parse(localStorage.getItem("clickedRowData"))[12]
}
populateForm()