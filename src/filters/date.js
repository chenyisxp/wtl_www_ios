import fillZero from './fillZero';
export default function date(_date) {
    if(!_date){
        return _date;
    }

    const date = new Date(_date.replace(/-/g,"/"));
    return date.getFullYear() + '-' + fillZero(date.getMonth() + 1) + '-' + fillZero(date.getDate());
}