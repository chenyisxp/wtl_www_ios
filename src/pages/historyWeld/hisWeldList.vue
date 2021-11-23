<template>
  <div class="hisWeldList" :class="envType=='env_ios'?'env_ios_gClass':''">
    <!-- <div class="header"><Icon type="ios-arrow-back" @click="go('/newIndex')"/>Histoty List</div> -->
    <!-- <div class="maginname">
        {{nowConnectMachine}}
    </div> -->
    <Head :wantTo="'/newIndex'" :headName="'Histoty List'"></Head>
    <div class="hislist" v-if="true">
        <span class="listName" v-if="weldMsgList.length!=0">List of recent welding history:</span>
        <div class="modbusLi">
            <div class="li modbus"  @click="goModubusHisWeld(item)" v-for="(item,idx) in weldMsgList" :key="idx">
                <div class="modbusTypename">
                    <Icon type="ios-arrow-forward" />
                    <span class="rightBox">
                        <div class="beginTime">
                            Start Time：{{item.BEGIN_TM}}
                        </div>
                        <div class="timelength">
                            Duration Time：{{item.FORMAT_COST_TM}}
                        </div>
                        <div class="modelClass">
                            Pattern：{{item.MODEL_TYPE}}
                        </div>
                    </span>
                </div>
            </div>
            <div v-if="weldMsgList.length==0">
                
                <div class="m_word login" v-if="!this.loginName" @click="handleLogin">Please log in first</div>
                <div class="m_word" v-else-if="netWorkStatus.indexOf('online')>-1">No data</div>
                <!-- 请在联网情况下使用APP焊接才能记录最近的焊接记录 -->
                <div class="m_word" v-else>Please use app welding in the case of networking to record the latest welding records</div>
            </div>
        </div>
    </div>
    <!-- 保留旧的规则 -->
    <div class="hislist" v-if="false">
        <div class="li"  @click="gohisWeld(0)">
            <div class="typename">
                MIG SYN<Icon type="ios-arrow-forward" />
            </div>
            <!-- <div class="beginTime">
                开始时间：2018.08.26  18:10:09
            </div>
            <div class="timelength">
                持续时间：2小时15分
            </div> -->
        </div>
        <div class="li"  @click="gohisWeld(1)">
            <div class="typename">
                MIG MAN<Icon type="ios-arrow-forward" />
            </div>
            <!-- <div class="beginTime">
                开始时间：2018.08.26  18:10:09
            </div>
            <div class="timelength">
                持续时间：2小时15分
            </div> -->
        </div>
        <div class="li"  @click="gohisWeld(2)">
            <div class="typename">
                TIG SYN<Icon type="ios-arrow-forward" />
            </div>
            <!-- <div class="beginTime">
                开始时间：2018.08.26  18:10:09
            </div>
            <div class="timelength">
                持续时间：2小时15分
            </div> -->
        </div>
        <div class="li"  @click="gohisWeld(3)">
            <div class="typename">
                TIG MAN<Icon type="ios-arrow-forward" />
            </div>
            <!-- <div class="beginTime">
                开始时间：2018.08.26  18:10:09
            </div>
            <div class="timelength">
                持续时间：2小时15分
            </div> -->
        </div>
        <div class="li"  @click="gohisWeld(4)">
            <div class="typename">
                MMA<Icon type="ios-arrow-forward" />
            </div>
            <!-- <div class="beginTime">
                开始时间：2018.08.26  18:10:09
            </div>
            <div class="timelength">
                持续时间：2小时15分
            </div> -->
        </div>
        <div class="li"  @click="gohisWeld(5)">
            <div class="typename">
                CUT<Icon type="ios-arrow-forward" />
            </div>
        </div>
    </div>
     <Loading :is-loading="isLoading"></Loading>
  </div>
</template>

<script>
import { Toast ,Indicator } from 'mint-ui'
import Head from "@/components/base/header";
import Loading from "@/components/base/Loading";
import {InterfaceService} from '@/services/api'
export default {
  name: '',
  components: {
    Head,
   Loading
  },
  data () {
    return {
        loadingTimer:{},
        isLoading:false,
        chooseType:'',
        chooseTypeCrc:'',
        chooseTypeName:'',
        nowConnectMachine:'',
        weldMsgList:[],
        loginName:''
     } 
  },

  methods: {
        handleLogin(){
            this.$router.push('/loginIndex');
        },
        go(url){
          this.$store.state.routerOprete=3;
          this.$router.push(url);
        },
        getTtile(index){
            return "M"+(index+1)
        },
        //for android 给安卓用的方法 begin
        broastFromAndroid(data,openTestFlag){
           this.isLoading=false;
           clearTimeout(this.loadingTimer);
            var rst =this.buildData('hisweldlist',this.chooseTypeCrc,data.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
            this.$store.state.weldingStatus=0;//历史模式 清楚正在焊接中
            if(JSON.stringify(rst) != "{}"){
                //发送确认收到的指令给安卓
                var invalue =data.substring(data.length-4,data.length);
                //新规则: 指令ff+crc+检验crc
                // if(!openTestFlag){
                //    window.android.callSendDataToBle('newIndex','DAFF'+invalue+this.crcModelBusClacQuery('FF'+invalue, true),invalue); 
                // }
                if(!this.isModbusModal){
                    this.callSendDataToBleUtil('hisWeldList','DAFF'+invalue+this.crcModelBusClacQuery('FF'+invalue, true),invalue);
                }
                this.$router.push({ path: '/hisWeldInfo', query: {name:this.chooseTypeName,type:this.chooseType,modelCrc:this.chooseTypeCrc}});
            } 
        },
        gohisWeld(type){
            this.$store.state.routerOprete=3;
            this.isLoading=true;
            this.loadingTimer = setTimeout(() => {
                if(this.isLoading){
                     this.isLoading=false;
                }
            }, 11000);
            this.chooseType =type;
            switch (this.chooseType) {
                case 0:
                    this.chooseTypeCrc=this.GLOBAL_CONFIG.callWeldTypeData.migsyn.crcCode
                    this.chooseTypeName=this.GLOBAL_CONFIG.callWeldTypeData.migsyn.name
                    break;
                case 1:
                    this.chooseTypeCrc=this.GLOBAL_CONFIG.callWeldTypeData.migman.crcCode
                    this.chooseTypeName=this.GLOBAL_CONFIG.callWeldTypeData.migman.name
                    break;
                case 2:
                    this.chooseTypeCrc=this.GLOBAL_CONFIG.callWeldTypeData.tigsyn.crcCode
                    this.chooseTypeName=this.GLOBAL_CONFIG.callWeldTypeData.tigsyn.name
                    break;
                case 3:
                    this.chooseTypeCrc=this.GLOBAL_CONFIG.callWeldTypeData.tigman.crcCode
                    this.chooseTypeName=this.GLOBAL_CONFIG.callWeldTypeData.tigman.name
                    break;
                case 4:
                    this.chooseTypeCrc=this.GLOBAL_CONFIG.callWeldTypeData.mma.crcCode
                    this.chooseTypeName=this.GLOBAL_CONFIG.callWeldTypeData.mma.name
                    break;
                case 5:
                    this.chooseTypeCrc=this.GLOBAL_CONFIG.callWeldTypeData.cut.crcCode
                    this.chooseTypeName=this.GLOBAL_CONFIG.callWeldTypeData.cut.name
                    break;
                default:
                    break;
            }
            // Indicator.open({
            //         text: 'waiting.....',
            //         spinnerType: 'fading-circle'
            // });
            var dirctCode = this.getDirective('CALL_LAST_WELD','CALL_LAST_WELD');
            // var num = (Array(4).join('0') + parseInt(type,10).toString(16)).slice(-4);
            var num =this.jinzhiChangeFuc(type);
            console.log(num);
            var crc =this.crcModelBusClacQuery(dirctCode+num, true);
            var sendData ="DA"+dirctCode+num+crc;
            //测试开关
            if(this.GLOBAL_CONFIG.TESTFLAG){
                this.testDataFuc(this.chooseType);
            }else{
                this.callSendDataToBleUtil('hisWeldList',sendData,crc);
            }
        },
        goModubusHisWeld(item){
            this.$store.state.routerOprete=3;
            this.isLoading=true;
            this.loadingTimer = setTimeout(() => {
                if(this.isLoading){
                     this.isLoading=false;
                }
            }, 11000);
            
            let content='';
            switch (item.MODEL_TYPE) {
                case 'MIGSYN':
                    this.chooseType=0;
                    this.chooseTypeCrc=this.GLOBAL_CONFIG.callWeldTypeData.migsyn.crcCode;
                    this.chooseTypeName=this.GLOBAL_CONFIG.callWeldTypeData.migsyn.name;
                    // WELD_CONTENT: "DAE60A0316000100000033000100000003000B000000320064000A24445573"
                    content = (item.WELD_CONTENT+"").substring(3,500)//留着6
                    this.broastFromAndroid(this.GLOBAL_CONFIG.testData.migsyn.headc+content,'hisweldlist',this.GLOBAL_CONFIG.TESTFLAG);
                    break;
                case 'MIGMAN':
                    this.chooseType=1;
                    this.chooseTypeCrc=this.GLOBAL_CONFIG.callWeldTypeData.migman.crcCode
                    this.chooseTypeName=this.GLOBAL_CONFIG.callWeldTypeData.migman.name
                    content = (item.WELD_CONTENT+"").substring(3,500)//留着6
                    this.broastFromAndroid(this.GLOBAL_CONFIG.testData.migman.headc+content,'hisweldlist',this.GLOBAL_CONFIG.TESTFLAG);
                    break;
                case 'TIGSYN':
                    this.chooseType=2;
                    this.chooseTypeCrc=this.GLOBAL_CONFIG.callWeldTypeData.tigsyn.crcCode
                    this.chooseTypeName=this.GLOBAL_CONFIG.callWeldTypeData.tigsyn.name
                    content = (item.WELD_CONTENT+"").substring(3,500)//留着6
                    this.broastFromAndroid(this.GLOBAL_CONFIG.testData.tigsyn.headc+content,'hisweldlist',this.GLOBAL_CONFIG.TESTFLAG);
                    break;
                case 'TIGMAN':
                    this.chooseType=3;
                    this.chooseTypeCrc=this.GLOBAL_CONFIG.callWeldTypeData.tigman.crcCode
                    this.chooseTypeName=this.GLOBAL_CONFIG.callWeldTypeData.tigman.name
                    content = (item.WELD_CONTENT+"").substring(3,500)//留着6
                    this.broastFromAndroid(this.GLOBAL_CONFIG.testData.tigman.headc+content,'hisweldlist',this.GLOBAL_CONFIG.TESTFLAG);
                    break;
                case 'MMA':
                    this.chooseType=4;
                    this.chooseTypeCrc=this.GLOBAL_CONFIG.callWeldTypeData.mma.crcCode
                    this.chooseTypeName=this.GLOBAL_CONFIG.callWeldTypeData.mma.name
                    content = (item.WELD_CONTENT+"").substring(3,500)//留着6
                    this.broastFromAndroid(this.GLOBAL_CONFIG.testData.mma.headc+content,'hisweldlist',this.GLOBAL_CONFIG.TESTFLAG);
                    break;
                case 'CUT':
                    this.chooseType=5;
                    this.chooseTypeCrc=this.GLOBAL_CONFIG.callWeldTypeData.cut.crcCode
                    this.chooseTypeName=this.GLOBAL_CONFIG.callWeldTypeData.cut.name
                     // WELD_CONTENT: "DAE60A0316000100000033000100000003000B000000320064000A24445573"
                    content = (item.WELD_CONTENT+"").substring(3,500)//留着6
                    this.broastFromAndroid(this.GLOBAL_CONFIG.testData.cut.headc+content,'hisweldlist',this.GLOBAL_CONFIG.TESTFLAG);
                    break;
                default:
                    break;
            }
            
        },
        testDataFuc(chooseType){
             switch (this.chooseType) {
                case 0:
                
                this.broastFromAndroid(this.GLOBAL_CONFIG.testData.migsyn.headc+this.GLOBAL_CONFIG.testData.migsyn.data,'hisweldlist',this.GLOBAL_CONFIG.TESTFLAG);
                    // this.broastFromAndroid('dac1 00 00 00 00 02 00 003C 003D 00b4 00c8 02 09 5952','hisweldlist',this.GLOBAL_CONFIG.TESTFLAG);
                    break;
                case 1:
                    this.broastFromAndroid(this.GLOBAL_CONFIG.testData.migman.headc+this.GLOBAL_CONFIG.testData.migman.data,'hisweldlist',this.GLOBAL_CONFIG.TESTFLAG);
                    //  this.broastFromAndroid('dac2 00 003D 00c8 00 6283','hisweldlist',this.GLOBAL_CONFIG.TESTFLAG);
                    break;
                case 2:
                    this.broastFromAndroid(this.GLOBAL_CONFIG.testData.tigsyn.headc+this.GLOBAL_CONFIG.testData.tigsyn.data,'hisweldlist',this.GLOBAL_CONFIG.TESTFLAG);
                    //  this.broastFromAndroid('dac3 00 00 03 0064 0064 02 09  8C75','hisweldlist',this.GLOBAL_CONFIG.TESTFLAG);
                    break;
                case 3:
                    //  this.broastFromAndroid(this.GLOBAL_CONFIG.testData.tigman.headc+this.GLOBAL_CONFIG.testData.tigman.data,'hisweldlist',this.GLOBAL_CONFIG.TESTFLAG);
                    this.broastFromAndroid('dac4 08 03 03 23 00 63 4e 00 23 00 64 00 05 30 23 00 549E','hisweldlist',this.GLOBAL_CONFIG.TESTFLAG);
                    break;
                case 4:
                     this.broastFromAndroid(this.GLOBAL_CONFIG.testData.mma.headc+this.GLOBAL_CONFIG.testData.mma.data,'hisweldlist',this.GLOBAL_CONFIG.TESTFLAG);
                    //  this.broastFromAndroid('dac5 82 00 01 09 0064 0064 C54A','hisweldlist',this.GLOBAL_CONFIG.TESTFLAG);
                    break;
                case 5:
                     this.broastFromAndroid(this.GLOBAL_CONFIG.testData.cut.headc+this.GLOBAL_CONFIG.testData.cut.data,'hisweldlist',this.GLOBAL_CONFIG.TESTFLAG);
                    //  this.broastFromAndroid('dac5 82 00 01 09 0064 0064 C54A','hisweldlist',this.GLOBAL_CONFIG.TESTFLAG);
                    break;
                default:
                    break;
            }
            Indicator.close();
        },
        goBack(){
            this.$router.push({path:'/newIndex',query:{}}); 
        },
        formatSeconds(value) { 
                var theTime = parseInt(value);// 需要转换的时间秒 
                var theTime1 = 0;// 分 
                var theTime2 = 0;// 小时 
                var theTime3 = 0;// 天
                if(theTime > 60) { 
                theTime1 = parseInt(theTime/60); 
                theTime = parseInt(theTime%60); 
                if(theTime1 > 60) { 
                theTime2 = parseInt(theTime1/60); 
                theTime1 = parseInt(theTime1%60); 
                if(theTime2 > 24){
                    //大于24小时
                    theTime3 = parseInt(theTime2/24);
                    theTime2 = parseInt(theTime2%24);
                }
                } 
                } 
                var result = '';
                if(theTime > 0){
                result = ""+parseInt(theTime)+"s";
                }
                if(theTime1 > 0) { 
                result = ""+parseInt(theTime1)+"m"+result; 
                } 
                if(theTime2 > 0) { 
                result = ""+parseInt(theTime2)+"h"+result; 
                } 
                if(theTime3 > 0) { 
                result = ""+parseInt(theTime3)+"d"+result; 
                }
                return result; 
        },
        queryAppWeldList(){
            this.loginName = localStorage.getItem("wtl_login_email") || '';
            if(this.loginName){
                let param = {
                    BT_ADDRESS:this.btAddress || '四合一地址',
                    APP_UUID:this.userUuid,
                    EMAIL:this.loginName
                };
                InterfaceService.queryAppWeldInfoList(param,(data)=>{
                    if(data.respData && data.respData.respCode=='0000'){
                        this.weldMsgList=data.respData.msgList;
                        this.weldMsgList.forEach(element => {
                            // element.FORMAT_COST_TM=this.formatSeconds(102000);
                            element.FORMAT_COST_TM=element.COST_TM+'s';
                        });
                    }else{
                        
                    }
                },function(data){
                });
            }
        }
  },
  mounted: function () {
        window['broastHistoryFromAndroid'] = (data) => {
        this.wtlLog('hisweldlist','broastHistoryFromAndroid='+data);
        
          this.broastFromAndroid(data,this.GLOBAL_CONFIG.TESTFLAG);
      }
      this.nowConnectMachine = this.$store.state.nowConnectMachine;
    //禁止返回键
    // window.history.pushState(null, null, "#");
    // window.addEventListener("popstate", function(e) {
    //   window.history.pushState(null, null, "#");
    // })
    if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.goBack, false);
    }
   
    this.queryAppWeldList();
  },
  created () {
   
  },
  computed:{
    envType(){
        return this.$store.state.envType;
    },
    isModbusModal(){
      return this.$store.state.isModbusModal;
    },
    userUuid(){
        return this.$store.state.userUuid;
    },
    btAddress(){
        return this.$store.state.btAddress;
    },
    netWorkStatus(){
        // this.$store.state.netWorkStatus='online';
        return this.$store.state.netWorkStatus;
    }
  },destroyed(){
    this.isLoading=false;
    clearTimeout(this.loadingTimer);
    window.removeEventListener('popstate', this.goBack, false);
  }
}
</script>
<style lang="scss" scoped>
.hisWeldList{
  padding-top: 100px;
  width: 100%;
  height: 100vh;
  background: -webkit-linear-gradient(to top,#002c3a,#174d60);
  background: -o-linear-gradient(to top,#002c3a,#174d60);
  background: -moz-linear-gradient(to top,#002c3a,#174d60);
  background: -mos-linear-gradient(to top,#002c3a,#174d60);
  background: linear-gradient(to top,#002c3a,#174d60);
  .header{
    position: relative;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    text-align: left;
    color: #fff;
    background: #010101;
    padding-left: 60px;
    .ivu-icon{
      font-size: 20px;
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translate(0,-50%)
    }
  }
   &.env_ios_gClass{
       /deep/ .header{
       .ivu-icon{
            top:30px!important;
        }
      }
  }
  .maginname{
    //   background: #1a4759;
      color: #fff;
      font-size: 16px;
      height: 70px;
      line-height: 70px;
      margin: 0 20px;
      margin-top: 10px;
      padding-left: 15px;
    //   border-bottom: 1px solid #eee;
     background: linear-gradient(
        to top,
        rgba(24, 65, 81, 1) 0%,
        rgba(27, 72, 90, 1) 20%,
        rgba(26, 71, 89, 1) 50%,
        rgba(27, 72, 90, 1) 80%,
        rgba(57, 97, 113, 1) 90%,
        rgba(24, 65, 81, 1) 100%
        );
         border-left: 1px solid;
          border-right: 1px solid;
          
        -webkit-border-image: -webkit-linear-gradient(to right,#2f4e59 , #8ac5d6 , #2f4e59)1 10 1; /* 控制边框颜色渐变 */
         border-image: linear-gradient(to right,#2f4e59 , #8ac5d6 , #2f4e59)1 10 1; /* 标准的必须写在最后 */
  }
  .hislist{
      .listName{
          color: #8ac5d6;
          padding-left: 20px;
          font-size: 14px;
      }
      .modbusLi{
          margin-top: 10px;
        //   height: calc(100vh - 150px);
          overflow: auto;
          .m_word{
              padding: 0 20px;
              text-align: center;
              color: #8ac5d6;
              &.login{
                  text-decoration:underline
              }
          }
      }
      .li{
          padding-left: 15px;
          background: #0f3a44;
          color: #6d9dae;
          height: 70px;
          margin: 0 20px;
          border-bottom: 2px solid;
          
        -webkit-border-image: -webkit-linear-gradient(to right,#2f4e59 , #8ac5d6 , #2f4e59)1 10 1; /* 控制边框颜色渐变 */
         border-image: linear-gradient(to right,#2f4e59 , #8ac5d6 , #2f4e59)1 10 1; /* 标准的必须写在最后 */
        color:white;
    //       -moz-box-shadow: 0px 0px 2px 1px #103f4b;
    //   -webkit-box-shadow: 0px 0px 2px 1px #103f4b;
    //   box-shadow: 0px 0px 2px 1px #103f4b;
        background: linear-gradient(
        to top,
        rgba(43, 81, 91, 1) 0%,
        rgba(21, 55, 67, 1) 20%,
        rgba(5, 43, 56, 1) 50%,
        rgba(21, 55, 67, 1) 80%,
        rgba(43, 81, 91, 1) 100%
        );
          .typename{
              height: 70px;
              line-height: 70px;
              font-size: 20px;
            //   padding: 10px 0;
              position: relative;
              .ivu-icon{
                  position: absolute;
                  right: 20px;
                  top:50%;
                  transform: translate(50%,-50%)
              }
             
          }
          .modbusTypename{
              position: relative;
              font-size: 20px;
              height: 70px;
               .modelName{
                    font-size: 14px;
                    display: inline-block;
                    padding: 25px 0;
                    position: absolute;
                    right: 45px;
                    top:50%;
                    transform: translate(50%,-50%)
              }
               .ivu-icon{
                  position: absolute;
                  right: 10px;
                  top:50%;
                  transform: translate(50%,-50%)
              }
          }
          .rightBox{
                display: inline-block;
                font-size: 12px;
                line-height: 12px;
                position: absolute;
                left: 107px;
                top: 50%;
                transform: translate(-50%, -50%);
                .beginTime{
                    width: 210px;
                    color: #8ac5d6;
                }
                .timelength{
                    color: #8ac5d6;
                    padding-top: 5px;
                }
                .modelClass{
                    color: #8ac5d6;
                    padding-top: 5px;
                }
                
          }
          
      }
     
  }
}
/* x xs */
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
   // iphoneX iphoneXS样式
  
    .hisWeldList  .header{
        height: 65px;
        line-height: 1;
        padding-top: 30px;
        .ivu-icon{
            top:37px;
        }
    }
}
/* xr */
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {
   .hisWeldList  .header{
        height: 65px;
        line-height: 1;
        padding-top: 30px;
        .ivu-icon{
            top:37px;
        }
    }
}
/* xs max */
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
   // iphoneX iphoneXS样式
    .hisWeldList  .header{
        height: 65px;
        line-height: 1;
        padding-top: 30px;
        .ivu-icon{
            top:37px;
        }
    }
}
</style>
