/*
    *Ios工具 公用方法 全局方法
    *
    *
    *
*/ 
export default {
        install(Vue, options) {
            // window.checkStatus
            //发送消息 util.js里也有部分逻辑！！！！！
            Vue.prototype.globalSendMsgToIos = function(fucName,keyName,valueName) {
                var message = {"method":fucName,"keyName":keyName,"valueName":valueName}
                if(window.webkit){
                    window.webkit.messageHandlers.interOp.postMessage(message) 
                }else{
                    // console.log('warn:ios,window.webkit:none',message)
                }
            }
            // //接收消息 这个比较特别需要不同的方法接收 window.globalGetMsgFromIos()
            // window['globalGetMsgFromIos'] = (type,data) => {
            //     switch (type) {
            //         case "WWW":
            //             //数据中转到每个window方法去
            //             window.broastCameraScanRst('aaa');
            //             break;
                
            //         default:
            //             break;
            //     }
               
            // }
            // window.initTimerFuc =setTimeout(() => {
                
            // }, 10);
        }
    }
    
    