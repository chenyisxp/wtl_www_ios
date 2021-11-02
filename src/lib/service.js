import { Common } from './common';
import { SERVICE_CODE, STATE_CODE } from './config/interface';
import axios from 'axios'
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
    },
    getUpdateInfo:(callback)=>{
        axios.get("https://itunes.apple.com/CN/lookup?bundleId=new.uk.co.parweld.www")
            .then(response=>{
                if(response.status===200){
                    typeof callback === 'function' && callback(response.data);
                }
            }) 
    },
    getOverseasUpdateInfo:(callback)=>{
        // ru.grovers.www
        //com.wtl.wtlBlueTooth
        axios.get("https://itunes.apple.com/lookup?bundleId=new.uk.co.parweld.www")
            .then(response=>{
                if(response.status===200){
                    typeof callback === 'function' && callback(response.data);
                }
        }) 
}
} 

const interMap = [
    { method: 'testMsg', code: "ac010000" },
    { method: 'getJywDetail', code: "yq01001" },
    { method: 'getJywAcct', code: "yq01002" },

    { method: 'miniProgramInnit', code: "1030004" },   //微信小程序初始化

]

let interAPI = {};

interMap.forEach( m => {
    interAPI[m.method] = (params, callback, errorCallback, loadingStartCb, loadingEndCb) => {
        Common.request(m.code, params, (data) => {
            typeof callback === 'function' && callback(data);
        }, (data) => {
            // if(m.showMsg && data.respData && data.respData.respMsg){
            //     CommonAlert(data.respData.respMsg);
            // }else if(m.showError && data.respData && data.respData.respCode === '9999' && data.respData.respMsg){
            //     CommonAlert(data.respData.respMsg);
            // }
            typeof errorCallback === 'function' && errorCallback(data);
        }, loadingStartCb, loadingEndCb); 
    }
});
Object.assign(InterfaceService,interAPI);

export { InterfaceService };
