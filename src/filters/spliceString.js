export default function spliceString(str) {
	if(str){
		console.log(str)
		if(str.indexOf('-')>0){
		    var tempStr =str.split('-');
			console.log(tempStr[0]);
			var array = tempStr[0].toLowerCase().split(" ");
			for (var i = 0; i < array.length; i++){
				array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length);
			}
			var string1 = array.join(" ");
			var array = tempStr[1].toLowerCase().split(" ");
			for (var i = 0; i < array.length; i++){
				array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length);
			}
			var string2 = array.join(" ");
			return string1+" "+string2;		
		}
		if(str=='HF'){//针对HF这种端的特殊处理
			return str;
		}
		var array = str.toLowerCase().split(" ");
		for (var i = 0; i < array.length; i++){
		array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length);
		}
		var string = array.join(" ");
		return string;
	}
	
}
