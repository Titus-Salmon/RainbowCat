console.log('localStorage from adminM0d.js==>', localStorage)

let adminButtonClassCollection = document.getElementsByClassName('adminButton')
let adminFormClassCollection = document.getElementsByClassName('adminForm')

let autoEmailButtonClassCollection = document.getElementsByClassName('autoEmailAdminButton')
let autoEmailFormClassCollection = document.getElementsByClassName('autoEmailAdminForm')

let userEml = localStorage.getItem('userEmail_localStorage')
console.log('userEml from adminM0d.js==>', userEml)


if (userEml !== TITUS_ADMIN_EMAIL) { //include admin email address(es) as .env variables
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

if (userEml !== TITUS_ADMIN_EMAIL && userEml !== ANDREA_ADMIN_EMAIL) { //include admin email address(es) as .env variables
	for (let i = 0; i < autoEmailButtonClassCollection.length; i++) {
		autoEmailButtonClassCollection[i].disabled = true;
		autoEmailButtonClassCollection[i].style.backgroundColor = '#ff66ff';
	}
	for (let i = 0; i < autoEmailFormClassCollection.length; i++) {
		autoEmailFormClassCollection[i].readOnly = true;
		autoEmailFormClassCollection[i].style.backgroundColor = '#ffcccc';
	}
}