<template>
  <div class="memoryDetail">
       <div class="mmp">
            <div class="header">
                <div class="licon" @click="go('back')">
                    <span></span>
                </div>
                M{{pupnum}}
            </div>
            <div class="modText">
                <div class="mup">
                    <div class="u-r">label</div>
                    <div class="u-l">
                        <div class="u-l-text" @click="openEditModal">modify</div>
                    </div>
                </div>
                <div class="mdown">
                    <p>{{remarksText}}
                    </p>
                </div>
            </div>
            <div class="mainPanel">
                <div class="m-l1"></div>
                <div class="modelName">{{name}}</div>
                <div class="m-show" v-if="name=='MIG SYN'">
                    <div class="m-s-l">{{tmp1}}</div>
                    <div class="m-s-r">{{tmp2}}</div>
                </div>
                <div class="m-show" v-if="name=='MIG MAN'">
                    <div class="m-s-l">{{tmp1}}</div>
                    <div class="m-s-r">{{tmp2}}</div>
                </div>
                <div class="m-show" v-if="name=='TIG SYN'">
                    <div class="m-s-l_current">{{tmp1}}</div>
                </div>
                <!-- <div class="m-show" v-if="name=='TIG MAN'">
                    <div class="m-s-l">{{tmp1}}</div>
                </div> -->
                <div class="m-show" v-if="name=='MMA'">
                    <div class="m-s-l_force">{{tmp1}}</div>
                    <div class="m-s-r">{{tmp2}}</div>
                </div>
                <div class="m-l2">
                    
                </div>
                <ul class="params">
                    <li v-for="(item,index) in nowTypeList"  :class="item.typeName=='GAS'&& MIG_MATERIAL !=0?'eleUnShow':''">
                        <div class="p-l-l">{{item.typeName}}</div>
                        <div class="p-l-r">
                             <span v-for="(temp,newIdx) in item.comList" v-if="UnitFlag==0 && item.chooseKey==temp.id">
                            {{temp.value}}
                            </span>
                            <span v-for="(temp,newIdx) in item.inchComList" v-if="UnitFlag==1 && item.chooseKey==temp.id">
                            {{temp.value}}
                            </span>
                        </div>
                    </li>
                    <li v-for="(item,index) in  suppllytments" v-if="name=='TIG MAN'">
                        <div class="p-l-l">{{item.typeName}}</div>
                        <div class="p-l-r">
                             <span>
                             {{item.value}}
                            </span>
                          
                        </div>
                    </li>
                </ul>
                 <div class="m-l3"></div>
            </div>
        </div>
        <div class="appBtn" @click="goEditPage">OVERRIDE</div>
        <div class="hideWid" v-if="hideFlag" id="hiid">
            <div class="up" v-if="upshowFlag" @click="closeModal"></div>
            <div class="down" v-if="downshowFlag" :class="closeClass?'transdown':''">
                <div class="remarkContent">
                      <textarea placeholder="New remarks" v-model="remarksText"  maxlength="200" ></textarea>
                </div>
                <div class="confirm" @click="confirmCloseModal">
                    Confirm
                </div>
            </div>
        </div>
     <!-- 底部抽屉弹层 按钮组 end -->
     <Loading :is-loading="isLoading"></Loading>
  </div>
</template>

<script>
import { Toast ,Indicator } from 'mint-ui'
import Loading from "@/components/base/Loading";
export default {
  name: "",
  components: {Loading},
  data() {
    return {
        isLoading:false,
        nowModalTypeId:'',
        modelCrc:'',
        name:'',
        pupnum:'',//通道id
        tmp1:'',
        tmp2:'',
        params:
        [
            { name:'MODE',value:'2T'},
            {name:'GAS',value:'Ar'},
            {name:'MATRRIAL',value:'FE'},
            {name:'DIAMETER',value:'0.6mm'},
            {name:'THICKNESS',value:'0.6mm'}
        ],
        suppllytments:[],//额外字段
        name:'',//当前模式姓名
        type:'',//类型
        nowTypeList:'',
        UnitFlag:'',//单位
        MIG_MATERIAL:'',//联动控制 gas选项出现
        hideFlag: false,
        upshowFlag:false,
        downshowFlag:false,
        closeClass: false,
        remarksText:'',
        nowModelTypeName:'',//tigman模式
        nowDCORACFLAG:'',//tigman模式
        modelKey:''
    };
  },

  methods: {
    getKeyMap(id){
        switch (id) {
            case '0':
                return 'EF';
                break;
            case '1':
                return 'AF';
                break;
            case '2':
                return 'DF';
                break;
            case '3':
                return 'BF';
                break;
            case '4':
                return 'CF';
                break;
            default:
                break;
        }
    },
    goEditPage(){
        //1、发送覆盖的指令 不同模式有自己的 *F+通道数=
        var dirctCode = this.getKeyMap(this.nowModalTypeId+'');
        //0-4焊接模式 1-9通道
        var num = (
        Array(4).join("0") + parseInt(this.pupnum, 10).toString(16)
        ).slice(-4);
        var crc = this.crcModelBusClacQuery(dirctCode + num, true);
        var sendData = "DA" + dirctCode + num + crc;
        if(this.GLOBAL_CONFIG.TESTFLAG){
            Toast({
              message: 'simulation sendData success :'+sendData,
              position: 'middle',
              iconClass: 'icon icon-success',
              duration: 1500
            });
        }else{
            this.callSendDataToBleUtil('save_Detail',sendData,crc);
        }
         //2、前往 参数可以修改的页面
          this.goWeldPage(this.nowModalTypeId+'');
        
    },
    //应该是去之前的焊接页
    goWeldPage(newIndexId){
        let self =this;
        switch (newIndexId) {
            case '1'://migsyn
                self.$router.push({ path: '/weld_common', query:{type:'MIGSYN',pageBackTo:'/memoryManage'} });
                break;
            case '3'://migman
                self.$router.push({ path: '/weld_common', query:{type:'MIGMAN',pageBackTo:'/memoryManage'} });
                break;
            case '4'://tigsyn
                self.$router.push({ path: '/weld_tig_syn', query:{type:'TIGMAN',pageBackTo:'/memoryManage'} });
                break;
            case '2'://tigman
                self.$router.push({ path: '/weld_tig_man', query:{type:'TIGMAN',pageBackTo:'/memoryManage'} });
                break;
            case '0'://mma
                self.$router.push({ path: '/weld_mma', query:{type:'MMA',pageBackTo:'/memoryManage'} });
                break;
            default:
                break;
        }
    },
     confirmCloseModal(modalType){
         let self =this;
         //2、原来关闭逻辑
         self.closeClass=true;
         self.upshowFlag=true;
        setTimeout(
          function fuc(params) {
            self.hideFlag=false;
            self.downshowFlag=false;
            self.closeClass=false;
        }
        ,500)
        //TODO 更新安卓存储
    },
    openEditModal(){
        let self =this;
        self.hideFlag=true;
        self.downshowFlag=true;
        setTimeout(
          function fuc(params) {
            self.upshowFlag=true;//延迟显示底色
          }
        ,200)
    },
    closeModal(){
         let self =this;
         self.closeClass=true;
         self.upshowFlag=false;
        setTimeout(
          function fuc(params) {
            self.hideFlag=false;
            self.downshowFlag=false;
            self.closeClass=false;
          }
          ,500)
    },
    go(url) {
        if(url=='back'){
            this.$router.go(-1);
        }else{
            this.$router.push(url);
        }
      
    },
    initData(){
      var list  =this.$store.state.memoryInfo;//去拿memeory对象里的值
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
      switch (this.modelCrc) {
        case this.GLOBAL_CONFIG.callWeldTypeData.migsyn.crcCode://migsyn
           this.tmp1 =(list.SPEED_DISPLAY/10+'').indexOf('.')>0?list.SPEED_DISPLAY/10:list.SPEED_DISPLAY/10+'.0';
           this.tmp2 =(list.V_WELDING/10+'').indexOf('.')>0?list.V_WELDING/10:list.V_WELDING/10+'.0';
          
          break;
        case this.GLOBAL_CONFIG.callWeldTypeData.migman.crcCode://migman
            this.tmp1 =(list.SPEED_DISPLAY/10+'').indexOf('.')>0?list.SPEED_DISPLAY/10:list.SPEED_DISPLAY/10+'.0';
            this.tmp2 =(list.V_WELDING/10+'').indexOf('.')>0?list.V_WELDING/10:list.V_WELDING/10+'.0';
        break;
        case this.GLOBAL_CONFIG.callWeldTypeData.tigsyn.crcCode://tig syn
              //电流是整数
            // this.tmp1 =(list.SYN_WELD_CUR/10+'').indexOf('.')>0?list.SYN_WELD_CUR/10:list.SYN_WELD_CUR/10+'.0';
             this.tmp1=list.SYN_WELD_CUR;
            break;
        case this.GLOBAL_CONFIG.callWeldTypeData.tigman.crcCode://tig MAN
                this.nowModelTypeName =list.initBean.nowChooseModel;
                this.nowDCORACFLAG =list.initBean.polatrity;
                this.buildTigManData(list);
            break;
        case this.GLOBAL_CONFIG.callWeldTypeData.mma.crcCode:
            //推力 电流是整数
            // this.tmp1 = (list.ARC_FORCE_VAL/10+'').indexOf('.')>0?list.ARC_FORCE_VAL/10:list.ARC_FORCE_VAL/10+'.0';
            // this.tmp2 =(list.MMA_CURRENT_VAL+'').indexOf('.')>0?list.MMA_CURRENT_VAL/10:list.MMA_CURRENT_VAL+'.0';
            this.tmp1 = list.ARC_FORCE_VAL;
            this.tmp2 =list.MMA_CURRENT_VAL;
        break;
      default:
          break;
      }
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
    }
  },
  mounted: function() {
    //存储的mid
    this.modelCrc = this.$route.query.modelCrc;
    this.modelKey= this.$route.query.modelKey;
    this.nowModalTypeId=this.$route.query.nowModalTypeId;//主页中的id
    this.name = this.$route.query.name;
    this.pupnum = this.$route.query.pupnum;//通道id
    this.initData();
    this.remarksText = this.$route.query.remarksText;
  },
  created() {},
  computed: {}
};
</script>
<style lang="scss" scoped>
.memoryDetail {
    background: #053342;
    color: #95a1a4;
    width: 100%;
    display: flex;
    min-height: 100vh;
    flex-flow: row wrap;
.mmp{
    width: 100%;
    align-self: flex-start;
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
  .modText{
      padding: 0 20px;
      margin-top: 20px;
      margin-bottom: 20px;
      .mup{
                height: 25px;
                margin-bottom: 5px;
                .u-r{
                    float: left;
                    font-size: 20px;
                }
                .u-l{
                    background: #205a66;
                    padding: 0 5px;
                    width: 70px;
                    height: 20px;
                    line-height: 20px;
                    color: #79949c;
                    float:right;
                    border-radius: 3px;
                    .u-l-text{
                        font-size: 14px;
                        background:url(../../assets/images/edit.png) no-repeat;    
                        background-size: 13px;
                        background-position:right center;
                    }
                }
                

            }
            .mdown{
                display: block;
                min-height: 15px;
                line-height: 15px;
                font-size: 14px;
            }
        }
        .mainPanel{
            margin: 0 20px;
            background: #092b37;
            box-shadow:
                // 0px -10px 0px 0px #ff0000,   /*上边阴影  红色*/
                -1px 0px 0px 0px #1d414d,   /*左边阴影  绿色*/
                1px 0px 0px 0px #1d414d,    /*右边阴影  蓝色*/
                // 0px 10px 0px 0px #eede15;    /*下边阴影  黄色*/
                ;
            .m-l1{
                background-image: radial-gradient(ellipse at 50% -20%,#5a7789,#092b37);
                height: 5px;
            } 
            .m-l3{
                clear: both;
                background-image: radial-gradient(ellipse at center center,#1c434f,#07313e);
                height: 5px;
            }
            .modelName{
                margin: 30px 0;
                font-size: 16px;
                height: 30px;
                color: #fff;
                font-weight: bold;
                font-size: 18px;
                background: #074dc6;
                border-radius: 50%;
                line-height: 30px;  
                text-align: center;
                width: 100px;;
                background-image: -webkit-radial-gradient(#074dc6(120,70%,60%,.9),#143c5a(360,60%,60%,.9)); background-image: radial-gradient(#074dc6(120,70%,60%,.9),#333(360,60%,60%,.9));
                // background-image: radial-gradient(ellipse at center center, #014dcf, #15394f);
                // background: -webkit-radial-gradient(#074dc6, #143c5a); /* Safari 5.1 - 6.0 */
                // background: -o-radial-gradient(#074dc6, #143c5a); /* Opera 11.6 - 12.0 */
                // background: -moz-radial-gradient(#074dc6, #143c5a); /* Firefox 3.6 - 15 */
                // background: radial-gradient(#074dc6, #143c5a); /* 标准的语法（必须放在最后） */

            }
            .m-show{
                padding: 0 20px;
                height: 50px;
                font-size: 46px;
                color: #83cadf;
                margin-bottom: 10px;
                .m-s-l{
                    float: left;
                    background:url(../../assets/images/speed.png) no-repeat;    
                    background-size: 43px;
                    background-position:left center;
                    padding-left: 50px;
                }
                .m-s-l_current{
                    float: left;
                    background:url(../../assets/images/weld_icon_current.png) no-repeat;    
                    background-size: 43px;
                    background-position:left center;
                    padding-left: 50px;
                }
                .m-s-l_force{
                    float: left;
                    background:url(../../assets/images/weld_icon_newForce.png) no-repeat;    
                    background-size: 43px;
                    background-position:left center;
                    padding-left: 50px;
                }
                .m-s-r{
                    float:right;
                    background:url(../../assets/images/voltage.png) no-repeat;    
                    background-size: 43px;
                    background-position:left center;
                    padding-left: 50px;
                }
            }
            .m-l2{
                height: 5px;
                background: linear-gradient( 
                    to right, 
                    rgba(23,61,74,.6) 0%,  
                    rgba(158,180,189,1) 20%, 
                    
                    rgba(244,253,255,1) 50%,
                    
                    rgba(158,180,189,1) 90%, 
                    rgba(23,61,74,.6)  100%);
            }
            .params{
                    min-height: 30px;
                    margin: 20px 20px;
                li{
                    height: 30px;
                    font-size: 14px;
                    .p-l-l{
                        float: left;
                        color: #6c888f;
                        font-size: 18px;
                    }
                    .p-l-r{
                        float: right;
                        color: #aabfc6;
                    }
                }
            }
        }
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
            align-self: flex-end;
            width: 100%;
            background: -moz-linear-gradient(top, #070304 0%, #3d3b3c 100%) ;
            background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#3d3b3c), color-stop(100%,#070304));
            // text-shadow: 0 1px 0 #cccccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbbbbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaaaaa, 0 6px 1px rgba(0, 0, 0, 0.1), 0 0 5px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.3), 0 3px 5px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.2), 0 20px 20px rgba(0, 0, 0, 0.15);
                text-shadow: 0.1em 0.1em 0.3em #fff;
        }
        .hideWid{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    // background-color: rgba(55,55,55,.6);
    height: 100%;
    z-index: 100;
   
    .up{
      background:  #333;
      height: 100%;
      top: 0; 
      // bottom: 0;
      right: 0;
      left: 0px;
      opacity: .8;
      position: fixed;
    }
    .down{
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        border-top: 1px solid #999;
      background: #2b2c30;
      height: auto;
      display: inline-block;
      /* top: 50%; */
      bottom: 0;
      right: 0;
      left: 0px;
      position: fixed;
      animation:btmoveOne .5s;
      -webkit-animation:btmoveOne .5s;
      animation-fill-mode: forwards;/*当动画完成时，动画会停留在最后一帧。*/
      overflow: hidden;
      .remarkContent{
            padding-top: 5px;
            width: 90%;
            text-align: center;margin-bottom: 15px;
            margin: 0 auto;
            textarea{
                margin-top: 20px;
                margin-bottom: 30px;
                padding: 10px;
                width: 100%;height: 160px;border: none;background-color:#fafafa ;line-height: 20px;
                border-radius: 10px;
                
            }::placeholder{
                color: #cdcdcd;
                padding-left: 8px;
                padding-top: 8px;
            }  
        }
       .confirm{
        //   height: 50px;
        color: #4cb2c5;
        font-family: Arial;
        width: 100%;
        clear: both;  
        height: 50px;
        line-height: 50px;;
        text-align: center;
        font-size: 30px;
        background: -moz-linear-gradient(top, #070304 0%, #3d3b3c 100%) ;
        background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#3d3b3c), color-stop(100%,#070304))  ;
      }
   
    }.transdown{
        animation:btmoveSecond .5s;
        -webkit-animation:btmoveSecond .5s;
        animation-fill-mode: forwards;/*当动画完成时，动画会停留在最后一帧。*/
        overflow: hidden;
    }
    .down.thinkness{
        color: #fff;
        padding-top: 20px;
        .d-t-name{
            font-size: 20px;
            columns: #fff;
            height: 50px;
            line-height: 50px;
            text-align: left;
            margin-bottom: 5px;
            padding-left: 35px;
        }
        .d-t-value{
            height: 30px;
            line-height: 30px;
            padding-left: 160px;
            font-size: 18px;
        }
        .b-t-btn-sub{
            position: relative;
            clear: both;
            height: 90px;
        
           
            .subbtn{
                width: 100%;
                position: absolute;
                height: 50px;
                line-height: 50px;
                color: #00c2ee;
                bottom: 0;
                font-size: 24px;
                text-align: center;
                background: -moz-linear-gradient(top, #070304 0%, #3d3b3c 100%) ;
                background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#3d3b3c), color-stop(100%,#070304));
            }
        }
        .ncommon{
        height: 300px;
        width: 100px;
        float: left;
        .rulers{
            width: 50px;
            height: 100%;
            float:right;
            // border-top: 2px solid #333;
            // border-bottom: 2px solid #333;
            border-right: 1px solid #fff;
            .bottom{
                
            }
            .l-li{
                float: left;
            }
            .r-li{
                position: relative;
                height: 20px;
                width: 15px;
                float: right;
                clear: both;//浮动清除
                // border-bottom: 1px solid #333;
                span{
                    position: absolute;
                    left: -35px;
                    top: 10;
                }
                .line{
                    border-bottom: 1px solid #fff;
                    height: 0px;
                    width: 10px;
                    left: 5px;
                    top: 20px;
                }
                .begin{
                    font-size: 14px;
                    position: absolute;
                    left: -70px;
                    top: -9px;
                }
                .end{
                    font-size: 14px;
                    position: absolute;
                    left: -70px;
                    top: -9px;
                }
            }.five{
                width: 25px;
                border-bottom: 2px solid #fff;
            }
        }
    }.distance{
        width: 30px;
        .up{
            height: 0px;
            width: 100%;
            border-bottom: 1px solid #f79d00;
            position: relative;
            .jiantou{
                position: absolute;
                height: 15px;
                width: 1px;
                background: #f79d00;
                top: -15px;
                left: 48%;

            }::before{
                    content: '';
                    display: inline-block;
                    width: 7px;
                    height: 7px;
                    border-top: 1px solid #f79d00;
                    border-right: 1px solid #f79d00;
                    -ms-transform: rotate(135deg);
                    transform: rotate(135deg);
                    -webkit-transform: rotate(135deg);
                    position: absolute;
                    top: 8px;
                    left: -3px;
            }
        }
        .mid{//用于调节高度
            height: 100px;
            position: relative;
            width: 100%;
            .bt{
                height: 0px;
                position: absolute;
                bottom: 1px;
                width: 100%;
                border-bottom: 1px solid #f79d00;
            }
            .ErectLine{
                width: 50%;
                height: 100%;
                float: left;
                // border-right: 1px solid #fff;
                position: relative;
            }
            // .ErectLine::before{
            //     content: '';
            //     display: inline-block;
            //     width: 10px;
            //     height: 10px;
            //     border-top: 1px solid #333;
            //     border-right: 1px solid #333;
            //     -ms-transform: rotate(-45deg);
            //     transform: rotate(-45deg);
            //     -webkit-transform: rotate(-45deg);
            //     position: absolute;
            //     top: 0;
            //     left: 44px;
            // }
            // .ErectLine::after{
            //     content: '';
            //     display: inline-block;
            //     width: 10px;
            //     height: 10px;
            //     border-top: 1px solid #333;
            //     border-right: 1px solid #333;
            //     -ms-transform: rotate(135deg);
            //     -webkit-transform: rotate(135deg);
            //     position: absolute;
            //     bottom: 1px;
            //     left: 44px;
            // }
        }
        .rdown{
            height: 30px;
            width: 100%;
            // border-top: 1px solid red;
            position: relative;
            // margin-top: -2px;
            .contain{
                position: absolute;
                height: 30px;
                width: 100%;
                top: -15px;
            }        
            .djiantou{
                position: absolute;
                height: 15px;
                width: 1px;
                background: #f79d00;
                top: 0px;
                left: 48%;

            }
            .djiantou::before{
                    content: '';
                    display: inline-block;
                    width: 7px;
                    height: 7px;
                    border-top: 1px solid #f79d00;
                    border-right: 1px solid #f79d00;
                    -ms-transform: rotate(-45deg);
                    transform: rotate(-45deg);
                    -webkit-transform: rotate(-45deg);
                    position: absolute;
                    top: 0px;
                    left: -3px;
            }
        }
    }
    .ncommon.ruler{
        position: relative;
        .r-begin{
            position: absolute;
            width: 30px;;
            height: 1px;
            border-top:1px solid #fff; 
            right: 0;
        }
        .r-end{
            position: absolute;
            height: 1px;
            border-top:1px solid #fff; 
            width: 30px;;
            right: 0;
            bottom: 0;
        }
        .snum{
            position: absolute;
            right: 35px;
            top: -6px;
        }
        .enum{
             position: absolute;
            right: 35px;
            bottom: -5px;
        }
    }
    .cube-wrapper{
        position: relative;
        // margin-left: 50px;
        display: inline-block;
        transform-style: preserve-3d;
        -webkit-transform-style: preserve-3d;
        transform: rotateX(-170deg) rotateY(30deg);
        -webkit-transform: rotateX(-170deg) rotateY(30deg);
        margin-top: -5px;
        margin-left: -6px;
        }
        .cube-box{
            transform-style: preserve-3d;
            -webkit-transform-style: preserve-3d;
            width: 200px;
            height: 10px;
            position: absolute;
            left: 0;
            bottom: 0;
            // transition: height .5s;
        }
        .cube{
            position: absolute;
            left: 0;
            top: 0;
            // opacity: .5;
        }
        .cube1{
            width: 100%;
            height: 100%;
            background: #f5d3d3;
        }
        .cube2{
            // width: 80px;
            width: 130px;
            height: 100%;
            background: -webkit-linear-gradient(to left,#93999b,#feffff);
            background: -o-linear-gradient(to left,#93999b,#feffff);
            background: -moz-linear-gradient(to left,#93999b,#feffff);
            background: -mos-linear-gradient(to left,#93999b,#feffff);
            background: linear-gradient(to left,#93999b,#feffff);
            -webkit-transform-origin: left top;
            -webkit-transform: rotateY(-90deg);
            transform-origin: left top;
            transform: rotateY(-90deg);
        }
        .cube3{
            width: 100px;
            height: 100%;
            background: #f59a9a;
             -webkit-transform-origin: right top;
             -webkit-transform: rotateY(90deg);
              transform-origin: right top;
             transform: rotateY(90deg);
        }
        .cube4{
            // width: 160px;
            width: 190px;
            height: 100%;
            background: -o-linear-gradient(to right,#93999b,#feffff);
            background: -moz-linear-gradient(to right,#93999b,#feffff);
            background: -mos-linear-gradient(to right,#93999b,#feffff);
            background: linear-gradient(to right,#93999b,#feffff);
             -webkit-transform-origin: right top;
             -webkit-transform: translateZ(80px);
             transform-origin: right top;
             transform: translateZ(129px);
        }
        .cube5{
            width: 100%;
            padding-top: 50px;
            background: #f14646;
            transform-origin: left top;
            transform: rotateX(90deg);
        }
        .cube6{
            // width: 160px;
            // padding-top: 80px;
            width: 190px;
            padding-top: 130px;
            background: -webkit-linear-gradient(to left,#92929c,#feffff);
            background: -o-linear-gradient(to left,#92929c,#feffff);
            background: -moz-linear-gradient(to left,#92929c,#feffff);
            background: -mos-linear-gradient(to left,#92929c,#feffff);
            background: linear-gradient(to left,#92929c,#feffff);
            top: inherit;
            bottom: 0;
             -webkit-transform-origin: left bottom;
             -webkit-transform: rotateX(-90deg);
              transform-origin: left bottom;
             transform: rotateX(-90deg);
        }
    .btn{

    }
    }
    @-webkit-keyframes btmoveOne /* Safari and Chrome */
      {
            0%   {bottom:-70%;}
            100% {bottom:0;}
      }
    @-webkit-keyframes btmoveSecond /* Safari and Chrome */
    {
          0%   {bottom:0;}
          100% {bottom:-70%;}
    }
  }
}
</style>
