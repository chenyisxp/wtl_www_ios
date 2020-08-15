<template>
  <div class="hisWeldInfo">
    <div class="header"><Icon type="ios-arrow-back" @click="go('/hisWeldList')"/>History Detail</div>
    <!-- <div class="maginname">
       {{nowConnectMachine}}
    </div> -->
    <div class="modelName">{{name}}</div>
    <div class="itlist">
      <div class="li" v-for="(item,index) in nowTypeList" :class="item.typeName=='GAS'&& MIG_MATERIAL !=0?'eleUnShow':''">
        <div class="left">
            {{item.typeName|spliceString}}
        </div>
        <div class="right">
            <span v-for="(temp,newIdx) in item.comList" v-if="UnitFlag==0 && item.chooseKey==temp.id">
              {{temp.value}}
            </span>
            <span v-for="(temp,newIdx) in item.inchComList" v-if="UnitFlag==1 && item.chooseKey==temp.id">
              {{temp.value}}
            </span>
            <!-- <span :class="item.unit=='A'?'bigword': item.unit=='BIG'?'bigword':''">{{item.value}}</span><span v-if="item.unit=='A'">A</span> -->
        </div>
      </div>
        <div class="li" v-for="(item,index) in suppllytments">
        <div class="left">
            {{item.typeName |spliceString}}
        </div>
        <div class="right">
            <span>
               {{item.value}}
            </span>
            <!-- <span :class="item.unit=='A'?'bigword': item.unit=='BIG'?'bigword':''">{{item.value}}</span><span v-if="item.unit=='A'">A</span> -->
        </div>
      </div>
    </div>
    <div class="btnli">
          <div class="appBtn" type="primary" ghost @click="applyWeld">Application</div>
          <!-- <Button type="info" ghost class="info" @click="go('/memoryManage')">保存焊接参数</Button> -->
    </div>
  </div>
</template>

<script>
import { Toast ,Indicator } from 'mint-ui'
export default {
  name: '',
  components: {
   
  },
  data () {
    return {
      // options:[
      //     {name:'MODE',value:'2T',unit:'T'},
      //     {name:'MATERIAL',value:'FE'},
      //     {name:'GAS',value:'Ar'},
      //     {name:'DIAMETER',value:'0.6mm'},
      //     {name:'THICKNESS',value:'0.6mm'},
      //     {name:'INDUCTANCE',value:'90',unit:'A'},
      //     {name:'SPEED',value:'8',unit:'BIG'}
      //   ],
        suppllytments:[],//额外字段
        name:'',//当前模式姓名
        type:'',//类型
        nowTypeList:'',
        UnitFlag:'',//单位
        MIG_MATERIAL:'',//联动控制 gas选项出现
        nowConnectMachine:''
     } 
  },

  methods: {
        applyWeld(){
          let self =this;
           //00、 判断是不是焊接中，焊接中不能编辑部分参数
          if(self.$store.state.weldingStatus==1){
              Toast({
                  message: 'The Machine is running!',
                  position: 'middle',
                  iconClass: 'icon icon-success',
                  duration: 1500
              });
              return;
          }
          //去焊接
          var dirctCode = self.getDirective('APPY_LAST_WELD', 'APPY_LAST_WELD');
          // var num = (
          //   Array(4).join("0") + parseInt(self.type, 10).toString(16)
          // ).slice(-4);
           var num =this.jinzhiChangeFuc(self.type);
          var crc = self.crcModelBusClacQuery(dirctCode + num, true);
          var sendData = "DA" + dirctCode + num + crc;
          if(self.GLOBAL_CONFIG.TESTFLAG){
            console.log(sendData+'|||'+crc);
              // Toast({
              //   message: 'simulation sendData success :'+sendData,
              //   position: 'middle',
              //   iconClass: 'icon icon-success',
              //   duration: 1500
              // });
              
          }else{
               self.callSendDataToBleUtil('hisWeldInfo',sendData,crc);
          }
          //前往 参数可以修改的页面
          // alert(self.type);
          self.gohisWeld(self.type);
        },
        gohisWeld(type){
            let self =this;
            switch (type) {
                case 0://migsyn
                    self.$router.push({ path: '/weld_common', query:{type:'MIGSYN',pageBackTo:'/hisWeldList'} });
                    break;
                case 1://migman
                    self.$router.push({ path: '/weld_common', query:{type:'MIGMAN',pageBackTo:'/hisWeldList'} });
                    break;
                case 2://tigsyn
                    self.$router.push({ path: '/weld_tig_syn', query:{type:'TIGMAN',pageBackTo:'/hisWeldList'} });
                    break;
                case 3://tigman
                    self.$router.push({ path: '/weld_tig_man', query:{type:'TIGMAN',pageBackTo:'/hisWeldList'} });
                    break;
                case 4://mma
                    self.$router.push({ path: '/weld_mma', query:{type:'MMA',pageBackTo:'/hisWeldList'} });
                    break;
                default:
                    break;
            }
        },
       go(url){
          this.$router.push(url);
        },
        getTtile(index){
            return "M"+(index+1)
        },
        buildTigManData(list){
            if ( this.nowModelTypeName == "2T_NOPULSE_DC") {
                        var t0 ={typeName:'PRE-GAS',value:list.PRE_GAS_VAL/10+'s'};      
                        var t6 ={typeName:'SLOP-UP',value:list.STOP_UP_VAL/10+'s'};
                        var t11 ={typeName:'WELD-CURRENT',value:list.WELD_CUR_VAL+'A'};
                        var t5 ={typeName:'SLOP-DOWN',value:list.SLOP_DOWN_VAL/10+'s'};
                        var t8 ={typeName:'POST-GAS',value:list.POST_GAS_VAL/10+'s'};
                        this.suppllytments.push(t0);
                        this.suppllytments.push(t6);
                        this.suppllytments.push(t11);
                        this.suppllytments.push(t5);
                        this.suppllytments.push(t8);
               } else if ( this.nowModelTypeName == "4T_NOPULSE_DC") {
                        var t0 ={typeName:'PRE-GAS',value:list.PRE_GAS_VAL/10+'s'};      
                        var t6 ={typeName:'SLOP-UP',value:list.STOP_UP_VAL/10+'s'};
                        var t11 ={typeName:'WELD-CURRENT',value:list.WELD_CUR_VAL+'A'};
                        var t5 ={typeName:'SLOP-DOWN',value:list.SLOP_DOWN_VAL/10+'s'};
                        var t8 ={typeName:'POST-GAS',value:list.POST_GAS_VAL/10+'s'};
                        var t1 ={typeName:'START-CURRENT',value:list.START_CUR_VAL+'A'};
                        var t7 ={typeName:'CRATER-CURRENT',value:list.CRATER_CUR_VAL+'A'};

                        this.suppllytments.push(t0);
                        this.suppllytments.push(t6);
                        this.suppllytments.push(t11);
                        this.suppllytments.push(t5);
                        this.suppllytments.push(t8);
                        this.suppllytments.push(t1);
                        this.suppllytments.push(t7);
                }else if ( this.nowModelTypeName == "2T_PULSE_DC") {
                        var t0 ={typeName:'PRE-GAS',value:list.PRE_GAS_VAL/10+'s'};      
                        var t6 ={typeName:'SLOP-UP',value:list.STOP_UP_VAL/10+'s'};
                        var t11 ={typeName:'WELD-CURRENT',value:list.WELD_CUR_VAL+'A'};
                        var t5 ={typeName:'SLOP-DOWN',value:list.SLOP_DOWN_VAL/10+'s'};
                        var t8 ={typeName:'POST-GAS',value:list.POST_GAS_VAL/10+'s'};
                        var t2 ={typeName:'PULSE-DUTY',value:list.DUTY_VAL/10+'%'};
                        var t4 ={typeName:'BASE-CURRENT',value:list.BASE_CUR_VAL+'A'};
                        var t3 ={typeName:'PULSE-FRE',value:list.PULSE_FRE_VAL/10+'Hz'};

                        this.suppllytments.push(t0);
                        this.suppllytments.push(t6);
                        this.suppllytments.push(t11);
                        this.suppllytments.push(t5);
                        this.suppllytments.push(t8);
                        this.suppllytments.push(t2);
                        this.suppllytments.push(t4);
                        this.suppllytments.push(t3);
                }else if( this.nowModelTypeName=='4T_PULSE_DC'){
                        var t0 ={typeName:'PRE-GAS',value:list.PRE_GAS_VAL/10+'s'};      
                        var t6 ={typeName:'SLOP-UP',value:list.STOP_UP_VAL/10+'s'};
                        var t11 ={typeName:'WELD-CURRENT',value:list.WELD_CUR_VAL+'A'};
                        var t5 ={typeName:'SLOP-DOWN',value:list.SLOP_DOWN_VAL/10+'s'};
                        var t8 ={typeName:'POST-GAS',value:list.POST_GAS_VAL/10+'s'};
                        var t1 ={typeName:'START-CURRENT',value:list.START_CUR_VAL+'A'};
                        var t7 ={typeName:'CRATER-CURRENT',value:list.CRATER_CUR_VAL+'A'};
                        var t2 ={typeName:'PULSE-DUTY',value:list.DUTY_VAL/10+'%'};
                        var t4 ={typeName:'BASE-CURRENT',value:list.BASE_CUR_VAL+'A'};
                        var t3 ={typeName:'PULSE-FRE',value:list.PULSE_FRE_VAL/10+'Hz'};


                        this.suppllytments.push(t0);
                        this.suppllytments.push(t6);
                        this.suppllytments.push(t11);
                        this.suppllytments.push(t5);
                        this.suppllytments.push(t8);
                        this.suppllytments.push(t1);
                        this.suppllytments.push(t7);
                        this.suppllytments.push(t2);
                        this.suppllytments.push(t4);
                        this.suppllytments.push(t3);
                }
                
                if(this.nowDCORACFLAG==1){
                    var t9 ={typeName:'AC-BALANCE',value:list.AC_DUTY_VAL+'%'};//交流占空比
                    var t10 ={typeName:'AC-FRE',value:list.AC_FRE_VAL+'Hz'};
                    this.suppllytments.push(t9);
                    this.suppllytments.push(t10);
                }
    },
     goBack(){
            this.$router.push({path:'/hisWeldList',query:{}}); 
        }
  },
  mounted: function () {
     //请求相应的最后一次焊接记录
    //  this.$route.query.type
      this.nowConnectMachine =this.$store.state.nowConnectMachine;
      Indicator.close();
      this.name = this.$route.query.name;
      this.type = this.$route.query.type;
      var list  =this.$store.state.rstInfo;
      //赋值拆解
      this.nowTypeList =list.nowTypeList;
      //电感量
      this.inducanceValue = list.INDUCTANCE;
      //最新的
      this.MIG_MATERIAL =list.MIG_MATERIAL;
      if(list.initBean.unit==1){
          this.UnitFlag=1;
      }else{
          this.UnitFlag=0;
      }
      //根据不同模式额外补充参数显示
       var tmp1 ={};
       var tmp2 ={};
      switch (this.type) {
        case 0://migsyn
            var speed =(list.SPEED_DISPLAY/10+'').indexOf('.')>0?list.SPEED_DISPLAY/10:list.SPEED_DISPLAY/10+'.0';
            var voltage =(list.V_WELDING/10+'').indexOf('.')>0?list.V_WELDING/10:list.V_WELDING/10+'.0';
            if( this.UnitFlag==1){
                 tmp1 ={typeName:'SPEED',value:speed+'inch/min'};
            }else{
                tmp1 ={typeName:'SPEED',value:speed+'m/min'};
            }
            tmp2={typeName:'V_WELDING',value:voltage+'v'};
            this.suppllytments.push(tmp1);
            this.suppllytments.push(tmp2);
          break;
        case 1://migman
            var speed =(list.SPEED_DISPLAY/10+'').indexOf('.')>0?list.SPEED_DISPLAY/10:list.SPEED_DISPLAY/10+'.0';
            var voltage =(list.V_WELDING/10+'').indexOf('.')>0?list.V_WELDING/10:list.V_WELDING/10+'.0';
            if( this.UnitFlag==1){
                 tmp1 ={typeName:'SPEED',value:speed+'inch/min'};
            }else{
                tmp1 ={typeName:'SPEED',value:speed+'m/min'};
            }
            tmp2={typeName:'V_WELDING',value:voltage+'v'};
            this.suppllytments.push(tmp1);
            this.suppllytments.push(tmp2);
        break;
      case 2://tig syn
            var syncur =(list.SYN_WELD_CUR/10+'').indexOf('.')>0?list.SYN_WELD_CUR/10:list.SYN_WELD_CUR/10+'.0';
            tmp2={typeName:'WELD-CURRENT',value:syncur+'A'};
            this.suppllytments.push(tmp2);
          break;
      case 3://tig MAN
              this.nowModelTypeName =list.initBean.nowChooseModel;
              this.nowDCORACFLAG =list.initBean.polatrity;
              this.buildTigManData(list);
              // var t0 ={typeName:'PRE-GAS',value:list.PRE_GAS_VAL/10+'s'};
              // var t1 ={typeName:'START-CURRENT',value:list.START_CUR_VAL+'A'};
              // var t2 ={typeName:'PULSE-DUTY',value:list.DUTY_VAL/10+'%'};
              // var t3 ={typeName:'PULSE-FRE',value:list.PULSE_FRE_VAL/10+'Hz'};
              // var t4 ={typeName:'BASE-CURRENT',value:list.BASE_CUR_VAL+'A'};
              // var t5 ={typeName:'SLOP-DOWN',value:list.SLOP_DOWN_VAL/10+'s'};
              // var t6 ={typeName:'SLOP-UP',value:list.STOP_UP_VAL/10+'s'};
              // var t7 ={typeName:'CRATER-CURRENT',value:list.CRATER_CUR_VAL+'A'};
              // var t8 ={typeName:'POST-GAS',value:list.POST_GAS_VAL/10+'s'};
              // var t9 ={typeName:'AC-BALANCE',value:list.AC_DUTY_VAL+'%'};//交流占空比
              // var t10 ={typeName:'AC-FRE',value:list.AC_FRE_VAL+'Hz'};

              // this.suppllytments.push(t0);
              // this.suppllytments.push(t1);
              // this.suppllytments.push(t2);
              // this.suppllytments.push(t3);
              // this.suppllytments.push(t4); 
              // this.suppllytments.push(t5);
              // this.suppllytments.push(t6);
              // this.suppllytments.push(t7);
              // this.suppllytments.push(t8);
              // this.suppllytments.push(t9);
              // this.suppllytments.push(t10);
          break;
      case 4:
              var t0 ={typeName:'FROCE',value:list.ARC_FORCE_VAL/10+'F'};
              var t1 ={typeName:'WELD-CURRENT',value:list.MMA_CURRENT_VAL+'A'};

              this.suppllytments.push(t0);
              this.suppllytments.push(t1);
        break;
      default:
          break;
      }
    if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.goBack, false);
    } 
  },
  created () {
   
  },
  computed:{
       
  },destroyed(){
     window.removeEventListener('popstate', this.goBack, false);
  }
}
</script>
<style lang="scss" scoped>
.hisWeldInfo{
  color: #fff;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(
    to top,
    rgba(24, 65, 81, 1) 0%,
    rgba(27, 72, 90, 1) 20%,
    rgba(26, 71, 89, 1) 50%,
    rgba(27, 72, 90, 1) 80%,
    rgba(57, 97, 113, 1) 90%,
    rgba(24, 65, 81, 1) 100%
  );
  // color: #7dc1d4;
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
  .maginname{
      margin-top: 20px;
      padding: 0 20px;
      font-size: 16px;
  }
  .modelName{
      font-size: 20px;
      padding: 0 20px;
      margin-top: 20px;
      margin-bottom: 10px;
  }
  .itlist{
    padding: 0 20px;
    .li{
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      .left{
        float: left;
        width: 65%;
      }
      .right{
        float: right;
        text-align: right;
        width: 35%;
        .bigword{
          font-size: 20px;
        }
      }
    }
  }
  .btnli{
    width: 100%;
    // padding:0 20px;
    margin-top: 25px;
    .ivu-btn{
      width: 100%;
    }
    .info{
      margin-top: 10px;
    }
    .appBtn{
            clear: both;
            height: 50px;
            line-height: 50px;
            text-align: center;
            background: #333;
            color: #3cbde7;
            font-size: 24px;
            padding-bottom: 50px;
            position: fixed;
            bottom: 0; 
            width: 100%;
             background: -moz-linear-gradient(top, #070304 0%, #3d3b3c 100%) ;
            background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#3d3b3c), color-stop(100%,#070304));
    }
  }
}
.eleUnShow{
    display: none;
}
</style>
