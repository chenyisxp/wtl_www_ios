<template>
  <div class="blueToothManage" :class="envType=='env_ios'?'env_ios_class':''">
       <!-- {{rstMsg}} -->
       <div class="blockHig">
           <span class="scanning" @click="handleCameraScan"></span>
           <!-- <span class="rBtn" v-if="reBackFlag">ReBack</span> -->
       </div>
       <div class="t-contain">
            <div v-show="!scaningFlag" class="scan">
                <img src="../assets/images/ble_scan.png"  @click="beforeHandleScan"> 
            </div>
            <div v-show="scaningFlag" class="radar"></div>
       </div>
       <!--显示逻辑 :
            1-静：1、empty 2、last
            2-动：scaning  
            3-rst:1、if have or empty 2、if more
            
        -->
        <div class="btList" v-if="lastConnectList.length>0 && showOrder==0">
          <div class="ceq">Last connected equipment</div>
          <ul >
                <li class="b-li"  v-for="(item,index) in lastConnectList" @click="setBleConnect(item.address,item.bleName)" :key="index">
                        <div class="d title">Name</div>
                        <div class="d name">{{item.bleName}}</div>
                        <div class="d connect">Connect ></div>
                </li>
          </ul>
            </div>
        <div class="btList" v-if="orderList1.length==0 && showOrder==1">
            <div class="ceq">Connectible equipment</div>
            <ul>
                <li class="b-li special">
                scanning...
                </li>
            </ul>
        </div>
        <div class="btList" v-if="orderList1.length==0 && showOrder==2">
            <ul>
                <li class="b-li special">
                    No available device was found. 
                </li>
            </ul>
        </div>
        <div class="btList" v-if="orderList1.length>0 && showOrder!=0">
            <div class="ceq">Connectible equipment</div>
            <ul>
                <li class="b-li"  v-for="(item,index) in orderList1" @click="setBleConnect(item.address,item.bleName)" :key="index">
                        <div class="d title">Name</div>
                        <div class="d name">{{item.bleName}}</div>
                        <div class="d connect">Connect ></div>
                </li>
            </ul>
        </div>
        <!-- 如果自己要用本地hc-8查看模拟报文发送接受 需打开，否则看不到这个蓝牙 -->
      <!-- <div class="morescan" v-if="orderList2.length>0 && (showOrder==1||showOrder==2) && moreFlag" @click="moreScan">More >></div> -->
       <div class="btList" v-if="orderList2.length>0 && showOrder==2 && !moreFlag">
            <div class="ceq">othter equipment</div>
            <ul>
                <li class="b-li"  v-for="(item,index) in orderList2" @click="setBleConnect(item.address,item.bleName)" :key="index">
                        <div class="d title">Name</div>
                        <div class="d name">{{item.bleName}}</div>
                        <div class="d connect">Connect ></div>
                </li>
            </ul>
        </div>
      <div v-if="orderList1.length==0 && orderList2.length==0 && lastConnectList.length==0 && showOrder==0" class="empty">The list is empty.</div>
       <Loading :is-loading="isLoading"></Loading>
       <Modal
            v-model="modal6"
            title="ATTENTION"
            ok-text='YES'
            cancel-text='NO'
            :loading="loading"
            @on-ok="asyncOK"
            @on-cancel="asyncCancell"
            >
            <p>Whether to Enter the Experiencer Model.</p>
        </Modal>
        <Modal
            v-model="comeraRstFlag"
            title="ATTENTION"
            ok-text='YES'
            cancel-text='NO'
            :loading="loading"
            @on-ok="comeraConnectTo"
            @on-cancel="asyncCancell"
            >
            <p>Whether to connect to machine?</p>
            <p>name:{{cameraRstName}}</p>
            <p>ip:{{cameraRstIp}}</p>
        </Modal>
        <Modal
            v-model="searchInFlag"
            title="ATTENTION"
            ok-text='YES'
            cancel-text='NO'
            :loading="loading"
            @on-ok="confrimScan"
            @on-cancel="searchInFlag=false"
            >
            <p>Scanning will disconnect the currently connected device?</p>
        </Modal>
    <!-- <div style="-webkit-user-select:text !important;">
        <input v-model="cameraRstName" placeholder="测试输入">
    </div>
    <input v-model="cameraRstName" placeholder="测试输入2"> -->
    
    <!-- 测试入口 -->
    <div class="testWay welding" @click="goWeldingExperiential">go to welding experiential.<Icon type="ios-arrow-dropright-circle" /></div>
    <div class="testWay" @click="goExperiential">go to normal experiential.<Icon type="ios-arrow-dropright-circle" /></div>
  </div>
</template>

<script>
import { MessageBox ,Popup,Toast ,Indicator } from 'mint-ui'
import Loading from "@/components/base/Loading";
import { BASE_CONFIG } from '../lib/config/config'
export default {
  name: '',
  components: {
   Loading
  },
  data () {
    return {
        cameraRstName:'',
        cameraRstIp:'',
        reBackFlag:false,//返回按钮显示 时机 点击连接 没有连接上就要返回了
        blueToothFlag:false,//蓝牙开关是否打开
        modal6: false,
        comeraRstFlag:false,
        searchInFlag:false,
        loading: true,
        addressGo:'',
        isWaitingToGo:false,//等待跳转
        connectFailedInfo:{},
        connectStatus:'',
        isLoading:false,
        showOrder:0,//顺序 0起始 1扫描中 2扫描结束
        jiushi:'',
        timeInterval1:'',//定时器拉取扫描按钮显示文字
        timeInterval2:'',//蓝牙列表
        btText:'扫描设备',
        rstList:[],//蓝牙列表
        scaningFlag:false,
        lastConnectList:[],
        newFilterList:[],
        orderList1:[],
        orderList2:[],
        importantkey:'08',//关键字key
        moreFlag:false,
        rstMsg:'',
        stopScanTimer:{},
        ios_bleList:'',
        timeDelayer:{},
        updateBlelistDB:[],//备注连接过的json数据
        lastBleConnectTimer:{},
        havedScanClick:true//是否点击处理蓝牙后台自动扫描问题

     } 
  },
  methods: {
      comeraConnectTo(){
           this.comeraRstFlag =false;
           if(this.GLOBAL_CONFIG.TESTFLAG){
               
                Toast({
                    message: 'test connected',
                    position: 'middle',
                    iconClass: 'icon icon-success',
                    duration: 1500
                });

              return;
            }
          // 调用到蓝牙连接 类似点击历史连接 ios比较特殊 需要重新定位ip

          if(this.envType=='env_ios'){
              if(this.rstList.length==0){
                    Toast({
                        message: 'If the connection fails, click Bluetooth search to search for available devices',
                        position: 'middle',
                        iconClass: 'icon icon-success',
                        duration: 1500
                    });
                    return;
              }else{
                  this.rstList.forEach(element => {
                      if(element.bleName == this.cameraRstName){
                        this.cameraRstIp=element.address;
                        this.setBleConnect(this.cameraRstIp,this.cameraRstName)
                      }
                  });
              }
          }else{
            this.setBleConnect(this.cameraRstIp,this.cameraRstName)
          }
      },
      //体验模式
      goWeldingExperiential(){
        this.GLOBAL_CONFIG.TESTFLAG=true;
        this.isLoading =false;
        this.$store.state.getConnectStatus='connected';
        this.$router.push({path:'/modelList',query:{}});
      },
      goExperiential(){
        let self =this;
        self.$store.state.routerOprete=1;
        clearInterval(self.$store.state.globalGetConnectStatus);
        self.GLOBAL_CONFIG.TESTFLAG=true;
        self.isLoading =false;
        self.$store.state.getConnectStatus='connected';
        self.isLoading=false;
        clearTimeout(self.connectFailedInfo)
        self.$store.state.nowConnectMachine ='experiential01';
        self.$store.state.nowConnectAddress ='11111';
        if(!self.GLOBAL_CONFIG.TESTFLAG && !self.GLOBAL_CONFIG.DEVELOPERMODEFLAG){
            //1、查出自定义的名字
            self.newFilterList.forEach(fiElement => {
                //且应该是我们自己的蓝牙才能放到order1中
                if('11111'==fiElement.realAddress ){
                    self.$store.state.nowConnectMachine=fiElement.bleName;
                }
            });
            //2、记录最后一次连接的设备
            if(self.envType=='env_ios'){
                self.bleInfoHistory();
            }else{
                // String address,String remarkInfo,String realAddress,String type
                window.android.updateBleRemarkByAddress(self.$store.state.nowConnectAddress.replace(/:/g, "").replace(/\"/g, ""),self.$store.state.nowConnectMachine,self.$store.state.nowConnectAddress,0);
            }
            
        }
        self.$router.push({path:'/newIndex',query:{bleName:self.$store.state.nowConnectMachine}});
        
      },
      moreScan(){
            this.moreFlag=false;
            //数组追加
            //  this.orderList1=this.orderList1.concat(this.orderList2);
      },
    buildData(){
       var aa= [{address:'\"56:4B:ED:75:AC:29\"', bleName:'null', rssi:'-97'}, {address:'\"78:04:73:00:AC:3D\"', bleName:'HC-08', rssi:'-41'}];
        this.rstList =aa;
        Toast({
            message: 'bele:::'+ aa.length,
            position: 'middle',
            iconClass: 'icon icon-success',
            duration: 500
        });
    },
    setBleConnect(address,bleName){
        if(this.envType=='env_ios'){
            this.setBleConnect_ios(address,bleName);
        }else{
            this.setBleConnect_android(address,bleName);
        }
    },
    setBleConnect_ios(address,bleName){
        // Toast({
        //         message: `${this.$store.state.nowConnectAddress},${address},${this.getConnectStatus}`,
        //         position: 'middle',
        //         iconClass: 'icon icon-success',
        //         duration: 2000
        // });
        if(this.$store.state.nowConnectAddress == address && this.getConnectStatus=='connected'){
            this.$router.push({path:'/newIndex',query:{bleName:this.$store.state.nowConnectMachine,address:this.$store.state.nowConnectAddress}});
        }else{
            
            //提前记录名字把 
            this.$store.state.nowConnectMachine=bleName;//全局存储机器名字
            this.$store.state.nowConnectAddress =address;
            this.globalSendMsgToIos("handleConnect",address,"")
        } 
    },
    setBleConnect_android(address,bleName){
        let self =this;
        self.$store.state.routerOprete=1;
        self.isLoading =true;
        
        // alert(self.ifOpenBlueTooth(self));
        if(!self.GLOBAL_CONFIG.DEVELOPERMODEFLAG){
            if(!self.ifOpenBlueTooth(self)){
                self.isLoading =false;
                return;
            }
        }
        // alert(this.GLOBAL_CONFIG.TESTFLAG)
        //1、如果是连接中应该先判断是不是老的连接，老的连接就不重新发起连接请求
        // alert(self.$store.state.nowConnectAddress+'||'+address)
        if(self.$store.state.getConnectStatus =='connected' && self.$store.state.nowConnectAddress == address){
            self.isLoading =false;
            self.$store.state.nowConnectMachine=bleName;//全局存储机器名字
            self.$store.state.nowConnectAddress =address;
            // alert(self.$store.state.nowConnectMachine); //!!!!!!注意blename取值
            self.$router.push({path:'/newIndex',query:{bleName:self.$store.state.nowConnectMachine,address:self.$store.state.nowConnectAddress}});
            return;
        }
        //2、老逻辑
        self.$store.state.nowConnectMachine=bleName;//全局存储机器名字
        self.$store.state.nowConnectAddress =address;
        self.connectFailedInfo =setTimeout(() => {
                if(self.$store.state.getConnectStatus !='connected'){
                    Toast({
                            message: 'Connection failed please try scanning again!',
                            position: 'middle',
                            iconClass: 'icon icon-success',
                            duration: 2000
                    });
                    self.isLoading=false;
                    self.reBackFlag =true;//开启返回首页按钮显示
                }else if(self.$store.state.getConnectStatus =='connected'){
                    self.isLoading =false;
                    if(self.envType=='env_ios'){
                        self.bleInfoHistory();
                    }else{
                        // String address,String remarkInfo,String realAddress,String type
                        window.android.updateBleRemarkByAddress(self.$store.state.nowConnectAddress.replace(/:/g, "").replace(/\"/g, ""),self.$store.state.nowConnectMachine,self.$store.state.nowConnectAddress,0);
                    }
                    self.$router.push({path:'/newIndex',query:{bleName:self.$store.state.nowConnectMachine}});
                }
        }, 8000);
        
          
          if(!self.GLOBAL_CONFIG.DEVELOPERMODEFLAG){
               //TODO 1、应该先关闭（是否可以判断是否连接着） 2、重新连接新的
               //window.android.closeBleConnect();
               if(self.envType=='env_ios'){
                    this.globalSendMsgToIos("handleConnect",address,"")
               }else{
                    window.android.setBleConnect(address);
               }
               
          }
          
          self.$store.state.nowConnectMachine=bleName;//全局存储机器名字
          self.$store.state.nowConnectAddress =address;
          self.wtlLog('blueToothManage','address='+self.$store.state.nowConnectAddress+',bleName='+self.$store.state.nowConnectMachine);
          self.isWaitingToGo=true;
          
            
        
          if(self.GLOBAL_CONFIG.TESTFLAG){
            self.$store.state.getConnectStatus='connected';
            self.isLoading=false;
            clearTimeout(self.connectFailedInfo)
            self.$router.push({path:'/newIndex',query:{bleName:self.$store.state.nowConnectMachine}});
            return;
          }
         
    },
    bleInfoHistory(){
        let self =this;
        let bleInfo ={
            address:self.$store.state.nowConnectAddress,
            bleName:self.$store.state.nowConnectMachine,
            remarkInfo:self.$store.state.nowConnectMachine,
            realBleName:self.$store.state.nowConnectMachine,
            realAddress:self.$store.state.nowConnectAddress,
            type:1
        }
        let step = 0;
        self.updateBlelistDB.forEach(element => {
            
            if(element.address == bleInfo.address){
                step=1;
                element.type=1;
            }else{
                element.type=0;
            }
        });
        if(step==0){
            self.updateBlelistDB.push(bleInfo);
        }
        // self.globalSendMsgToIos("handSaveWrite","lastBleInfo",bleInfo);
        self.globalSendMsgToIos("handSaveWrite","updateBlelistDB",JSON.stringify(self.updateBlelistDB)); 
    },
    //废弃
    updateHtmlBleList(){
        /**
         * 流程梳理
         * 1、点击扫描 开启雷达图
         * 2、开启定时任务 获取安卓端返回文本来判断连接状态
         * 3、定时任务异常 结束定时任务、结束雷达、回到起始状态
         * 4、请求到扫描中...不变
         * 5、请求到已完成，关闭雷达圈圈、关闭定时任务
         */
        let self =this;
        self.timeInterval2 = setInterval(() => {
            self.rstList=[];
            var dataFlag =true;
            try {
                JSON.parse(window.android.getBleList())
            } catch (error) {
                dataFlag=false;
                Toast({
                        message: '返回的数据解析异常',
                        position: 'middle',
                        iconClass: 'icon icon-success',
                        duration: 1500
                });
                clearInterval(self.timeInterval2);
            }
            if(dataFlag){
                self.rstList =JSON.parse( window.android.getBleList());;
            }
           
        }, 1000);
    },
    go(url){
        this.$router.push(url);
    },
    openStopScanTimer(){
        this.stopScanTimer = setTimeout(() => {
            //停止扫描
            if(this.envType=='env_ios'){
                this.globalSendMsgToIos("handleStopScan","","");
                this.scaningFlag=false;
                this.showOrder =2;//扫描结束
                clearInterval(this.timeInterval1)
            }else{
                //TODO 安卓
            }
        }, BASE_CONFIG.scaningDuring);
    },
    beforeHandleScan(){
        if(this.getConnectStatus=='connected'){
            this.searchInFlag=true;
            return;
        }else{
            this.handleScan();
        }
    },
    handleScan(){
        if(this.envType=='env_ios'){
            this.globalSendMsgToIos("handleStopScan","","");
            this.havedScanClick=false;
            // clearTimeout(this.lastBleConnectTimer);
            this.scan_ios();
        }else{
            this.scan();
        }
    },
    confrimScan(){
        //关闭弹层、断开扫描、开启扫描
        this.searchInFlag=false;
        this.$store.state.getConnectStatus='scaning';
        let address =this.$store.state.nowConnectAddress
        if(address){
            this.globalSendMsgToIos("handleDisConnect",address,"")
            //开启定时器
            // this.timeInterval1 = setInterval(() => {
            //     this.globalSendMsgToIos("handleGetBleState","","");
            // },800);
        }
        this.handleScan();
    },
    scan_ios(){
        let self =this;
        var scanStatus =true;
        self.scaningFlag=true;
        self.showOrder =1;//扫描中
        //开启及扫描
        try {
            self.globalSendMsgToIos("handleStartScan","","");
        } catch (error) {
            scanStatus =false;
        } 
        self.timeInterval1 = setInterval(() => {
            self.globalSendMsgToIos("handleGetBleState","","");
        },800);
        self.openStopScanTimer();
        //！！！！剩余逻辑在window['handBleListToHtml5']中

    },
    scan(){
        let self =this;
        if(!self.ifOpenBlueTooth(self)){
            return;
        }
        var scanStatus =true;
        self.scaningFlag=true;
        self.showOrder =1;//扫描中
        //开启及扫描
        try {
            window.android.beginScan();
        } catch (error) {
            scanStatus =false;
        } 
        if(scanStatus){
            var rstLLIST=[];
           setTimeout(() => {
               var tempI=0;
               var rstString ='';
                self.timeInterval1 = setInterval(() => {
                    //扫描中
                   try {
                       if('scaning'==window.android.getScanBtnText()){
                             self.scaningFlag=true;
                        }else{
                            if(self.orderList2.length>0){//是否有more的
                                     self.moreFlag=true;
                            }
                             clearInterval(self.timeInterval1);
                             self.scaningFlag=false;
                             self.showOrder =2;//扫描结束
                           
                        }
                        //结果处理
                          try {
                               rstString =window.android.getBleList();
                               rstLLIST = JSON.parse(rstString);
                            } catch (error) {
                                rstLLIST=[];
                                Toast({
                                        message: 'FBTM:Data parsing exception returned!',
                                        position: 'middle',
                                        iconClass: 'icon icon-success',
                                        duration: 1500
                                });
                            }
                            //赋值
                            self.rstList =rstLLIST;
                            tempI =0;
                            self.orderList1=[];
                            self.orderList2=[];
                            self.rstList.forEach(element => {
                                tempI =0;
                                self.newFilterList.forEach(fiElement => {
                                    //且应该是我们自己的蓝牙才能放到order1中
                                    if(element.address==fiElement.realAddress ){
                                        if(element.bleName.indexOf(self.importantkey)>-1){
                                            element.bleName=fiElement.bleName;
                                            self.orderList1.push(element);
                                        }else{
                                            element.bleName=fiElement.bleName;
                                            self.orderList2.push(element);
                                        }
                                       tempI =1;//外层判断需不要加
                                       return false;
                                    }
                                });
                                if(tempI==0){
                                    //是我们要的开头
                                   if(element.bleName.indexOf(self.importantkey)>-1){
                                        self.orderList1.push(element);
                                   }else{
                                        self.orderList2.push(element);
                                   }
                                }
                            });
                           
                            self.wtlLog('blueToothManage','rstString='+rstString);
                           
                   } catch (error) {
                       self.scanStatus =false;
                       clearInterval(self.timeInterval1);
                   }
                }, 800); 
           }, 500);
        }
    },
    aa(text){
        //  Toast({
        //     message: 'text值是：'+text,
        //     position: 'middle',
        //     iconClass: 'icon icon-success',
        //     duration: 2500
        // });
        // this.btText=text;
    },
    asyncOK () {
        // setTimeout(() => {
            this.modal6 = false;
            //逻辑调整直接去调试页面
            this.GLOBAL_CONFIG.TESTFLAG =true;
            // this.$store.state.nowConnectMachine='testBle';//全局存储机器名字
            this.isLoading =false;
            // this.$router.push({path:'/newIndex',query:{bleName:this.$store.state.nowConnectMachine}});
        // }, 2000);
    },
    asyncCancell(){
         this.GLOBAL_CONFIG.TESTFLAG =false;
         this.isLoading =false;
    },
    ifOpenBlueTooth(self){
        // let self =this;
        if(!self.blueToothFlag){
            var rst = window.android.openBluetooth();
            
            if(rst=='false'){
                return false;
            }else if(rst=='true'){
                self.blueToothFlag=true;
                return true;
            }
        }else{
            return true;
        }
    },
    goBack(){
        this.$router.back() 
        // window.history.back()
      return;
    },
    handleCameraScan(){
        if(this.scaningFlag){
            Toast({
                        message: "Please wait for the search scan to finish",
                        position: 'middle',
                        iconClass: 'icon icon-success',
                        duration: 2500
            }); 
            return;
        }
       
        //ios
        if(this.envType=='env_ios'){
            // let message = {"method":"handleStartScan","":""}
           
            try {
                this.globalSendMsgToIos("handleOpenIosScan","","");//打开二维码扫描
            } catch (error) {
                Toast({
                        message: error,
                        position: 'middle',
                        iconClass: 'icon icon-success',
                        duration: 2500
                }); 
            }
        }else{
            window.android.openCameraScan();
        }
        
    },
    init_ios(){
            let self=this;
            //0、默认开启蓝牙扫描 为了可以连接上次记忆的蓝牙
            // self.globalSendMsgToIos("handleStartScan","","");
            // self.lastBleConnectTimer =setTimeout(() => {
            //     self.globalSendMsgToIos("handleStopScan","","");
            // }, 100000);
            //1、获取最后连接的蓝牙
            self.isLoading=false;
            // self.modal6 = false;//关闭
            //00、获取最后连接的蓝牙
            var lastBle ='';
            if(self.GLOBAL_CONFIG.DEVELOPERMODEFLAG){
                lastBle = '11221||本地开发模拟的数据';
            }else{
                //第一步
                self.globalSendMsgToIos("handSaveReadByFuction","updateBlelistDB","");//请求最后连接蓝牙名字
                //第二步 在mounted中处理 //2、获取被重命名过的数据
                // window['updateBlelistDB']
            }
            if (window.history && window.history.pushState) {
                history.pushState(null, null, document.URL);
                window.addEventListener('popstate', this.goBack, false);
            } 
        

    },
    init_android(){
        let self=this;
            self.isLoading=false;
            // self.modal6 = false;//关闭
            //00、获取最后连接的蓝牙
            var lastBle ='';
            if(self.GLOBAL_CONFIG.DEVELOPERMODEFLAG){
                lastBle = '11221||本地开发模拟的数据';
            }else{
                lastBle = window.android.getLastConnectBleAddress();
            }
            //  alert(lastBle)
            if(lastBle){
                var arr = lastBle.split("||||");
                var conbean={};
                conbean.address =arr[0];
                conbean.bleName =arr[1];
                self.lastConnectList.push(conbean);
            }
            //11、数据过滤用名字
            var rsst ='';
            if(self.GLOBAL_CONFIG.DEVELOPERMODEFLAG){
                rsst = '';
            }else{
                rsst = window.android.getBleEditNames();
            }
        
            self.wtlLog('blueToothManage','TESTFLAG='+self.GLOBAL_CONFIG.TESTFLAG+',lastBle='+lastBle+',rsst='+rsst);
            var newArr =rsst.split('||||');
            var temp={};
            var tempArr=[];
            for(var i=0;i<newArr.length;i++){
                temp={};
                tempArr = newArr[i].split('|||');
                temp.address=tempArr[0];
                temp.realAddress=tempArr[1];//真实的蓝牙地址
                temp.bleName=tempArr[2]; 
                self.newFilterList.push(temp);
            }
        if (window.history && window.history.pushState) {
            history.pushState(null, null, document.URL);
            window.addEventListener('popstate', this.goBack, false);
        } 
    }
  },
  mounted: function () {
        let self =this;
        if(self.envType=='env_ios'){
            self.init_ios();
        }else{
            self.init_android();
        }
  },
  created () {
        
        let self =this;
        window['broastCameraScanRst'] = (data) => {
            Toast({
                    message: 'scanned data is not in rule'+data,
                    position: 'middle',
                    iconClass: 'icon icon-success',
                    duration: 2500
            });
            console.log('+++++++++++++++++++++')
            console.log('+++++++++++++++++++++')
            // TODO 按规则 切割成 name和ip
            //测试模式时
            if(self.GLOBAL_CONFIG.TESTFLAG){
                self.cameraRstName=data;
                self.cameraRstIp="78,78,878,78,78";
                self.comeraRstFlag=true
                return;
            }
            // var data ="F0:B5:D1:59:23:4A||HC-08"; WELDin1020
            if(data.indexOf('||')>-1){
                let tempArr = data.split('||');
                // self.cameraRstIp=tempArr[0].replace(/,/g,":");
                self.cameraRstIp=tempArr[0].replace(/,/g,":");
                self.comeraRstFlag=true;
                self.cameraRstName =data.split('||')[1];
            }else{
                Toast({
                        message: 'scanned data is not in rule'+data,
                        position: 'middle',
                        iconClass: 'icon icon-success',
                        duration: 2500
                });
            }
           
        }
        //获取ble蓝牙状态
        window['sendToHtmlBleState']= (scanStatus) => {
            // if('scaning'==scanStatus){
            //     self.scaningFlag=true;
            // }else{
            //     clearInterval(self.timeInterval1);
            //     self.scaningFlag=false;
            //     self.showOrder =2;//扫描结束
            // }
            if('connected'==scanStatus){
                clearInterval(self.timeInterval1)
                self.$router.push({path:'/newIndex',query:{bleName:self.$store.state.nowConnectMachine,address:self.$store.state.nowConnectAddress}});
            }
        }
        window['sendToHtmlBleStateThenIndex']= () => {
            self.$router.push({path:'/newIndex',query:{bleName:self.$store.state.nowConnectMachine,address:self.$store.state.nowConnectAddress}});
        }
        //模拟多个： Sd8eab80c2c18b79bC,DE0EA5ED-978E-07AF-6E90-9BB27D274EF5|||HC-08,663E99B6-39F0-CD53-CF0C-BEB6CA13B875
        //ios蓝牙扫描结果
        window['handIosBleListToHtml5']= (data) => {
            // if(self.havedScanClick){
            //     //规避后台扫描的
            //     return;
            // }
            //栗子：QJB2,0,5A1AE6BB-1188-4CB8-4193-9DB06B4222A1|||HC-08,0,663E99B6-39F0-CD53-CF0C-BEB6CA13B875|||
            //扫描中回应
            let tempI =0;
            if(data){
                let bleList= data.split("|||");//切割
                let bleArr =[];
                let bleInfo ={};
                let rstLLIST=[];
                bleList.forEach(element => {
                    bleArr = element.split(',');
                    bleInfo['bleName']=bleArr[0];
                    bleInfo['address']=bleArr[1];
                    rstLLIST.push(bleInfo);
                });
                //ios独立的逻辑处理
                //赋值
                self.rstList =rstLLIST;
                tempI =0;
                self.orderList1=[];
                self.orderList2=[];
                self.rstList.forEach(element => {
                    tempI =0;
                    self.newFilterList.forEach(fiElement => {
                        //且应该是我们自己的蓝牙才能放到order1中
                        if(element.address==fiElement.realAddress ){
                            if(element.bleName.indexOf(self.importantkey)>-1){
                                element.bleName=fiElement.bleName;
                                self.orderList1.push(element);
                            }else{
                                element.bleName=fiElement.bleName;
                                self.orderList2.push(element);
                            }
                            tempI =1;//外层判断需不要加
                            return false;
                        }
                    });
                    if(tempI==0){
                        //是我们要的开头
                        if(element.bleName.indexOf(self.importantkey)>-1){
                            self.orderList1.push(element);
                        }else{
                            self.orderList2.push(element);
                        }
                    }
                });
                console.log(self.orderList1);
                console.log(self.orderList2);
                
            }
        }
        
        window['updateBlelistDB']= (bleLists) => {
            //
            //  alert(lastBle)
            if(bleLists){
                let tempList =JSON.parse(bleLists);
                self.$store.state.updateBlelistDB=tempList;
                self.updateBlelistDB = tempList;
                tempList.forEach(element => {
                    if(element.type==1){
                         self.lastConnectList.push(element);
                    }
                });
                // var arr = bleLists.split("||||");
                // var conbean={};
                // conbean.address =arr[0];
                // conbean.bleName =arr[1];
                // self.lastConnectList.push(conbean);

                
                if(self.GLOBAL_CONFIG.DEVELOPERMODEFLAG){
                    self.newFilterList=[];
                }else{
                    self.newFilterList = tempList;
                }
            
               
            }
            
        }

  },
  destroyed(){
      let self =this;
      clearInterval(self.timeInterval1);
      clearInterval(self.timeInterval2);
      clearTimeout(self.connectFailedInfo);
     
      MessageBox.close(); 
       window.removeEventListener('popstate', this.goBack, false);
  },
  computed:{
        getConnectStatus () {
            return this.$store.state.getConnectStatus;　　//需要监听的数据
        },
        envType(){
            return this.$store.state.envType;
        }
        
  },watch:{
      //不灵？？？
     getConnectStatus(val, oldVal){
            let self =this;
            if(val =='connected'){
                // alert(val)
                self.isLoading =false;
                if(self.envType=='env_ios'){
                    self.bleInfoHistory();
                }else{
                    //记录最新的蓝牙连接
                    window.android.updateBleRemarkByAddress(self.$store.state.nowConnectAddress.replace(/:/g, "").replace(/\"/g, ""),self.$store.state.nowConnectMachine,self.$store.state.nowConnectAddress,0);
                }
                clearTimeout(self.connectFailedInfo);
                self.$router.push({path:'/newIndex',query:{bleName:self.$store.state.nowConnectMachine,address:self.$store.state.nowConnectAddress}});
               
            }
            
      }
  }
}
</script>
<style lang="scss" scoped>
.blueToothManage{
    width: 100%;
    background: #04303d;
    min-height: 100vh;
    .blockHig{
        height: 40px;;
        position: relative;
        .scanning{
            height: 40px;
            width: 40px;
            display: inline-block;
            color: #fff;
            background:url(../assets/images/cameraScanIcon.png) no-repeat;    
            background-size: 25px;
            background-position:center center;
        }
        .rBtn{
            position: absolute;
            color: #fff;
            border: 1px solid #fff;
            display: inline-block;
            right: 10px;
            top:10px;
            border-radius: 10px;
            padding: 5px 10px;
            
        }
    }
    .scanBtn{
        background: red;
        text-align: center;
        height: 30px;
        line-height: 30px;
    }
    .ceq{
        margin-top: 40px;
        color: #fff;;
        height: 20px;
        line-height: 20px;
        padding: 0 20px;
    }
    .btList{
        .b-li{
            
            height: 50px;
            background: #18404c;
            margin: 10px 20px;
            position: relative;
            color: #fff;
            .d{
                position: absolute;
            }
            .title{
              height: 25px;
              line-height: 30px;
              left: 15px;
              top: 0;
              color: #237992;
            }
            .name{
                height: 25px;
                line-height: 15px;
                left: 15px;
                bottom: 0;
                font-size: 16px;
            }
            .connect{
                height: 50px;
                line-height: 50px;
                font-size: 15px;
                right:15px;
            }
            
        }
        .b-li.special{
            text-align: center;
            line-height: 50px;
        }
    }
    .morescan{
        color: #fff;
        font-size: 12px;
        margin: 10px 20px;
        height: 30px;
        line-height: 30px;
    }
    .empty{
        margin:  40px;
        height: 40vw;
        line-height: 40vw;
        text-align: center;
        color: #fff;
        // border: 1px solid #eee;
    }
    .t-contain{
            height: 40vw;
        .scan{
            text-align: center;
            img{
                  width: 40vw;
                  height: 40vw;
            }
        }
        .radar {
        margin: 0 auto;
        // background: -webkit-radial-gradient(center, rgba(32, 255, 77, 0.3) 0%, rgba(32, 255, 77, 0) 75%), -webkit-repeating-radial-gradient(rgba(32, 255, 77, 0) 5.8%, rgba(32, 255, 77, 0) 18%, #20ff4d 18.6%, rgba(32, 255, 77, 0) 18.9%), -webkit-linear-gradient(90deg, rgba(32, 255, 77, 0) 49.5%, #20ff4d 50%, #20ff4d 50%, rgba(32, 255, 77, 0) 50.2%), -webkit-linear-gradient(0deg, rgba(32, 255, 77, 0) 49.5%, #20ff4d 50%, #20ff4d 50%, rgba(32, 255, 77, 0) 50.2%);
        // background: radial-gradient(center, rgba(32, 255, 77, 0.3) 0%, rgba(32, 255, 77, 0) 75%), repeating-radial-gradient(rgba(32, 255, 77, 0) 5.8%, rgba(32, 255, 77, 0) 18%, #20ff4d 18.6%, rgba(32, 255, 77, 0) 18.9%), linear-gradient(90deg, rgba(32, 255, 77, 0) 49.5%, #20ff4d 50%, #20ff4d 50%, rgba(32, 255, 77, 0) 50.2%), linear-gradient(0deg, rgba(32, 255, 77, 0) 49.5%, #20ff4d 50%, #20ff4d 50%, rgba(32, 255, 77, 0) 50.2%);
        background: -webkit-radial-gradient(center, rgba(85, 146, 189, 0.3) 0%, rgba(85, 146, 189, 0) 75%), -webkit-repeating-radial-gradient(rgba(85, 146, 189, 0) 5.8%, rgba(85, 146, 189, 0) 18%, #5592bd  18.6%, rgba(85, 146, 189, 0) 18.9%), -webkit-linear-gradient(90deg, rgba(85, 146, 189, 0) 49.5%, #5592bd  50%, #5592bd  50%, rgba(85, 146, 189, 0) 50.2%), -webkit-linear-gradient(0deg, rgba(85, 146, 189, 0) 49.5%, #5592bd  50%, #5592bd  50%, rgba(85, 146, 189, 0) 50.2%);
        background: radial-gradient(center, rgba(85, 146, 189, 0.3) 0%, rgba(85, 146, 189, 0) 75%), repeating-radial-gradient(rgba(85, 146, 189, 0) 5.8%, rgba(85, 146, 189, 0) 18%, #5592bd  18.6%, rgba(85, 146, 189, 0) 18.9%), linear-gradient(90deg, rgba(85, 146, 189, 0) 49.5%, #5592bd  50%, #5592bd  50%, rgba(85, 146, 189, 0) 50.2%), linear-gradient(0deg, rgba(85, 146, 189, 0) 49.5%, #5592bd  50%, #5592bd  50%, rgba(85, 146, 189, 0) 50.2%);
        width: 40vw;
        height: 40vw;
        max-height: 40vh;
        max-width: 40vh;
        position: relative;
        // left: 50%;
        // top: 50%;
        // transform: translate(-50%, -50%);
        border-radius: 50%;
        border: 0.2rem solid #5592bd ;
        overflow: hidden;
        }
        .radar:before {
        content: ' ';
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        animation: blips 5s infinite;
        animation-timing-function: linear;
        animation-delay: 1.4s;
        }
        .radar:after {
        content: ' ';
        display: block;
        background-image: linear-gradient(44deg, rgba(0, 255, 51, 0) 50%, #5592bd  100%);
        width: 50%;
        height: 50%;
        position: absolute;
        top: 0;
        left: 0;
        animation: radar-beam 5s infinite;
        animation-timing-function: linear;
        transform-origin: bottom right;
        border-radius: 100% 0 0 0;
        }

        @keyframes radar-beam {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
        }
        @keyframes blips {
        14% {
            background: radial-gradient(2vmin circle at 75% 70%, #ffffff 10%, #5592bd  30%, rgba(255, 255, 255, 0) 100%);
        }
        14.0002% {
            background: radial-gradient(2vmin circle at 75% 70%, #ffffff 10%, #5592bd  30%, rgba(255, 255, 255, 0) 100%), radial-gradient(2vmin circle at 63% 72%, #ffffff 10%, #5592bd  30%, rgba(255, 255, 255, 0) 100%);
        }
        25% {
            background: radial-gradient(2vmin circle at 75% 70%, #ffffff 10%, #5592bd  30%, rgba(255, 255, 255, 0) 100%), radial-gradient(2vmin circle at 63% 72%, #ffffff 10%, #5592bd  30%, rgba(255, 255, 255, 0) 100%), radial-gradient(2vmin circle at 56% 86%, #ffffff 10%, #5592bd  30%, rgba(255, 255, 255, 0) 100%);
        }
        26% {
            background: radial-gradient(2vmin circle at 75% 70%, #ffffff 10%, #5592bd  30%, rgba(255, 255, 255, 0) 100%), radial-gradient(2vmin circle at 63% 72%, #ffffff 10%, #5592bd  30%, rgba(255, 255, 255, 0) 100%), radial-gradient(2vmin circle at 56% 86%, #ffffff 10%, #5592bd  30%, rgba(255, 255, 255, 0) 100%);
            opacity: 1;
        }
        100% {
            background: radial-gradient(2vmin circle at 75% 70%, #ffffff 10%, #5592bd  30%, rgba(255, 255, 255, 0) 100%), radial-gradient(2vmin circle at 63% 72%, #ffffff 10%, #5592bd  30%, rgba(255, 255, 255, 0) 100%), radial-gradient(2vmin circle at 56% 86%, #ffffff 10%, #5592bd  30%, rgba(255, 255, 255, 0) 100%);
            opacity: 0;
        }
    }
}
    .testWay{
        position: fixed;
        bottom: 20px;
        width: 90%;
        left: 5%;
        margin: 0 auto;
        height: 40px;
        line-height: 40px;
        background: #fff;
        text-align: center;
        color: #5592bd;
        font-size: 20px;
    }.welding{
        bottom: 70px;
    }

}
/* x xs */
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
   // iphoneX iphoneXS样式
   .blueToothManage .blockHig{
       height: 60px;
       .scanning{
            margin-top: 10px;
            margin-left: 10px;
       }
   }
}
/* xr */
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {
    .blueToothManage .blockHig{
       height: 60px;
       .scanning{
            margin-top: 10px;
            margin-left: 10px;
       }
   }
}
/* xs max */
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
    .blueToothManage .blockHig{
       height: 60px;
       .scanning{
            margin-top: 10px;
            margin-left: 10px;
       }
   }
}
</style>
