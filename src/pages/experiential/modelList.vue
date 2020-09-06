<template>
  <div class="modelList">
       <div class="header">
            <div class="licon" @click="go('/newIndex')">
                    <span></span>
            </div>
            back
      </div>
       <ul class="mListContain">
            <li v-for="(item,index) in mList" class="m-li" :key="index">
                 <div class="m-b"  @click="goWelding(item.typeName)">Go To {{item.typeShowName}} Welding Experience</div>
            </li>
    </ul>
  </div>
</template>

<script>
//引入远程访问service

export default {
  name: 'modelList',
  components: {
   
  },
  data () {
    return {
        mList:[
            {typeName:'migman',typeShowName:'MIG MAN',weldingCur:'',weldingVoltage:''},
            {typeName:'migsyn',typeShowName:'MIG SYN',weldingCur:'',weldingVoltage:''},
            {typeName:'tigman',typeShowName:'TIG MAN',weldingCur:'',weldingVoltage:''},
            {typeName:'tigsyn',typeShowName:'TIG SYN',weldingCur:'',weldingVoltage:''},
            {typeName:'mma',typeShowName:'MMA',weldingCur:'',weldingVoltage:''}
        ]
     } 
  },

  methods: {
    goWelding(typeName){  
        // this.$router.push({path:'/welding',query:{}});
        console.log(this.GLOBAL_CONFIG.TESTFLAG+'typeName::'+typeName)
        if(this.GLOBAL_CONFIG.TESTFLAG){
            var  data ='';
            //焊接中....migsyn
           if(typeName=='migsyn'){
                data ='DAB1 0100 0200 8658';
                // this.weldBuildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.migsyn.crcCode,this.GLOBAL_CONFIG.testWeldingData.migsyn.data.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
           }else if(typeName=='migman'){
               //焊接中....migman
                data ='DAB2 0000 0000 1A1C';
                // this.weldBuildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.migman.crcCode,this.GLOBAL_CONFIG.testWeldingData.migman.data.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "")); 
           }else if(typeName=='tigsyn'){
                 //焊接中....tigsyn
                // data ='DAB3 0000 0000 DA21';
                data ='DAB3F901DF00B618';
                // this.weldBuildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.tigsyn.crcCode,this.GLOBAL_CONFIG.testWeldingData.tigsyn.data.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
           }else if(typeName=='tigman'){
                //焊接中....tigman
                  data ='DAB4 0000 0000 1A94';
                // this.weldBuildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.tigman.crcCode,this.GLOBAL_CONFIG.testWeldingData.tigman.data.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
           }else{
                //焊接中....mma
                  data ='DAB5 0000 0000 DAA9';
                // this.weldBuildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.mma.crcCode,this.GLOBAL_CONFIG.testWeldingData.mma.data.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
           }
           
            // setTimeout(() => {
              this.buildWeldingData(data);
            // }, 2000);
        }
    },
    go(url) {
      this.$store.state.routerOprete=10;
      this.$router.push(url);
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
            if(this.envType=='env_ios'){
              this.callSendDataToBleUtil('newIndex','DA00'+oldCrc+this.crcModelBusClacQuery('00'+oldCrc, true),oldCrc);
            }else{
              window.android.callSendDataToBle('newIndex','DA00'+oldCrc+this.crcModelBusClacQuery('00'+oldCrc, true),oldCrc);
            }
            return;
        }
        //发送确认秦请求
        
        if(!this.GLOBAL_CONFIG.TESTFLAG){
          //  alert(111)
            window.android.callSendDataToBle('newIndex','DAFF'+oldCrc+this.crcModelBusClacQuery('FF'+oldCrc, true),oldCrc);
        } 
        //有空的情况
        // this.$store.state.getWeldingInfoTimes = this.$store.state.getWeldingInfoTimes?this.$store.state.getWeldingInfoTimes:0+1;
        this.wtlLog('layout','getWeldingInfoTimes='+this.$store.state.getWeldingInfoTimes);
        this.$store.state.getWeldingInfoTimes = (this.$store.state.getWeldingInfoTimes || 0)+1;
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
        console.log('this.$store.state.getWeldingInfoTime'+this.$store.state.getWeldingInfoTime)
  
          //11、且当前模式也自动返回了相关数据
          // alert(JSON.stringify(this.$store.state.rstInfo))
          if(JSON.stringify(this.$store.state.rstInfo) != "{}"){
            //22、是不是焊接中的数据
            this.wtlLog('layout','weldStatus='+this.$store.state.rstInfo.initBean.weldStatus);
            console.log('this.$store.state.rstInfo.initBean.weldStatus'+this.$store.state.rstInfo.initBean.weldStatus);
            // alert("aa:"+this.$store.state.weldingStatus)
             if(this.$store.state.weldingStatus==1){
                this.$router.push('/welding');
             }else{
                this.$router.push('/welding');
             }
          }
      },
  },
  mounted: function () {
    //模拟模式 welding的状态应该重置
    this.$store.state.weldingStatus==0;
    this.$store.state.getWeldingInfoTimes=0;
  },
  created () {
   
  },
  computed:{
       envType(){
         return this.$store.state.envType;
       }
  }
}
</script>

<style lang="scss" scoped>
.modelList{
     width: 100%;
   min-height: 100vh;
   background: #053342;
   .header{
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
        //   padding-left: 45px;
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
}
</style>
