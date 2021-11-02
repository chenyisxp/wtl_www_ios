export default function formatEmail(email) {
    if(email) {
		var arr = email.split("@");
		var star = "";
		if (arr[0].length <= 3) {
		star = "*";
		arr[0] = arr[0].substr(0, arr[0].length - 1) + star;
		} else {
		star = "***";
		arr[0] = arr[0].substr(0, arr[0].length - 3) + star;
		}
		return email = arr[0] + "@" + arr[1];
    };
}