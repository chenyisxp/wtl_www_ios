<template>
  <div class="memoryManage">
   <div class="header">
       <div class="licon" @click="go('back')">
            <span></span>
      </div>
     BACK</div>
   <ul class="mListContain">
        <li v-for="(item,index) in mList" class="m-li">
           <div class="m-b" :class="'b-'+index" @click="goDetail(item.mid,item.remarksTtile)">{{item.remarksTtile}}</div>
        </li>
   </ul>
    <Loading :is-loading="isLoading"></Loading>
  </div>
</template>

<script>
import { CellSwipe ,Toast} from "mint-ui";
import Loading from "@/components/base/Loading";
export default {
  name: "",
  components: {Loading},
  data() {
    return {
      isLoading:false,
       mList:
            [
              {
                mid:1,
                remarksTtile:'None ',
              },
              {
                mid:2,
                remarksTtile:'None',
              },
              {
                mid:3,
                remarksTtile:'None',
              },
              {
                mid:4,
                remarksTtile:'None',
              },
              {
                mid:5,
                remarksTtile:'None',
              },
              {
                mid:6,
                remarksTtile:'None',
              },
              {
                mid:7,
                remarksTtile:'None',
              },
              {
                mid:8,
                remarksTtile:'None',
              },
              {
                mid:9,
                remarksTtile:'None',
              },
            ],
            nowChooseId:'',
            remarksText:'',
            nowModalTypeId:''
    };
  },

  methods: {
    go(url) {
      this.$store.state.routerOprete=6;
      if(url=='back'){
        // this.$router.go(-1);
        this.$router.push({path:'/newIndex',query:{}}); 
      }else{
        this.$router.push(url);
      }
      
    },
    getTtile(index) {
      return "M" + (index + 1);
    },
    goDetail(mid,remarksText){
        this.$store.state.routerOprete=6;
        this.isLoading=true;
        this.remarksText =remarksText;
        this.nowChooseId =mid;
        var dirctCode = this.getDirective('CALL_MEMORY','CALL_MEMORY');
        var num = (Array(4).join('0') + parseInt(mid,10).toString(16)).slice(-4);
        var crc =this.crcModelBusClacQuery(dirctCode+num, true);
        var sendData ="DA"+dirctCode+num+crc;
        //测试开关
        if(this.GLOBAL_CONFIG.TESTFLAG){
            this.testDataBuildFuc(mid);
        }else{
             this.callSendDataToBleUtil('save_mannage',sendData,crc);
            // window.android.callSendDataToBle('memoryManage',sendData,crc);
        }
    //  this.$router.push({path:'/memoryDetail',query:{mid:mid}});
    },
    //for android 给安卓用的方法 begin
    broastFromAndroid2(data,index,openTestFlag){
          this.isLoading =false;
          //去除空格 截取出通道号
          data = data.replace(/\s+/g,"");
          var pupnum =data.substring(4,6);//通道号
          var newData=data.substring(0,4)+data.substring(6,data.length);
          //返回的通道数不一致
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
          var rst =this.buildData('memory',tmpRstcrc.crcCode,newData.replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
          console.log(rst)
          if(JSON.stringify(rst) != "{}"){
             this.isLoading=false;
              //发送确认收到的指令给安卓
              var invalue =data.substring(data.length-4,data.length);
              //新规则: 指令ff+crc+检验crc
              // if(!openTestFlag){
              //     window.android.callSendDataToBle('newIndex','DAFF'+invalue+this.crcModelBusClacQuery('FF'+invalue, true),invalue); 
              // }
              this.callSendDataToBleUtil('save_mannage','DAFF'+invalue+this.crcModelBusClacQuery('FF'+invalue, true),invalue);
              
              this.$router.push({path:'/saveDetail',query:{modelCrc:tmpRstcrc.crcCode,name:tmpRstcrc.name,modelKey:tmpRstcrc.modelKey,pupnum:index,remarksText:this.remarksText,nowModalTypeId:this.nowModalTypeId}});
          }else{
             this.isLoading=false;
             
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
            case 1:
                this.broastFromAndroid2('dad1 01 00 00 00 00 02 00 3C00 3D00 b400 c800 02 09 4956',index,this.GLOBAL_CONFIG.TESTFLAG);
                break;
            case 2:
                this.broastFromAndroid2('dad2 02 00 3D00 c800 00 7503',index,this.GLOBAL_CONFIG.TESTFLAG);
                break;
            case 3:
                this.broastFromAndroid2('dad3 03 00 00 03 6400 6400 02 09  1EB4',index,this.GLOBAL_CONFIG.TESTFLAG);
                break;
            case 4:
                  this.broastFromAndroid2('dad4 04 00 c0 32 3200 32 3200 3200 e800 32 32 3200 32 50 23 5FAD',index,this.GLOBAL_CONFIG.TESTFLAG);
                break;
            case 5:
                  this.broastFromAndroid2('dad5 05 82 00 01 09 0064 0064 872E',index,this.GLOBAL_CONFIG.TESTFLAG);
                break;
            case 6:
                  this.broastFromAndroid2('dad5 06 82 00 01 09 0064 0064 872E',index,this.GLOBAL_CONFIG.TESTFLAG);
                break;
            case 7:
                  this.broastFromAndroid2('dad5 07 82 00 01 09 0064 0064 872E',index,this.GLOBAL_CONFIG.TESTFLAG);
                break;
            case 8:
                  this.broastFromAndroid2('dad5 08 82 00 01 09 0064 0064 872E',index,this.GLOBAL_CONFIG.TESTFLAG);
                break;
            case 9:
                  this.broastFromAndroid2('dad5 05 82 00 01 09 6400 6400 872E',index,this.GLOBAL_CONFIG.TESTFLAG);
                break;
            default:
                break;
        }
    } ,goBack(){
            this.$router.push({path:'/newIndex',query:{}}); 
        }
  },
  mounted: function() {
    let self =this;
    self.nowModalTypeId =self.$route.query.nowModalTypeId;//模式id
    //TODO 读取九个通道在安卓里的备注名
    // //1、请求九个通道数据 默认每个通道都有值
    window['broastMemoryFromAndroid'] = (data) => {
        self.wtlLog('saveManage','broastMemoryFromAndroid='+data);
        //  alert(data)
        self.broastFromAndroid2(data,self.nowChooseId,self.GLOBAL_CONFIG.TESTFLAG);
    }
    // this.buildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.migsyn.crcCode,'dae1 00 00 00 00 02 00 003C 003D 00b4 00c8 02 09 5952'.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
     if (window.history && window.history.pushState) {
       history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.goBack, false);
    } 
  },
  created() {
    //模拟请求安卓完成 九个通道别名的获取
    var newString="";
    if(this.GLOBAL_CONFIG.DEVELOPERMODEFLAG){
      newString ="a||||b||||c||||v||||a||||a||||c||||v||||a||||a";
    }else{
      newString =  window.android.callMemoryRemarks();
    }
    var remarksList =(newString+'').split('||||');
    for(var i=0;i<this.mList.length;i++){
      this.mList[i].remarksTtile=remarksList[i];
    }
  },
  computed: {},
  destroyed(){
    window.removeEventListener('popstate', this.goBack, false);
  }
};
</script>
<style lang="scss" scoped>
.memoryManage {
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
        .rid{
            padding:0 25px;
            margin-right: 20px;
        }
        position: relative;
        .m-b{
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
