import { Common } from './common';
import { SERVICE_CODE, STATE_CODE } from './config/interface';

let InterfaceService = {
    // 手机验证码发送请求
    getPhoneCode: (params, callback, errorCallback, loadingStartCb, loadingEndCb) => {
        Common.request(SERVICE_CODE.CUST_GET_PHONE_CODE, params, (data) => {

            typeof callback === 'function' && callback(data);
        }, (data) => {
            typeof errorCallback === 'function' && errorCallback(data);
        }, loadingStartCb, loadingEndCb);
    },
    // 用户注册
    doCustRegister: (params, callback, errorCallback, loadingStartCb, loadingEndCb) => {
        Common.request(SERVICE_CODE.CUST_REGISTER, params, (data) => {
            typeof callback === 'function' && callback(data);
        }, (data) => {
            typeof errorCallback === 'function' && errorCallback(data);
        }, loadingStartCb, loadingEndCb);
    }
} 

export { InterfaceService };
