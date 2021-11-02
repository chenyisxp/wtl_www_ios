// 字符串保留多长
export default function supplierRank(str) {
    console.log("aaaa::"+type)
   
        var array = str.toLowerCase().split(" ");
        for (var i = 0; i < array.length; i++){
          array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length);
        }
        var string = array.join(" ");
      
        return string;
}