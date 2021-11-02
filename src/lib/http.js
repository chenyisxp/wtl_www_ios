/*
 *公共方法 
 *ajax 
 *
 *
 */

import mock from "@/mock/mock";
const config = require('../../config')
import axios from 'axios'
import qs from 'qs'
import {
    BASE_CONFIG
} from '@/lib/config/config'
import {
    SERVICE_CODE,
    STATE_CODE
} from '@/lib/config/interface'
import CryptoJS from 'crypto-js';
import $router from '../router'
import {MessageBox,Toast,Indicator} from 'mint-ui';
import wx from 'weixin-js-sdk'

let Common = {
    request(txCode, reqParams, callback, errorCallback, loadingStartCallback, loadingEndCallback) {
        if (typeof loadingStartCallback == 'function') {
            loadingStartCallback();
        }
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

        reqParams['tenantID']=BASE_CONFIG.tenantID;
        let params = {
            txCode: txCode || '000000',
            // deviceId: localStorage.getItem('deviceID') || '',
            // sessionId: sessionStorage.getItem('sessionID') || '',
            // custId: sessionStorage.getItem('customID') || '',
            // currentTenantId:"/vW0BLN5Zhk4QjB9rPTYE6ccLzk9ATt7PLHbsr7dmmU=",
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

        //post 参数
        let postData = qs.stringify({
            jsonparams:BASE_CONFIG.CRYPTO_KEY_OPEN ? encrypted.toString() : JSON.stringify(params)
        })
        let promise = axios({
            method: 'POST',
            url:BASE_CONFIG.SERVICE_ADDRESS,
            timeout: BASE_CONFIG.REQUEST_TIMEOUT,
            /*params: {
                jsonparams: BASE_CONFIG.CRYPTO_KEY_OPEN ? encrypted.toString() : params
            },*/
            data:postData,
            withCredentials:true
        });
        promise.then(doneCallbacks, failCallbacks)

        function doneCallbacks(resp){
            if (typeof loadingEndCallback == 'function') {
                loadingEndCallback();
            }
            requestDone = true;
            let data = resp.data;
       
            if (data.respCode == STATE_CODE.CORRECT_CODE) {
                // 存储customID
                data.custId && sessionStorage.setItem('customID', data.custId);
                // 存储会话ID
                data.sessionId && sessionStorage.setItem('sessionID', data.sessionId);

                typeof callback === 'function' && callback(data);
            } else {
                /*Toast({
                    message: '系统异常',
                    position: 'middle',
                    duration: 1500
                });*/
                if (STATE_CODE.ERROR_CODE.test(data.respCode)) {
                    Toast({
                        message: '系统异常'+JSON.stringify(data),
                        position: 'middle',
                        duration: 1500
                    });
                    typeof errorCallback === 'function' && errorCallback(data);
                } else if (data.respCode == STATE_CODE.SESSION_TIMEOUT_CODE || data.respCode == STATE_CODE.HAS_LOGIN_CODE) {
                    // $router.push({
                    //     path: "/reBind",
                    //     query:{
                    //       code:data.respCode,
                    //       outTime:data.respData
                    //     }
                    // });
                    //前往小程序页面
                    //重新登录
                    //前往小程序首页 TODO PAGEFrom灵活配置
                    wx.miniProgram.redirectTo({
                        url: `/pages/index/index?operate=bind&pageFrom=index`
                    });
                    typeof errorCallback === 'function' && errorCallback(data);
                } else {
                    typeof errorCallback === 'function' && errorCallback(data);
                }
            }
        }

        function failCallbacks(resp){
            Toast({
                  message: '系统异常'+JSON.stringify(resp),
                  position: 'middle',
                  duration: 1500
            }); 
            requestDone = true;
            if (typeof loadingEndCallback == 'function') {
                loadingEndCallback();
            }
            typeof errorCallback === 'function' && errorCallback(resp);
        }


    },
    requestUpLoad(txCode, reqParams, doRequest) {
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
            deviceId: '',
            sessionId: '',
            custId: '',
            timestamp: currentdate || '',
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
                    window.location.href="#/error";//跳转到错误页面
                    typeof errorCallback === 'function' && errorCallback(data);
                } else if (data.respCode == STATE_CODE.SESSION_TIMEOUT_CODE || data.respCode == STATE_CODE.HAS_LOGIN_CODE) {
                    //  登录异常 跳转到登录页
                    window.location.href="#/login";
                    typeof errorCallback === 'function' && errorCallback(data);
                } else if (data.respCode == STATE_CODE.RIGHT_LIMITE_CODE){
                    //  没有操作权限 跳转提示
                    window.location.href="#/noright";//跳转到错误页面
                    typeof errorCallback === 'function' && errorCallback(data); 
                } else {
                    window.location.href="#/error";//跳转到错误页面
                    typeof errorCallback === 'function' && errorCallback(data);
                }
             }
         }

         function failCallbacks(resp){
             requestDone = true;
             typeof errorCallback === 'function' && errorCallback();
             window.location.href="#/error";//跳转到错误页面
         }

    },
    requestDownload(txCode, reqParams, callback, errorCallback, loadingStartCallback, loadingEndCallback) {

        // 模拟数据
        //if (config.dev.mockData) {
        //     callback(mock['MOCK' + txCode])
        //     return
        // }
        

        let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
        let isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
        let isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
        let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
        let IE = false
        if(isIE || isEdge || isIE11) {
            IE = true  
        }else{
            IE = false  //不是ie浏览器
        }

        //判断是否有权限
        let limitTxCode = sessionStorage.getItem('limitTxCode') || '[]';
        limitTxCode = JSON.parse(limitTxCode)
        //console.log(limitTxCode)
        for(let i = 0;i<limitTxCode.length ;i++){
            let limit = limitTxCode[i]
            if(limit.code.indexOf(txCode) > -1){
               // console.log(limit)
                if(limit.type == '1'){
                    if(IE){
                        window.location.href=BASE_CONFIG.ROOT_URL+"/#/noright";
                        window.location.reload()
                    }else{
                        window.location.href="#/noright";
                    }
                    return false;
                }else if(limit.type == '2'){
                    MessageBox.alert("您没有权限执行此操作。", "权限限制", {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning',
                      center: true
                    })
                    return false;
                }
            }
        }
        // if(limitTxCode.indexOf(txCode) > -1){
        //     Message.error('没有权限');
        //     window.location.href="#/noright";//跳转到错误页面
        //     return
        // }


        if (typeof loadingStartCallback == 'function') {
            loadingStartCallback();
        }
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
            deviceId: '',
            sessionId: '',
            custId: '',
            timestamp: currentdate || '',
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

        let postData = qs.stringify({
            jsonparams:BASE_CONFIG.CRYPTO_KEY_OPEN ? encrypted.toString() : JSON.stringify(params)
        })
        let promise = axios({
            method: 'POST',
            url: BASE_CONFIG.ATTACH_ADDRESS,
            timeout: BASE_CONFIG.REQUEST_TIMEOUT,
            /*params: {
                jsonparams: BASE_CONFIG.CRYPTO_KEY_OPEN ? encrypted.toString() : params
            },*/
            data:postData,
            withCredentials:true,
            responseType: 'blob'
        });
        promise.then(doneCallbacks, failCallbacks);

        function doneCallbacks(resp) {
            if (typeof loadingEndCallback == 'function') {
                loadingEndCallback();
            }
            requestDone = true;

            if (!resp) {
                Toast('文件下载链接失败');
                //Message.error('文件下载链接失败');
                return false
            }
          
            if(resp.headers['content-disposition']){
                let disposition = resp.headers['content-disposition'].indexOf("=")
                let fileName = resp.headers['content-disposition'].substr(disposition+1)
                let data = resp.data
                
                if('msSaveOrOpenBlob' in navigator){
                    var blob = new Blob([data], {type: "application/vnd.ms-excel"});//result为从后台返回的数据
                    window.navigator.msSaveOrOpenBlob(blob, fileName);
                }else{

                    window.downloadFile = function (sUrl,fileName) {
                  
                        //iOS devices do not support downloading. We have to inform user about this.
                        if (/(iP)/g.test(navigator.userAgent)) {
                            alert('Your device does not support files downloading. Please try again in desktop browser.');
                            return false;
                        }

                        //If in Chrome or Safari - download via virtual link click
                        //if (window.downloadFile.isChrome || window.downloadFile.isSafari) {
                            //Creating new link node.
                            var link = document.createElement('a');
                            link.href = sUrl;

                            if (link.download !== undefined) {
                                //Set HTML5 download attribute. This will prevent file from opening if supported.
                                //var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
                                link.download = fileName;
                            }

                            //Dispatching click event.
                            if (document.createEvent) {
                                var e = document.createEvent('MouseEvents');
                                e.initEvent('click', true, true);
                                link.dispatchEvent(e);
                                return true;
                            }
                       // }

                        // Force file download (whether supported by server).
                        if (sUrl.indexOf('?') === -1) {
                            sUrl += '?download';
                        }
                       
                        // standard code for Google Chrome, Mozilla Firefox etc
                        window.open(sUrl, '_self');
                        
                        return true;
                    }

                    //window.downloadFile.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
                    //window.downloadFile.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
                    let url = window.URL.createObjectURL(new Blob([data]))
                    window.downloadFile(url,fileName)
                }
                
                
                // let link = document.createElement('a')
                // link.style.display = 'none'
                // link.href = url
                // link.setAttribute('download', fileName)
                // document.body.appendChild(link)
                // link.click()
            }else{
                //Message.error('文件下载失败');
                Toast('文件下载链接失败');
            }
            
        }

        function failCallbacks(resp) {
            requestDone = true;
            if (typeof loadingEndCallback == 'function') {
                loadingEndCallback();
            }
        }
        setTimeout(function () {
            if (!requestDone) {
                if (typeof loadingEndCallback == 'function') {
                    loadingEndCallback();
                }
                //requestXhr.abort();
                //return promise.reject(error);
            }
        }, BASE_CONFIG.REQUEST_TIMEOUT);


    },
    getRequest(url,reqParams,callback){
        axios.get(
            url, 
            {
                params: reqParams
            }
        )
        .then(function (response) {
            //console.log(response);
            if(response.status == '200'){
                typeof callback === 'function' && callback(response);
            }else{
                Toast({
                    message: '系统异常'+JSON.stringify(response),
                    position: 'middle',
                    duration: 1500
                });
            }
            
        })
        .catch(function (error) {
            console.log(error);
            Toast({
                message: '系统异常'+JSON.stringify(error),
                position: 'middle',
                duration: 1500
            });
        });
    }
}

export {
    Common
};