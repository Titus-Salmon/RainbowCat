function populateForm() {
  let autoEmailVndNmInput = document.getElementById('autoEmailVndNm');
  let autoEmailVndEmailInput = document.getElementById('autoEmailVndEmail');

  autoEmailVndNmInput.value = vendorNameArray;
  autoEmailVndEmailInput.value = receiverEmailAddrArray;
}
populateForm();