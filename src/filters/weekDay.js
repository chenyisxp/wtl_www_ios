import fillZero from './fillZero';
export default function weekDay(_date) {
    if (!_date) {
        return _date;
    }
    const date = new Date(_date);
    const week = {
        0: '星期日',
        1: '星期一',
        2: '星期二',
        3: '星期三',
        4: '星期四',
        5: '星期五',
        6: '星期六'
    }
    return week[date.getDay()];
}