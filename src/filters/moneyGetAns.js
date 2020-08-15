//过滤器  人民币格式化 1111.000 => 1,111.000  
//入参 money 人民币金额,length 输出需要保留几位小数 不够的补0
export default function moneyGetAns(money,length) {
    var pattern = /(?=((?!\b)\d{3})+$)/g;
    money = money+'';
	var b = money.split(".");
	var x=b[0];
	var y=b[1];

    let res = x.replace(pattern, ',')
    if(length && length > 0){
        y = y || '0'
        let len  = length-y.length
        if(y.length < length){
            for(var i = 0;i<len;i++){
                y+='0'
            }
        }
    }
    if(!res && res == 'null'){
        res = '0'
    }
    res = res+"."+y;
   
    
  	return  res
}
