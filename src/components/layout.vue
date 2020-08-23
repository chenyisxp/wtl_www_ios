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
  </div>
</template>

<script>
import { Toast } from 'mint-ui'
import Loading from "@/components/base/Loading";
import Connecting from "@/components/base/connectingPage";
export default {
  components: {
    Loading,
    Connecting
  },
  data: function () {
    return {
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
              // console.log('data.substring(data.length-4,data.length+1)::'+this.crcModelBusClacQuery(data.substring(2,data.length-4), true))
          if(this.GLOBAL_CONFIG.ENV_IOS_FLAG){
            this.callSendDataToBleUtil('newIndex','DA00'+oldCrc+this.crcModelBusClacQuery('00'+oldCrc, true),oldCrc);
          }else{
            window.android.callSendDataToBle('newIndex','DA00'+oldCrc+this.crcModelBusClacQuery('00'+oldCrc, true),oldCrc);
          }
          return;
        }
        //发送确认秦请求
        
        if(!this.GLOBAL_CONFIG.TESTFLAG){
          //  alert(111)
          if(this.GLOBAL_CONFIG.ENV_IOS_FLAG){
            this.callSendDataToBleUtil('newIndex','DAFF'+oldCrc+this.crcModelBusClacQuery('FF'+oldCrc, true),oldCrc);
          }else{
            window.android.callSendDataToBle('newIndex','DAFF'+oldCrc+this.crcModelBusClacQuery('FF'+oldCrc, true),oldCrc);
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
    if (/iphone|ipad|ipod|apple|webkit/.test(userAgent )) {
      Toast({
            message: "Ios客户端",
            position: 'middle',
            iconClass: 'icon icon-success',
            duration: 2000
      });
        // alert("Ios客户端");
       this.$store.state.envType = 'env_ios'
       this.globalSendMsgToIos("handleStartScan","","");
    } else if (/android/.test(userAgent )) {
        // alert("Android客户端");
        this.$store.state.envType = 'env_android'
    }else{
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
              this.$store.state.getConnectStatus =  window.android.getConStatus();
            }
            if(this.GLOBAL_CONFIG.ONLY_CONNECT_STATUS_TOAST){
               Toast({
                  message: '连接状态：：'+this.$store.state.getConnectStatus,
                  position: 'middle',
                  iconClass: 'icon icon-success',
                  duration: 1000
              });
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
      isConnectStatus () {
        return this.$store.state.getConnectStatus;　　//需要监听的数据
      },
      envType(){
        return this.$store.state.envType;　　//需要监听的数据
      }
    },
  watch: {
    isConnectStatus (newVal, oldVal) {
      console.log('111::'+this.$store.state.nowRouter)
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
          this.displayType=1;
          //1、尝试连接
          if(!this.GLOBAL_CONFIG.DEVELOPERMODEFLAG){
               //TODO 1、应该先关闭（是否可以判断是否连接着） 2、重新连接新的
               //window.android.closeBleConnect();
              setTimeout(() => {
                 if(this.GLOBAL_CONFIG.ENV_IOS_FLAG){
                    this.globalSendMsgToIos("handleConnect",this.$store.state.nowConnectAddress,"")
                 }else{
                   window.android.setBleConnect(this.$store.state.nowConnectAddress);
                 }
              }, 2000);
               
          }
          //2、8秒后 还没连上 去 蓝牙页
          this.layoutTimer = setTimeout(() => {
            this.$router.push('/blueToothManage');
            this.displayType=0;
          }, 10000);
        }
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
        // alert('layout::'+this.modelType+'|||'+tempType);
       
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
}
</style>
