<template>
  <div class="hisWeldInfo" :class="envType=='env_ios'?'env_ios_gClass':''">
    <!-- <div class="header"><Icon type="ios-arrow-back" @click="go('/hisWeldList')"/>History Detail</div> -->
   <Head :wantTo="'/hisWeldList'" :headName="'History Detail'"></Head>
    <div class="mainPanel">
        <div class="panel-inner">
             <div class="m-l1"></div>
                <div class="modelName">{{name}}</div>
                <div class="m-show" v-if="name=='MIG SYN'">
                    <div class="m-s-l">{{tmp1}}<span class="unit">{{calcUnit()}}</span></div>
                    <div class="m-s-r">{{tmp2}}</div>
                </div>
                <div class="m-show" v-if="name=='MIG MAN'">
                    <div class="m-s-l">{{tmp1}}<span class="unit">{{calcUnit()}}</span></div>
                    <div class="m-s-r">{{tmp2}}</div>
                </div>
                <div class="m-show" v-if="name=='TIG SYN'">
                    <div class="m-s-l_current">{{tmp1}}</div>
                    <div class="m-s-r_gas">{{tmp2}}</div>
                </div>
                <!-- <div class="m-show" v-if="name=='TIG MAN'">
                    <div class="m-s-l">{{tmp1}}</div>
                </div> -->
                <div class="m-show" v-if="name=='MMA'">
                    <div class="m-s-l_current">{{tmp2}}</div>
                    <div class="m-s-l_force">{{tmp1}}</div>
                </div>
                <div class="m-show" v-if="name=='CUT'">
                    <div class="m-s-l_current">{{tmp2}}</div>
                </div>
                <div class="m-l2">
                    
                </div>
                <ul class="params">
                    <li v-for="(item,index) in nowTypeList"  :class="item.typeName=='GAS'&& MIG_MATERIAL !=0?'eleUnShow':''">
                        <div class="p-l-l">{{changeStrShowName(item.typeName)}}</div>
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
    <div class="btnli">
          <div class="appBtn" type="primary" ghost @click="applyWeld">Application</div>
          <!-- <Button type="info" ghost class="info" @click="go('/memoryManage')">保存焊接参数</Button> -->
    </div>
    <Loading :is-loading="isLoading"></Loading>
  </div>
</template>

<script>
import { Toast ,Indicator } from 'mint-ui'
import Loading from "@/components/base/Loading";
import Head from "@/components/base/header";
export default {
  name: '',
  components: {
   Loading,
   Head
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
        
        nowConnectMachine:'',

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
        paramKeysNameMap:{
            pre_gas:'Pre Gas',
            start_cur_end:'Start Current',
            pulse_duty:'Pulse Duty',
            pulse_fre:'Pulse Fre',
            base_cur:'Base Current',
            slop_down:'Slop Down',
            slop_up:'Slop Up',
            crater_cur:'Crater Current',
            post_gas:'Post Gas',
            ac_balance:'Ac Balance',
            ac_fre:'Ac Fre',
            weld_current:'Weld current'

        },//显示的名字
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
        nowConnectMachine:'',
        modelType:'',
        comfromFlag:true,
        isLoading:false,
        loadingTimer:'',
     } 
  },

  methods: {
        calcUnit(){
            if(this.UnitFlag==1){
                return 'M/Min';
            }else{
                return 'inch/min';
            }
        },
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
          var num='';
            if(self.isModbusModal){
                num =self.jinzhiChange10jinzhiFuc(self.type);
            }else{
                num =self.jinzhiChangeFuc(self.type);
            }
        var crc = self.crcModelBusClacQuery(dirctCode + num, true);
        var sendData = "DA" + dirctCode + num + crc;
         
           self.callSendDataToBleUtil('hisWeldInfo',sendData,crc);
           self.isLoading =true;
           self.loadingTimer =setTimeout(() => {
              if(self.isLoading){
                self.isLoading=false;
              }
            }, 11000);
            self.$store.state.nowModelDirectice=self.modelCrc;
            self.modelType = self.modelCrc;
          //前往 参数可以修改的页面
        //   alert(self.type);
        //   this.broastFromAndroid3(this.GLOBAL_CONFIG.testData.migsyn.heade+this.GLOBAL_CONFIG.testData.migsyn.data,'newIndex');
        //   self.gohisWeld(self.type);
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
                    self.$router.push({ path: '/weld_tig_man_his', query:{type:'TIGMAN',pageBackTo:'/hisWeldList'} });
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
        goBack(){
            this.$router.push({path:'/hisWeldList',query:{}}); 
        },
        //注意和memorydetail里一致
        buildTigManData(list){
            console.log( this.nowModelTypeName )
                if ( this.nowModelTypeName == "2T_NOPULSE_DC") {//plusE ON 
                            var t0 ={typeName:this.paramKeysNameMap.pre_gas,value:list.PRE_GAS_VAL/10+'s'};   
                            // var t1 ={typeName:this.paramKeysNameMap.start_cur_end,value:list.START_CUR_VAL+'A'};
                            var t2 ={typeName:this.paramKeysNameMap.pulse_duty,value:list.DUTY_VAL/10+'%'};
                            var t3 ={typeName:this.paramKeysNameMap.pulse_fre,value:list.PULSE_FRE_VAL/10+'Hz'};
                            var t4 ={typeName:this.paramKeysNameMap.base_cur,value:list.BASE_CUR_VAL+'A'};
                            var t5 ={typeName:this.paramKeysNameMap.slop_down,value:list.SLOP_DOWN_VAL/10+'s'};
                            var t6 ={typeName:this.paramKeysNameMap.slop_up,value:list.STOP_UP_VAL/10+'s'};
                            // var t7 ={typeName:this.paramKeysNameMap.crater_cur,value:list.CRATER_CUR_VAL+'A'};
                            var t8 ={typeName:this.paramKeysNameMap.post_gas,value:list.PRE_GAS_VAL/10+'s'}; 
                            var t9 ={typeName:this.paramKeysNameMap.weld_current,value:list.WELD_CUR_VAL+'A'};
                            
                            this.suppllytments.push(t0);
                            // this.suppllytments.push(t1);
                            this.suppllytments.push(t2);
                            this.suppllytments.push(t3);
                            this.suppllytments.push(t4);
                            this.suppllytments.push(t5);
                            this.suppllytments.push(t6);
                            // this.suppllytments.push(t7);
                            this.suppllytments.push(t8);
                            this.suppllytments.push(t9);
                } else if ( this.nowModelTypeName == "4T_NOPULSE_DC") { //plusE ON 
                            //      pre_gas:'Pre Gas',
                            // start_cur_end:'Start Current',
                            // pulse_duty:'Pulse Duty',
                            // pulse_fre:'Pulse Fre',
                            // base_cur:'Base Current',
                            // slop_down:'Slop Down',
                            // slop_up:'Slop Up',
                            // crater_cur:'Crater Current',
                            // post_gas:'Post Gas',
                            // weld_current:'Weld current'
                            var t0 ={typeName:this.paramKeysNameMap.pre_gas,value:list.PRE_GAS_VAL/10+'s'};   
                            var t1 ={typeName:this.paramKeysNameMap.start_cur_end,value:list.START_CUR_VAL+'A'};
                            var t2 ={typeName:this.paramKeysNameMap.pulse_duty,value:list.DUTY_VAL/10+'%'};
                            var t3 ={typeName:this.paramKeysNameMap.pulse_fre,value:list.PULSE_FRE_VAL/10+'Hz'};
                            var t4 ={typeName:this.paramKeysNameMap.base_cur,value:list.BASE_CUR_VAL+'A'};
                            var t5 ={typeName:this.paramKeysNameMap.slop_down,value:list.SLOP_DOWN_VAL/10+'s'};
                            var t6 ={typeName:this.paramKeysNameMap.slop_up,value:list.STOP_UP_VAL/10+'s'};
                            var t7 ={typeName:this.paramKeysNameMap.crater_cur,value:list.CRATER_CUR_VAL+'A'};
                            var t8 ={typeName:this.paramKeysNameMap.post_gas,value:list.PRE_GAS_VAL/10+'s'}; 
                            var t9 ={typeName:this.paramKeysNameMap.weld_current,value:list.WELD_CUR_VAL+'A'};
                            
                            this.suppllytments.push(t0);
                            this.suppllytments.push(t1);
                            this.suppllytments.push(t2);
                            this.suppllytments.push(t3);
                            this.suppllytments.push(t4);
                            this.suppllytments.push(t5);
                            this.suppllytments.push(t6);
                            this.suppllytments.push(t7);
                            this.suppllytments.push(t8);
                            this.suppllytments.push(t9);
                        
                    }else if ( this.nowModelTypeName == "2T_PULSE_DC") {// pulse off
                            var t0 ={typeName:this.paramKeysNameMap.pre_gas,value:list.PRE_GAS_VAL/10+'s'};      
                            var t6 ={typeName:this.paramKeysNameMap.slop_up,value:list.STOP_UP_VAL/10+'s'};
                            var t11 ={typeName:this.paramKeysNameMap.weld_current,value:list.WELD_CUR_VAL+'A'};
                            var t5 ={typeName:this.paramKeysNameMap.slop_down,value:list.SLOP_DOWN_VAL/10+'s'};
                            var t8 ={typeName:this.paramKeysNameMap.post_gas,value:list.POST_GAS_VAL/10+'s'};
                            // var t1 ={typeName:this.paramKeysNameMap.start_cur_end,value:list.START_CUR_VAL+'A'};
                            // var t7 ={typeName:this.paramKeysNameMap.crater_cur,value:list.CRATER_CUR_VAL+'A'};
                            // var t2 ={typeName:this.paramKeysNameMap.pulse_duty,value:list.DUTY_VAL/10+'%'};
                            // var t4 ={typeName:this.paramKeysNameMap.base_cur,value:list.BASE_CUR_VAL+'A'};
                            // var t3 ={typeName:this.paramKeysNameMap.pulse_fre,value:list.PULSE_FRE_VAL/10+'Hz'};


                            this.suppllytments.push(t0);
                            this.suppllytments.push(t6);
                            this.suppllytments.push(t11);
                            this.suppllytments.push(t5);
                            this.suppllytments.push(t8);
                            // this.suppllytments.push(t1);
                            // this.suppllytments.push(t7);
                            // this.suppllytments.push(t2);
                            // this.suppllytments.push(t4);
                            // this.suppllytments.push(t3);
                    }else if( this.nowModelTypeName=='4T_PULSE_DC'){
                            var t0 ={typeName:this.paramKeysNameMap.pre_gas,value:list.PRE_GAS_VAL/10+'s'};      
                            var t6 ={typeName:this.paramKeysNameMap.slop_up,value:list.STOP_UP_VAL/10+'s'};
                            var t11 ={typeName:this.paramKeysNameMap.weld_current,value:list.WELD_CUR_VAL+'A'};
                            var t5 ={typeName:this.paramKeysNameMap.slop_down,value:list.SLOP_DOWN_VAL/10+'s'};
                            var t8 ={typeName:this.paramKeysNameMap.post_gas,value:list.POST_GAS_VAL/10+'s'};
                            var t1 ={typeName:this.paramKeysNameMap.start_cur_end,value:list.START_CUR_VAL+'A'};
                            var t7 ={typeName:this.paramKeysNameMap.crater_cur,value:list.CRATER_CUR_VAL+'A'};
                            // var t2 ={typeName:this.paramKeysNameMap.pulse_duty,value:list.DUTY_VAL/10+'%'};
                            // var t4 ={typeName:this.paramKeysNameMap.base_cur,value:list.BASE_CUR_VAL+'A'};
                            // var t3 ={typeName:this.paramKeysNameMap.pulse_fre,value:list.PULSE_FRE_VAL/10+'Hz'};


                            this.suppllytments.push(t0);
                            this.suppllytments.push(t6);
                            this.suppllytments.push(t11);
                            this.suppllytments.push(t5);
                            this.suppllytments.push(t8);
                            this.suppllytments.push(t1);
                            this.suppllytments.push(t7);
                            // this.suppllytments.push(t2);
                            // this.suppllytments.push(t4);
                            // this.suppllytments.push(t3);
                    }
                    
                    if(this.nowDCORACFLAG==0){ //1:
                        var t9 ={typeName:this.paramKeysNameMap.ac_balance,value:list.AC_DUTY_VAL+'%'};//交流占空比
                        var t10 ={typeName:this.paramKeysNameMap.ac_fre,value:list.AC_FRE_VAL+'Hz'};
                        this.suppllytments.push(t9);
                        this.suppllytments.push(t10);
                    }
        },
        //废弃
        buildTigManData_20201105(list){
            if ( this.nowModelTypeName == "2T_NOPULSE_DC") {
                        // var t0 ={typeName:'PRE-GAS',value:list.PRE_GAS_VAL/10+'s'};      
                        // var t6 ={typeName:'SLOP-UP',value:list.STOP_UP_VAL/10+'s'};
                        // var t11 ={typeName:'WELD-CURRENT',value:list.WELD_CUR_VAL+'A'};
                        // var t5 ={typeName:'SLOP-DOWN',value:list.SLOP_DOWN_VAL/10+'s'};
                        // var t8 ={typeName:'POST-GAS',value:list.POST_GAS_VAL/10+'s'};
                        var t0 ={typeName:this.paramKeysNameMap.pre_gas,value:list.PRE_GAS_VAL/10+'s'};      
                        var t6 ={typeName:this.paramKeysNameMap.slop_up,value:list.STOP_UP_VAL/10+'s'};
                        var t11 ={typeName:this.paramKeysNameMap.weld_current,value:list.WELD_CUR_VAL+'A'};
                        var t5 ={typeName:this.paramKeysNameMap.slop_down,value:list.SLOP_DOWN_VAL/10+'s'};
                        var t8 ={typeName:this.paramKeysNameMap.post_gas,value:list.POST_GAS_VAL/10+'s'};
                        this.suppllytments.push(t0);
                        this.suppllytments.push(t6);
                        this.suppllytments.push(t11);
                        this.suppllytments.push(t5);
                        this.suppllytments.push(t8);
               } else if ( this.nowModelTypeName == "4T_NOPULSE_DC") {
                        var t0 ={typeName:this.paramKeysNameMap.post_gas,value:list.PRE_GAS_VAL/10+'s'};      
                        var t6 ={typeName:this.paramKeysNameMap.slop_up,value:list.STOP_UP_VAL/10+'s'};
                        var t11 ={typeName:this.paramKeysNameMap.weld_current,value:list.WELD_CUR_VAL+'A'};
                        var t5 ={typeName:this.paramKeysNameMap.slop_down,value:list.SLOP_DOWN_VAL/10+'s'};
                        var t8 ={typeName:this.paramKeysNameMap.post_gas,value:list.POST_GAS_VAL/10+'s'};
                        var t1 ={typeName:this.paramKeysNameMap.start_cur_end,value:list.START_CUR_VAL+'A'};
                        var t7 ={typeName:this.paramKeysNameMap.crater_cur,value:list.CRATER_CUR_VAL+'A'};

                        this.suppllytments.push(t0);
                        this.suppllytments.push(t6);
                        this.suppllytments.push(t11);
                        this.suppllytments.push(t5);
                        this.suppllytments.push(t8);
                        this.suppllytments.push(t1);
                        this.suppllytments.push(t7);
                }else if ( this.nowModelTypeName == "2T_PULSE_DC") {
                        var t0 ={typeName:this.paramKeysNameMap.pre_gas,value:list.PRE_GAS_VAL/10+'s'};      
                        var t6 ={typeName:this.paramKeysNameMap.slop_up,value:list.STOP_UP_VAL/10+'s'};
                        var t11 ={typeName:this.paramKeysNameMap.weld_current,value:list.WELD_CUR_VAL+'A'};
                        var t5 ={typeName:this.paramKeysNameMap.slop_down,value:list.SLOP_DOWN_VAL/10+'s'};
                        var t8 ={typeName:this.paramKeysNameMap.post_gas,value:list.POST_GAS_VAL/10+'s'};
                        var t2 ={typeName:this.paramKeysNameMap.pulse_duty,value:list.DUTY_VAL/10+'%'};
                        var t4 ={typeName:this.paramKeysNameMap.base_cur,value:list.BASE_CUR_VAL+'A'};
                        var t3 ={typeName:this.paramKeysNameMap.pulse_fre,value:list.PULSE_FRE_VAL/10+'Hz'};

                        this.suppllytments.push(t0);
                        this.suppllytments.push(t6);
                        this.suppllytments.push(t11);
                        this.suppllytments.push(t5);
                        this.suppllytments.push(t8);
                        this.suppllytments.push(t2);
                        this.suppllytments.push(t4);
                        this.suppllytments.push(t3);
                }else if( this.nowModelTypeName=='4T_PULSE_DC'){
                        var t0 ={typeName:this.paramKeysNameMap.pre_gas,value:list.PRE_GAS_VAL/10+'s'};      
                        var t6 ={typeName:this.paramKeysNameMap.slop_up,value:list.STOP_UP_VAL/10+'s'};
                        var t11 ={typeName:this.paramKeysNameMap.weld_current,value:list.WELD_CUR_VAL+'A'};
                        var t5 ={typeName:this.paramKeysNameMap.slop_down,value:list.SLOP_DOWN_VAL/10+'s'};
                        var t8 ={typeName:this.paramKeysNameMap.post_gas,value:list.POST_GAS_VAL/10+'s'};
                        var t1 ={typeName:this.paramKeysNameMap.start_cur_end,value:list.START_CUR_VAL+'A'};
                        var t7 ={typeName:this.paramKeysNameMap.crater_cur,value:list.CRATER_CUR_VAL+'A'};
                        var t2 ={typeName:this.paramKeysNameMap.pulse_duty,value:list.DUTY_VAL/10+'%'};
                        var t4 ={typeName:this.paramKeysNameMap.base_cur,value:list.BASE_CUR_VAL+'A'};
                        var t3 ={typeName:this.paramKeysNameMap.pre_gas.pulse_fre,value:list.PULSE_FRE_VAL/10+'Hz'};


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
                    var t9 ={typeName:this.paramKeysNameMap.ac_balance,value:list.AC_DUTY_VAL+'%'};//交流占空比
                    var t10 ={typeName:this.paramKeysNameMap.ac_fre,value:list.AC_FRE_VAL+'Hz'};
                    this.suppllytments.push(t9);
                    this.suppllytments.push(t10);
                }
    },
    checkModal(data){
        switch (data.substring(2,4)) {
            case 'E1':
                return this.GLOBAL_CONFIG.callWeldTypeData.migsyn.crcCode
                break;
            case 'E2':
                return this.GLOBAL_CONFIG.callWeldTypeData.migman.crcCode
                break;
            case 'E3':
                return this.GLOBAL_CONFIG.callWeldTypeData.tigsyn.crcCode
                break;
            case 'E4':
                return this.GLOBAL_CONFIG.callWeldTypeData.tigman.crcCode
                break;
            case 'E5':
                return this.GLOBAL_CONFIG.callWeldTypeData.mma.crcCode
                break;
            case 'E6':
                return this.GLOBAL_CONFIG.callWeldTypeData.cut.crcCode
                break;
            default:
                return this.modelType;
                break;
        }
    },
     //for android 给安卓用的方法 begin
    broastFromAndroid3(data,pageFrom){
        this.isLoading =false;
        clearTimeout(this.loadingTimer);
      console.log(data)
      let that =this;
        // alert('newindex::'+that.modelType+'|||'+that.$store.state.nowModelDirectice);
       if(that.$store.state.nowModelDirectice!='' && that.modelType!=that.$store.state.nowModelDirectice){
          // alert(11)
          return;
        }
        else if(that.checkModal(data)!=that.modelType){
            return;
        }
        else{
          // alert(22)
             that.$store.state.nowModelDirectice=that.modelType;
              // Toast({
              //       message: 'this.mo222delType'+data,
              //       position: 'middle',
              //       iconClass: 'icon icon-success',
              //       duration: 1500
              //     });
            //  var rst =this.buildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.migsyn.crcCode,'dae1 00 00 00 00 02 00 003C 003D 00b4 00c8 02 09 5952'.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
            that.$store.state.nowModelDirectice =that.modelType
            that.wtlLog('newIndex_bfa3','this.modelType'+that.modelType+"comfromFlag"+that.comfromFlag);
            var rst =that.buildData('newIndex',that.modelType,data.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
            that.isLoading=false;
            
            //  alert(this.comfromFlag)
            if(!that.comfromFlag){
              //不是来自按钮点击 是单片机自动上发的话 不做跳转 告诉收到
                //  alert('来了');
                  var invalue =data.substring(data.length-4,data.length);
                  that.callSendDataToBleUtil('newIndex','DAFF'+invalue+that.crcModelBusClacQuery('FF'+invalue, true),invalue);
                  return;
            }
            that.comfromFlag=false;
            if(JSON.stringify(rst) != "{}"){
                //发送确认收到的指令给安卓
                var invalue =data.substring(data.length-4,data.length);
                //新规则: 指令ff+crc+检验crc   测试模式不发送
                that.callSendDataToBleUtil('newIndex','DAFF'+invalue+that.crcModelBusClacQuery('FF'+invalue, true),invalue);
                that.isLoading =false;
                
              
                //焊接中的状态返回参数不需要跳转
                if(that.$store.state.weldingStatus==1){
                  return;
                }
                
                if(that.modelType==that.GLOBAL_CONFIG.callWeldTypeData.tigman.crcCode){
                  that.go('/weld_tig_man');//最复杂
                }else if(that.modelType==that.GLOBAL_CONFIG.callWeldTypeData.tigsyn.crcCode){
                  that.go('/weld_tig_syn');
                }else if(that.modelType==that.GLOBAL_CONFIG.callWeldTypeData.mma.crcCode){
                  that.go('/weld_mma');
                }else if(that.modelType==that.GLOBAL_CONFIG.callWeldTypeData.cut.crcCode){
                  that.go('/weld_cut');
                }else{
                  that.go('/weld_common?type='+rst.weldType);
                }
            }    
        }
         
    }
  },
  mounted: function () {
     //请求相应的最后一次焊接记录
    //  this.$route.query.type
      this.nowConnectMachine =this.$store.state.nowConnectMachine;
      Indicator.close();
      this.name = this.$route.query.name;
      this.type = this.$route.query.type;
      this.modelCrc =this.$route.query.modelCrc;
    //   alert(this.modelCrc)
      var list  =this.$store.state.rstInfo;
      console.log(list)
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
      switch (this.type) {
        case 0://migsyn
          
           this.tmp1 =(list.SPEED_DISPLAY/10+'').indexOf('.')>0?list.SPEED_DISPLAY/10:list.SPEED_DISPLAY/10+'.0';
           this.tmp2 =(list.V_WELDING/10+'').indexOf('.')>0?list.V_WELDING/10:list.V_WELDING/10+'.0';
          break;
        case 1://migman
            this.tmp1 =(list.SPEED_DISPLAY/10+'').indexOf('.')>0?list.SPEED_DISPLAY/10:list.SPEED_DISPLAY/10+'.0';
            this.tmp2 =(list.V_WELDING/10+'').indexOf('.')>0?list.V_WELDING/10:list.V_WELDING/10+'.0';
        break;
      case 2://tig syn
            this.tmp1=list.SYN_WELD_CUR;
            this.tmp2=list.postGasTime
          break;
      case 3://tig MAN
               this.nowModelTypeName =list.initBean.nowChooseModel;
                this.nowDCORACFLAG =list.initBean.polatrity;
                this.buildTigManData(list);
          break;
      case 4:
             //推力 电流是整数
            // this.tmp1 = (list.ARC_FORCE_VAL/10+'').indexOf('.')>0?list.ARC_FORCE_VAL/10:list.ARC_FORCE_VAL/10+'.0';
            // this.tmp2 =(list.MMA_CURRENT_VAL+'').indexOf('.')>0?list.MMA_CURRENT_VAL/10:list.MMA_CURRENT_VAL+'.0';
            this.tmp1 = list.ARC_FORCE_VAL;
            this.tmp2 =list.MMA_CURRENT_VAL;
        break;
      case 5:
             //电流是整数
            this.tmp2 =list.CUT_CURRENT_VAL;
        break;
      default:
          break;
      }
    if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.goBack, false);
    } 
    let that =this;
     window['broastFromAndroid'] = (data,pageFrom) => {
         alert(data)
          //如果和现在选的模式不一致，不进行跳转
          //  alert(data)
        //   if(that.$store.state.oldBroastData && that.$store.state.oldBroastData===data){
        //     //重复不做处理
        //     if(!that.$store.state.havedClickPage){
        //         return;
        //     }
            
        //   }
          // alert(data)
        //   that.$store.state.havedClickPage=false;
          that.$store.state.oldBroastData =data;
          that.wtlLog("hisweldInfo",'ppp::'+that.$store.state.AdroidNewMsg+'||||'+that.$store.state.AdroidOldMsg);
          // alert('ppp::'+that.$store.state.AdroidNewMsg+'||||'+that.$store.state.AdroidOldMsg);
          if(that.$store.state.AdroidOldMsg){
            that.$store.state.AdroidNewMsg =data;
          }else{
            that.$store.state.AdroidNewMsg =data;
            that.$store.state.AdroidOldMsg=data;
          }
          that.wtlLog('hisweldinfo','broastFromAndroid3='+data); 
          that.broastFromAndroid3(data,pageFrom,that);
          
      }
  },
  created () {
   
  },
  computed:{
    envType(){
        return this.$store.state.envType;
    }
  },destroyed(){
     clearTimeout(this.loadingTimer);
     window.removeEventListener('popstate', this.goBack, false);
  }
}
</script>
<style lang="scss" scoped>
.hisWeldInfo{
  color: #fff;
  width: 100%;
  min-height: 100vh;
  background:#053342;
  // background: linear-gradient(
  //   to top,
  //   rgba(24, 65, 81, 1) 0%,
  //   rgba(27, 72, 90, 1) 20%,
  //   rgba(26, 71, 89, 1) 50%,
  //   rgba(27, 72, 90, 1) 80%,
  //   rgba(57, 97, 113, 1) 90%,
  //   rgba(24, 65, 81, 1) 100%
  // );
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
  &.env_ios_gClass{
       /deep/ .header{
       .ivu-icon{
            top:30px!important;
        }
      }
  }
  .maginname{
      margin-top: 20px;
      padding: 0 20px;
      font-size: 16px;
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
  .mainPanel{
      
            padding: 100px 20px 80px 20px;
            // background: #092b37;
            // box-shadow:
            //     // 0px -10px 0px 0px #ff0000,   /*上边阴影  红色*/
            //     -1px 0px 0px 0px #1d414d,   /*左边阴影  绿色*/
            //     1px 0px 0px 0px #1d414d,    /*右边阴影  蓝色*/
            //     // 0px 10px 0px 0px #eede15;    /*下边阴影  黄色*/
            //     ;
            .panel-inner{
                box-shadow: -1px 0px 0px 0px #1d414d, 1px 0px 0px 0px #1d414d;
                background: #092b37;
                box-shadow:
                // 0px -10px 0px 0px #ff0000,   /*上边阴影  红色*/
                -1px 0px 0px 0px #1d414d,   /*左边阴影  绿色*/
                1px 0px 0px 0px #1d414d,    /*右边阴影  蓝色*/
                // 0px 10px 0px 0px #eede15;    /*下边阴影  黄色*/
            }
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
                padding: 0 15px;
                min-height: 50px;
                font-size: 46px;
                // color: #83cadf;
                color: #fff;
                margin-bottom: 10px;
                .m-s-l{
                    float: left;
                    background:url(../../assets/images/speed.png) no-repeat;    
                    background-size: 43px;
                    background-position:left center;
                    padding-left: 50px;
                    .unit{
                        font-size: 16px;
                    }
                }
                .m-s-l_current{
                    float: left;
                    background:url(../../assets/images/weld_icon_current.png) no-repeat;    
                    background-size: 43px;
                    background-position:left center;
                    padding-left: 50px;
                }
                .m-s-l_force{
                    float: right;
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
                .m-s-r_gas{
                    float:right;
                    background:url(../../assets/images/postGas.png) no-repeat;    
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
                        // color: #6c888f;
                        color: #fff;
                        font-size: 18px;
                    }
                    .p-l-r{
                        float: right;
                        // color: #aabfc6;
                        color: #fff;
                    }
                }
            }
        }
}
.eleUnShow{
    display: none;
}
// @media screen and (max-width: 400px) {
//   .hisWeldInfo .mainPanel .m-show {font-size: 35px;}
//   .hisWeldInfo .mainPanel .m-show .m-s-l{background-size: 38px;padding-left: 45px;}
//   .hisWeldInfo .mainPanel .m-show .m-s-r{background-size: 38px;padding-left: 45px;}
// }
@media screen and (max-width: 400px) {
   .hisWeldInfo .mainPanel .m-show {font-size: 33px;padding: 0 9px}
   .hisWeldInfo .mainPanel .m-show .m-s-l_current,
   .hisWeldInfo .mainPanel .m-show .m-s-l_force{background-size: 35px;padding-left: 36px;}
   .hisWeldInfo .mainPanel .m-show .m-s-l{background-size: 35px;padding-left: 36px;}
   .hisWeldInfo .mainPanel .m-show .m-s-r{background-size: 35px;padding-left: 36px;}
}
/* x xs */
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
   // iphoneX iphoneXS样式
   .hisWeldInfo .btnli .appBtn{
        height: 60px;
    }
    .hisWeldInfo  .header{
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
   .hisWeldInfo .btnli .appBtn{
        height: 60px;
    }
    .hisWeldInfo  .header{
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
    .hisWeldInfo .btnli .appBtn{
        height: 60px;
    }
    .hisWeldInfo  .header{
        height: 65px;
        line-height: 1;
        padding-top: 30px;
        .ivu-icon{
            top:37px;
        }
    }
}
</style>
