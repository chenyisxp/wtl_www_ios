// 处理时间戳类型的日期过滤函数
export default function formatLongTime (value,type) {
    //空返回 -
    if(!value){
        return '-';
    }
    var date = new Date(value);
       var Y = date.getFullYear(),
                m = date.getMonth() + 1,
                d = date.getDate(),
                H = date.getHours(),
                i = date.getMinutes(),
                s = date.getSeconds();
        var t  ;
        if (m < 10) {
            m = '0' + m;
        }
        if (d < 10) {
            d = '0' + d;
        }
        if (H < 10) {
            H = '0' + H;
        }
        if (i < 10) {
            i = '0' + i;
        }
        if (s < 10) {
            s = '0' + s;
        }
        //保留十分秒还是不保留
        if(type=='yyyymmdd'){
            t = Y + '-' + m + '-' + d;
        }else{
            t = Y + '-' + m + '-' + d + ' ' + H + ':' + i;
        }
        return t;
};