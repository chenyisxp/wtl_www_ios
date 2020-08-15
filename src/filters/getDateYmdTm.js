export default function getDateYmdTm(str,len) {
	let slen = len || 19
    if (str) {
        return str.substr(0, slen);
    }
}