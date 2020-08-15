<template>
  <div class="weldMMA" :class="ifFixedFlag?'weldFixed':''" :style="{height:newContainHeight+100+'px'}" id="allPage" ref="allPage">
    <div class="header">
      <Icon type="ios-arrow-back" @click="go('/newIndex')"/>
      {{changeStrEmptyName(typeName)}}
      <span class="setupyi">SET UP</span>
    </div>
    <div class="mmp" ref="mmpId" id="idid">
      <div class="con-box">
           <div class="containList" v-for="(item,index) in nowTypeList" :key="index">
            <div class="common">
              <div class="typename" v-if="UnitFlag==1" :class="item.typeName" @click="openModal(item.typeName,item.inchComList,item.chooseKey)">{{changeStrShowName(item.typeName)}}</div>
              <div class="typename" v-if="UnitFlag!=1" :class="item.typeName" @click="openModal(item.typeName,item.comList,item.chooseKey)">{{changeStrShowName(item.typeName)}}</div>
              <!-- <div class="typename" :class="item.typeName">{{changeStrShowName(item.typeName)}}</div> -->
              <div class="btn">
                <div
                  class="btRight"
                  v-for="(bean,index1) in item.comList"
                  :key="index1"
                  type="primary"
                  v-if="item.chooseKey==bean.id"
                  :class="item.chooseKey==bean.id?'':'unchoose'"
                  @click="openModal(item.typeName,item.comList,item.chooseKey)"
                >
                  <span style="padding-right:11px">{{bean.value}}</span>
                  <span style="padding-right:10px;">
                    <img src="../../assets/images/edit.png">
                  </span>
                </div>
              </div>
            </div>
          </div>
      </div>
      <div class="midLine1">
        <div class="left"></div>
        <div class="right"></div>
      </div>
      <div class="electricCurrent Voltage">
        <!-- canvas 1 -->
        <!-- <div class="canvas-main-contain">
          <canvas ref="myCanvas1" style="padding-left: 30px;"></canvas>
        </div> -->
        <!-- canvas 2 -->
        <!-- <div class="canvas-two" v-show="nowDCORACFLAG=='1'">
          <canvas ref="myCanvas2"></canvas>
        </div> -->
        <!-- 新逻辑直接用图替换 -->
        <div class="canvas-main-contain">
          <img v-if="nowChooseLineKey=='pre_gas'"  src="../../assets/images/tigman/brokenLine_pre_gas.png">
          <img v-if="nowChooseLineKey=='start_cur_end'" src="../../assets/images/tigman/brokenLine_start_cur_end.png">
          <img v-if="nowChooseLineKey=='slop_up'" src="../../assets/images/tigman/brokenLine_slop_up.png">
          <!-- <img v-if="nowChooseLineKey=='weld_cur' && nowModelTypeName !='4T_PULSE_DC' && nowModelTypeName !='2T_PULSE_DC' " src="../../assets/images/tigman/brokenLine_weld_cur.png"> -->
          <!-- <img v-if="nowChooseLineKey=='weld_cur' && (nowModelTypeName =='4T_PULSE_DC' ||nowModelTypeName =='2T_PULSE_DC' )" src="../../assets/images/tigman/brokenLine_pluse_weld_cur.png"> -->
          <img v-if="nowChooseLineKey=='weld_cur'" src="../../assets/images/tigman/brokenLine_weld_cur.png">
           <img v-if="nowChooseLineKey=='base_cur'" src="../../assets/images/tigman/brokenLine_base_cur.png">
          <img v-if="nowChooseLineKey=='slop_down'" src="../../assets/images/tigman/brokenLine_slop_down.png">
          <img v-if="nowChooseLineKey=='crater_cur'" src="../../assets/images/tigman/brokenLine_crater_cur.png">
          <img v-if="nowChooseLineKey=='post_gas'" src="../../assets/images/tigman/brokenLine_post_gas.png">
          <img v-if="nowChooseLineKey=='ac_balance'" src="../../assets/images/tigman/brokenLine_ac_balance.png">
          <img v-if="nowChooseLineKey=='ac_fre'" src="../../assets/images/tigman/brokenLine_ac_fre.png">
           <img v-if="nowChooseLineKey=='pulse_duty'" src="../../assets/images/tigman/brokenLine_pulse_duty.png">
           <img v-if="nowChooseLineKey=='pulse_fre'" src="../../assets/images/tigman/brokenLine_pulse_fre.png">
           <img v-if="nowChooseLineKey=='peak_cur'" src="../../assets/images/tigman/brokenLine_pluse_weld_cur.png">
          
          <!-- <img src="../../assets/images/memory.png"> -->
          
        </div> 
        <div class="chooseParams">
          <span class="l" @click="chooseParam(0)"></span>
          <span class="keyname">{{nowChooseLineKeyFuc(nowChooseLineKey)}}</span>
          <span class="r" @click="chooseParam(1)"></span>

        </div>
        <div class="up">
          <!-- <div class="u-left">
            <img src="../../assets/images/voltage.png">
          </div> -->
          <div class="u-right">
            
            <div class="value">
              <div class="bt del" @click="delFuc2()"></div>
              <div class="cct"><span class="con" :class="unit2=='S'?'s':unit2=='A'?'A':unit2=='Hz'?'HZ':unit2=='percent'?'percent':''">{{nowPosionX2}}</span></div>
              <div class="bt add" @click="addFuc2()"></div>
            </div>
            
          </div>
        </div>
        <div class="slider" ref="mySlider2">
          <div class="bgSlider"></div>
          <div class="dangerRange" ref="dangerRange2"></div>
          <!-- <div class="sliderBtn" @touchstart="tStart()" @touchmove="tmove()" @touchend="tEnd()" ref="silderBtnId" :style="{left:nowPosionX+'px'}"></div> -->
          <div class="sliderBtn" ref="sbtn2">
            <div class="left"></div>
            <div class="right"></div>
          </div>
        </div>
        <div class="rdown">{{min2}}~{{max2}}{{unit2=='percent'?'%':unit2}}</div>
      </div>
    </div>
    <div class="footers" :class="btFooterFlag?'unEnough':''">
      <!-- <div class="inducance">INDUCANCE</div> -->
      <div class="new-footer-btns">
        <div class="btn n-1"  @click="go('/saveManage')">
          <div class="shuxian"></div>
          <span>Save</span>
        </div>
        <div class="btn n-2" @click="go('/welding')">
            <span v-if="isReadyFlag!=1">Get Ready</span>
            <span v-if="isReadyFlag==1">Already</span>
        </div>
      </div>
    </div>
    <!-- 底部抽屉弹层 按钮组 begin -->
    <div class="hideWid" v-if="hideFlag" id="hiid">
      <div class="up" v-if="upshowFlag" @click="closeModal"></div>
      <div
        class="down"
        v-if="downshowFlag && nowtypename!='THICKNESS'"
        :class="closeClass?'transdown':''"
      >
        <!-- <Card :bordered="false">
                    <p slot="title">No border title</p>
                    <p>Content of no border type. Content of no border type. Content of no border type. Content of no border type. </p>
        </Card>-->
        <div class="title">
          <div class="le">
            <!-- <img src="../../assets/images/histroy.png"> -->
             <img v-if="nowtypename=='POLATRITY'" src="../../assets/images/blue_acdc.png"> 
             <img v-if="nowtypename=='MODE'" src="../../assets/images/blue_weld_icon_new_mode.png"> 
             <img v-if="nowtypename=='Pulse'" src="../../assets/images/blue_weld_icon_new_pluse.png"> 
              <img v-if="nowtypename=='HF'" src="../../assets/images/blue_weld_icon_new_hf.png"> 
          </div>
          <div class="ri">{{changeStrShowName(nowtypename)}}</div>
        </div>
        <ul class="btlist">
          <li
            v-for="(bean,index1) in showBtnList"
            :key="index1"
            type="primary"
            @click="modalChangeChecked(bean.id)"
          >
            <div class="con" :class="nowChoose==bean.id?'choose':''">{{bean.value}}</div>
          </li>
          <div style="clear:both;"></div>
        </ul>
        <div class="confirm" @click="newCloseModal">OK</div>
      </div>
    </div>
    <!-- 底部抽屉弹层 按钮组 end -->
    <Loading :is-loading="isLoading"></Loading>
  </div>
</template>

<script>
import { MessageBox, Popup, Toast, Indicator } from "mint-ui";
import $ from 'jquery'
import Loading from "@/components/base/Loading";
import weld_commonVue from './weld_common.vue';
 const TIGMAN_DIRECTIVE_MAP =new Map([['MODE','D0'],['POLATRITY','D1'],['HF','D2'],['Pulse','D3'],['BTNS','D4'],['PARAMVALUE','D5']]);
export default {
  name: "",
  components: {
    Loading
  },
  data() {
    return {
      newContainHeight:200,
      isReadyFlag:0,//是否焊接准备完毕
      haveInitTimes:0,//滑动组件初始化 次数 太多次会重复监听
      autoTimeoutFlag:{},//自动跳转定时器
      isLoading:false,
      nowModalTypeId: "", //当前焊接模式的id
      MIG_MATERIAL: "", //联动控制 gas选项出现
      UnitFlag: 0, //是否是inch单位
      btFooterFlag: false, //置底
      timeInterval1: "", //获取安卓原生信息定时器
      //begin 开始弹层中可滑动选择参数开始
      ifFixedFlag: "", //控制不同层滑动
      distanceBegin: "", //区间值最小值
      distanceEnd: "", //区间值最大值
      unit: "mm", //单位
      increaseNum: "", //每次增加的数量值
      disNum: 0, //刻度数量
      disNumAtr: [], //数组
      commonContainHeight: 150, //内容的高度
      avgHeight: "", //平均的刻度高度 百分比数值
      avgHeightValue: "", //间隔 相对于总高度的值
      actualNum: "", //实时数值
      sTopValue: "", //指示器高度位置
      sTopCard: "", //标尺
      clacHeaderHeigt: "", //抽屉弹层顶部的距离
      nowTouchIndex: "", //当前滑动的位置
      touchStartY: "", //触摸位移记录
      //end 开始弹层中可滑动选择参数开始
      // 底部抽屉动画
      showBtnList: [], //弹出的按钮内容集合
      nowChoose: "", //当前选中
      nowtypename: "", //当前选中 的typename
      hideFlag: false,
      closeClass: false,
      upshowFlag: false,
      downshowFlag: false,
      // 电流控制器 begin
      myPosition: {
        left: 0,
        right: 0,
        now: 0,
        isBtn: 2, //焦点
        propoWidth: 0
      },
      max: 10, //默认
      min: 0, //默认
      block: 10, //总的区间
      diffMin: 3, //特殊区间段最小值
      diffMax: 4, //特殊区间最大值
      nowPosionX: 3, //当前位置
      oldPosionX: "", //老的值用于判断是否需要发送给安卓内容
      timerPosition1: "", //定时器避免重复点击 造成连续发送
      touchStartFlag: false,
      InDangerFlag: false,
      paramIncreaseDistance: 0.1, //加减法 按钮的增长幅度
      // 电流控制器 end
      // 电压控制器 begin
      myPosition2: {
        left: 0,
        right: 0,
        now: 0,
        isBtn: 2, //焦点
        propoWidth: 0
      },
      max2: 200,
      min2: 10,
      unit2: "",
      block2: 190, //总的区间
      diffMin2: 20, //特殊区间段最小值
      diffMax2: 60, //特殊区间最大值
      nowPosionX2: 36, //当前位置
      oldNowPosionX2: "",
      timerPosition2: "", //定时器避免重复点击 造成连续发送
      touchStartFlag2: false,
      InDangerFlag2: false,
      paramIncreaseDistance2: 0.1, //加减法 按钮的增长幅度
      // 电压控制器 end
      typeName: "",
      nowTypeList: [], //共通title数据集合
      chooseKey: [], //共通选中集合

      /** tig模式**/
      tigmanList: [
        {
          typeName: "MODE",
          chooseKey: 0, //默认选中
          comList: [
            { id: 0, key: "2T", value: "2T" },
            { id: 1, key: "4T", value: "4T" }
          ]
        },
        {
          typeName: "POLATRITY",
          chooseKey: 0, //默认选中
          comList: [
            { id: 0, key: "AC", value: "AC" },
            { id: 1, key: "DC", value: "DC" },
          ]
        },
        {
          typeName: "Pulse",
          chooseKey: 0, //默认选中
          comList: [
            { id: 0, key: "NOPULSE", value: "NO PULSE" },
            { id: 1, key: "PULSE", value: "PULSE" }
        
          ]
        },
        {
          typeName: "HF",
          chooseKey: 0, //默认选中
          comList: [
            { id: 0, key: "HF", value: "HF" },
            { id: 1, key: "LIFT", value: "LIFT" }
          ]
        }
      ],
      /************* begin 折线部分*/
      canvas: "",
      ctx: "",
      oldx: 0,
      oldy: 100,
      nowChooseLineKey: "",
      listData: [],
      lineNormalColor: "#e0f5fc", //这折线图颜色
      lineChooseColor: "#227cff", //折线图选中的颜色
      nowMaxX: "", //最大x轴值用于canvas居中计算
      paddingLeftNum: "", //左偏移量
      keyArr: [], //key数组
      nowChooseLineKey: "", //现在选中的
      keysRangeMap: "", //数据范围集合
      nowModelTypeName: "", //当前模式名称  用于显示不同的折线图及参数
      //可以通用吧
      constant: {
        pre_gas: "pre_gas", //0 key
        begin_position: "begin_position", //  1
        heart_cur_begin: "heart_cur_begin", //  2
        heart_cur_end: "heart_cur_end", // 3
        start_cur_begin: "start_cur_begin",
        start_cur_end: "start_cur_end", //key
        slop_up_begin: "slop_up_begin", //4 key
        slop_up: "slop_up", //5    key   level 水平
        weld_cur: "weld_cur", //6  key    vertical 垂直
        crater_cur: "crater_cur", //key
        slop_down: "slop_down", //7  key  level 水平
        post_gas_begin: "post_gas_begin",
        post_gas: "post_gas", //8  key  level 水平
        pulse_duty:'pulse_duty',
        pulse_fre:'pulse_fre',
        base_cur:'base_cur',
        ac_balance:'ac_balance',
        ac_fre:'ac_fre'

      },
      /************ end 折线部分*/
      /*** 第二个折线 begin****/
      canvas2:'',
      acListData: [],
      old2y:'',
      old2x:'',
      ctx2:'',
      keyArr2:[],
      /**** end***/
      nowDCORACFLAG:'',//当前是ac还是dc控制第二个canvas是否需要出现
      nowChooseKeysMap:{},
      nowChooseKeysNameMap:{
        // pre_gas:'PRE-GAS',
        // start_cur_end:'START-CURRENT',
        // pulse_duty:'PULSE-DUTY',
        // pulse_fre:'PULSE-FRE',
        // base_cur:'BASE-CURRENT',
        // slop_down:'SLOP-DOWN',
        // slop_up:'SLOP-UP',
        // crater_cur:'CRATER-CURRENT',
        // post_gas:'POST-GAS',
        // ac_balance:'AC-BALANCE',
        // ac_fre:'AC-FRE'
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
        peak_cur:'Peak Current',
        weld_cur:'Welding Current'
      },//显示的名字
      pfc_num:'',
      ac_dc_num:'',
      hf_lift_num:'',
      tigman_min_cur:'',
      tigman_max_cur:'',
      max_ac_fre:'',
      min_ac_fre:'',
      nowChoosedKeyName:'',
    };
  },

  methods: {
      initWeldingAutoRouter(){
           let self =this;
              //是不是焊接中....
              if(self.$store.state.weldingStatus!=1){
                return;
              }
              let allPage = self.$refs.allPage;
              self.autoTimeoutFlag =setTimeout(() => {
                   //没有做任何操作就跳转
                   self.$router.push('/welding');
                }, self.GLOBAL_CONFIG.autoRouterTime);
              allPage.addEventListener('touchmove',(e)=>{//屏幕触摸事件
                  clearTimeout(self.autoTimeoutFlag);
              });
              allPage.addEventListener('touchend',(e)=>{//屏幕触摸事件
                  clearTimeout(self.autoTimeoutFlag);
                  self.autoTimeoutFlag =setTimeout(() => {
                    //没有做任何操作就跳转
                    self.$router.push('/welding');
                  }, self.GLOBAL_CONFIG.autoRouterTime);
              });
        },
    nowChooseLineKeyFuc(nowChooseLineKey){
      //20190611 新逻辑
      return this.nowChooseKeysNameMap[nowChooseLineKey]; 
    },
    buildStrData(name){
      //显示调整  PEAK-CURRENT --》 Peak Current
      var nameArr = name.split('-');
      console.log(nameArr[0]);
      return 'nnnn';
    },
    modalChangeChecked(key) {
      this.nowChoose = key;
    },
    openModal(typename, comList, chooseKey) {
      let self = this;
      //00、 判断是不是焊接中，焊接中不能编辑部分参数
      if(self.$store.state.weldingStatus==1){
          return;
      }
      self.showBtnList = comList;
      self.nowChoose = chooseKey;
      self.nowtypename = typename;
      self.ifFixedFlag=true;//固定 弹层出现底部不能滑动了
      self.hideFlag = true;
      self.downshowFlag = true;
      setTimeout(
        function fuc(params) {
          self.upshowFlag = true; //延迟显示底色
        },

        200
      );
    },
    //抽屉弹层的确认键
    newCloseModal(modalType) {
      let self = this;
      self.ifFixedFlag = false;
      self.changeChecked(self.nowtypename, self.nowChoose, 0);
      //2、原来关闭逻辑
      self.closeClass = true;
      self.upshowFlag = false;
      setTimeout(function fuc(params) {
        self.hideFlag = false;
        self.downshowFlag = false;
        self.closeClass = false;
      }, 500);
    },
    closeModal() {
      let self = this;
      self.ifFixedFlag = false;
      self.closeClass = true;
      self.upshowFlag = false;
      setTimeout(function fuc(params) {
        self.hideFlag = false;
        self.downshowFlag = false;
        self.closeClass = false;
      }, 500);
    },
    buildSliderChangeData(value, type) {
    
      // var aa = (Array(2).join('0') + parseInt(positionNum*10,10).toString(16)).slice(-2);
      //计算 查找 发送请求给ble告知 修改了
      var dirctCode = TIGMAN_DIRECTIVE_MAP.get('PARAMVALUE');
      var num='';
          num =this.jinzhiChangeFuc(parseInt(value * this.keysRangeMap.get(type).multi, 10));
      var crc = this.crcModelBusClacQuery(dirctCode + num, true);
      var sendData = "DA" + dirctCode + num + crc;
      console.log(sendData)
      this.callSendDataToBleUtil('weld_tig_man',sendData,crc);
    },
    addFuc2() {
      console.log(this.nowPosionX2);
      if (this.nowPosionX2 == this.max2) {
        return;
      } else {
        //特殊逻辑处理 pulse fre小于10有小数点 增长速度是0.1 大于10 按1增长
        if(this.nowPosionX2>9.9 && this.nowChooseLineKey=='pulse_fre'){
          this.nowPosionX2 =Math.round(this.nowPosionX2 )+ 1;
        }else{
          this.nowPosionX2 =
            Math.round((parseFloat(this.nowPosionX2 )+ this.paramIncreaseDistance2) * 10) /
          10;
        }
        
        let sliderBtn = this.$refs.sbtn2;
        let dangerRange = this.$refs.dangerRange2;    
        let mySlider = this.$refs.mySlider2;
        //00、初始化滚动条位置 占比是百分比
        var percetNum =   ((this.nowPosionX2 - this.min2) / this.block2) * 100;
        sliderBtn.style.left =percetNum  + "%";
        //01、初始化 危险区域位置
        dangerRange.style.width=percetNum/100 *mySlider.offsetWidth+'px';
        //11、重新绘制折线图
        //设值
        this.keysRangeMap.get(this.nowChooseLineKey).nowValue=this.nowPosionX2;
        //关闭 折线动图
        // this.drawCharMainContrl(this.nowModelTypeName);
        //22、发送请求给ble
        clearTimeout(this.timerPosition2);
        this.timerPosition2 = setTimeout(() => {
          if (this.oldNowPosionX2 != this.nowPosionX2) {
            this.oldNowPosionX2 = this.nowPosionX2;
            this.buildSliderChangeData(this.nowPosionX2,this.nowChooseLineKey);
          }
        }, 1000);
      }
      console.log(this.nowPosionX2)
    },
    delFuc2() {
       
      if (this.nowPosionX2 == this.min2) {
        return;
      } else {
        //特殊逻辑处理 pulse fre小于10有小数点 增长速度是0.1 大于10 按1增长
        if(this.nowPosionX2>10 && this.nowChooseLineKey=='pulse_fre'){
          this.nowPosionX2 =Math.round(this.nowPosionX2 )- 1;
        }else{
          this.nowPosionX2 =
            Math.round((parseFloat(this.nowPosionX2 )-this.paramIncreaseDistance2) * 10) /
          10;
        }
        // this.nowPosionX2 =
        //   Math.round((this.nowPosionX2 - this.paramIncreaseDistance2) * 10) /
        //   10;
        let sliderBtn = this.$refs.sbtn2;
        let dangerRange = this.$refs.dangerRange2;    
        let mySlider = this.$refs.mySlider2;
        //00、初始化滚动条位置 占比是百分比
        var percetNum =   ((this.nowPosionX2 - this.min2) / this.block2) * 100;
        sliderBtn.style.left =percetNum  + "%";
        //01、初始化 危险区域位置
        dangerRange.style.width=percetNum/100 *mySlider.offsetWidth+'px';
        //11、重新绘制折线图
        //设值
        this.keysRangeMap.get(this.nowChooseLineKey).nowValue=this.nowPosionX2;
        // this.drawCharMainContrl(this.nowModelTypeName);
        //22、发送请求给ble
        clearTimeout(this.timerPosition2);
        this.timerPosition2 = setTimeout(() => {
          console.log('lala：：'+this.oldNowPosionX2+"||"+this.nowPosionX2)
          if (this.oldNowPosionX2 != this.nowPosionX2) {
            this.oldNowPosionX2 = this.nowPosionX2;
            this.buildSliderChangeData(this.nowPosionX2,this.nowChooseLineKey);
          }
        }, 1000);
      }
    },
    go(url) {
      if (url == "/welding") {
        //执行焊接
        var data = this.getDirective(this.typeName, 'Getready')+ '0000';
        var crc = this.crcModelBusClacQuery(data, true);
        var sendData = "DA" + data + crc;        
        this.callSendDataToBleUtil('weld_tig_man',sendData,crc);
      } else {
        this.$router.push({
          path: url,
          query: { type: this.typeName, nowModalTypeId: this.nowModalTypeId,pageFrom:'/weld_tig_man' }
        });
      }
    },
    changeChecked(type, value, index) {
        console.log(type+"||"+value+"||"+index);
        //计算 查找 发送请求给ble告知 修改了 特殊合成的key
        let dirctCode = TIGMAN_DIRECTIVE_MAP.get(type);
        let num =this.jinzhiChangeFuc(value);
        let crc = this.crcModelBusClacQuery(dirctCode + num, true);
        let sendData = "DA" + dirctCode + num + crc;
        if(!this.GLOBAL_CONFIG.TESTFLAG){
          this.callSendDataToBleUtil('weld_tig_man',sendData,crc);
        }
     
    },
    //当前是哪个模式
    getNowCanvasModel(){
       
        //1、是否是ac模式
        if(this.nowChooseKeysMap.get('POLATRITY')==1){
          this.nowDCORACFLAG=1;//关于ac模式 出现第二个canvas图的控制
          //第二个canvas
          this.build_AC_MapData();
          this.drawSecondCanvas();
        }else{
          this.nowDCORACFLAG=0;
        }
        if(this.nowChooseKeysMap.get('MODE')==1){//4T
          if(this.nowChooseKeysMap.get('Pulse')==0){//脉冲 no pluse
            this.nowModelTypeName ='4T_NOPULSE_DC';
          }else{
            this.nowModelTypeName ='4T_PULSE_DC';
          }
        }else{//2T
          if(this.nowChooseKeysMap.get('Pulse')==0){//脉冲 pluse
            this.nowModelTypeName ='2T_NOPULSE_DC';
          }else{
            this.nowModelTypeName ='2T_PULSE_DC';
          }
        }
        //绘图
        this.drawCharMainContrl(this.nowModelTypeName);
   
    },
    initSliderLineFuc() {
      let mySlider = this.$refs.mySlider2;
      let dangerRange = this.$refs.dangerRange2;
      let mySliderWidth = mySlider.offsetWidth; //条子宽度
      // let btnWidth='';//滑动块所占百分比
      let sliderBtn = this.$refs.sbtn2;
      //00、初始化滚动条位置 占比是百分比
      var percetNum =   ((this.nowPosionX2 - this.min2) / this.block2) * 100;
      sliderBtn.style.left =percetNum  + "%";
      //01、初始化 危险区域位置
      dangerRange.style.width=percetNum/100 *mySliderWidth+'px';
      // dangerRange.style.left =((this.diffMin2-this.min2)/this.block2)*100+'%';

      let myWidth = 0;
      let propo = mySlider.children[0]; //底色不变
      //1、
      const elementLeft = e => {
        //计算x坐标
        var offset = e.offsetLeft;
        if (e.offsetParent != null) offset += elementLeft(e.offsetParent);
        return offset;
      };
      //2、
      const myCount = () => {
        //计算滑动
        if (this.myPosition2.right > this.myPosition2.left) {
          //判断滑动范围
          this.myPosition2.propoWidth =
            this.myPosition2.right - this.myPosition2.left;
          // this.valueFun(parseInt(this.myPosition.left),parseInt(this.myPosition.right),parseInt(this.myPosition.propoWidth))
        } else if (this.myPosition2.right < this.myPosition2.left) {
          this.myPosition2.propoWidth =
            this.myPosition2.left - this.myPosition2.right;
          // this.valueFun(parseInt(this.myPosition.right),parseInt(this.myPosition.left),parseInt(this.myPosition.propoWidth))
        } else if (this.myPosition2.right == this.myPosition2.left) {
          //按钮位置滑到最大值或者最小值
          this.myPosition2.propoWidth =
            this.myPosition2.left - this.myPosition2.right;
          // this.valueFun(parseInt(this.myPosition.right),parseInt(this.myPosition.left),parseInt(this.myPosition.propoWidth))
        }
      };

      let mySliderX = elementLeft(mySlider); //滑动块x坐标
      mySlider.addEventListener("touchmove", e => {
        //屏幕滑动事件
        let pageX = e.touches[0].pageX - mySliderX; //获取滑动x坐标
        myWidth = (pageX / mySlider.offsetWidth) * 100; //计算百分比
        if (myWidth > 100) {
          //判断不超出范围
          myWidth = 100;
        } else if (myWidth < 0) {
          myWidth = 0;
        }
       if(this.paramIncreaseDistance2==0.1){
          //特殊处理小于10 速度为0.1 大于10 速度为1
          if(this.nowPosionX2>10 && this.nowPosionX2<=this.max2 && this.nowChooseLineKey=='pulse_fre'){
             this.nowPosionX2 =Math.round(Math.round(this.block2 * (Math.round(myWidth) / 100) * 10) / 10+1); //四舍五入保留一位小数
          }else{
            this.nowPosionX2 = Math.round((Math.round(this.block2 * (Math.round(myWidth) / 100) * 10) / 10+this.min2)*10)/10; //四舍五入保留一位小数
          }
       }else{
          this.nowPosionX2 = (Math.round(this.block2 * (Math.round(myWidth) / 100))+this.min2); //四舍五入保留一位小数
       }
        
        //重新绘制折线图
        //设值
        this.keysRangeMap.get(this.nowChooseLineKey).nowValue=this.nowPosionX2;
        // this.drawCharMainContrl(this.nowModelTypeName);
        //判断是否在危险区
        // if(this.myPosition2>=){
        //    InDangerFlag2=true;
        // }
        if (this.myPosition2.isBtn == 1) {
          //判断焦点
          this.myPosition.left = myWidth;
          rightBtn.style.left = myWidth + "%";
        } else if (this.myPosition2.isBtn == 2) {
          this.myPosition.right = myWidth;
          sliderBtn.style.left = myWidth + "%";
          dangerRange.style.width=myWidth/100 *mySliderWidth+'px';
        }
        myCount();
        e.preventDefault();
      });
      if(this.haveInitTimes==0){
         mySlider.addEventListener("touchstart", e => {
          //屏幕触摸事件
          let touchX = e.touches[0].pageX - mySliderX;
          // btnWidth = (sliderBtn.offsetWidth/mySlider.offsetWidth)*100; //计算按钮宽度
          // btnWidth=btnWidth.toFixed(2);//保留两位有效数字
          this.myPosition2.now = (touchX / mySlider.offsetWidth) * 100;
          mySliderX = elementLeft(mySlider); //滑动块x坐标
        });
        mySlider.addEventListener("touchend", e => {
          //屏幕触摸结束事件
          // 发送请求给ble告诉 修改了
          
          this.buildSliderChangeData(this.nowPosionX2, this.nowChooseLineKey);
        });
      }
     
    },
    /**** 折线图开始 begin*****/

    changeBeatiful(ctx, canvas) {
      return;
      var PIXEL_RATIO = (function(ctc) {
        var dpr = window.devicePixelRatio || 1,
          bsr =
            ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio ||
            1;

        return dpr / bsr;
      })();
      // PIXEL_RATIO =30;
      var canvasWidth = 300,
        canvasHeight = 100;
      // 适配高清屏，canvas内容的宽高是实际的宽高的PIXEL_RATIO倍
      canvas.width = canvasWidth * PIXEL_RATIO;
      canvas.height = canvasHeight * PIXEL_RATIO;
      canvas.style.width = canvasWidth + "px";
      canvas.style.height = canvasHeight + "px";
      // 缩放绘图
      ctx.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
    },
    //第二个canvas
    change2CanvasBeatiful(ctx, canvas) {
      return;
      return;
      var PIXEL_RATIO = (function(ctc) {
        var dpr = window.devicePixelRatio || 1,
          bsr =
            ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio ||
            1;

        return dpr / bsr;
      })();
      // PIXEL_RATIO =30;
      var canvasWidth = 300,
        canvasHeight = 50;
      // 适配高清屏，canvas内容的宽高是实际的宽高的PIXEL_RATIO倍
      canvas.width = canvasWidth * PIXEL_RATIO;
      canvas.height = canvasHeight * PIXEL_RATIO;
      canvas.style.width = canvasWidth + "px";
      canvas.style.height = canvasHeight + "px";
      // 缩放绘图
      ctx.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
    },
    drawChartMainController() {
      return;
      let self = this;
      // self.canvas = document.getElementById("myCanvas");
      self.canvas = self.$refs.myCanvas1;
      self.canvas.width = 300;
      self.canvas.height = 150;
      // self.oldx=0;
      // self.oldy=150;
      //简单地检测当前浏览器是否支持Canvas对象，以免在一些不支持html5的浏览器中提示语法错误
      if (self.canvas.getContext) {
        //获取对应的CanvasRenderingContext2D对象(画笔)
        self.ctx = self.canvas.getContext("2d");
        //高清屛设置
        self.changeBeatiful(self.ctx, self.canvas);
        self.ctx.lineWidth = 3;

        //注意，Canvas的坐标系是：Canvas画布的左上角为原点(0,0)，向右为横坐标，向下为纵坐标，单位是像素(px)。
        //开始一个新的绘制路径
        var tempp = {};
        for (var i = 0; i < self.listData.length; i++) {
          tempp = self.listData[i];
          if (tempp.paramKey == self.nowChooseLineKey) {
           
            self.ctx.strokeStyle = self.lineChooseColor; // 折线颜色
          } else {
            self.ctx.strokeStyle = self.lineNormalColor; // 折线颜色
          }
          // if (tempp.paramKey == self.constant.heart_cur_begin) {
          //   //关于连接处有缺陷修正
          //   self.oldy += 2;
          // } else if (tempp.paramKey == self.constant.heart_cur_end) {
          //   //关于连接处有缺陷修正
          //   self.oldx -= 1;
          // } else if (tempp.paramKey == self.constant.slop_up_begin) {
          //   //关于连接处有缺陷修正
          //   self.oldy -= 1;
          // } else if (tempp.paramKey == self.constant.slop_up) {
          //   //关于连接处有缺陷修正
          //   self.oldy -= 1;
          // } else if (tempp.paramKey == self.constant.weld_cur) {
          //   //关于连接处有缺陷修正
          //   self.oldx -= 1;
          // } else if (tempp.paramKey == self.constant.slop_down) {
          //   //关于连接处有缺陷修正
          //   self.oldy -= 1;
          // } else if (tempp.paramKey == self.constant.post_gas) {
          //   //关于连接处有缺陷修正
          //   self.oldx -= 1;
          // }
          self.ctx.beginPath();
          self.ctx.moveTo(self.oldx, self.oldy);
          self.ctx.lineTo(tempp.x, tempp.y);
          self.oldx = tempp.x;
          self.oldy = tempp.y;
          self.ctx.stroke();
        }
        //关闭当前的绘制路径
        self.ctx.closePath();
      }
    },
    //画第二个
     drawSecondCanvas() {
       return;
      let self = this;
      // self.canvas = document.getElementById("myCanvas");
      self.canvas2 = self.$refs.myCanvas2;
      self.canvas2.width = 300;
      self.canvas2.height = 50;
      // self.oldx=0;
      // self.oldy=150;
      //简单地检测当前浏览器是否支持Canvas对象，以免在一些不支持html5的浏览器中提示语法错误
      if (self.canvas2.getContext) {
        //获取对应的CanvasRenderingContext2D对象(画笔)
        self.ctx2 = self.canvas2.getContext("2d");
        //高清屛设置
        self.change2CanvasBeatiful(self.ctx2, self.canvas2);
        self.ctx2.lineWidth = 3;
        var tempp = {};
        for (var i = 0; i < self.acListData.length; i++) {
          tempp = self.acListData[i];
          if (tempp.paramKey == self.nowChooseLineKey) {
            self.ctx2.strokeStyle = self.lineChooseColor; // 折线颜色
          } else {
            self.ctx2.strokeStyle = self.lineNormalColor; // 折线颜色
          }
          self.ctx2.beginPath();
          self.ctx2.moveTo(self.old2x, self.old2y);
          self.ctx2.lineTo(tempp.x, tempp.y);
          self.old2x = tempp.x;
          self.old2y = tempp.y;
          self.ctx2.stroke();
        }
        //关闭当前的绘制路径
        self.ctx2.closePath();
      }
    },
    //2T_NOPULSE_DC
    build_2T_NOPULSE_DCMapData() {
      //空map设值key-value
      let self = this;
      self.listData = [];
      self.oldy = 100 - 30;
      var temp1X=60-this.keysRangeMap.get("pre_gas").nowValue * 60/this.keysRangeMap.get("pre_gas").block;//对应区间值 60-20=40  key:pre_gas 注意动画方向
      var temp6X=this.keysRangeMap.get("slop_up").nowValue * 100/this.keysRangeMap.get("slop_up").block+90;//对应区间值 190-90=100  key:slop_up
      var temp67Y=(60-this.keysRangeMap.get('weld_cur').nowValue * 40/this.keysRangeMap.get("weld_cur").block)+30;//对应区间值 试出来的不会超出 同时30和基准电流高度一致即可
      var temp8X=this.keysRangeMap.get('slop_down').nowValue * 40/this.keysRangeMap.get("slop_down").block+190;//190前一个点的x坐标
      var temp9X=(this.keysRangeMap.get('post_gas').nowValue-this.keysRangeMap.get('post_gas').min) * 40/this.keysRangeMap.get("post_gas").block+temp8X;//190前一个点的x坐标
      self.oldx = temp1X ;//起点也要重新设置
      var temp1 = {
        x: temp1X,
        y: "100",
        direction: "",
        hiddenFlag: false,
        paramKey: self.constant.begin_position
      };
      var temp2 = {
        x: "60",
        y: "100",
        direction: "level",
        hiddenFlag: false,
        paramKey: self.constant.pre_gas
      }; //key
      var temp3 = {
        x: "60",
        y: "80",
        direction: "",
        hiddenFlag: false,
        paramKey: self.constant.heart_cur_begin
      };
      var temp4 = {
        x: "90",
        y: "80",
        direction: "",
        hiddenFlag: false,
        paramKey: self.constant.heart_cur_end
      };
      var temp5 = {
        x: "90",
        y: "90",
        direction: "",
        hiddenFlag: false,
        paramKey: self.constant.slop_up_begin
      };
      var temp6 = {
        x: temp6X,//90-190
        y: temp67Y,
        direction: "level",
        hiddenFlag: false,
        paramKey: self.constant.slop_up
      }; //key
      var temp7 = {
        x: "190",
        y: temp67Y,
        direction: "vertical",
        hiddenFlag: false,
        paramKey: self.constant.weld_cur
      }; //key
      var temp8 = {
        x: temp8X,
        y: "100",
        direction: "level",
        hiddenFlag: false,
        paramKey: self.constant.slop_down
      }; //key
      var temp9 = {
        x: temp9X,
        y: "100",
        direction: "level",
        hiddenFlag: false,
        paramKey: self.constant.post_gas
      }; //key
      self.listData.push(temp1);
      self.listData.push(temp2);
      self.listData.push(temp3);
      self.listData.push(temp4);
      self.listData.push(temp5);
      self.listData.push(temp6);
      self.listData.push(temp7);
      self.listData.push(temp8);
      self.listData.push(temp9);
      self.listData.forEach(element => {
        element.y -= 30;
      });
      self.paddingLeftNum =0 + "px";
      //key数值
      self.keyArr = ["pre_gas", "slop_up", "weld_cur", "slop_down", "post_gas"];
    },
    //4T_NOPULSE_DC
    build_4T_NOPULSE_DCMapData() {
      //空map设值key-value
      let self = this;
      self.listData = [];
      self.oldx = 20; //左右对称
      self.oldy = 80; //减多少是多少
      var temp1X=60-this.keysRangeMap.get("pre_gas").nowValue * 60/this.keysRangeMap.get("pre_gas").block;//对应区间值 60-20=40  key:pre_gas 注意动画方向
      var temp6Y=70-this.keysRangeMap.get("start_cur_end").nowValue * 70/this.keysRangeMap.get("start_cur_end").block+25;
      var temp7X=this.keysRangeMap.get("slop_up").nowValue * 50/this.keysRangeMap.get("slop_up").block+100;
      //公式：nowvalue-min/block *给予的高度
      var temp78Y=(70-(this.keysRangeMap.get('weld_cur').nowValue-this.keysRangeMap.get('weld_cur').min) * 70/this.keysRangeMap.get("weld_cur").block)+20;//对应区间值 试出来的不会超出 同时30和基准电流高度一致即可
      var temp9X =(this.keysRangeMap.get('slop_down').nowValue-this.keysRangeMap.get('slop_down').min) * 40/this.keysRangeMap.get("slop_down").block+150;//对应区间值 试出来的不会超出 同时30和基准电流高度一致即可
      var temp910Y =(70-(this.keysRangeMap.get('crater_cur').nowValue-this.keysRangeMap.get('crater_cur').min) * 70/this.keysRangeMap.get("crater_cur").block)+20;//对应区间值 试出来的不会超出 同时30和基准电流高度一致即可
      var  temp12X =(this.keysRangeMap.get('post_gas').nowValue-this.keysRangeMap.get('post_gas').min) * 40/this.keysRangeMap.get("post_gas").block+240;

      self.oldx = temp1X ;//起点也要重新设置
      var temp1 = {
        x: temp1X,
        y: "100",
        direction: "",
        hiddenFlag: false,
        paramKey: self.constant.begin_position
      };
      var temp2 = {
        x: "60",
        y: "100",
        direction: "level",
        hiddenFlag: false,
        paramKey: self.constant.pre_gas
      }; //key
      var temp3 = {
        x: "60",
        y: "80",
        direction: "",
        hiddenFlag: false,
        paramKey: self.constant.heart_cur_begin
      };
      var temp4 = {
        x: "80",
        y: "80",
        direction: "",
        hiddenFlag: false,
        paramKey: self.constant.heart_cur_end
      };
      var temp5 = {
        x: "80",
        y: temp6Y,
        direction: "",
        hiddenFlag: false,
        paramKey: self.constant.start_cur_begin
      };
      var temp6 = {
        x: "100",
        y: temp6Y,
        direction: "",
        hiddenFlag: false,
        paramKey: self.constant.start_cur_end
      }; //key
      var temp7 = {
        x:temp7X,
        y: temp78Y,
        direction: "",
        hiddenFlag: false,
        paramKey: self.constant.slop_up
      }; //key
      var temp8 = {
        x: "150",
        y: temp78Y,
        direction: "level",
        hiddenFlag: false,
        paramKey: self.constant.weld_cur
      }; //key
      var temp9 = {
        x: temp9X,
        y: temp910Y,
        direction: "vertical",
        hiddenFlag: false,
        paramKey: self.constant.slop_down
      }; //key
      var temp10 = {
        x: "240",
        y: temp910Y,
        direction: "",
        hiddenFlag: false,
        paramKey: self.constant.crater_cur
      }; //key
      var temp11 = {
        x: "240",
        y: "100",
        direction: "",
        hiddenFlag: false,
        paramKey: self.constant.post_gas_begin
      }; //垂直无用
      var temp12 = {
        x: temp12X,
        y: "100",
        direction: "level",
        hiddenFlag: false,
        paramKey: self.constant.post_gas
      }; //key
      self.listData.push(temp1);
      self.listData.push(temp2);
      self.listData.push(temp3);
      self.listData.push(temp4);
      self.listData.push(temp5);
      self.listData.push(temp6);
      self.listData.push(temp7);
      self.listData.push(temp8);
      self.listData.push(temp9);
      self.listData.push(temp10);
      self.listData.push(temp11);
      self.listData.push(temp12);
      self.listData.forEach(element => {
        element.y -= 20;
      });
      self.paddingLeftNum =0 + "px";
      //   self.paddingLeftNum =(300-250)/2+'px';
      //key数值
      self.keyArr = [
        "pre_gas",
        "start_cur_end",
        "slop_up",
        "weld_cur",
        "slop_down",
        "crater_cur",
        "post_gas"
      ];
    },
    //2T_PULSE_DC  2T脉冲DC
    build_2T_PULSE_DCMapData() {
      //空map设值key-value
      let self = this;
      self.listData = [];
      self.oldy = 100 - 30;
      var temp1X=30-(this.keysRangeMap.get("pre_gas").nowValue-this.keysRangeMap.get("pre_gas").min) * 30/this.keysRangeMap.get("pre_gas").block;//对应区间值 60-20=40  key:pre_gas 注意动画方向
      var temp6X=30-(this.keysRangeMap.get("slop_up").nowValue-this.keysRangeMap.get("slop_up").min) * 30/this.keysRangeMap.get("slop_up").block+50;
      var temp89Y=60-(this.keysRangeMap.get('weld_cur').nowValue-this.keysRangeMap.get("weld_cur").min) * 60/this.keysRangeMap.get("weld_cur").block+30;//总区间30+60=90
      var temp11X=(this.keysRangeMap.get('pulse_duty').nowValue-this.keysRangeMap.get("pulse_duty").min) * 30/this.keysRangeMap.get("pulse_duty").block+110;//100-150  预留 110-140
      // var temp67Y=70;
      var temp12Y= 60-(this.keysRangeMap.get('base_cur').nowValue-this.keysRangeMap.get("base_cur").min) * 60/this.keysRangeMap.get("base_cur").block+30;//总区间30+60=90
      // !!联动beign
      var desvalue=(this.keysRangeMap.get('pulse_fre').nowValue-this.keysRangeMap.get("pulse_fre").min) * 60/this.keysRangeMap.get("pulse_fre").block;
      var temp13X=160-desvalue*6;//180-20=160
          temp11X =temp11X-desvalue*1.3;
      // !!联动end
      var slowdownX=(this.keysRangeMap.get('slop_down').nowValue-this.keysRangeMap.get('slop_down').min) * 40/this.keysRangeMap.get("slop_down").block+180;//180前一个点的x坐标
      var postgasX=(this.keysRangeMap.get('post_gas').nowValue-this.keysRangeMap.get('post_gas').min) * 40/this.keysRangeMap.get("post_gas").block+slowdownX;//slowdownX前一个点的x坐标
      
     self.oldx = temp1X ;//起点也要重新设置
      var temp1 = {
        x: temp1X,
        y: "100",
        direction: "",
        hiddenFlag: false,
        paramKey:''
      };
      var temp2 = {
        x: "30",
        y: "100",
        direction: "level",
        hiddenFlag: false,
        paramKey: self.constant.pre_gas//canvas区间：0-30
      }; //key
      var temp3 = {
        x: "30",
        y: "80",
        direction: "",
        hiddenFlag: false,
        paramKey: ''
      };
      var temp4 = {
        x: "50",
        y: "80",
        direction: "",
        hiddenFlag: false,
        paramKey:''
      };
      var temp5 = {
        x: "50",
        y: "90",
        direction: "",
        hiddenFlag: false,
        paramKey: ''
      };
      var temp6 = {
        x: temp6X,//90-190
        y: 70,
        direction: "level",
        hiddenFlag: false,
        paramKey:self.constant.slop_up //canvas区间x：50-70
      }; //key
      var temp7 = {
        x: "100",
        y: 70,
        direction: "vertical",
        hiddenFlag: false,
        paramKey: ''
      };
      //key
      var temp8 = {
        x: 100,
        y: temp89Y,
        direction: "level",
        hiddenFlag: false,
        paramKey: ''
      }; 
      var temp9 = {
        x: temp11X,
        y: temp89Y,
        direction: "level",
        hiddenFlag: false,
        paramKey:self.constant.weld_cur //canvas区间y：90-0
      };
      var temp10 = {
        x: temp11X,
        y: temp89Y,
        direction: "level",
        hiddenFlag: false,
        paramKey:''
      };
      var temp11 = {
        x: temp11X,
        y: temp12Y,
        direction: "level",
        hiddenFlag: false,
        paramKey: self.constant.pulse_duty
      };
      var temp12 = {
        x:temp13X,
        y: temp12Y,
        direction: "level",
        hiddenFlag: false,
        paramKey: self.constant.base_cur
      };
      var temp13 = {
        x: temp13X,
        y: 70,
        direction: "level",
        hiddenFlag: false,
        paramKey:self.constant.pulse_fre
      };
      var temp14 = {
        x: 180,
        y: 70,
        direction: "level",
        hiddenFlag: false,
        paramKey:''
      };
      var temp15 = {
        x: slowdownX,
        y: 100,
        direction: "level",
        hiddenFlag: false,
        paramKey:self.constant.slop_down
      };
      var temp16 = {
        x: postgasX,
        y: 100,
        direction: "level",
        hiddenFlag: false,
        paramKey: self.constant.post_gas
      };
      self.listData.push(temp1);
      self.listData.push(temp2);
      self.listData.push(temp3);
      self.listData.push(temp4);
      self.listData.push(temp5);
      self.listData.push(temp6);
      self.listData.push(temp7);
      self.listData.push(temp8);
      self.listData.push(temp9);
      self.listData.push(temp10);
      self.listData.push(temp11);
      self.listData.push(temp12);
      self.listData.push(temp13);
      self.listData.push(temp14);
      self.listData.push(temp15);
      self.listData.push(temp16);
      self.listData.forEach(element => {
        element.y -= 30;
      });
      
      self.paddingLeftNum =30 + "px";
      // self.paddingLeftNum = (300 - 250) / 2 + "px";
      //key数值
      self.keyArr = ["pre_gas", "slop_up", "weld_cur", 'pulse_duty','base_cur','pulse_fre',"slop_down", "post_gas"];
    },
    //4T_PULSE_DC  4T脉冲DC
    build_4T_PULSE_DCMapData() {
      //空map设值key-value
      let self = this;
      self.listData = [];
      self.oldy=100-20;
      var temp1X=30-(this.keysRangeMap.get("pre_gas").nowValue-this.keysRangeMap.get("pre_gas").min) * 30/this.keysRangeMap.get("pre_gas").block;//对应区间值 30-0
      var startCurY = 70-(this.keysRangeMap.get('start_cur_end').nowValue-this.keysRangeMap.get("start_cur_end").min) * 70/this.keysRangeMap.get("start_cur_end").block+20;
      var slopUp=30-(this.keysRangeMap.get("slop_up").nowValue-this.keysRangeMap.get("slop_up").min) * 30/this.keysRangeMap.get("slop_up").block+60;
      var weldCurY = 70-(this.keysRangeMap.get('weld_cur').nowValue-this.keysRangeMap.get("weld_cur").min) * 70/this.keysRangeMap.get("weld_cur").block+20;
      var pulseDutyX= 40-(this.keysRangeMap.get('pulse_duty').nowValue-this.keysRangeMap.get("pulse_duty").min) * 40/this.keysRangeMap.get("pulse_duty").block+130;//130-170 留10间距
      var baseCur=  70-(this.keysRangeMap.get('base_cur').nowValue-this.keysRangeMap.get("base_cur").min) * 70/this.keysRangeMap.get("base_cur").block+20;

       // !!联动beign
      var desvalue=(this.keysRangeMap.get('pulse_fre').nowValue-this.keysRangeMap.get("pulse_fre").min) * 60/this.keysRangeMap.get("pulse_fre").block;
      var pulseFre=180-desvalue*5;//180-20=160
          pulseDutyX =pulseDutyX-desvalue*3;
      // !!联动end
      var craterCur = 70-(this.keysRangeMap.get('crater_cur').nowValue-this.keysRangeMap.get("crater_cur").min) * 70/this.keysRangeMap.get("crater_cur").block+20;
      var slowdownX=(this.keysRangeMap.get('slop_down').nowValue-this.keysRangeMap.get('slop_down').min) * 40/this.keysRangeMap.get("slop_down").block+250;//180前一个点的x坐标
      var postgasX=(this.keysRangeMap.get('post_gas').nowValue-this.keysRangeMap.get('post_gas').min) * 40/this.keysRangeMap.get("post_gas").block+slowdownX;//slowdownX前一个点的x坐标
      
      self.oldx = temp1X ;//起点也要重新设置
      var temp1 = {
        x:temp1X,
        y: 100,
        direction: "",
        hiddenFlag: false,
        paramKey: ''
      };
      var temp2 = {
        x: 30,
        y: 100,
        direction: "level",
        hiddenFlag: false,
        paramKey: self.constant.pre_gas
      }; //key
      var temp3 = {
        x: 30,
        y: startCurY,
        direction: "",
        hiddenFlag: false,
        paramKey:''
      };
      var temp4 = {
        x: "60",
        y: startCurY,
        direction: "",
        hiddenFlag: false,
        paramKey: self.constant.start_cur_end
      };
      var temp5 = {
        x: slopUp,
        y: 60,
        direction: "",
        hiddenFlag: false,
        paramKey:self.constant.slop_up
      };
      var temp6 = {
        x: 120,
        y: 60,
        direction: "",
        hiddenFlag: false,
        paramKey: ''
      }; //key
      var temp7 = {
        x:120,
        y: weldCurY,
        direction: "",
        hiddenFlag: false,
        paramKey:''
      }; //key
      var temp8 = {
        x: pulseDutyX,
        y: weldCurY,
        direction: "level",
        hiddenFlag: false,
        paramKey: self.constant.weld_cur
      }; //key
      var temp9 = {
        x: pulseDutyX,
        y: baseCur,
        direction: "vertical",
        hiddenFlag: false,
        paramKey: self.constant.pulse_duty//X 120-180
      }; //key
      var temp10 = {
        x: pulseFre,
        y: baseCur,
        direction: "",
        hiddenFlag: false,
        paramKey:self.constant.base_cur//10-100
      }; //key
      var temp11 = {
        x: pulseFre,
        y: 30,
        direction: "",
        hiddenFlag: false,
        paramKey: self.constant.pulse_fre
      }; //垂直无用
      var temp12 = {
        x: 210,
        y: 30,
        direction: "level",
        hiddenFlag: false,
        paramKey: ''
      }; //key
      var temp13 = {
        x: 230,
        y: craterCur,
        direction: "level",
        hiddenFlag: false,
        paramKey: ''
      }; //key
      var temp14 = {
        x: 250,
        y: craterCur,
        direction: "level",
        hiddenFlag: false,
        paramKey: self.constant.crater_cur
      }; 
      var temp15 = {
        x: slowdownX,
        y: 80,
        direction: "level",
        hiddenFlag: false,
        paramKey: self.constant.slop_down
      }; 
     var temp16 = {
        x: postgasX,
        y: 80,
        direction: "level",
        hiddenFlag: false,
        paramKey: self.constant.post_gas
      }; 
      self.listData.push(temp1);
      self.listData.push(temp2);
      self.listData.push(temp3);
      self.listData.push(temp4);
      self.listData.push(temp5);
      self.listData.push(temp6);
      self.listData.push(temp7);
      self.listData.push(temp8);
      self.listData.push(temp9);
      self.listData.push(temp10);
      self.listData.push(temp11);
      self.listData.push(temp12);
      self.listData.push(temp13);
      self.listData.push(temp14);
      self.listData.push(temp15);
      self.listData.push(temp16);
      self.listData.forEach(element => {
        element.y -= 20;
      });
       self.paddingLeftNum =0 + "px";
      //key数值
      self.keyArr = ["pre_gas","start_cur_end", "slop_up", "weld_cur", 'pulse_duty','base_cur','pulse_fre',"crater_cur","slop_down", "post_gas"];
    },
    //AC模式
    build_AC_MapData(){
      let self = this;
      self.acListData = [];
      self.old2y=100-50;
      self.old2x = 100 ;//起点也要重新设置
      var dvalue=(this.keysRangeMap.get('ac_fre').nowValue-this.keysRangeMap.get("ac_fre").min) * 100/this.keysRangeMap.get("ac_fre").block;
      var acFreX =dvalue+100+20;
      //acfrex在前面计算acbanlance右侧临界点
      var acBalanceX = (this.keysRangeMap.get('ac_balance').nowValue-this.keysRangeMap.get("ac_balance").min) * (acFreX-120)/this.keysRangeMap.get("ac_balance").block+110;
     
      // acBalanceX =(dvalue/200) *acBalanceX;
        if(this.nowChooseLineKey=='ac_fre'){
             acBalanceX =(acFreX-130)*5/8+110;
        }
      var temp1 = {
        x:100,
        y: 100,
        direction: "",
        hiddenFlag: false,
        paramKey: ''
      };
      var temp2 = {
        x: 100,
        y: 50,
        direction: "level",
        hiddenFlag: false,
        paramKey:''
      }; //key
      var temp3 = {
        x: acBalanceX,
        y: 50,
        direction: "",
        hiddenFlag: false,
        paramKey:''
      };
      var temp4 = {
        x: acBalanceX,
        y: 100,
        direction: "",
        hiddenFlag: false,
        paramKey:  self.constant.ac_balance//往右增加
      };
      var temp5 = {
        x: acFreX,
        y: 100,
        direction: "",
        hiddenFlag: false,
        paramKey: ''
      };
      var temp6 = {
        x: acFreX,
        y: 50,
        direction: "",
        hiddenFlag: false,
        paramKey: self.constant.ac_fre
      };
      self.acListData.push(temp1);
      self.acListData.push(temp2);
      self.acListData.push(temp3);
      self.acListData.push(temp4);
      self.acListData.push(temp5);
      self.acListData.push(temp6);
      self.acListData.forEach(element => {
        element.y -= 50;
      });
       self.paddingLeftNum =0 + "px";
     self.keyArr2 = ["ac_balance","ac_fre"];
    },
    //切换线条
    chooseParam(type) {
       //焊接中不能切换只能是电流
       if(this.$store.state.weldingStatus==1){
         return;
       }
       //体验模式和正常模式会有点区分
       if(this.GLOBAL_CONFIG.TESTFLAG){
         this.testModalLine(type);
       }else{
        //11、改造为 图片替换成当前模式的图片即可 不画图了
        this.newChangeRule(type);
       }
    },
    testModalLine(type){
      for (var i = 0; i < this.keyArr.length; i++) {
        console.log(111222333444555666777);
        console.log(this.keyArr[i]);
        console.log(this.nowChooseLineKey);
        if (this.keyArr[i] == this.nowChooseLineKey) {
          if (type == 0) {
            //减往左
            if (i == 0) {
              this.nowChooseLineKey = this.keyArr[this.keyArr.length - 1];
            } else {
              this.nowChooseLineKey = this.keyArr[i - 1];
            }
            break;
          } else if (type == 1) {
            //减往右
            if (i == this.keyArr.length - 1) {
              this.nowChooseLineKey = this.keyArr[0];
            } else {
              this.nowChooseLineKey = this.keyArr[i + 1];
            }
            break;
          }
        }
      }
      //1、画选中的那条线
      this.drawCharMainContrl(this.nowModelTypeName);
      //2、选中的参数的初始化变量设置
      this.initChooseline();
      //重新初始化滑动组件
      this.initSliderLineFuc();
    },
    newChangeRule(type){
      //20190613
      if(type==0){//左D4: 0xA0
        this.newChooseLineChangeData('A000');

      }else{//右0x0A
        this.newChooseLineChangeData('0A00');
      }
    },
    newChooseLineChangeData(snum) {
        let dirctCode = TIGMAN_DIRECTIVE_MAP.get('BTNS');
        let num =snum;
        let crc = this.crcModelBusClacQuery(dirctCode + num, true);
        let sendData = "DA" + dirctCode + num + crc;
        this.callSendDataToBleUtil('weld_tig_man',sendData,crc);
    },
    initChooseline(){
      //滑动组件赋值
      var tempInfo = this.keysRangeMap.get(this.nowChooseLineKey);
       console.log(this.nowChooseLineKey)
      this.max2 = tempInfo.max;
      this.min2 = tempInfo.min;
      this.unit2 = tempInfo.unit;
     
      this.block2 = tempInfo.max - tempInfo.min;
      this.nowPosionX2 = tempInfo.nowValue;
      console.log(tempInfo.nowValue)
      //按钮加减幅度 动态计算 
      this.paramIncreaseDistance2 = tempInfo.increseRang;
      // this.paramIncreaseDistance2 = 1;//按钮加减幅度
    },
    drawCharMainContrl(type) {
      console.log(type)
      if (type == "2T_NOPULSE_DC") {
        this.build_2T_NOPULSE_DCMapData();
      } else if (type == "4T_NOPULSE_DC") {
        this.build_4T_NOPULSE_DCMapData();
      }else if (type == "2T_PULSE_DC") {
        this.build_2T_PULSE_DCMapData();
      }else if(type=='4T_PULSE_DC'){
        this.build_4T_PULSE_DCMapData();
      }
      if(this.nowDCORACFLAG==1){
          //ac 模式增加元素
          this.keyArr.push('ac_balance');
          this.keyArr.push('ac_fre');
      }
      this.drawChartMainController();
      //第二个canvas
      this.build_AC_MapData();
      this.drawSecondCanvas();
    },
    initKeysValueMap() {
      this.keysRangeMap = new Map();
      //没有推荐范围
      this.keysRangeMap.set("pre_gas", {
        min: 0.1,
        max: 10,
        nowValue: 8,
        unit: "S",
        multi:10,//乘法 发送给安卓前计算
        increseRang:0.1,
        block:9.9 //区间应该独立否则会影响到其他的max-min
      });
       this.keysRangeMap.set("start_cur_end", {
        min: 10,
        max: 200,
        nowValue: 80,
        unit: "A",
        multi:1,
        increseRang:1,
        block:190 //区间应该独立否则会影响到其他的max-min
      });
      this.keysRangeMap.set("slop_up", {
        min: 0,
        max: 10,
        nowValue: 5,
        unit: "S",
        multi:10,
        increseRang:0.1,
        block:10 //区间应该独立否则会影响到其他的max-min
      });
      this.keysRangeMap.set("weld_cur", {
        min: 10,
        max: 140,
        nowValue: 120,
        unit: "A",
        multi:1,
        increseRang:1,
        block:130 //区间应该独立否则会影响到其他的max-min
      });
       this.keysRangeMap.set("peak_cur", {
        min: 30,
        max: 200,
        nowValue: 120,
        unit: "A",
        multi:1,
        increseRang:1,
        block:170 //区间应该独立否则会影响到其他的max-min
      });
      this.keysRangeMap.set("slop_down", {
        min: 0,
        max: 10,
        nowValue: 6,
        unit: "S",
        multi:10,
        increseRang:0.1,
        block:10 //区间应该独立否则会影响到其他的max-min
      });
      this.keysRangeMap.set("crater_cur", {
        min: 10,
        max: 200,
        nowValue: 80,
        unit: "A",
        multi:1,
        increseRang:1,
        block:190 //区间应该独立否则会影响到其他的max-min
      });
      this.keysRangeMap.set("post_gas", {
        min: 0,
        max: 10,
        nowValue: 10,
        unit: "S",
        multi:10,
        increseRang:0.1,
        block:9 //区间应该独立否则会影响到其他的max-min
      });
      this.keysRangeMap.set("base_cur", {//脉冲基值电流
        min: 10,
        max: 200,
        nowValue: 130,
        unit: "A",
        multi:1,
        increseRang:1,
        block:190 //区间应该独立否则会影响到其他的max-min
      });
      this.keysRangeMap.set("pulse_duty", {//脉冲占空比
        min: 5,
        max: 100,
        nowValue: 50,
        // unit: "%",
        unit:"percent",//unit比较特殊
        multi:1,
        increseRang:1,
        block:95 //区间应该独立否则会影响到其他的max-min
      });
      this.keysRangeMap.set("pulse_fre", {//脉冲频率
        min: 0.5,
        max: 200,
        nowValue: 100,
        unit: "Hz",
        multi:10,
        increseRang:0.1,
        block:1995 //区间应该独立否则会影响到其他的max-min
      });
      this.keysRangeMap.set("ac_fre", {//50-250 交流频率
        min:50,
        max: 200,
        nowValue: 190,
        unit: "Hz",
        multi:1,
        increseRang:1,
        block:175 //区间应该独立否则会影响到其他的max-min
      });
      this.keysRangeMap.set("ac_balance", {// 10-50 交流占空比
        min: 15,
        max: 50,
        nowValue: 30,
        // unit: "%",
        unit:"percent",//unit比较特殊
        multi:1,
        increseRang:1,
        block:35 //区间应该独立否则会影响到其他的max-min
      });

    },
    //根据传过来的值重新赋值
    initKeysRangeMap(){
      this.keysRangeMap.get('start_cur_end').min=this.tigman_min_cur;
      this.keysRangeMap.get('start_cur_end').max=this.tigman_max_cur;
      this.keysRangeMap.get('peak_cur').min=this.tigman_min_cur;
      this.keysRangeMap.get('peak_cur').max=this.tigman_max_cur;

      this.keysRangeMap.get('weld_cur').min=this.tigman_min_cur;
      this.keysRangeMap.get('weld_cur').max=this.tigman_max_cur;
    
      this.keysRangeMap.get('base_cur').min=this.tigman_min_cur;
      this.keysRangeMap.get('base_cur').max=this.tigman_max_cur;
      
      this.keysRangeMap.get('crater_cur').min=this.tigman_min_cur;
      this.keysRangeMap.get('crater_cur').max=this.tigman_max_cur;
      this.keysRangeMap.get('post_gas').min=1;
      this.keysRangeMap.get('post_gas').max=10;
      this.keysRangeMap.get('ac_fre').max=this.max_ac_fre;
      this.keysRangeMap.get('ac_fre').min=this.min_ac_fre;
      console.log(this.max_ac_fre)
    },
     //根据传过来的值重新赋值
    keysChangelistMap(list){
      //新
      this.keysRangeMap.get('pre_gas').nowValue=list.PRE_GAS_VAL/10;
      this.keysRangeMap.get('start_cur_end').nowValue=
          this.calcRang(list.START_CUR_VAL,this.keysRangeMap.get('start_cur_end').min,this.keysRangeMap.get('start_cur_end').max);
      this.keysRangeMap.get('weld_cur').nowValue=
          this.calcRang(list.WELD_CUR_VAL,this.keysRangeMap.get('weld_cur').min,this.keysRangeMap.get('weld_cur').max);
      this.keysRangeMap.get('base_cur').nowValue=
          this.calcRang(list.BASE_CUR_VAL,this.keysRangeMap.get('base_cur').min,this.keysRangeMap.get('base_cur').max);;
      this.keysRangeMap.get('pulse_fre').nowValue=list.PULSE_FRE_VAL/10;
      this.keysRangeMap.get('pulse_duty').nowValue=list.DUTY_VAL/10;
      this.keysRangeMap.get('slop_down').nowValue=list.SLOP_DOWN_VAL/10;
      this.keysRangeMap.get('crater_cur').nowValue=
          this.calcRang(list.CRATER_CUR_VAL,this.keysRangeMap.get('crater_cur').min,this.keysRangeMap.get('crater_cur').max);;;
      this.keysRangeMap.get('post_gas').nowValue=
          this.calcRang(list.POST_GAS_VAL/10,this.keysRangeMap.get('post_gas').min,this.keysRangeMap.get('post_gas').max);;;;
      this.keysRangeMap.get('ac_fre').nowValue=list.AC_FRE_VAL>this.keysRangeMap.get('ac_fre').max?this.keysRangeMap.get('ac_fre').max:list.AC_FRE_VAL;
      this.keysRangeMap.get('ac_balance').nowValue=list.AC_DUTY_VAL;
      ;
      //旧
      // this.keysRangeMap.get('pre_gas').nowValue=list.PRE_GAS_VAL/10;
      // this.keysRangeMap.get('start_cur_end').nowValue=list.START_CUR_VAL;
      // this.keysRangeMap.get('weld_cur').nowValue=list.WELD_CUR_VAL;
      // this.keysRangeMap.get('base_cur').nowValue=list.BASE_CUR_VAL;
      // this.keysRangeMap.get('pulse_fre').nowValue=list.BASE_CUR_VAL/10;
      // this.keysRangeMap.get('pulse_duty').nowValue=list.DUTY_VAL/10;
      // this.keysRangeMap.get('slop_down').nowValue=list.SLOP_DOWN_VAL/10;
      // this.keysRangeMap.get('crater_cur').nowValue=list.CRATER_CUR_VAL;
      // this.keysRangeMap.get('post_gas').nowValue=list.POST_GAS_VAL/10;
      // this.keysRangeMap.get('ac_fre').nowValue=list.AC_FRE_VAL;
      // this.keysRangeMap.get('ac_balance').nowValue=list.AC_DUTY_VAL;
    },
    //20190613
    newKeysChangelistMap(paramValue){
      console.log(this.nowChooseLineKey)
      switch (this.nowChooseLineKey) {
        case 'pre_gas':
          this.keysRangeMap.get('pre_gas').nowValue=paramValue/10;
          break;
        case 'start_cur_end':
          this.keysRangeMap.get('start_cur_end').nowValue=
          this.calcRang(paramValue,this.keysRangeMap.get('start_cur_end').min,this.keysRangeMap.get('start_cur_end').max);
          break;
        case 'slop_up':
          this.keysRangeMap.get('slop_up').nowValue=
          this.calcRang(paramValue/this.keysRangeMap.get('slop_up').multi,this.keysRangeMap.get('slop_up').min,this.keysRangeMap.get('slop_up').max);
          break;
        case 'weld_cur':
          this.keysRangeMap.get('weld_cur').nowValue=
          this.calcRang(paramValue,this.keysRangeMap.get('weld_cur').min,this.keysRangeMap.get('weld_cur').max);
          break;
        case 'peak_cur':
          this.keysRangeMap.get('peak_cur').nowValue=
          this.calcRang(paramValue,this.keysRangeMap.get('peak_cur').min,this.keysRangeMap.get('peak_cur').max);
          break;
        case 'pulse_duty':
          this.keysRangeMap.get('pulse_duty').nowValue=paramValue;
          break;
        case 'pulse_fre':
          this.keysRangeMap.get('pulse_fre').nowValue=paramValue/10;
          break;
        case 'base_cur':
          this.keysRangeMap.get('base_cur').nowValue=
          this.calcRang(paramValue,this.keysRangeMap.get('base_cur').min,this.keysRangeMap.get('base_cur').max);;
          break;
        case 'slop_down':
          this.keysRangeMap.get('slop_down').nowValue=paramValue/10;
          break;
        case 'crater_cur':
          this.keysRangeMap.get('crater_cur').nowValue=
          this.calcRang(paramValue,this.keysRangeMap.get('crater_cur').min,this.keysRangeMap.get('crater_cur').max);
          break;
        case 'post_gas':
          this.keysRangeMap.get('post_gas').nowValue=
          this.calcRang(paramValue/10,this.keysRangeMap.get('post_gas').min,this.keysRangeMap.get('post_gas').max);
          break;
        case 'ac_fre':
          console.log(paramValue,this.keysRangeMap.get('ac_fre').max)
          this.keysRangeMap.get('ac_fre').nowValue=paramValue>this.keysRangeMap.get('ac_fre').max?this.keysRangeMap.get('ac_fre').max:paramValue;
          break;
        case 'ac_balance':
          this.keysRangeMap.get('ac_balance').nowValue=paramValue;
          break;
        default:
          break;
      }
    },
    calcRang(value,min,max){
      if(value<min){
        return min;
      }else if(value>max){
        return max;
      }else{
        return value;
      }
    },
    //计算最小电流最大电流区间
    clacTigManCur(){
      //最大只看 pfc
      // alert(this.pfc_num)
      // alert(this.ac_dc_num)
      // alert(this.hf_lift_num)
      if(this.pfc_num==1){
        if(this.ac_dc_num==1){//DC
          // this.tigman_max_cur=220;
          this.tigman_max_cur=200;//2019-07-29
        }else{
          this.tigman_max_cur=200;
        } 
      }else{
          // this.tigman_max_cur=140;
          this.tigman_max_cur=200;//2019-07-29
      }
      //最小 ac和hf
      if(this.ac_dc_num==1){
          if(this.hf_lift_num==1){
            this.tigman_min_cur=10;
          }else{
            this.tigman_min_cur=10;
          }
      }else{
          if(this.hf_lift_num==1){
            // this.tigman_min_cur=15;
            this.tigman_min_cur=30;//2019-07-29
          }else{
            this.tigman_min_cur=30;
          }
      }
    },
    clacTigMax_AC_FRE(base_cur,weld_cur){
      //20190615 单个上发没有了这两个参数 所以50~200
      this.max_ac_fre=200;
      this.min_ac_fre=50;
      return;
      if(base_cur>170 || weld_cur>170){
          this.max_ac_fre=100;
          return;
      }else if(base_cur>140 || weld_cur>120){
          this.max_ac_fre=120;
          return;
      }else if(base_cur>100 || weld_cur>100){
          this.max_ac_fre=150;
          return;
      }else if(base_cur>70 || weld_cur>70){
          this.max_ac_fre=200;
          return;
      }else if(base_cur<70 || weld_cur<70){
          this.max_ac_fre=250;
          return;
      }
        
    }
    /*****折线图 end ******/
    , getModelType(elementKey){
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
      }

    ,
    initFuc(){
       var list  ={};
    if(this.pageBackTo=='/memoryManage'){//来自momery页
        list  =this.$store.state.memoryInfo;
    }else{
        list  =this.$store.state.rstInfo;
    }
    this.nowModalTypeId =list.weldTypeNum;//后退回去时用
    this.nowTypeList =list.nowTypeList;
    //000.给线条字段赋值
    //11、范围构建函数 初始化
    this.pfc_num =list.initBean.pfc==1?list.initBean.pfc:0;
    this.ac_dc_num=list.initBean.polatrity==1?list.initBean.polatrity:0;
    this.hf_lift_num=list.initBean.ifhf==1?list.initBean.ifhf:0;
    this.isReadyFlag =list.initBean.isReadyFlag;//是否焊接准备完毕
    this.clacTigManCur();
    this.clacTigMax_AC_FRE(list.BASE_CUR_VAL,list.WELD_CUR_VAL);
    this.initKeysValueMap();
    this.initKeysRangeMap();
    //关闭重新赋值??20190526开启之前为什么关闭，导致不能实时更新
    this.nowChooseLineKey =list.nowChoosedKeyName;//新规则计算好当前选的keyname
    this.newKeysChangelistMap(list.paramValue);
    console.log(list.paramValue)
      
   //00.基本参数设置
    // this.nowDCORACFLAG ='0',//dc
    // this.nowModelTypeName = "4T_PULSE_DC";
    this.nowDCORACFLAG =list.initBean.polatrity;
    this.nowModelTypeName =list.initBean.nowChooseModel;
    this.typeName = "TIGMAN";
    // this.nowTypeList = this.tigmanList;
    //如果是焊接中的状态
    if(this.$store.state.weldingStatus==1){
        this.nowChooseLineKey = this.constant.weld_cur;//默认选中 电流且不能切换了
    }
    //11、范围构建函数
    // this.initKeysValueMap();
    this.initChooseline();
    //22、初始化 滑动控制器
    this.initSliderLineFuc();
    ++this.haveInitTimes;
    /*33、折线图 begin  新规则不需要画图了***/
    // if (this.witdhParam) {
      this.drawCharMainContrl(this.nowModelTypeName);//这里面不止时huacanvas还有逻辑赋值
    // }
    /****折线图 end***/
    //4、初始化 图片设置
    // this.initWeldingAutoRouter();
 
    },goBack(){
            this.$router.push({path:'/newIndex',query:{}});
        }
  },
  mounted: function() {
     this.$route.query.nowModalTypeId=3;
    // this.typeName =this.$route.query.type;
    // this.nowTypeList =this.tigmanList;
    this.pageBackTo =this.$route.query.pageBackTo;
    this.initFuc();
    console.log("1111||"+this.keyArr)
    //  if (window.history && window.history.pushState) {
    //   history.pushState(null, null, document.URL);
    //   window.addEventListener('popstate', this.go('/newIndex'), false);
    // } 
    if (window.history && window.history.pushState) {
            history.pushState(null, null, document.URL);
            window.addEventListener('popstate', this.goBack, false);
    } 
    if(this.$route.query.pageFrom =='/memoryDetail'){
        //来自记忆的application
        this.isReadyFlag=1;
    }
    //高度设置
    this.$nextTick(()=>{
        this.newContainHeight =$('#allPage').outerHeight();
        console.log($('#allPage').outerHeight())
        // console.log(this.$refs.allPage.outerHeight())
    })
  },
  created() {
    this.witdhParam = window.innerWidth;
  },
  computed: {
     getAndriodNewMsg () {
            return this.$store.state.AdroidNewMsg;　　//需要监听的数据
        }
  },
  watch: {
        getAndriodNewMsg(val, oldVal){
            if(val!=this.$store.state.AdroidOldMsg){
                
                this.$store.state.AdroidOldMsg=val;
                //更新操作
                this.modelType=this.getModelType(val.substring(2,4));
                this.wtlLog('weld_tigman_bfa3','this.modelType'+this.modelType);
                
                var rst =this.buildData('newIndex',this.modelType,val.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
                 
                 if(JSON.stringify(rst) != "{}"){
                    //发送确认收到的指令给安卓
                    var invalue =val.substring(val.length-4,val.length);
                    //新规则: 指令ff+crc+检验crc   测试模式不发送
                    this.callSendDataToBleUtil('newIndex','DAFF'+invalue+this.crcModelBusClacQuery('FF'+invalue, true),invalue);
                    //重新初始化
                    this.initFuc();
                }
                
            }
        },
    //list渲染完执行高度计算 更精确
    nowTypeList: function() {
      this.$nextTick(function() {
        let mmpId = this.$refs.mmpId;
        var hei = mmpId.offsetHeight;
        //初始化 内容高度 置低元素
        if (hei + 90 > window.innerHeight) {
          //元素高度加上底部高度超出否
          this.btFooterFlag = true;
        }
      });
    },
     nowPosionX2(val, oldVal){//普通的watch监听
          var now = val+'';
          if(now.indexOf('.')<0 && this.paramIncreaseDistance2!=1){
            if(this.nowChooseLineKey=='pulse_fre'){
               if(val<10.1){
                 this.nowPosionX2+='.0';
               }
            }else{
              this.nowPosionX2+='.0';
            }
           
          }
      }
  },
  destroyed(){
        window.removeEventListener('popstate', this.goBack, false);
       clearTimeout(this.autoTimeoutFlag);
      //  window.removeEventListener('popstate', this.go('/newIndex'), false);
      //记录最后一次修改的字段
      if(!this.GLOBAL_CONFIG.TESTFLAG){//测试模式不走
        window.android.saveKeyStorage('tig_man_nowChooseLineKey',this.nowChooseLineKey);
        
      }
  }
};
</script>
<style lang="scss" scoped>
.weldMMA {
  background: #01303e;
  width: 100%;
  min-height: 100vh;
  // flex-flow: row wrap;
  // display: flex;
  position: relative;
  .mmp {
    position: absolute;
    left: 0;
    top: 0;
    // position: relative;
    height: auto;
    width: 100%;
    margin-bottom: 40px;
  }
  // opacity: 0.1;
  .header {
    z-index: 1111111;
    position: fixed;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    text-align: left;
    width: 100%;
    color: #fff;
    background: #010101;
    padding-left: 60px;
    top: 0;
    left: 0;
    .ivu-icon {
      font-size: 20px;
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translate(0, -50%);
    }
    .setupyi {
      padding-left: 10px;
    }
  }
  .con-box{
      margin-top: 50px;
      padding-top: 2px;
     .containList {
        .typename {
          width: 40%;
          float: left;
          font-size: 14px;
          color: #fff;
          // opacity: 0.6;
          padding-left: 60px;
          //   margin-top: 15px;
        }
        .typename.ELECTRODE{
            background: url(../../assets/images/weld_icon_new_elecode.png) no-repeat;
            background-size: 40px;
            background-position: left center;
          }
          .typename.POLARITY{
            background: url(../../assets/images/weld_icon_new_acdc.png) no-repeat;
            background-size: 40px;
            background-position: left center;
          }
          .typename.MODE{
            background: url(../../assets/images/weld_icon_new_mode.png) no-repeat;
            background-size: 40px;
            background-position: left center;
          }
          .typename.MATERIAL{
            background: url(../../assets/images/weld_icon_new_meterial.png) no-repeat;
            background-size: 40px;
            background-position: left center;
          }
          .typename.GAS{
            background: url(../../assets/images/weld_icon_new_gas.png) no-repeat;
            background-size: 40px;
            background-position: left center;
          }
          .typename.DIAMETER{
            background: url(../../assets/images/weld_icon_new_diameter.png) no-repeat;
            background-size: 40px;
            background-position: left center;
          }
          .typename.THICKNESS{
            background: url(../../assets/images/weld_icon_new_thinkness.png) no-repeat;
            background-size: 40px;
            background-position: left center;
          } 
          .typename.Pulse{
            background: url(../../assets/images/weld_icon_new_pluse.png) no-repeat;
            background-size: 40px;
            background-position: left center;
          }
            .typename.HF{
            background: url(../../assets/images/weld_icon_new_hf.png) no-repeat;
            background-size: 40px;
            background-position: left center;
          }
        .btn {
          width: 60%;
          float: right;
          .btRight {
            text-align: right;
            color: #fff;
            // opacity: 0.8;
            img {
              width: 13px;
              height: 17px;
              vertical-align: middle;
            }
          }
        }
        .btn .ivu-btn {
          width: 90px;
          margin-right: 20px;
          margin-top: 10px;
        }
        .common {
          height: 40px;
          line-height: 40px;
          background: red;
          margin: 10px 20px;
          border-radius: 2px;
          background: linear-gradient(
            to top,
            rgba(10, 59, 70, 1) 0%,
            rgba(2, 46, 56, 1) 50%,
            rgba(10, 59, 70, 1) 100%
          );
          -moz-box-shadow: 0px 0px 2px 1px #103f4b;
          -webkit-box-shadow: 0px 0px 2px 1px #103f4b;
          box-shadow: 0px 0px 2px 1px #103f4b;
          .rid {
            padding: 0 25px;
            margin-right: 20px;
          }
        }
      }
  }
 
  .midLine1 {
    opacity: 0.5;
    width: 100%;
    height: 2px;
    margin-top: 20px;
    //  background: linear-gradient(to left, #173d4a , #fdfcff,#173d4a);
    background: linear-gradient(
      to right,
      rgba(23, 61, 74, 0.6) 0%,
      rgba(158, 180, 189, 1) 20%,
      rgba(244, 253, 255, 1) 50%,
      rgba(158, 180, 189, 1) 90%,
      rgba(23, 61, 74, 0.6) 100%
    );
  }
  .electricCurrent {
    margin: 25px 15px;
    padding: 20px 0;
    border-radius: 5px;
    //   box-shadow: 0px 0px 2px 1px #103f4b;
    -moz-box-shadow: 0px 0px 10px 5px #2d5360 inset; /* For Firefox3.6+ */
    -webkit-box-shadow: 0px 0px 10px 5px #2d5360 inset; /* For Chrome5+, Safari5+ */
    box-shadow: 0px 0px 10px 5px #2d5360 inset; /* For Latest Opera */
    //   background: red;
    .up {
      height: 70px;
      line-height: 62px;
      .u-left {
        width: 40%;
        float: left;
        height: 100%;
        text-align: center;
        img {
          width: 50px;
          vertical-align: middle;
        }
      }
      .u-right {
        width: 100%;
        text-align: center;
        height: 100%;
        position: relative;
        margin-top: 20px;
        .bt {
          float: left;
          width: 35px;
          height: 70px;
          font-size: 16px;
          background: #163749;
          color: #fff;
          // position: absolute;
          // top: 50%;
          // transform: translate(0, -50%);
        }
        .del {
             background: url(../../assets/images/jian.png) no-repeat;
            background-size: 35px;
            background-position: center center;
        }
        .value {
        //   float: left;
          width:230px;
          text-align: center;
          height: 70px;
          line-height: 70px;
          color: #fff;
          font-size: 48px;
          margin: 0 auto;
        //   position: absolute;
        //   top: 37%;
        //   transform: translate(0, -50%);
        //   left: 30px;
          .cct{width: 160px;height: 70px;float: left;text-align: center;}
            .con{
                 position: relative;
                 
            }
            .con.s::after{
                   content: 'S';
                    display: inline-block;
                    width: 3px;
                    height: 3px;
                    position: absolute;
                    bottom: 46px;
                    font-size: 18px;
                    right: -8px;
            }
            .con.A::after{
                   content: 'A';
                    display: inline-block;
                    width: 3px;
                    height: 3px;
                    position: absolute;
                    bottom: 46px;
                    font-size: 18px;
                    right: -8px;
            }
            .con.HZ::after{
                   content: 'Hz';
                    display: inline-block;
                    width: 3px;
                    height: 3px;
                    position: absolute;
                    bottom: 46px;
                    font-size: 18px;
                    right: -8px;
            }
            .con.percent::after{
                   content: '%';
                    display: inline-block;
                    width: 3px;
                    height: 3px;
                    position: absolute;
                    bottom: 46px;
                    font-size: 18px;
                    right: -8px;
            }
         
        }
        
        .dangerColor {
          color: red;
        }
        .add {
            right: 60px;
            background: url(../../assets/images/jia.png) no-repeat;
            background-size: 35px;
            background-position: center center;
        }
      }
    }
    .slider {
      position: relative;
      margin-top: 100px;
      height: 40px;
      width: 90%;
      // background: green;
      margin: 0 auto;
      .bgSlider {
        background: #fdfffd;
        position: absolute;
        height: 5px;
        width: 100%;
        left: 0;
        top: 50%;
        transform: translate(0, -50%);
      }
      .dangerRange {
        background: #0079a3;
        position: absolute;
        height: 5px;
        width: 100px;
        left: 0;
        top: 50%;
        transform: translate(0, -50%);
      }
      .sliderBtn {
        height: 20px;
        width: 10px;
        background: #333;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(0, -50%);
        border-radius: 2px;
        .left {
          float: left;
          width: 3px;
          height: 100%;
          background: #08221f;
        }
        .right {
          float: left;
          width: 7px;
          background: #00c2ee;
          height: 100%;
          opacity: 0.8;
        }
      }
    }
    .rdown {
      font-size: 16px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-weight: bold;
      color: #00c6ff;
    }
    /****折线begin****/
    .canvas-main-contain {
      height: auto;
      width: 100%;
      text-align: center;
    }
    .canvas-two{
       height: 50px;
      width: 100%;
      text-align: center;
    }
    .chooseParams {
      color: #fff;
      font-size: 20px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      position: relative;
        background: url(../../assets/images/tm_choose_btline.jpg) no-repeat;
        background-size: 65%;
        background-position: bottom center;
     
      .l {
        left: 10%;
        width: 20px;
        height: 100%;;
        position: absolute;
        background: url(../../assets/images/tm_choose_left.jpg) no-repeat;
        background-size: 30px;
        background-position: left center;
        padding-left: 33px;
      }
      .r {
         position: absolute;
         right: 10%;
        width: 20px;
        height: 100%;;
        background: url(../../assets/images/tm_choose_right.jpg) no-repeat;
        background-size: 30px;
        background-position: right center;
        padding-right: 33px;

      }
    }
    /****折线end****/
  }
  .inducance {
    height: 50px;
    line-height: 50px;
    color: #fff;
    text-align: center;
    background: #01303e;
    background: linear-gradient(to top, #0c3648, #2c5361, #0c3648);
  }

  .new-footer-btns {
    // position: fixed;
    // bottom: 0;
    margin-top: 0;
    width: 100%;
    height: 40px;
    background: #333; /* For browsers that do not support gradients */
    background: -webkit-linear-gradient(
      #fff,
      #333,
      #fff
    ); /* For Safari 5.1 to 6.0 */
    .btn {
      width: 50%;
      height: 40px;
      float: left;
      text-align: center;
      color: #fff;
      // color: #000;
      font-size: 18px;
      line-height: 40px;
      // border-right: 2px solid;
      background: #000;
      // background: linear-gradient(to top, #354141 0%, #000 100%);
      // background: -moz-linear-gradient(to top, #354141 0%, #000 100%);
      // background: -webkit-gradient(
      //   linear,
      //   to left to top,
      //   to left to bottom,
      //   color-stop(0%, #354141),
      //   color-stop(100%, #000)
      // );
      // background: -webkit-linear-gradient(to top, #354141 0%, #000 100%);
      // background: -o-linear-gradient(to top, #354141 0%, #000 100%);
      // background: -ms-linear-gradient(to top, #354141 0%, #000 100%);
    }
    .n-1 {
      position: relative;
      .shuxian{
            width: 2px;
            height: 40px;
            position: absolute;
            right: 0;
            background:url(../../assets/images/shuxian.png) no-repeat;    
            background-size: 2px;
            background-position:right center;
        }
      span {
        background: url(../../assets/images/memory.png) no-repeat;
        background-size: 26px;
        background-position: left center;
        padding-left: 33px;
      }
    }
    .n-2 {
      // width: 60%;
      span {
        color: #fff;
        font-weight: bold;
        
      }
    }
    .btn:last-of-type {
      border-right: none;
    }
  }
  .hideWid {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    // background-color: rgba(55,55,55,.6);
    height: 100%;
    z-index: 100;

    .up {
      background: #333;
      height: 100%;
      top: 0;
      // bottom: 0;
      right: 0;
      left: 0px;
      opacity: 0.8;
      position: fixed;
    }
    .down {
      overflow: initial;
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
      animation: btmoveOne 0.5s;
      -webkit-animation: btmoveOne 0.5s;
      animation-fill-mode: forwards; /*当动画完成时，动画会停留在最后一帧。*/
      overflow: initial;
      .confirm {
        //   height: 50px;
        color: #4cb2c5;
        font-family: Arial;
        width: 100%;
        clear: both;
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 30px;
        background: -moz-linear-gradient(top, #070304 0%, #3d3b3c 100%);
        background: -webkit-gradient(
          linear,
          left top,
          left bottom,
          color-stop(0%, #3d3b3c),
          color-stop(100%, #070304)
        );
      }
      .btlist {
        margin: 0 20px;
        margin-bottom: 10px;
        font-size: 16px;
        li {
          width: 33.33%;
          height: 60px;
          float: left;
          margin-bottom: 20px;
          .con {
            background: #3f4043;
            height: 100%;
            border-radius: 20px;
            text-align: center;
            height: 60px;
            line-height: 60px;
            color: #fff;
          }
          .choose {
            background: #214360;
          }
        }
        li:nth-child(1) {
          padding-right: 10px;
        }
        li:nth-child(2) {
          padding: 0 10px;
        }
        li:nth-child(3n + 3) {
          padding-left: 10px;
        }
        li:nth-child(4n + 4) {
          padding-right: 10px;
        }
        li:nth-child(5n + 5) {
          padding: 0 10px;
        }
      }
      .title {
        width: 100%;
        //   min-height: 280px;
        height: 130px;

        .le {
          width: 60%;
          float: left;
          text-align: right;
          line-height: 100px;
          height: 100px;
          position: relative;
            img{
                position: absolute;
                left: 10px;
                top: -76px;
                width: 170px;
                margin-right: 10px;
                vertical-align: middle;
            }
        }
        .ri {
          text-align: center;
          font-size: 24px;
          height: 100px;
          line-height: 100px;
          float: left;
          width: 40%;
          color: #fff;
          opacity: 0.8;
        }
      }
    }
    .transdown {
      animation: btmoveSecond 0.5s;
      -webkit-animation: btmoveSecond 0.5s;
      animation-fill-mode: forwards; /*当动画完成时，动画会停留在最后一帧。*/
      overflow: hidden;
    }

    @-webkit-keyframes btmoveOne /* Safari and Chrome */ {
      0% {
        bottom: -70%;
      }
      100% {
        bottom: 0;
      }
    }
    @-webkit-keyframes btmoveSecond /* Safari and Chrome */ {
      0% {
        bottom: 0;
      }
      100% {
        bottom: -70%;
      }
    }
  }
  .footers {
    // align-self: flex-end;
    position: fixed;
    bottom: 0;
    width: 100%;
  }
}
/deep/ .ivu-radio-group-button.ivu-radio-group-large .ivu-radio-wrapper {
  height: 25px;
  line-height: 23px;
}

.unchoose {
  color: #000;
  background: #fff;
}
.weldFixed {
  position: fixed;
}
.weldMMA .footers.unEnough {
//   position: unset;
}
.eleUnShow {
  display: none;
}
</style>
