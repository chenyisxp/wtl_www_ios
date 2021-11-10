/*
    *服务 接口
    *和后端交互的接口
    *
    *
*/ 

import { Common } from '@/lib/http';
import { SERVICE_CODE, STATE_CODE } from '@/lib/config/interface';
import {
    BASE_CONFIG
} from '@/lib/config/config'
import axios from 'axios'
import {MessageBox,Toast} from 'mint-ui';

let CommonAlert = function(msg){
    return Toast({
        message: msg,
        duration: BASE_CONFIG.MESSAGE_DURATION
    })
}
let version = new Date()
let InterfaceService = { 

    //--------------上传公共服务 start--------------

    //一次性获取签名 用于:多文件file 一次性上传 遍历文件的时间很短 一般在签名有效期以内 所以不需要判断签名时效
    getOssSignatureDisposable: (params, callback, errorCallback, loadingStartCb, loadingEndCb) => {
        Common.request(SERVICE_CODE.OSS_SIGNATURE, params, (data) => {
            let respData = data.respData
            typeof callback === 'function' && callback(respData);
        }, (data) => {
            if(data.respData && data.respData.respMsg){
                CommonAlert(data.respData.respMsg);
            }
            typeof errorCallback === 'function' && errorCallback(data);
        }, loadingStartCb, loadingEndCb);
      
    },
    getOssSignature: (params, callback, errorCallback, loadingStartCb, loadingEndCb) => {
        let signature = sessionStorage.getItem('signature') || '{}';
        signature = JSON.parse(signature)
        let now = new Date().getTime();
        if(signature && signature['expire'] > now){  //签名未过期 直接上传
            typeof callback === 'function' && callback(signature);
        }else{ //签名过期 直接上传
            sessionStorage.removeItem('signature');
            Common.request(SERVICE_CODE.OSS_SIGNATURE, params, (data) => {
                let respData = data.respData
                sessionStorage.setItem('signature',JSON.stringify(respData));
                
                typeof callback === 'function' && callback(respData);
            }, (data) => {
                typeof errorCallback === 'function' && errorCallback(data);
            }, loadingStartCb, loadingEndCb);
        }
    },
    /*
    *   signature  后端获取的签名
    *   file       上传文件对象
        dirName    文件名 string     
            product/[productId]/main/     (商品图：商品/商品id/主图/)   
            product/[productId]/detail/   (商品图：商品/商品id/主图/)
            company/                    (公司/)    
        pos        多文件上传 pos对应文件的索引 单文件上传输入0即可
        callBack   oss上传成功回调
    *
    */
    uploadToOss:(signature,file,dirName,pos,callBack)=>{
        let param = new FormData(); //创建form对象
        let now = Date.parse(new Date()) / 1000; 
        param.append('key',signature.dir+dirName+file.name)  //signature.dir
        param.append('policy',signature.policy)
        param.append('OSSAccessKeyId',signature.accessid)
        param.append('success_action_status','200')
        param.append('signature',signature.signature)
        param.append('file',file,file.name)
        let config = {
            headers:{'Content-type': 'multipart/form-data'},
            // withCredentials:true
        }; 
        

        (function(pos){
            axios.post(signature.host,param,config)
            .then(response=>{
                //console.log(pos)
                //console.log(file)
                if(response.status===200){
                    typeof callBack === 'function' && callBack(pos,file,dirName,signature);
                }else{
                    Message.error("oss签名获取错误");
                }
            })  
        })(pos)
    },
    //--------------oss静态文件获取 start--------------
    //新闻列表
    getNewsList:(callback)=>{
        axios.get(BASE_CONFIG.OSS_SERVICE_ADDRESS+"lws/news/newsList.json??v="+version)
            .then(response=>{
                if(response.status===200){
                    typeof callback === 'function' && callback(response.data);
                }
            }) 
    },
    getStockApi:(params, callback, errorCallback, loadingStartCb, loadingEndCb) => {
        Common.getRequest(BASE_CONFIG.STOCK_ADDRESS, params, (data) => {
            typeof callback === 'function' && callback(data);
        }, (data) => {
            typeof errorCallback === 'function' && errorCallback(data);
        }, loadingStartCb, loadingEndCb);
    },
   
    //--------------oss静态文件获取 start--------------
    //--------------共通code start--------------
    // getCommonCode:(params, callback, errorCallback, loadingStartCb, loadingEndCb) => {
    //     Common.getRequest(BASE_CONFIG.COMMON_CODE, params, (data) => {
    //         typeof callback === 'function' && callback(data);
    //     }, (data) => {
    //         typeof errorCallback === 'function' && errorCallback(data);
    //     }, loadingStartCb, loadingEndCb);
    // },
    //首页
    getHomeConfig:(callback) => {
        axios.get(BASE_CONFIG.OSS_SERVICE_ADDRESS+"lws/homeConfig.json?v="+version)
            .then(response=>{
                if(response.status===200){
                    typeof callback === 'function' && callback(response.data);
                }
            }) 
        
    }, 
    getNewsDetailConfig:(attachUrl,callback) => {
        axios.get(BASE_CONFIG.OSS_SERVICE_ADDRESS+"lws/news/newsImg/"+attachUrl+"?v="+version)
            .then(response=>{
                if(response.status===200){
                    typeof callback === 'function' && callback(response.data);
                }
            }) 
        
    },
    //法务相关文件信息
    getLwsFileConfig:(ossPath,callback) => {
        axios.get(ossPath)
            .then(response=>{
                if(response.status===200){
                    typeof callback === 'function' && callback(response.data);
                }
            }) 
        
    },
    //法务get股票信息
    getStockInfo:(url,callback) => {
        axios.get(url)
            .then(response=>{
                console.log(response)
                if(response.status===200){
                    typeof callback === 'function' && callback(response.data);
                }
            }) 
        
    },
    getCheckCode:(url,callback) => {
        axios.get(BASE_CONFIG.ROOT_URL+url)
            .then(response=>{
                console.log(response)
                if(response.status===200){
                    typeof callback === 'function' && callback(response.data);
                }else{
                    Toast(JSON.stringify(response))
                }
            }) 
        
    },
    //境外公司 用上面的
    // getOverseasCompanyList:(callback) => {
    //     axios.get(BASE_CONFIG.OSS_SERVICE_ADDRESS+"lws/overseasCompaniesConfig.json?v="+version)
    //         .then(response=>{
    //             if(response.status===200){
    //                 typeof callback === 'function' && callback(response.data);
    //             }
    //         }) 
        
    // },

} 
const interMap = [
    { method: 'checkNetWork', code: "ac000000" },//检查网络
    { method: 'login', code: "ac010001" },//登录
    { method: 'getMainCheckCode', code: "ac010002" },//获取验证码
    { method: 'sendEmailCode', code: "ac010003" },//获取验证码
    { method: 'checkEmailCode', code: "ac010004" },//校验验证码
    { method: 'insertUuidFuc', code: "ac010005" },//插入uuid
    { method: 'registerAcct', code: "ac010006" },//注册
    { method: 'queryUserInfo', code: "ac010007" },//校验邮箱用户是否已经存在
    { method: 'resetPassword', code: "ac010008" },//重置密码
    
    
    { method: 'upLoadData', code: "ac020001" },//上传数据
    { method: 'addMachineInfo', code: "ac020002" },//机器信息记录
    { method: 'batchInsertMachineWeld', code: "ac020003" },//机器的焊接记录
    { method: 'batchInsertAppWeld', code: "ac020004" },//app的焊接记录
    { method: 'queryAppWeldInfoList', code: "ac020005" },//查询历史焊接记录
    
    


    // { method: 'getJywDetail', code: "yq01001" },
    // { method: 'getJywAcct', code: "yq01002" },

    // { method: 'miniProgramInnit', code: "1030004" },   //微信小程序初始化

]

let interAPI = {};

interMap.forEach( m => {
    interAPI[m.method] = (params, callback, errorCallback, loadingStartCb, loadingEndCb) => {
        Common.request(m.code, params, (data) => {
            typeof callback === 'function' && callback(data);
        }, (data) => {
            if(m.showMsg && data.respData && data.respData.respMsg){
                // CommonAlert(data.respData.respMsg);
            }else if(m.showError && data.respData && data.respData.respCode === '9999' && data.respData.respMsg){
                // CommonAlert(data.respData.respMsg);
            }
            typeof errorCallback === 'function' && errorCallback(data);
        }, loadingStartCb, loadingEndCb); 
    }
});
Object.assign(InterfaceService,interAPI);




export { InterfaceService};
