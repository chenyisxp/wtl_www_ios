import fillZero from './fillZero';
export default function delayDate(_date, delay) {
    if (!_date) {
        return _date;
    }

    let dateStr = _date;
    if( dateStr.length == 21 ){
    	dateStr = dateStr.substring(0,dateStr.length-2)
    }
    let date = new Date(Date.parse(dateStr.replace(/-/g, "/")));
    date = new Date(+date + 1000 * 60 * 60 * 24 * delay);

    return date.getFullYear() + '-' + fillZero(date.getMonth() + 1) + '-' + fillZero(date.getDate()) + ' ' + fillZero(date.getHours()) + ':' + fillZero(date.getMinutes()) + ':' + fillZero(date.getSeconds());
}