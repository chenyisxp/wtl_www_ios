<template>
    <div class="developerManage">
      <div class="contain">
            <!-- <input type="text" class="copyObj"  value="我是要复制的内容" id="copyObj" /> -->
            <!-- <div  class="copyObj"  value="我是要复制的内容" id="copyObj" @click="copyArticle">我是要复制</div> -->
            <!-- <input class="mm_input db" readonly type="text" id="psd" value="">
            <span style="cursor: pointer;width: 45px;height: 20px;line-height: 22px;color: #fff;background: #a32d2b;display: inline-block;
            text-align: center;font-size: 10px;margin-left: 2px;" class="copy" @click="copyPsd()">复制</span> -->
            <ul class="d-ul">
                <li class="d-li">
                    <div class="lf">体验者模式开关</div>
                    <div class="rt">
                        <i-switch @on-change="changeTestFlag" :value="TESTFLAG" size="large">
                            <span slot="open">ON</span>
                            <span slot="close">OFF</span>
                        </i-switch>
                    </div>
                </li>
                <li class="d-li">
                    <div class="lf">日志开关</div>
                    <div class="rt">
                        <i-switch @on-change="changeLogFlag" :value="LOGFLAG"  size="large">
                            <span slot="open">ON</span>
                            <span slot="close">OFF</span>
                        </i-switch>
                    </div>
                </li>
                  <li class="d-li">
                    <div class="lf">连接状态</div>
                    <div class="rt">
                        <i-switch @on-change="changeConnectStatusFlag" :value="ONLY_CONNECT_STATUS_TOAST"  size="large">
                            <span slot="open">ON</span>
                            <span slot="close">OFF</span>
                        </i-switch>
                    </div>
                </li>
                <li class="d-li">
                    <div class="lf">测试设置</div>
                    <div class="rt">
                       <!-- <Radio-group v-model="testDeep">
                            <Radio value="0">console</Radio>
                            <Radio value="1">alert</Radio>
                            <Radio value="2">toast</Radio>
                        </Radio-group> -->
                        <div class="t-li" @click="choose(0)" :class="testDeep==0?'choosed':''">0</div>
                        <div class="t-li" @click="choose(1)" :class="testDeep==1?'choosed':''">1</div>
                        <div class="t-li" @click="choose(2)" :class="testDeep==2?'choosed':''">2</div>
                    </div>
                </li>
                <!-- <li class="d-li">
                    <div class="lf">模拟焊接中的状态</div>
                    <div class="rt">
                        <i-switch @on-change="changeConnectWeldingStatusFlag" :value="gowelding"  size="large">
                            <span slot="open">ON</span>
                            <span slot="close">OFF</span>
                        </i-switch>
                    </div>
                </li> -->
                <li class="d-li two">
                    <div class="lf">模拟焊接中的状态</div>
                    <div class="rt">
                        <div class="t-li" @click="choosem(0)" :class="testModel==0?'choosed':''">migsyn</div>
                        <div class="t-li" @click="choosem(1)" :class="testModel==1?'choosed':''">migman</div>
                        <div class="t-li" @click="choosem(2)" :class="testModel==2?'choosed':''">tigsyn</div>
                        <div class="t-li" @click="choosem(3)" :class="testModel==3?'choosed':''">tigman</div>
                        <div class="t-li" @click="choosem(4)" :class="testModel==4?'choosed':''">mma</div>
                    </div>
                </li>
                <li class="d-li">
                    <div class="lf">前往焊接中</div>
                    <div class="rt">
                       <input class="secd" type="number" v-model="secdTime"  min="1" max="20" >s
                    </div>
                </li>
                <li class="d-li">
                    <div class="lf">接收的报文</div>
                </li>
                <li class="d-li" @click="copyArticle()" >
                    <div class="lf">点击复制log</div>
                </li>
                 <li>
                     <div class="rizhi" v-for="(item,index) in rizhiList" :key="index">
                        {{item.sendTime}}:{{item.bleReponseData}}
                    </div>
                 </li>
            </ul>
           <div>
               {{getReportData}}
           </div>
      </div>
        <div class="goback" @click="goback">
                BACK
        </div>
    </div>
</template>

<script>
import { Toast} from 'mint-ui'
export default {
  name: "",
  components: {},
  data() {
    return {
        getReportData:'',
        TESTFLAG:this.GLOBAL_CONFIG.TESTFLAG,//测试开关
        LOGFLAG:this.GLOBAL_CONFIG.LOGFLAG,//日志开关
        testDeep:this.GLOBAL_CONFIG.TESTDEEPTH,//日志深度
        ONLY_CONNECT_STATUS_TOAST:this.GLOBAL_CONFIG.ONLY_CONNECT_STATUS_TOAST,//实时蓝牙连接状态toast
        secdTime:this.GLOBAL_CONFIG.autoRouterTime/1000,
        gowelding:false,
        testModel:0,
        rizhiList:this.$store.state.rizhiList


    };
  },

  methods: {
       copyArticle() {
            var input = document.createElement("input");

            input.value =JSON.stringify(this.rizhiList); //你需要复制的内容  

            document.body.appendChild(input);

            input.select();

            input.setSelectionRange(0, input.value.length), document.execCommand('Copy');

            document.body.removeChild(input);

            console.log("复制成功");  
    },
       copyPsd() {
            var psd = document.getElementById("psd");
            var psdUser = '#psd';
            this.navigatorCopy(psd, psdUser);
        },
       // 一键复制文本，兼容iso和安卓
         navigatorCopy(inputId, domUser) {
            var u = navigator.userAgent;
            // 安卓
            if(u.indexOf('Android') > -1 ){
                // var copytext = document.getElementById("user");
                var copytext = inputId;
                console.log(copytext)
                copytext.select(); // 选择对象
                document.execCommand("Copy"); // 执行浏览器复制命令
                alert('复制成功')
            }
            //ios兼容
            if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) { 
                // var copyDOM = document.querySelector('#user');  //要复制文字的节点  
                var copyDOM = document.querySelector(domUser);  //要复制文字的节点  
                console.log(copyDOM)
                var range = document.createRange();    
                // 选中需要复制的节点  
                range.selectNode(copyDOM);  
                // 执行选中元素  
                window.getSelection().addRange(range);  
                // 执行 copy 操作  
                var successful = document.execCommand('copy');    
                try {    
                    var msg = successful ? '复制成功！' : '复制失败'; 
                    alert(msg);    
                } catch(err) {    
                    alert('复制失败!');    
                }  
                // 移除选中的元素  
                window.getSelection().removeAllRanges();  
            }
        },
        copyUrl() {
            // for (let index = 0; index < 1000; index++) {
            //     let info ={
            //         "sendTime":"2020-10-28 22:53",
            //         "bleReponseData":"[218,226,74,91,0,186,0,10,75,19]"
            //     }
            //     this.rizhiList.push(info);
            // }
            // var clickContent = JSON.stringify(this.rizhiList);  //获取要复制的值
            // var inputElement =  document.getElementById("copyObj");  //获取要赋值的input的元素
            // inputElement.value = clickContent;  //给input框赋值   
            // inputElement.select();//选中input框的内容
            // document.execCommand("Copy");// 执行浏览器复制命令
            const range = document.createRange();
            range.selectNode(document.querySelector(".copyObj"));

            const selection = window.getSelection();
            if(selection.rangeCount > 0) selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('Copy');
            
              Toast({
                message: '日志复制成功，共'+this.rizhiList.length+'条',
                position: 'middle',
                iconClass: 'icon icon-success',
                duration: 1500
            });
        },
        goback(){
            this.$store.state.rizhiListFlag=true;
            this.$router.go(-1)
        },
        changeTestFlag (status) {
            this.$Message.info('Changed:' + status);
            this.$store.state.testModalDoorFlag=status;
            this.GLOBAL_CONFIG.TESTFLAG=status;
        },
        changeLogFlag (status) {
            this.$Message.info('Changed:' + status);
            this.GLOBAL_CONFIG.LOGFLAG=status;
        },changeConnectStatusFlag (status) {
            this.$Message.info('Changed:' + status);
            this.GLOBAL_CONFIG.ONLY_CONNECT_STATUS_TOAST=status;
        },
        changeConnectWeldingStatusFlag(status){
            this.gowelding =status;
            if( this.gowelding){
                setTimeout(() => {
                    //前往焊接中
                        //焊接中....migsyn
                    var  data ='DAB1 0000 0000 1A58';
                    this.buildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.migsyn.crcCode,'dae1 20 00 00 00 02 00 003C 003D 00b4 00c8 02 09 5952'.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
                    this.buildWeldingData(data);
                }, 2000);
            }
        },
        choose(val){
            this.testDeep =val;
            this.GLOBAL_CONFIG.TESTDEEPTH =val;
        },
        choosem(val){
            this.testModel =val;
            var  data='';
            switch (val) {
                case 0:
                    //前往焊接中
                    //焊接中....migsyn
                    data ='DAB1 0000 0000 1A58';
                    this.buildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.migsyn.crcCode,'dae1 20 00 00 00 02 00 003C 003D 00b4 00c8 02 09 5952'.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
                    break;
                case 1:
                    data ='DAB2 0000 0000 1A1C';
                    this.buildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.migman.crcCode,'dae2 20 003D 00c8 00 6283'.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
                    break;
                case 2:
                     data ='DAB3 0000 0000 DA21';
       this.buildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.tigsyn.crcCode,'dae3 20 00 03 0064 0064 02 09  8C75'.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
                    break;
                case 3:
                    data ='DAB4 0000 0000 1A94';
                    this.buildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.tigman.crcCode,'dae4 20 c0 32 0032 32 0032 0032 03e8 32 32 0032 32 50 23 4CCA'.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
                    break;
                case 4:
                      data ='DAB5 0000 0000 DAA9';
       this.buildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.mma.crcCode,'dae5 20 00 01 09 0064 0064 C54A'.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
                    break;
                default:
                    break;
            }
            setTimeout(() => {
                   this.buildWeldingData(data);
            }, 2000);
        },
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
            if(this.envType=='env_ios'){
                this.callSendDataToBleUtil('newIndex','DAFF'+oldCrc+this.crcModelBusClacQuery('FF'+oldCrc, true),oldCrc)
            }else{
                window.android.callSendDataToBle('newIndex','DAFF'+oldCrc+this.crcModelBusClacQuery('FF'+oldCrc, true),oldCrc);
            }
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
      }
  },
  mounted: function() {
      this.$store.state.rizhiListFlag=false;
  },
  created() {},
  computed: {
    envType(){
        return this.$store.state.envType;　　//需要监听的数据
    }
  },
  destroyed(){
      this.$store.state.rizhiListFlag=true;
  },
  watch: {
    secdTime(){
        this.GLOBAL_CONFIG.autoRouterTime = this.secdTime * 1000;
    },
    getReportData(){
        return this.$store.state.oldBroastData;
    }
  },
};
</script>
<style lang="scss" scoped>
.developerManage{
    height: 100%;
    width: 100%;
    background: #39abfd;
    display: inline-block;
    .contain{
        margin-top: 20px;
        .d-ul{
            height: auto;
            margin: 0 10px;
            .d-li{
                background: #fff;
                color: #000;
                height: 50px;
                line-height: 50px;
                margin: 5px 0;
                padding: 0 15px;
                zoom:1;
                .lf{
                    width: 35%;
                    font-size: 14px;
                    float: left;
                }
                .rt{
                    width: 65%;
                    float: right;
                    text-align: right;
                    text-align: center;
                    font-size: 20px;
                    .t-li{
                        margin-right: 5px;
                        width: 60px;
                        border: 1px dashed #999;
                        float: left;
                    }.choosed{
                        background: #39abfd;
                    }
                    .secd{
                        text-align: center;
                        background: #eee;
                        height: 45px;
                        line-height: 45px;
                    }
                }
            }.two{
                height: 120px;
                
            }
            .rizhi{
                padding:5px 0;
            }
        }
    }
    .goback{
        margin-top: 180px;
        margin-left: 40px;
        margin-right: 40px;
        margin-bottom: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 16px;
        background:#010101;
        color: #fff;
    }
}
</style>
