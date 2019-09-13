console.log('localStorage from adminM0d.js==>', localStorage)

let adminButtonClassCollection = document.getElementsByClassName('adminButton')
let adminFormClassCollection = document.getElementsByClassName('adminForm')


if (localStorage.getItem('userEmail_localStorage') !== 'tsalm0n@twc.com') {
	console.log('user is not an admin (from adminM0d.js)')
	for (let i = 0; i < adminButtonClassCollection.length; i++) {
		adminButtonClassCollection[i].disabled = true;
		adminButtonClassCollection[i].style.backgroundColor = 'red';
	}
	for (let i = 0; i < adminFormClassCollection.length; i++) {
		adminFormClassCollection[i].readOnly = true;
		adminFormClassCollection[i].style.backgroundColor = 'orange';
	}
}