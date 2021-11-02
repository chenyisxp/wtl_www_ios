<template>
    <div class="testPage">
         <div class="wrapper">
            <p>Your website content here.</p>
            <div class="push"></div>
        </div>
        <div class="footer">
            <p @click="doCrcCheck">Copyright (c) 2008</p>
            <div class="btn" @click="go('/weld_common?type=MIGSYN')">go--mig-syn</div>
            <div class="btn" @click="go('/weld_common?type=MIGMAN')">go--mig-man</div>
            <div class="btn" @click="go('/weld_tig_syn')">go--tig-syn</div>
            <div class="btn" @click="go('/weld_tig_man')">go--tig-man</div>
            <div class="btn" @click="gogo()">go-mma</div>
        </div>
    </div>
</template>

<script>
import utils from '../lib/util'
export default {
  data() {
    return {
     
    };
  },
  methods: {
    doCrcCheck(){
        // alert(this.crcModelBusClacQuery('12 34 56 78'));
    }  ,
    go(url){
       this.$router.push(url);
    },
    gogo(){
        this.go('/weld_mma?type='+'MMA');
    }
  },
  mounted() {
    //1、crc校验
    var newData ='12345678';
    // console.log(this.crcModelBusClacQuery(newData));
    //2、转16进制
    var num = 0x00+'';
    console.log(num.toString(10).toString(2));//输出FF
    console.log(parseInt('00',16).toString(2))
    console.log((Array(8).join('0') + parseInt('01',16).toString(2)).slice(-8))
    //切割成1位
    console.log((Array(8).join('0') + parseInt('01',16).toString(2)).slice(-8).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' '))
    //3、公共数据处理  加空格同时去除首位空格 
    // dae1000000000002050a 0f 14 c8 01 0c 02 06
    // 
    // var rst =this.buildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.migsyn.crcCode,'DA E1 43 04 00 04 06 A5 00 28 00 28 00 C8 00 C8 02 0D EA F8'.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
    // var rst =this.buildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.migsyn.crcCode,'DA E1 00 04 00 04 05 A5 00 28 00 28 00 C8 00 C8 00 0D BAFB'.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
    // var rst =this.buildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.migsyn.crcCode,'dae1 00 00 00 00 02 00 003C 003D 00b4 00c8 02 09 5952'.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
    // var rst =this.buildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.migman.crcCode,'dae2 00 003D 00c8 00 6283'.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
    // var rst =this.buildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.tigsyn.crcCode,'dae3 00 00 03 0064 0064 02 09  8C75'.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
    var rst =this.buildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.mma.crcCode,'dae5 82 00 01 09 0064 0064 C54A'.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
    // var rst =this.buildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.tigman.crcCode,'dae4 00 c0 32 0032 32 0032 0032 03e8 32 32 0032 32 50 23 4CCA'.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
    // var rst =this.buildData('newIndex','',data.replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
    // console.log(rst)
    //4、正则每隔两个字符加个空格
    // console.log(newData.replace(/(.{2})/g,'$1 '))
    //5、测试来自安卓的消息
    console.log(JSON.stringify(this.$store.state.rstInfo));
    // console.log()
  // console.log(this.crcModelBusClacQuery('122', true))
  },created () {
   
  
  }
};
</script>

<style lang="scss" scoped>
* {
margin: 0;
}

html, body {
height: 100%;
}

.wrapper {
min-height: 100%;
height: auto !important;
height: 100%;
margin: 0 auto -4em;
width: 100%;
}

.footer, .push {
height: 4em;
}
.btn{
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  color:blue;
  background:greenyellow;
  margin: 10px 20px;
  text-align: center;

}
</style>

