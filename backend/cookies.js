/* Create cookies that will track whether a user is logged in */
function createCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	}
	else var expires = "";
	document.cookie = name + "=" + value + expires + "; path=/";
}

/* Read a cookie to see if the cookie has the user marked as logged in */
function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length ; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ')  {
            c = c.substring(1, c.length);
        }
		if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length, c.length);
        } 
	}
	return null;
}

/* Delete the cookie */
function eraseCookie(name) {
	createCookie(name, "", -1);
}

