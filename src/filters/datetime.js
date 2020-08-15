import fillZero from './fillZero';
export default function datetime(_date) {
    if(!_date){
        return _date;
    }

    let dateStr = _date;
    if( dateStr.length == 21 ){
    	dateStr = dateStr.substring(0,dateStr.length-2)
    }
    const date = new Date(Date.parse(dateStr.replace(/-/g,"/")));

    return date.getFullYear() + '-' + fillZero(date.getMonth() + 1) + '-' + fillZero(date.getDate()) + ' ' + fillZero(date.getHours()) + ':' + fillZero(date.getMinutes()) + ':' + fillZero(date.getSeconds());
}