/*
    *工具 公用方法 全局方法
    *
    *
    *
*/ 

export default {
    install(Vue, options) {
    	//货币格式化
        Vue.filter( 'formatMoney' , function(number, places, symbol, thousand, decimal) {
	        number = number || 0;
	        places = !isNaN(places = Math.abs(places)) ? places : 2;
	        symbol = symbol !== undefined ? symbol : "";
	        thousand = thousand || ",";
	        decimal = decimal || ".";
	        var negative = number < 0 ? "-" : "",
	            i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
	            j = (j = i.length) > 3 ? j % 3 : 0;
	        return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
        });
    	//2015-12-08 17:09:02 获取 2015-12-08 17:09
        Vue.filter( 'getDateYmdTm' , function(str) {
	        if (str) {
	            return str.substr(0, 19);
	        }
        });
        //2015-12-08 17:09:02 获取 2015-12-08
        Vue.filter( 'getDateYmd' , function(str) {
	        if (str) {
	            return str.substr(0, 10);
	        }
        });
    }
}

