// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import MintUI from 'mint-ui'
// import wx from 'weixin-js-sdk'
import $ from 'jquery'

import Layout from './components/layout'
import router from './router'
import mock from './mock/mock'
import utils from './lib/util'
import utils_ios from './lib/util_ios'

import filters from './filters/index'
// import filters from './lib/filters'
import directive from './lib/directive'
import store from './store/index.js'
import { MessageBox ,Popup } from 'mint-ui'
import { Indicator,Toast } from 'mint-ui'

import iView from 'iview';
import 'iview/dist/styles/iview.css';
import {Icon,Switch} from 'iview';
import { InterfaceService } from "@/services/api";
import { listenerCount } from 'node-notifier'
import { BASE_CONFIG } from './lib/config/config'
import date from './filters/date'
// import {
//   InputNumber,
//   Button,
//   Select,
//   Option,
//   OptionGroup,
//   Popover,
//   Checkbox,
//   Menu,
//   Submenu,
//   MenuItem,
//   MenuItemGroup,
//   Row,
//   Col,
//   Tabs,
//   TabPane,
//   Input,
//   CheckboxButton,
//   CheckboxGroup,
//   Pagination,
//   MessageBox,
//   Message,
//   Dialog,
//   Form,
//   FormItem,
//   Tooltip,
//   Radio,
//   RadioGroup,
//   Table,
//   TableColumn,
//   DatePicker,
//   TimeSelect,
//   Carousel,
//   CarouselItem,
//   Tree,
//   Autocomplete,
//   Alert,
//   Tag,
//   Steps,
//   Step,
// } from 'element-ui';
// import '@/styles/element-variables.scss'
// import './assets/newStyle.css'
// element ui component
// Vue.component(Input.name, Input);
// Vue.component(InputNumber.name, InputNumber);
// Vue.component(Button.name, Button);
// Vue.component(Select.name, Select);
// Vue.component(Option.name, Option);
// Vue.component(OptionGroup.name, OptionGroup);
// Vue.component(Popover.name, Popover);
// Vue.component(Checkbox.name, Checkbox);
// Vue.component(Menu.name, Menu);
// Vue.component(Row.name, Row);
// Vue.component(Col.name, Col);
// Vue.component(Tabs.name, Tabs);
// Vue.component(TabPane.name, TabPane);
// Vue.component(Submenu.name, Submenu);
// Vue.component(MenuItem.name, MenuItem);
// Vue.component(MenuItemGroup.name, MenuItemGroup);
// Vue.component(CheckboxButton.name, CheckboxButton);
// Vue.component(CheckboxGroup.name, CheckboxGroup);
// Vue.component(Pagination.name, Pagination);
// Vue.component(MessageBox.name, MessageBox);
// Vue.component(Message.name, Message);
// Vue.component(Dialog.name, Dialog);
// Vue.component(Form.name, Form);
// Vue.component(FormItem.name, FormItem);
// Vue.component(Tooltip.name, Tooltip);
// Vue.component(Radio.name, Radio);
// Vue.component(RadioGroup.name, RadioGroup);
// Vue.component(Table.name, Table);
// Vue.component(TableColumn.name, TableColumn);

// Vue.component(DatePicker.name, DatePicker);
// Vue.component(TimeSelect.name, TimeSelect);
// Vue.component(Carousel.name, Carousel);
// Vue.component(CarouselItem.name, CarouselItem);
// Vue.component(Tree.name, Tree);
// Vue.component(Autocomplete.name, Autocomplete);
// Vue.component(Alert.name, Alert);
// Vue.component(Tag.name, Tag);
// Vue.component(Steps.name, Steps);
// Vue.component(Step.name, Step);


Vue.config.productionTip = false
Vue.use(utils)
Vue.use(utils_ios)

Vue.use(filters)
Vue.use(directive)
Vue.use(MintUI)
Vue.use(iView);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<Layout/>',
  components: { Layout },
   methods: {
      buildWeldingData(data){
        data=data.replace(/\s+/g,"").toUpperCase();
        //校验数据格式是否正确 发送信号给安卓 DAB1 0000 0000 E721
        var oldCrc =data.substring(data.length-4,data.length+1);
        if(data.length!=16){
          return;
        }else if(oldCrc!=this.crcModelBusClacQuery(data.substring(2,data.length-4), true)){//crc校验
              // console.log('data.substring(data.length-4,data.length+1)::'+this.crcModelBusClacQuery(data.substring(2,data.length-4), true))
          return;
        }
        //发送确认秦请求
        if(!this.GLOBAL_CONFIG.TESTFLAG){
            window.android.callSendDataToBle('newIndex','DAFF'+oldCrc+this.crcModelBusClacQuery('FF'+oldCrc, true),oldCrc);
        } 
        //有空的情况
        this.$store.state.getWeldingInfoTimes = this.$store.state.getWeldingInfoTimes?this.$store.state.getWeldingInfoTimes:0+1;
        // alert(this.$store.state.getWeldingInfoTimes)
        switch (data.substring(2,4)) {
          case 'B1':
            this.$store.state.weldingInfo =this.GLOBAL_CONFIG.callWeldTypeData.migsyn;
            this.$store.state.weldingCur =parseInt(data.substring(4,8),16);
            this.$store.state.weldingVoltage=parseInt(data.substring(8,12),16);
            break;
          case 'B2':
            this.$store.state.weldingInfo =this.GLOBAL_CONFIG.callWeldTypeData.migman;
            this.$store.state.weldingCur =parseInt(data.substring(4,8),16);
            this.$store.state.weldingVoltage=parseInt(data.substring(8,12),16);
            break;
          case 'B3':
            this.$store.state.weldingInfo =this.GLOBAL_CONFIG.callWeldTypeData.tigsyn;
            this.$store.state.weldingCur =parseInt(data.substring(4,8),16);
            this.$store.state.weldingVoltage=parseInt(data.substring(8,12),16);
            break;
          case 'B4':
            this.$store.state.weldingInfo =this.GLOBAL_CONFIG.callWeldTypeData.tigman;
            this.$store.state.weldingCur =parseInt(data.substring(4,8),16);
            this.$store.state.weldingVoltage=parseInt(data.substring(8,12),16);
            break;
          case 'B5':
            this.$store.state.weldingInfo =this.GLOBAL_CONFIG.callWeldTypeData.mma;
            this.$store.state.weldingCur =parseInt(data.substring(4,8),16);
            this.$store.state.weldingVoltage=parseInt(data.substring(8,12),16);
            break;
          default:
            break;
        }
        //00、是否前往焊接中的页面 第一次返回数据前往
        console.log('this.$store.state.getWeldingInfoTime'+this.$store.state.getWeldingInfoTime)
        if(this.$store.state.getWeldingInfoTimes==1){
          //11、且当前模式也自动返回了相关数据
          // alert(JSON.stringify(this.$store.state.rstInfo))
          if(JSON.stringify(this.$store.state.rstInfo) != "{}"){
            //22、是不是焊接中的数据
            console.log('this.$store.state.rstInfo.initBean.weldStatus'+this.$store.state.rstInfo.initBean.weldStatus);
            // alert("aa:"+this.$store.state.weldingStatus)
             if(this.$store.state.weldingStatus==1){
                this.$router.push('/welding');
             }
          }
        }
      },
       //for android 给安卓用的方法 begin
    broastFromAndroid(data){
    
        var rst =this.buildData('newIndex',this.getModelType(data.substring(2,4)),data.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
        if(JSON.stringify(rst) != "{}"){
          // alert(rst)
            //发送确认收到的指令给安卓
            var invalue =data.substring(data.length-4,data.length);
            //新规则: 指令ff+crc+检验crc   测试模式不发送
            if(!this.GLOBAL_CONFIG.TESTFLAG){
              window.android.callSendDataToBle('newIndex','DAFF'+invalue+this.crcModelBusClacQuery('FF'+invalue, true),invalue);
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
      },
      // 获取系统版本
     getOsVersion() {
      var u = navigator.userAgent, version = ''
      if (u.indexOf('Mac OS X') > -1) {
        // ios
        var regStr_saf = /OS [\d._]*/gi
        var verinfo = u.match(regStr_saf)
        version = 'IOS' + (verinfo + '').replace(/[^0-9|_.]/ig, '').replace(/_/ig, '.')
      } else if (u.indexOf('Android') > -1 ||
        u.indexOf('Linux') > -1) {
        // android
        version = 'Android' + u.substr(u.indexOf('Android') + 8, u.indexOf(';', u.indexOf('Android')) - u.indexOf('Android') - 8)
      } else if (u.indexOf('BB10') > -1) {
        // 黑莓bb10系统
        version = 'blackberry' + u.substr(u.indexOf('BB10') + 5, u.indexOf(';', u.indexOf('BB10')) - u.indexOf('BB10') - 5)
      } else if (u.indexOf('IEMobile') > -1) {
        // windows phone
        version = 'winphone' + u.substr(u.indexOf('IEMobile') + 9, u.indexOf(';', u.indexOf('IEMobile')) - u.indexOf('IEMobile') - 9)
      } else {
        var userAgent = navigator.userAgent.toLowerCase()
        if (userAgent.indexOf('windows nt 5.0') > -1) {
          version = 'Windows 2000'
        } else if (userAgent.indexOf('windows nt 5.1') > -1 || userAgent.indexOf('windows nt 5.2') > -1) {
          version = 'Windows XP'
        } else if (userAgent.indexOf('windows nt 6.0') > -1) {
          version = 'Windows Vista'
        } else if (userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1) {
          version = 'Windows 7'
        } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows 8') > -1) {
          version = 'Windows 8'
        } else if (userAgent.indexOf('windows nt 6.3') > -1) {
          version = 'Windows 8.1'
        } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows nt 10.0') > -1) {
          version = 'Windows 10'
        } else {
          version = 'Unknown'
        }
      }
      return version
    },
    send3DaysData(){
      //初始化
      let weldInfo3Days =localStorage.getItem("weldInfo3Days");
      if(weldInfo3Days!=null && weldInfo3Days!=''){
          try {
            let list =JSON.parse(weldInfo3Days);
            let times = new Date().getTime();
            let allTM =3*24*60*60*1000;//3天
            let temp = [];
            list.forEach(eInfo => {
              console.log((times-eInfo.RECORD_SECOND)<allTM,times,eInfo.RECORD_SECOND,allTM)
              if((times-eInfo.RECORD_SECOND)<allTM){
                //只留3天内的
                temp.push(eInfo);
              }
            });
            store.state.weldInfo3Days=temp;
            localStorage.setItem("weldInfo3Days",JSON.stringify(temp));
            console.log(temp)
            
            if(temp.length>0){
              InterfaceService.batchInsertAppWeld(temp,(data)=>{
                  store.state.weldInfo3Days=[];
                  //清空localstorage
                  localStorage.setItem("weldInfo3Days","")
              },function(data){
                  
              });  
            }
          } catch (error) {
            console.log(error)
            store.state.weldInfo3Days=[];
            localStorage.setItem('weldInfo3Days','')
          }
      }
      
    }
   },
   mounted () {
    
    //获得本地三天记录
    //let pInfo ={uuid:store.state.userUuid,allData:sendData,btAddress:store.state.btAddress,pageName:store.state.nowRouter,type:type?type:'默认Type',commonContent:params.weldTime};
    //ios
    if(BASE_CONFIG.ENV_IOS_FLAG){
      //获取网络状态
      setInterval(()=>{
        this.globalSendMsgToIos("getNetWorkStatus","","");//请求最后连接蓝牙名字
      },5000)
    }else{
      //安卓
      //获取网络状态
      let nStat ='';
      setInterval(()=>{
        nStat = window.android?window.android.getAndroidNetStatus():'';
        if(nStat){
          window.sendToHtmlNetState(nStat);
        }
      },5000)
    }
    //uuid请求参数赋值
    //每次启动都重置 希望用户登录
    localStorage.setItem("wtl_without_login",''); 
    //用于生成uuid
    let uuid = localStorage.getItem("wtl_uuid");
    let userAgent =navigator.userAgent || '';
    let osVersion = this.getOsVersion() || '';
    let osLanguage = navigator.languages || '';
    
    //1、先查询手机本地存储是否存在uuid
    //2、存在直接使用，不存在创建
    if(uuid=="" || uuid== null){
       uuid = this.creatUUID();
        localStorage.setItem("wtl_uuid",uuid);
    }

      let params ={     
            uuid:uuid,
            osVersion:osVersion.substring(0,49),
            userAgent:userAgent.substring(0,599),
            osLanguage:(osLanguage+"").substring(0,59),
            windowWidth:window.innerWidth,
            windowHeight:window.innerHeight,
            envFlag:BASE_CONFIG.ENV_IOS_FLAG?1:0
      } 
      this.$store.state.userUuid = uuid;
     let haveSend =false;
     window['sendToHtmlNetState']= (netStatus) => {
       if((netStatus+"").indexOf("Online")>-1){
        this.$store.state.netWorkStatus='online';
        //本地三天记录上传
        this.send3DaysData();
       }else{
        this.$store.state.netWorkStatus='offLine';
        return;
       }
       //每次启动的第一次 且联网了请求
        if(!haveSend && (netStatus+"").indexOf("Online")>-1){
          haveSend=true;
          InterfaceService.insertUuidFuc(
            params,(data)=>{
          },function(data){
          });
        }
     }
    //禁止使用返回键
      // window.history.pushState(null, null, "#");
      // window.addEventListener("popstate", function(e) {
      //   window.history.pushState(null, null, "#");
      // })
      //版本号去更新
      // InterfaceService.getUpdateInfo((data)=>{
      //   console.log(data)
      // })
      // let wtl_without_login = localStorage.getItem("wtl_without_login");
      // //有点击不想登录按钮
      
      // if(wtl_without_login==1){
      //   let times= localStorage.getItem("wtl_app_times") || 0;
      //   if(times<3){
      //     localStorage.setItem("wtl_app_times",++times);
      //   }else{
      //     //重置
      //     localStorage.setItem("wtl_app_times",0);
      //   }
      // }
      
        //每三十秒一次请求
        // setInterval(()=>{
        //   InterfaceService.checkNetWork(
        //     {},(data)=>{
        //       this.$store.state.netWorkStatus='online';
        //   },function(data){
        //     //没有网络
        //     this.$store.state.netWorkStatus='';
        //   });
        // },30000)

   },destroyed () {
   }
 

})
