import axios from 'axios'
import { BASE_CONFIG } from './config/config'
import { SERVICE_CODE, STATE_CODE } from './config/interface'
import CryptoJS from 'crypto-js';
import { Toast,Indicator} from 'mint-ui';
import qs from 'qs';

let Common = {
	request(txCode, reqParams, callback, errorCallback, opts){
		let self = this;
        let date = new Date();
        let seperator1 = "-";
        let seperator2 = ":";
        let month = (date.getMonth() + 1).toString();
        let strDate = (date.getDate()).toString();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        let currentdate = date.getFullYear() + month + strDate + date.getHours() + date.getMinutes() + date.getSeconds();


        let params = {
            txCode: txCode || '000000',
            deviceId: localStorage.getItem('deviceID') || '',
            sessionId: sessionStorage.getItem('sessionID') || '',
            custId: sessionStorage.getItem('customID') || '',
            timestamp:currentdate||'',
            reqParams: reqParams || {}
        };

        // 加密
        let cryptoParams = JSON.stringify(params);
        cryptoParams = CryptoJS.enc.Utf8.parse(cryptoParams);

        let key = CryptoJS.enc.Utf8.parse(BASE_CONFIG.CRYPTO_KEY);
        let iv = CryptoJS.enc.Utf8.parse(BASE_CONFIG.CRYPTO_KEY);
        let encrypted = CryptoJS.AES.encrypt(cryptoParams, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC
        });

        let requestDone = false;

        let promise = axios({
	        method: 'POST',
	        url:BASE_CONFIG.SERVICE_ADDRESS,
	        params: {
	            jsonparams: BASE_CONFIG.CRYPTO_KEY_OPEN ? encrypted.toString() : params
	        },
            withCredentials:true
	    });
	    promise.then(doneCallbacks, failCallbacks);

	    function doneCallbacks(resp){
	    	requestDone = true;
	    	let data = resp.data;
       
            if (data.respCode == STATE_CODE.CORRECT_CODE) {
                // 存储customID
                data.custId && sessionStorage.setItem('customID', data.custId);
                // 存储会话ID
                data.sessionId && sessionStorage.setItem('sessionID', data.sessionId);

                typeof callback === 'function' && callback(data);
            } else {
                if (STATE_CODE.ERROR_CODE.test(data.respCode)) {
                    typeof errorCallback === 'function' && errorCallback(data);
                } else if (data.respCode == STATE_CODE.SESSION_TIMEOUT_CODE || data.respCode == STATE_CODE.HAS_LOGIN_CODE) {
                    typeof errorCallback === 'function' && errorCallback(data);
                } else {
                    typeof errorCallback === 'function' && errorCallback(data);
                }
            }
	    }

	    function failCallbacks(resp){
            Toast({
                  message: '系统异常',
                  position: 'middle',
                  duration: 1500
            }); 
	    	requestDone = true;
            typeof errorCallback === 'function' && errorCallback();
	    }

	   
	},
    requestUpLoad(txCode, reqParams, callback, errorCallback, opts){
        //console.log(reqParams)
        let self = this;
        let date = new Date();
        let seperator1 = "-";
        let seperator2 = ":";
        let month = (date.getMonth() + 1).toString();
        let strDate = (date.getDate()).toString();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        let currentdate = date.getFullYear() + month + strDate + date.getHours() + date.getMinutes() + date.getSeconds();


        let params = {
            txCode: txCode || '000000',
            deviceId: localStorage.getItem('deviceID') || '',
            sessionId: sessionStorage.getItem('sessionID') || '',
            custId: sessionStorage.getItem('customID') || '',
            timestamp:currentdate||'',
            reqParams: reqParams || {}
        };

        // 加密
        let cryptoParams = JSON.stringify(params);
        cryptoParams = CryptoJS.enc.Utf8.parse(cryptoParams);

        let key = CryptoJS.enc.Utf8.parse(BASE_CONFIG.CRYPTO_KEY);
        let iv = CryptoJS.enc.Utf8.parse(BASE_CONFIG.CRYPTO_KEY);
        let encrypted = CryptoJS.AES.encrypt(cryptoParams, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC
        });

        let requestDone = false;
        //这种写法 发送请求 会报错
        axios({
            url:BASE_CONFIG.SERVICE_ADDRESS,
            method:'post',
            headers:{'Content-type': 'multipart/form-data'},
            params: {
                jsonparams: BASE_CONFIG.CRYPTO_KEY_OPEN ? encrypted.toString() : params
            },
            data:reqParams ,//Qs.stringify(reqParams)
            withCredentials:true
        })
       .then(doneCallbacks,failCallbacks);

      
        function doneCallbacks(resp){
            
            requestDone = true;
            let data = resp.data;
       
            if (data.respCode == STATE_CODE.CORRECT_CODE) {
                // 存储customID
                data.custId && sessionStorage.setItem('customID', data.custId);
                // 存储会话ID
                data.sessionId && sessionStorage.setItem('sessionID', data.sessionId);

                typeof callback === 'function' && callback(data);
            } else {
                if (STATE_CODE.ERROR_CODE.test(data.respCode)) {
                    typeof errorCallback === 'function' && errorCallback(data);
                } else if (data.respCode == STATE_CODE.SESSION_TIMEOUT_CODE || data.respCode == STATE_CODE.HAS_LOGIN_CODE) {
                    typeof errorCallback === 'function' && errorCallback(data);
                } else {
                    typeof errorCallback === 'function' && errorCallback(data);
                }
            }
        }

        function failCallbacks(resp){
            requestDone = true;
            Indicator.close();
              Toast({
                  message: '数据请求异常',
                  position: 'middle',
                  duration: 1500
              }); 
            typeof errorCallback === 'function' && errorCallback();
        }

       
    },
    getRequest(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    }
}

export { Common };