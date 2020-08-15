import formatMoney from './formatMoney';
import getDateYmdTm from './getDateYmdTm';
import ceilNumber from './ceilNumber';
import supplierRank from './supplierRank';
import fillZero from './fillZero';
import venderProductStatus from './venderProductStatus';
import date from './date';
import datetime from './datetime';
import delayDate from './delayDate';

import formatName from './formatName';
import formatPhone from './formatPhone';
import formatEmail from './formatEmail';
import weekDay from './weekDay';
import stakeHolder from './stakeHolder';
import stakeHolderSign from './stakeHolderSign';

import spliceString from './spliceString';
import moneyGetAns from './moneyGetAns';
import formatLongTime from './formatLongTime';
import stringUtil from './stringUtil';
export default {
    install(Vue, options) {
        //货币格式化  1000->1,000
        Vue.filter('formatMoney', formatMoney);
        //时间格式化  2015-12-08 17:09:02 -> 2015-12-08 17:09
        Vue.filter('getDateYmdTm', getDateYmdTm);
        //取大整数
        Vue.filter('ceilNumber', ceilNumber);
        // 供应商等级
        Vue.filter('supplierRank', supplierRank);
        // 补零
        Vue.filter('fillZero', fillZero);
        // 供应商产品状态
        Vue.filter('venderProductStatus', venderProductStatus);
        // 日期格式化
        Vue.filter('date', date);
        Vue.filter('datetime', datetime);
        // 延迟时间 
        Vue.filter('delayDate', delayDate);
         // Ydsagn  -> Y****n
        Vue.filter('formatName',formatName);
         // 13426004526 ->  134****4526
        Vue.filter('formatPhone',formatPhone);
         // 13426004526@qq.com ->  134****4526@qq.com
        Vue.filter('formatEmail',formatEmail);
        // 获取星期几
        Vue.filter('weekDay',weekDay);
        // 干系人
        Vue.filter('stakeHolder',stakeHolder);
        Vue.filter('stakeHolderSign',stakeHolderSign);

        // 干系人
        Vue.filter('spliceString',spliceString);

        Vue.filter('moneyGetAns',moneyGetAns);
        //格式化时间戳日期格式数据
        Vue.filter('formatLongTime',formatLongTime);
        //字符串首字母大写
        Vue.filter('stringUtil',stringUtil);
    }
}