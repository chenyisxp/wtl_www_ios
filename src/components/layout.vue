<template>
  <div class="app" ref="allPage">
      <!-- <transition :name="transitionName">
          <router-view></router-view>
      </transition> -->
       <!-- 部分页面缓存控制 -->
      <transition :name="transitionName">
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
      </transition>
      <transition :name="transitionName">
            <router-view  v-if="!$route.meta.keepAlive"></router-view>
      </transition>
      <Loading :is-loading="isLoading"></Loading>
      <Connecting v-show="displayType" :displayType="displayType"></Connecting>
      <VUpModal v-show="updateVersionModal" :vuPType="vuPType"></VUpModal>
      <div style="position:fixed;top:100px;background:rgba(0,0,0,0.4);color:#fff;padding:5px 5px;height:200px;overflow:auto;z-index:999;width:30%;" v-if="logFaceFlag">
        {{envType}}
          <div v-for="(item,index) in postDataList" :key="index" style="
    word-break: break-word;">
              <span>{{index+1}}、</span>
              <span v-if="item.type=='send'">发送</span>
              <span v-if="item.type=='receive'">接收</span>
              <span>{{item.data}}</span>
          </div>
      </div>
  </div>
</template>

<script>
import VUpModal from "@/components/base/versionUpdateModal";
import Vue from 'vue'
import { Toast } from 'mint-ui'
import Loading from "@/components/base/Loading";
import Connecting from "@/components/base/connectingPage";
import { BASE_CONFIG } from '../lib/config/config'
//安卓逻辑迁移 循环定时器 
/**
 * 1、校验数据的当前状态
 * 2、正确性
 * 3、页面来源
 * 4、重发时用 时间戳
 * 5、数据会太长的指令集合 配置项
 */
var checkData={};
var checkPage={};
var checkStatus={};
var checkTime={};
var checkSendTimes={};
var mayTooLong={};
var mayTooLongList=[
    // {
    // times:0,
    // directive:'',
    // value:''
    // }
];
var TimerTask ={};
import { InterfaceService } from '../lib/service'
export default {
  components: {
    Loading,
    Connecting,
    VUpModal
  },
  data: function () {
    return {
      // postDataList:[
        // {type:'send',data:'dadadadada'},
        // {type:'receive',data:'rrrrrr'}
      // ],
      updateVersionModal:false,
      vuPType:0,
      iosVersion:'',
      layoutTimer:{},
      modelType:'',
      displayType:0,
      isLoading:false,
      isShowAbout: false,
      isShowLogin: false,
      isShowReg: false,
      isShowFooter:true,
      transitionName:'',
      autoTimeoutFlag:{},
      weldingTimer:{},
      // globalGetConnectStatus:{}
      
    }
  },
  methods: {
    iosVersonCenter(){
        //版本号去更新 currentVersionReleaseDate
        // InterfaceService.getUpdateInfo((data)=>{
        //   if(data && data.results && data.results.length>0){
        //     let info =  data.results[0];
        //     console.log(info.version)
        //   }
        //   this.globalSendMsgToIos("handGetIosVersion","sendIosVersionToHtml","");
        // })
        InterfaceService.getOverseasUpdateInfo((data)=>{
          if(data && data.results && data.results.length>0){
            let info =  data.results[0];
            this.iosVersion =info.version
            console.log( this.iosVersion,info.version)
          }
          this.globalSendMsgToIos("handGetIosVersion","sendIosVersionToHtml","");
        })
        window['sendIosVersionToHtml']= (versionNo) => {
          //版本相同 1.2 testLight 1.3 未来真是1.1 >
          if(this.iosVersion && this.iosVersion > versionNo){
            //提示更新弹层
            this.updateVersionModal = true;
            this.vuPType=1;
          }
        }
      },
    //焊接中的话自动跳转
      initWeldingAutoRouter(){
            let self =this;
        
            let allPage = self.$refs.allPage;
          
            self.autoTimeoutFlag =setTimeout(() => {
                     //是不是焊接中....
              if(self.$store.state.weldingStatus==1){
             
                    //没有做任何操作就跳转
                    if(self.$store.state.nowRouter!='/blueToothManage'){
                      self.$router.push('/welding');
                    }
                    
              }
              }, self.GLOBAL_CONFIG.autoRouterTime);
            allPage.addEventListener('touchmove',(e)=>{//屏幕触摸事件
                clearTimeout(self.autoTimeoutFlag);
            });
            allPage.addEventListener('touchend',(e)=>{//屏幕触摸事件
                clearTimeout(self.autoTimeoutFlag);
                self.autoTimeoutFlag =setTimeout(() => {
                    //  alert(self.$store.state.weldingStatus)
                  if(self.$store.state.weldingStatus==1){
                    
                    // alert(self.$store.state.nowRouter)
                    //没有做任何操作就跳转
                    if(self.$store.state.nowRouter!='/blueToothManage'){
                      self.$router.push('/welding');
                    }
                  }
                },self.GLOBAL_CONFIG.autoRouterTime);
            });
      },
    showDialog (param) {
      this[param] = true
    },
    hideDialog (param) {
      this[param] = false
    },
    goIndex(){
      let currentRout = this.$route.name
      this.goHome(currentRout)
    }, 
     buildWeldingData(data){
      //  alert(data);
        data=data.replace(/\s+/g,"").toUpperCase();
        //校验数据格式是否正确 发送信号给安卓 DAB1 0100 0200 8658 双字节
        var oldCrc =data.substring(data.length-4,data.length+1);
        //  alert(this.crcModelBusClacQuery(data.substring(2,data.length-4, true)))
        if(data.length!=16){
          return;
        }else if(oldCrc!=this.crcModelBusClacQuery(data.substring(2,data.length-4), true)){//crc校验
              console.log('data.substring(data.length-4,data.length+1)::'+this.crcModelBusClacQuery(data.substring(2,data.length-4), true))
          if(this.GLOBAL_CONFIG.ENV_IOS_FLAG){
            this.callSendDataToBleUtil('newIndex','DA00'+oldCrc+this.crcModelBusClacQuery('00'+oldCrc, true),oldCrc);
          }else{
             window.android?window.android.callSendDataToBle('newIndex','DA00'+oldCrc+this.crcModelBusClacQuery('00'+oldCrc, true),oldCrc):'';
          }
          return;
        }
        //发送确认秦请求
        console.log('======22==========')
        if(!this.GLOBAL_CONFIG.TESTFLAG){
          //  alert(111)
          if(this.GLOBAL_CONFIG.ENV_IOS_FLAG){
            this.callSendDataToBleUtil('newIndex','DAFF'+oldCrc+this.crcModelBusClacQuery('FF'+oldCrc, true),oldCrc);
          }else{
             window.android?window.android.callSendDataToBle('newIndex','DAFF'+oldCrc+this.crcModelBusClacQuery('FF'+oldCrc, true),oldCrc):'';
          }
        } 
        //有空的情况
        // this.$store.state.getWeldingInfoTimes = this.$store.state.getWeldingInfoTimes?this.$store.state.getWeldingInfoTimes:0+1;
        this.wtlLog('layout','getWeldingInfoTimes='+this.$store.state.getWeldingInfoTimes);
        this.$store.state.getWeldingInfoTimes = this.$store.state.getWeldingInfoTimes+1;
        // alert(this.$store.state.getWeldingInfoTimes)
        switch (data.substring(2,4)) {
          case 'B1':
            this.$store.state.weldingInfo =this.GLOBAL_CONFIG.callWeldTypeData.migsyn;
            this.$store.state.weldingCur =parseInt(("0x"+data.substring(6,8)+data.substring(4,6)),16).toString(10)
            this.$store.state.weldingVoltage=parseInt(("0x"+data.substring(10,12)+data.substring(8,10)),16).toString(10)
            break;
          case 'B2':
            this.$store.state.weldingInfo =this.GLOBAL_CONFIG.callWeldTypeData.migman;
            this.$store.state.weldingCur =parseInt(("0x"+data.substring(6,8)+data.substring(4,6)),16).toString(10)
            this.$store.state.weldingVoltage=parseInt(("0x"+data.substring(10,12)+data.substring(8,10)),16).toString(10)
            break;
          case 'B3':
            this.$store.state.weldingInfo =this.GLOBAL_CONFIG.callWeldTypeData.tigsyn;
            this.$store.state.weldingCur =parseInt(("0x"+data.substring(6,8)+data.substring(4,6)),16).toString(10)
            this.$store.state.weldingVoltage=parseInt(("0x"+data.substring(10,12)+data.substring(8,10)),16).toString(10)
            break;
          case 'B4':
            this.$store.state.weldingInfo =this.GLOBAL_CONFIG.callWeldTypeData.tigman;
           this.$store.state.weldingCur =parseInt(("0x"+data.substring(6,8)+data.substring(4,6)),16).toString(10)
            this.$store.state.weldingVoltage=parseInt(("0x"+data.substring(10,12)+data.substring(8,10)),16).toString(10)
            break;
          case 'B5':
            this.$store.state.weldingInfo =this.GLOBAL_CONFIG.callWeldTypeData.mma;
            this.$store.state.weldingCur =parseInt(("0x"+data.substring(6,8)+data.substring(4,6)),16).toString(10)
            this.$store.state.weldingVoltage=parseInt(("0x"+data.substring(10,12)+data.substring(8,10)),16).toString(10)
            break;
          case 'B6':
            this.$store.state.weldingInfo =this.GLOBAL_CONFIG.callWeldTypeData.cut;
            this.$store.state.weldingCur =parseInt(("0x"+data.substring(6,8)+data.substring(4,6)),16).toString(10)
            this.$store.state.weldingVoltage=parseInt(("0x"+data.substring(10,12)+data.substring(8,10)),16).toString(10)
            break;
          default:
            break;
        }
        //00、是否前往焊接中的页面 第一次返回数据前往
        // alert(this.$store.state.getWeldingInfoTimes)
        // console.log('this.$store.state.getWeldingInfoTime'+this.$store.state.getWeldingInfoTime)
        if(this.$store.state.getWeldingInfoTimes==1){
          //11、且当前模式也自动返回了相关数据
          // alert(JSON.stringify(this.$store.state.rstInfo))
          if(JSON.stringify(this.$store.state.rstInfo) != "{}"){
            //22、是不是焊接中的数据
            this.wtlLog('layout','weldStatus='+this.$store.state.rstInfo.initBean.weldStatus);
            // console.log('this.$store.state.rstInfo.initBean.weldStatus'+this.$store.state.rstInfo.initBean.weldStatus);
            // alert("aa:"+this.$store.state.weldingStatus)
             if(this.$store.state.weldingStatus==1){
                this.$router.push('/welding');
             }
          }
        }
      },
       //for android 给安卓用的方法 begin
    broastFromAndroid(data){
       if(this.$store.state.nowModelDirectice && this.modelType!=this.$store.state.nowModelDirectice){
          return;
        } 
        this.$store.state.nowModelDirectice=this.modelType;
        var rst =this.buildData('newIndex',this.getModelType(data.substring(2,4)),data.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
        if(JSON.stringify(rst) != "{}"){
          // alert(rst)
            //发送确认收到的指令给安卓
            var invalue =data.substring(data.length-4,data.length);
            //新规则: 指令ff+crc+检验crc   测试模式不发送
            if(!this.GLOBAL_CONFIG.TESTFLAG){
                if(this.GLOBAL_CONFIG.ENV_IOS_FLAG){
                  this.callSendDataToBleUtil('newIndex','DAFF'+invalue+this.crcModelBusClacQuery('FF'+invalue, true),invalue);
                }else{
                  window.android.callSendDataToBle('newIndex','DAFF'+invalue+this.crcModelBusClacQuery('FF'+invalue, true),invalue);
                }
            } 
            
        }      
      },
      getModelType(elementKey){
        switch (elementKey) {
          case 'E1'://migsyn
              return this.GLOBAL_CONFIG.callWeldTypeData.migsyn.crcCode;
              break;
          case 'E2'://migman
              return this.GLOBAL_CONFIG.callWeldTypeData.migman.crcCode;
              // this.go('/weld_common?type=MIGMAN');
              break;
          case 'E3'://tig syn
              return this.GLOBAL_CONFIG.callWeldTypeData.tigsyn.crcCode;
              // this.go('/weld_tig_syn');
              break;
          case 'E4'://tig MAN
              return this.GLOBAL_CONFIG.callWeldTypeData.tigman.crcCode;
              // this.go('/weld_tig_man');//最复杂
              break;
          case 'E5'://mma
              return this.GLOBAL_CONFIG.callWeldTypeData.mma.crcCode;
              // this.go('/weld_mma');
              break;
          default:
            break;
       }
      }
  },
  mounted () {
    console.log('layout=====')
    var userAgent = navigator.userAgent.toLowerCase();
    if (/android/.test(userAgent )) {
        // alert("Android客户端");
        this.$store.state.envType = 'env_android'
    }else if (/iphone|ipad|ipod|apple|webkit/.test(userAgent ) && BASE_CONFIG.ENV_IOS_FLAG) {
      // Toast({
      //       message: "Ios客户端",
      //       position: 'middle',
      //       iconClass: 'icon icon-success',
      //       duration: 2000
      // });
        // alert("Ios客户端");
        this.iosVersonCenter();
       this.$store.state.envType = 'env_ios'//env_ios
       this.globalSendMsgToIos("handleStartScan","","");
    } else {
        this.$store.state.envType = 'env_pc'
    }
    // history.pushState(null, null, document.URL); 
    // window.addEventListener('popstate', function() { 
    // history.pushState(null, null, document.URL); 
    // });
    this.initWeldingAutoRouter();
    if(this.GLOBAL_CONFIG.DEVELOPERMODEFLAG){
         this.$store.state.getConnectStatus ='connected';//本地开发环境
    }else{
      //测试模式不该开启
      // alert(this.GLOBAL_CONFIG.TESTFLAG)
      console.log(this.envType)
      if(!this.GLOBAL_CONFIG.TESTFLAG){
          this.$store.state.globalGetConnectStatus = setInterval(() => {
            if(this.GLOBAL_CONFIG.TESTFLAG){
              clearInterval(this.$store.state.globalGetConnectStatus);
              return;
            }
            if(this.envType=='env_ios'){
             
              this.globalSendMsgToIos("handleGetBleStateByLayout","","");
            }else{
              let status = window.android?window.android.getConStatus():BASE_CONFIG.liulanqiConnect?'connected':'';
              this.$store.state.getConnectStatus = status;
              if(status == 'connected'  && this.modbusSendDataTimes<5){
                  //发出系统信息请求
                  // this.callSendModbusSystemData('0A0303E80001','0105','layout');//模拟响应：0A03020000851D
                  // this.callSendModbusSystemData('0A0303E8001E','C944','layout');//模拟响应：0A033C000000000851D
                  // this.callSendModbusSystemData('0A0303E80023','1885','layout');//增加五个焊接时长
                  //20211103
                  this.callSendModbusSystemData('0A0303E80028','DFC4','layout');//增加五个焊接时长   
              }
            }
            if(this.GLOBAL_CONFIG.ONLY_CONNECT_STATUS_TOAST){
              //  Toast({
              //     message: '连接状态：：'+this.$store.state.getConnectStatus,
              //     position: 'middle',
              //     iconClass: 'icon icon-success',
              //     duration: 1000
              // });
            }
            //不是测试模式就该返回了
            
        }, 1000);
      }else{
        this.$store.state.getConnectStatus ='connected';//本地开发环境
      }
    }
    window['sendToLayloutBleState']= (scanStatus) => {
        this.$store.state.getConnectStatus=scanStatus;
    }
    //提前获取keyId
    this.globalSendMsgToIos("handSaveReadByFuction","tig_man_nowChooseLineKey","");//请求最后连接蓝牙名字
    window['tig_man_nowChooseLineKey']= (tigManChooseLineKey) => {
        this.$store.state.tigManChooseLineKey=tigManChooseLineKey;
    }
    //提前取
    
    this.globalSendMsgToIos("handSaveReadByFuction","callMemoryRemarks","");//请求最后连接蓝牙名字
    window['callMemoryRemarks']= (data) => {
      if(data){
        this.$store.state.callMemoryRemarks=JSON.parse(data);
      }else{
        //需要补充数据 类似安卓里的初次建表
        let db =[];
        let cv ={};
        for(let i=1;i<10;i++){
          cv ={};
          cv[pupNum]=i;//通道
          cv[remarkInfo]=NONE; //备注
          db.push(cv);
        }
        this.$store.state.callMemoryRemarks=db;
        //通知
        this.globalSendMsgToIos("handSaveWrite","callMemoryRemarks",JSON.stringify(db));
      }
    }
  },
  destroyed: function () {
     clearTimeout(this.autoTimeoutFlag);
     clearTimeout(this.weldingTimer);
     clearInterval(this.$store.state.globalGetConnectStatus);
  },
  computed: {
      isModbusModal(){
        return this.$store.state.isModbusModal;
      },
      isConnectStatus () {
        return this.$store.state.getConnectStatus;　　//需要监听的数据
      },
      envType(){
        return this.$store.state.envType;　　//需要监听的数据
      },
      postDataList(){
        return this.$store.state.postDataList;
      },
      logFaceFlag(){
        return this.$store.state.logFaceFlag;
      },
      modbusSendTimes(){
        return this.$store.state.modbusSendTimes;
      },
      modbusSendDataTimes(){
        return this.$store.state.modbusSendDataTimes;
      }
    },
  watch: {
    isConnectStatus (newVal, oldVal) {
      console.log('111::'+this.$store.state.nowRouter)
      // Toast({
      //       message: 'nowRoute:'+this.$store.state.nowRouter,
      //       position: 'middle',
      //       iconClass: 'icon icon-success',
      //       duration: 2500
      //     });
      //do something
      if(this.$store.state.nowRouter!='/blueToothManage' 
          && this.$store.state.nowRouter!='/newIndex'
          && this.$store.state.nowRouter!='/'
          && this.$store.state.nowRouter!='/setmanage'
          && this.$store.state.nowRouter!='/testPage'
          && this.$store.state.nowRouter!='/develeperManage'
      ){
        if(newVal=='connected'){
          clearTimeout(this.layoutTimer);
          this.displayType=0;
          
        }else{
          //开启扫描
          if(this.GLOBAL_CONFIG.ENV_IOS_FLAG){
            this.globalSendMsgToIos("handleStartScan","","");
          }
          let now1Router = this.$store.state.nowRouter || '';
          if( now1Router.indexOf('login')==-1 && now1Router.indexOf('register')==-1){
            this.displayType=1;
          }
          // Toast({
          //   message: 'this.displayType:'+this.displayType+'||'+this.GLOBAL_CONFIG.ENV_IOS_FLAG,
          //   position: 'middle',
          //   iconClass: 'icon icon-success',
          //   duration: 2500
          // });
          //1、尝试连接
          if(!this.GLOBAL_CONFIG.DEVELOPERMODEFLAG){
               //TODO 1、应该先关闭（是否可以判断是否连接着） 2、重新连接新的
               //window.android.closeBleConnect();
              setTimeout(() => {
                 if(this.GLOBAL_CONFIG.ENV_IOS_FLAG){
                    this.globalSendMsgToIos("handleStopScan","","");
                    this.globalSendMsgToIos("handleConnect",this.$store.state.nowConnectAddress,"")
                 }else{
                   window.android.setBleConnect(this.$store.state.nowConnectAddress);
                 }
              }, 4000);//ios慢，多扫描会
               
          }
          //2、8秒后 还没连上 去 蓝牙页
          this.layoutTimer = setTimeout(() => {
            this.$router.push('/blueToothManage');
            this.displayType=0;
          }, 10000);
        }
      }else if(this.$store.state.nowRouter!='/newIndex' || this.$store.state.nowRouter!='/blueToothManage' ){
          //几次验证是modbus,有些场合不行
          let aaa=1;
          let bbb = setInterval(()=>{
              if(aaa>4){
                clearInterval(bbb);
              }
              aaa++
              //发出系统信息请求
              // this.callSendModbusSystemData('0A0303E80001','0105','layout');//模拟响应：0A03020000851D
              // this.callSendModbusSystemData('0A0303E8001E','C944','layout');//模拟响应：0A033C000000000851D
              // this.callSendModbusSystemData('0A0303E80023','1885','layout');//增加五个焊接时长
              //20211103
              this.callSendModbusSystemData('0A0303E80028','DFC4','layout');//增加五个焊接时长 
          },1500)
      }
      
    },
    //使用watch 监听$router的变化memoryManage
    $route(to, from) {
      //设置不参与动画的路由---页面有个奇怪的bug
      // if(to.path&&to.path=='/memoryManage'){
      //   console.log(333333)
      //   return;
      // }else {
           //如果to索引大于from索引,判断为前进状态,反之则为后退状态
          if(to.meta.index > from.meta.index){
            //前进时
            // if(from.name=='cityListByBoss'){
            //     to.meta.keepAlive = false;  // 让 A 缓存，即不刷新
            // }
          //设置动画名称
          this.transitionName = 'slide-left';
          }else{
            //后退时
            // if(to.name=='cityListByBoss'){
            //     to.meta.keepAlive = false;  // 让 A 缓存，即不刷新
            // }
            this.transitionName = 'slide-right';
          }
      // }
     
    }
  },beforeCreate(){
    
     //全局挂载监听函数
    window['tellVueWelding'] = (data) => {
        //处理返回的焊接中的数据...DAB1 0000 0000 E721
        //真实数据 DAB3F901DF00B618
        // alert("main2"+data); 
        // alert(this.$store.state.getWeldingInfoTimes);
      this.wtlLog('layout','tellVueWelding='+data);
      this.$store.state.weldingDelay=false;
      clearTimeout(this.weldingTimer);
      this.weldingTimer=setTimeout(() => {
        this.$store.state.weldingDelay=true;
        if(this.isModbusModal){
          console.log('执行modbus清楚焊接中')
           this.$store.state.weldingStatus=0;
        }
      }, 8000);
      // this.$store.state.AdroidOldMsg=data;
      this.buildWeldingData(data);
    }
     //全局挂载监听函数 安卓捕获后退键进行判断后 返回去哪里  目前就去主页 废弃
    window['tellVueGoWhere'] = (data) => {
        //处理返回的焊接中的数据...DAB1 0000 0000 E721
        // alert("main"+data); 
        this.$router.push(data);
    }
    window['broastFromAndroid'] = (data) => {
       console.log('lay_broastFromAndroid')
        // Toast({
        //     message: 'layout'+data,
        //     position: 'middle',
        //     iconClass: 'icon icon-success',
        //     duration: 2500
        //   });
    //  alert(this.$store.state.AdroidNewMsg+'||||'+this.$store.state.AdroidOldMsg);
      //全局都要 改造一起返回
      if(this.$store.state.AdroidOldMsg){
        this.$store.state.AdroidNewMsg =data;
      }else{
        this.$store.state.AdroidNewMsg =data;
        this.$store.state.AdroidOldMsg=data;
      }
      // alert("mainNew"+data)
      this.wtlLog('layout','broastFromAndroid='+data);
      this.modelType=this.getModelType(data.substring(2,4));
      //alert('layout::'+this.modelType+'|||'+tempType);
      
      // this.broastFromAndroid(data);
    }
   
    // this.GLOBAL_CONFIG.TESTFLAG=false;//重置s
    if(this.GLOBAL_CONFIG.TESTFLAG){
      //焊接中....migsyn
      // var  data ='DAB1 0000 0000 1A58';
      // this.buildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.migsyn.crcCode,'dae1 20 00 00 00 02 00 003C 003D 00b4 00c8 02 09 5952'.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
       //焊接中....migman
      //  var  data ='DAB2 0000 0000 1A1C';
      //  this.buildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.migman.crcCode,'dae2 20 003D 00c8 00 6283'.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
        //焊接中....tigsyn
      //  var  data ='DAB3 0000 0000 DA21';
      //  this.buildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.tigsyn.crcCode,'dae3 20 00 03 0064 0064 02 09  8C75'.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
        //焊接中....tigman
      //  var  data ='DAB4 0000 0000 1A94';
      //  this.buildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.tigman.crcCode,'dae4 20 c0 32 0032 32 0032 0032 03e8 32 32 0032 32 50 23 4CCA'.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
       //焊接中....mma
      //  var  data ='DAB5 0000 0000 DAA9';
      //  this.buildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.mma.crcCode,'dae5 20 00 01 09 0064 0064 C54A'.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
      
      
      // setTimeout(() => {
      //   this.buildWeldingData(data);
      // }, 2000);
    }
    
    // console.log('mainjs.$store.state.weldingCur'+this.$store.state.weldingCur)
    //公共 ：安卓蓝牙交互出入口 + 苹果20200817
      // let _this =this;
      //   Vue.prototype.callSendDataToBleUtil = function(pageFrom,sendData,crc) {
      //       console.log(sendData)
      //       _this.wtlLog(pageFrom,'sendData='+sendData+',crc='+crc);
            
      //       if(!_this.GLOBAL_CONFIG.TESTFLAG){
      //           // Toast({
      //           //     message: _this.GLOBAL_CONFIG.ENV_IOS_FLAG+sendData,
      //           //     position: 'middle',
      //           //     iconClass: 'icon icon-success',
      //           //     duration: 2500
      //           //   });
      //           if(_this.GLOBAL_CONFIG.ENV_IOS_FLAG){
      //               //ios 逻辑需借鉴后端的
      //               let directive =sendData.substring(2,4);
      //               //0、初始化 开始定时器
      //               if("FF"!=directive){//不是响应的需要开启定时器
      //                   // MainActivity.requestFromHtmlInit(pageFrom, data, crcCode);
      //                   checkPage[crc]= pageFrom;//页面来源
      //                   checkStatus[crc] =false;//默认请求还未成功
      //                   checkData[crc] = sendData;//要发送的数据
      //                   checkTime[crc] = new Date().getTime();//时间戳
      //                   checkSendTimes[crc] =1;
      //               }
      //               //1、改写直接 发字符串
      //               try {
      //                   _this.$store.state.nowPageFrom=pageFrom;
      //                   console.log(_this.$store.state.nowPageFrom+'==========')
      //                   var message = {"method":"handleSendData","sendDt":sendData}
      //                   window.webkit.messageHandlers.interOp.postMessage(message);
      //                   if("FF"!=directive){//响应不需要开启定时器
      //                       initTimer();
      //                   }
      //               } catch (error) {
      //                   Toast({
      //                       message: 'sendError:'+pageFrom+JSON.stringify(error),
      //                       position: 'middle',
      //                       iconClass: 'icon icon-success',
      //                       duration: 11500
      //                     });
      //               }
      //           }else{
      //               _this.$store.state.nowPageFrom=pageFrom;
      //               window.android.callSendDataToBle(pageFrom,sendData,crc);
      //           }
                
      //       }
      //   } 
            //ios监听蓝牙返回数据 重要！！！
            // window['iosBleDataLayoutFuc']= (bleReponseData) => {
              
            //         console.log(bleReponseData)
            //         // Toast({
            //         //     message: bleReponseData,
            //         //     position: 'middle',
            //         //     iconClass: 'icon icon-success',
            //         //     duration: 11000
            //         // });
            //       try {
            //         if(Array.isArray(bleReponseData)){
            //             let data='';
            //             //1、处理
            //             // [218, 225, 0, 0, 0, 0, 2, 0, 60, 0, 61, 0, 180, 0, 200, 0, 2, 9, 46, 119]
            //             let tempByte ='';
            //             bleReponseData.forEach(element => {
            //                 tempByte = parseInt(element,10).toString(16);
            //                 data += tempByte.length==2?tempByte:'0'+tempByte;
            //             });
            //             console.log(data)
            //             //2、crc校验(注意最长的)     console.log(this.crcModelBusClacQuery('100000', true))//0570
            //             let len =data.length;
            //             data =data.toUpperCase();//大写
            //             //帧头+指令+crc校验daffaaaa aaaa
            //             if(len>11 && data.indexOf('DA')==0){
            //                 //da 10 00 00 0750
                            
            //                 // let value = data.substring(2,len-4);
            //                 let crc = data.substring(len-4,len);
            //                 if(data.indexOf("DAFF")==0){
            //                     //规则变更:(ff+接收到数据)+crc
            //                     if(data.length!=12){
            //                         return;
            //                     }else{
            //                         let oldcrc = data.substring(4, 8)
            //     //					data.substring(2, 8);//原来的crc
            //     //					data.substring(8, 12);//现在的crc
            //                         let  tempMidData ="FF"+oldCrc;
            //                         let newCrc = _this.crcModelBusClacQuery(tempMidData, true);
                                    
            //                         if(crc == newCrc){
            //                             delete(checkData[oldcrc]);
            //                             delete(checkPage[oldcrc]);
            //                             delete(checkStatus[oldcrc]);
            //                             delete(checkTime[oldcrc]);
            //                             delete(checkSendTimes[oldcrc]);
            //                         }
            //                     }
            //                     return;
            //                 //如果是返回焊接中的电流，电压
            //                 }else if(data.indexOf("DAB")==0){
            //                     window.tellVueWelding(data);
            //                     // mWebView.loadUrl("javascript:tellVueWelding('" + data +"')");
            //                     return;
            //                 //MEMORY
            //                 }else if(data.indexOf("DAD")==0){
            //                     window.broastMemoryFromAndroid(data);
            //                     // mWebView.loadUrl("javascript:broastMemoryFromAndroid('" + data +"')");
            //                     return;
            //                 }
            //             //history
            //                 else if(data.indexOf("DAC")==0){
            //                     window.broastHistoryFromAndroid(data);
            //                     // mWebView.loadUrl("javascript:broastHistoryFromAndroid('" + data +"')");
            //                     return;
            //                 }//失败 重发
            //                 else if(data.indexOf("DA00")==0){
            //                     //重发
            //                     checkTime[crc] = new Date().getTime();
            //                     checkSendTimes[crc]=checkSendTimes[crc]+1;
            //                     let reSendData = checkData[crc];
            //                     var message = {"method":"handleSendData","sendDt":reSendData}
            //                     window.webkit.messageHandlers.interOp.postMessage(message);
            //                     return;
            //                 }
                            
            //                 //不是响应信息走正常路线
            //                 //1、截取数据进行切割校验   最后四位 作为crc校验值    查看是否正确
            //                 let midData ="";
            //                 if(data.length==8){
            //                     //结束 没有数据字段
            //                     midData="";
            //                 }else{
            //                     midData =data.substring(2, data.length-4);
            //                 }
            //                 //查不到走这里
            //                 if(!checkData[crc] && midData){
            //                     let newCrc = _this.crcModelBusClacQuery(midData, true);
            //                     console.log(crc,newCrc)
            //                     //取crc校验如果不一致则失败 发送crc校验失败的响应值
            //                     if(crc!=newCrc){
            //                         //可能数据太长造成的
            //                         doDataTooLongHeader(data);
            //                         return;
            //                     }
            //                     if(!checkData[newCrc]){
            //                             //应该是蓝牙传输过过来的数据 需要区分去哪
            //                             //1、正确关闭 定时器
            //                             if(mayTooLongList.length>0){
            //                                 // clearDate();
            //                             }
            //                             //2、发送
            //                             console.log(data,checkPage[crc])
            //                             Toast({
            //                                 message: '准备',
            //                                 position: 'middle',
            //                                 iconClass: 'icon icon-success',
            //                                 duration: 2000
            //                             });
            //                             window.broastFromAndroid(data,checkPage[crc]);
            //                             delete(checkStatus[crc]);
            //                             delete(checkData[crc]);
            //                             delete(checkPage[crc]);
            //                             delete(checkTime[crc]);
            //                             delete(checkSendTimes[crc]);
                                        
            //                         }
            //                 }
                        
            //             }else{
            //                 //可能是数据太长的尾巴
            //                 doDataTooLongLast(data);
            //             }
            
            //         }
            //     } catch (error) {
            //         Toast({
            //             message: error,
            //             position: 'middle',
            //             iconClass: 'icon icon-success',
            //             duration: 12000
            //         });
            //     }
                
            // }
            function initTimer(){
               var shutDownFlag =false;//终止的标识
               	//检查是否需要重发
                for(let crcCode  in checkStatus){
                    console.log(key + '---' + obj[key]);
                    if(!obj[key]){
                        //没有数据停止
                        continue;
                    }
                    shutDownFlag =true;
                    //是否超出总的重发次数 10次
                    if(checkSendTimes[crcCode]<=10){
                        //是否大于四百ms
                        let nowTime =new Date().getTime();
                        if((nowTime -checkTime[crcCode])>1500){
                            //更新时间戳
                            checkTime[crcCode]=nowTime;
                            //更新重发次数
                            checkSendTimes[crcCode] = checkSendTimes[crcCode]+1;
                            //重发给蓝牙消息
                            var sendData = checkData[crcCode];
                            // target_chara.setValue(HexCommandtoByte(data.getBytes()));
                            // mBluetoothLeService.writeCharacteristic(target_chara);
                            var message = {"method":"handleSendData","sendDt":sendData}
                            window.webkit.messageHandlers.interOp.postMessage(message);
                        }
                    }
                }
                if(shutDownFlag){
                  clearInterval(TimerTask);
		    		//有未完成的任务开启
		    		TimerTask =setInterval(()=>{
                        initTimer();
                    },1500);
		    	}else{
                    clearInterval(TimerTask);
                }
            }
            function doDataTooLongHeader(data) {
                    //只存一个的目前
                    if(mayTooLongList.length>0){
                        //干掉旧的
                        // clearDate();
                    }
                    let tmp ={            
                        times:0,
                        directive:data.substring(0,2),
                        value:data
                    }
                    mayTooLongList.push(tmp);  
            }
            function clearDate(){
                let value = mayTooLongList[0].value;
                let crc =value.substring(value.length-4, value.length);
                let newData1 = "DA00" + crc +_this.crcModelBusClacQuery("00" + crc, true)
                var message = {"method":"handleSendData","sendDt":newData1}
                window.webkit.messageHandlers.interOp.postMessage(message);
                mayTooLongList =[];//清空
            }
            //数据太长造成的
            function doDataTooLongLast(data){
                let templist = [];
                let midData ="";
                for (let index = 0; index < mayTooLongList.length; index++) {
                    const bean = mayTooLongList[index];
                    let tempData = bean.value+data;//组合判断
                    let crc = tempData.substring(tempData.length-4, tempData.length);
                    //校验
                    if(tempData.length==8){
                        //结束 没有数据字段
                        midData="";
                    }else{
                        midData =tempData.substring(2, tempData.length-4);
                    }
                    if (!checkData[crc]){
                        // 异常 crc错了啊
                        // return;
                        // 2、把数据转成crc 校验是否能取到职值
                        if (midData) {
                            
                            let tempMidData = midData;
                            let newCrc = _this.crcModelBusClacQuery(tempMidData,true)
                            // 取crc校验如果不一致则失败 发送crc校验失败的响应值
                            if (newCrc!=crc) {
                                // 错误 应答
                                let newData1 = "DA00" + crc + _this.crcModelBusClacQuery("00" + crc,true)
                                let message = {"method":"handleSendData","sendDt":newData1}
                                window.webkit.messageHandlers.interOp.postMessage(message);
                                return;
                            }
                            if (!checkData[newCrc]) {
                                // 应该是蓝牙传输过过来的数据 需要区分去哪
                                // 1、正确关闭 定时器
                                // timer.cancel();
                                // timer = null;
                                // 2、发送
                                window.broastFromAndroid(tempData,checkPage[crc]);
                                delete(checkStatus[crc]);
                                delete(checkData[crc]);
                                delete(checkPage[crc]);
                                delete(checkTime[crc]);
                                delete(checkSendTimes[crc]);
                              
                            }else{
                                // 错误 应答
                                let newData1 = "DA00" + crc + _this.crcModelBusClacQuery("00" + crc,true)
                                let message = {"method":"handleSendData","sendDt":newData1}
                                window.webkit.messageHandlers.interOp.postMessage(message);
                            }
                        }
                    }else{
                        //通知错误
                    
                        
                    }
                    
                }
                //重新赋值
                mayTooLongList =templist;
            }
  }
}
</script>

<style>
@import '../assets/style.css';
@import '../assets/mint-ui.css';
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
    will-change: transform;
    transition: all 500ms;
    position: absolute;
}
.slide-right-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
    /*opacity: 0;*/
    display: none;
    transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
    /*opacity: 0;*/
    display: none;
    transform: translate3d(-100%, 0, 0);
}
* {
-webkit-touch-callout:none;
-webkit-user-select:none;
-khtml-user-select:none;
-moz-user-select:none;
-ms-user-select:none;
user-select:none;
}
.app{
  /* opacity: 0.2; */
  background: #01303e
}
</style>
