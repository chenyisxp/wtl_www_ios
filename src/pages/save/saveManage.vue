<template>
  <div class="saveManage">
   <div class="header">
       <div class="licon" @click="goback">
            <span></span>
      </div>
     BACK</div>
   <ul class="mListContain">
        <li v-for="(item,index) in mList" class="m-li" :key="index">
           <div class="m-b" :class="'b-'+index" @click="goDetail(item.mid,item.remarksTtile)">{{item.remarksTtile}}</div>
        </li>
   </ul>
   <Loading :is-loading="isLoading"></Loading>
  </div>
</template>

<script>
import { CellSwipe ,Indicator,Toast} from "mint-ui";
import Loading from "@/components/base/Loading";
import index from '../../store';
export default {
  name: "",
  components: {Loading},
  data() {
    return {
      pageFrom:'',
      LoadingTimer:{},
      isLoading:false,
       mList:
            [
              {
                mid:1,
                remarksTtile:'',
              },
              {
                mid:2,
                remarksTtile:'',
              },
              {
                mid:3,
                remarksTtile:'',
              },
              {
                mid:4,
                remarksTtile:'',
              },
              {
                mid:5,
                remarksTtile:'',
              },
              {
                mid:6,
                remarksTtile:'',
              },
              {
                mid:7,
                remarksTtile:'',
              },
              {
                mid:8,
                remarksTtile:'',
              },
              {
                mid:9,
                remarksTtile:'',
              },
            ],
            nowChooseId:'',
            remarksText:'',
            querSendData:'',
            queryCrc:''
    };
  },

  methods: {
    goback(){
      this.$store.state.routerOprete=4;
      if(this.pageFrom){
        this.$router.push(this.pageFrom);
      }else{
        this.$router.push('/newIndex');
      }
    },
    go(url) {
      this.$router.push(url);
    },
    getTtile(index) {
      return "M" + (index + 1);
    },
    goDetail(mid,remarksText){
        this.$store.state.routerOprete=4;
        this.isLoading=true;
        this.LoadingTimer =setTimeout(() => {
          if(this.isLoading){
             this.isLoading=false;
          }
        }, 11000);
        this.remarksText =remarksText;
        // console.log('this.remarksText'+this.remarksText)
        this.nowChooseId =mid;
        var dirctCode = this.getDirective('CALL_MEMORY','CALL_MEMORY');
        // var num = (Array(4).join('0') + parseInt(mid,10).toString(16)).slice(-4);
        let num = this.jinzhiChangeFuc(mid);
        var crc =this.crcModelBusClacQuery(dirctCode+num, true);
        var sendData ="DA"+dirctCode+num+crc;
        console.log('sendData'+sendData);
        //测试开关
        if(this.GLOBAL_CONFIG.TESTFLAG){
          this.testDataBuildFuc(mid+'');
        }else{
          this.querSendData=sendData;
          this.queryCrc=crc;
          this.callSendDataToBleUtil('saveManage',sendData,crc);
        }
    //  this.$router.push({path:'/memoryDetail',query:{mid:mid}});
    },
    //for android 给安卓用的方法 begin
    broastFromAndroid(data,pageFrom,index,openTestFlag){
      
          this.isLoading=false;
          clearTimeout(this.LoadingTimer)
          //去除空格 截取出通道号
          data = data.replace(/\s+/g,"");
          var pupnum =data.substring(4,6);//通道号
            //左补零
          pupnum=parseInt(pupnum,16).toString(2)
          pupnum =(Array(8).join(0) + pupnum).slice(-8);;
          pupnum =parseInt(pupnum.substring(1,7),2);
          // var newData=data.substring(0,4)+data.substring(6,data.length);
          let newData =data;
         
          //返回的通道数不一致
          // console.log(pupnum+'||||'+index+'');
          this.wtlLog('weld_saveMange_manage',"pupnum="+pupnum+',index='+index+',newData'+newData);
          if(parseInt(pupnum)!=index){
            Toast({
              message: 'Inconsistent number of channels for response',
              position: 'middle',
              iconClass: 'icon icon-success',
              duration: 1500
            });
            return;
          }
          //判断是来自哪个模式数据 d1 d2 判断
          var tmpRstcrc =this.rstModelType(data);
          if(tmpRstcrc==0){
             Toast({
                message: 'error data',
                position: 'middle',
                iconClass: 'icon icon-success',
                duration: 1500
              });
            return;
          }
          //清空否则有缓存
          this.$store.state.memoryInfo={};
          console.log('newData:::::'+newData);
          var rst =this.buildData('memory',tmpRstcrc.crcCode,newData.replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
          console.log("mammama:"+rst)
          this.wtlLog('weld_saveMange_manage',"rst="+JSON.stringify(rst),'');
          if(JSON.stringify(rst) != "{}"){
              //发送确认收到的指令给安卓
              var invalue =data.substring(data.length-4,data.length);
              //新规则: 指令ff+crc+检验crc
          
              if(!openTestFlag){
                  if(this.envType=='env_ios'){
                    this.callSendDataToBleUtil('newIndex','DAFF'+invalue+this.crcModelBusClacQuery('FF'+invalue, true),invalue)
                  }else{
                      window.android.callSendDataToBle('newIndex','DAFF'+invalue+this.crcModelBusClacQuery('FF'+invalue, true),invalue); 
                  }
                  
              }
                // alert(JSON.stringify(this.$store.state.rstInfo))
              this.$router.push({path:'/saveDetail',query:{
                  modelCrc:tmpRstcrc.crcCode,
                  name:tmpRstcrc.name,
                  pupnum:index,
                  remarksText:this.remarksText,
                  querSendData:this.querSendData,
                  queryCrc:this.queryCrc
                }});
          } 
    },
    rstModelType(data){
      switch (data.substring(2,4).toLocaleUpperCase()) {
        case 'D1':
          return this.GLOBAL_CONFIG.callWeldTypeData.migsyn;
          break;
        case 'D2':
          return this.GLOBAL_CONFIG.callWeldTypeData.migman;
          break;
        case 'D3':
          return this.GLOBAL_CONFIG.callWeldTypeData.tigsyn;
          break;
        case 'D4':
          return this.GLOBAL_CONFIG.callWeldTypeData.tigman;
          break;
        case 'D5':
          return this.GLOBAL_CONFIG.callWeldTypeData.mma;
          break;
        default:
        return 0;
          break;
      }
    },
    testDataBuildFuc(index){
          //存储的byte0字节是个通道 序号
          switch (index) {
            case '1':
                // this.broastFromAndroid('dad1 02 04 01 04 0a a5 4600 4600 f000 f000 020a ae3c','hisweldlist',index,this.GLOBAL_CONFIG.TESTFLAG);
                this.broastFromAndroid('dad1 82 04 01 03 07 35 4600 4900 e100 a600 0208 95d0','hisweldlist',index,this.GLOBAL_CONFIG.TESTFLAG);//save不能显示
                break;
            case '2':
                this.broastFromAndroid('dad2 02 00 3D00 c800 00 7503','hisweldlist',index,this.GLOBAL_CONFIG.TESTFLAG);
                break;
            case '3':
                                        //dae3 82 00 05 41 0041 0002 082c 00 8529
                  this.broastFromAndroid('dad3 06 00 05 00 0041 0000 0000 e1  4c39','hisweldlist',index,this.GLOBAL_CONFIG.TESTFLAG);
                // this.broastFromAndroid('dad3 03 00 00 03 6400 6400 0209  1EB4','hisweldlist',index,this.GLOBAL_CONFIG.TESTFLAG);
                break;
            case '4':
                  this.broastFromAndroid('dad4 04 00 c0 32 3200 32 3200 3200 e800 32 32 3200 32 50 23 5FAD','hisweldlist',index,this.GLOBAL_CONFIG.TESTFLAG);
                break;
            case '5':
                  this.broastFromAndroid('dad5 05 82 00 01 09 6400 6400 872E','hisweldlist',index,this.GLOBAL_CONFIG.TESTFLAG);
                break;
            case '6':
                  this.broastFromAndroid('dad5 06 82 00 01 09 6400 6400 872E','hisweldlist',index,this.GLOBAL_CONFIG.TESTFLAG);
                break;
            case '7':
                  this.broastFromAndroid('dad5 07 82 00 01 09 6400 6400 872E','hisweldlist',index,this.GLOBAL_CONFIG.TESTFLAG);
                break;
            case '8':
                  this.broastFromAndroid('dad5 08 82 00 01 09 6400 6400 872E','hisweldlist',index,this.GLOBAL_CONFIG.TESTFLAG);
                break;
            case '9':
                  this.broastFromAndroid('dad5 09 82 00 01 09 6400 6400 872E','hisweldlist',index,this.GLOBAL_CONFIG.TESTFLAG);
                break;
            default:
                break;
        }
        Indicator.close();
    }
  },
  mounted: function() {
   
    if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.goBack, false);
    } 
    let self =this;
    self.pageFrom = self.$route.query.pageFrom;
    self.$store.state.nowModelDirectice='';//置空
    //禁止返回键
    // window.history.pushState(null, null, "#");
    // window.addEventListener("popstate", function(e) {
    //   window.history.pushState(null, null, "#");
    // })
    
  
    //TODO 读取九个通道在安卓里的备注名
    //1、请求九个通道数据 默认每个通道都有值
    window['broastMemoryFromAndroid'] = (data,pageFrom) => {
        //  alert(data)
        self.wtlLog('saveManage','broastHistoryFromAndroid='+data);
        self.broastFromAndroid(data,pageFrom,self.nowChooseId,self.GLOBAL_CONFIG.TESTFLAG);
    }
    // this.buildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.migsyn.crcCode,'dae1 00 00 00 00 02 00 003C 003D 00b4 00c8 02 09 5952'.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
    var newString="";
    if(this.GLOBAL_CONFIG.TESTFLAG ||this.GLOBAL_CONFIG.DEVELOPERMODEFLAG ){
      // newString ="test_m_1||||test_m_2||||test_m_3||||test_m_41||||test_m_5||||test_m_6||||test_m_7||||test_m_8||||test_m_9";
      newString="";
    }else{
      if(envType=='env_ios'){
        this.callMemoryRemarks.forEach((element,i) => {
          if(i<9){
             this.mList[i].remarksTtile=element.remarkInfo || '';
          }
        });
      }else{
        newString =  window.android.callMemoryRemarks();
        var remarksList =(newString+'').split('||||');
        for(var i=0;i<9;i++){
          this.mList[i].remarksTtile=remarksList[i] || '';
        }
      }
    }
   
  },
  created() {
    //模拟请求安卓完成 九个通道别名的获取
   
  },
  computed: {
    envType(){
      return this.$store.state.envType;
    },
    callMemoryRemarks(){
      return this.$store.state.callMemoryRemarks
    }
  },
  destroyed(){
    this.isLoading=false;
    clearTimeout(this.LoadingTimer);
    window.removeEventListener('popstate', this.goBack, false);
  }
};
</script>
<style lang="scss" scoped>
.saveManage {
   width: 100%;
   min-height: 100vh;
   background: #053342;
  .header {
    position: relative;
    height: 50px;
    line-height: 50px;
    font-size: 20px;
    text-align: left;
    color: #fff;
    background: #010101;
    .licon{
        width: 40px;
        height: 100%;
        float: left;
        padding-left: 40px;
        span{
                position: absolute;
                left: 10px;
                top: 0;
                content: '';
                display: inline-block;
                width: 13px;
                height: 13px;
                border-top: 1px solid #fff;
                border-right: 1px solid #fff;
                top: 50%;
                -ms-transform: translate(50%, 0) rotate(45deg);
                transform: translate(50%, 0) rotate(45deg);
                -webkit-transform: translateY(-50%) rotate(225deg);
        }
    }
    
  }
  .m-li{
        color: #839baa;
        height: 40px;
        line-height: 40px;
        margin: 20px 20px;
        border-radius: 2px;
        background: linear-gradient( 
            to top,
            rgba(10,59,70,1) 0%,  
            rgba(2,46,56,1) 50%,
            rgba(10,59,70,1)  100%);
           -moz-box-shadow:0px 0px 2px 1px #103f4b;
          -webkit-box-shadow:0px 0px 2px 1px #103f4b;
          box-shadow:0px 0px 2px 1px #103f4b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding-right: 20px;
          padding-left: 10px;
        .rid{
            padding:0 25px;
            margin-right: 20px;
        }
        position: relative;
        .m-b{
          height: 40px;;
          padding-right:20px;
          padding-left: 45px;
          white-space:nowrap; text-overflow:ellipsis; -o-text-overflow:ellipsis; overflow:hidden;
          
        }
        .m-b.b-0{
           background:url(../../assets/images/m1.png) no-repeat;
           background-size: 26px;
          background-position:left center;
          background-position-x: 10px;    
        }
         .m-b.b-1{
           background:url(../../assets/images/m2.png) no-repeat;
           background-size: 26px;
          background-position:left center;
          background-position-x: 10px;    
        }
         .m-b.b-2{
           background:url(../../assets/images/m3.png) no-repeat;
           background-size: 26px;
          background-position:left center;
          background-position-x: 10px;    
        }
         .m-b.b-3{
           background:url(../../assets/images/m4.png) no-repeat;
           background-size: 26px;
          background-position:left center;
          background-position-x: 10px;    
        }
         .m-b.b-4{
           background:url(../../assets/images/m5.png) no-repeat;
           background-size: 26px;
          background-position:left center;
          background-position-x: 10px;    
        }
         .m-b.b-5{
           background:url(../../assets/images/m6.png) no-repeat;
           background-size: 26px;
          background-position:left center;
          background-position-x: 10px;    
        }
         .m-b.b-6{
           background:url(../../assets/images/m7.png) no-repeat;
           background-size: 26px;
          background-position:left center;
          background-position-x: 10px;    
        }
         .m-b.b-7{
           background:url(../../assets/images/m8.png) no-repeat;
           background-size: 26px;
          background-position:left center;
          background-position-x: 10px;    
        }
         .m-b.b-8{
           background:url(../../assets/images/m9.png) no-repeat;
           background-size: 26px;
          background-position:left center;
          background-position-x: 10px;    
        }
        
  }
  .m-li::after{
      position: absolute;
      right: 10px;
      top:0;
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      border-top: 1px solid #3a6373;
      border-right: 1px solid #3a6373;
      top: 50%;
      transform: translate(50%,0) rotate(45deg);
      -webkit-transform: translateY(-50%) rotate(45deg);
  }
  .mListContain{
      // margin:  0 20px;
  }
}
</style>
