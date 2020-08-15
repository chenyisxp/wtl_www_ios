export default function formatName(str) {
	
    if(str) {
    	console.log(str)
    	console.log(str.substr(0,1) + '****' + str.substr(str.length-1,1))
        return str.substr(0,1) + '****' + str.substr(str.length-1,1);
    };
}