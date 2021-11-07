<template>
  <div class="weldMMA" :class="[ifFixedFlag?'weldFixed':'',envType=='env_ios'?'env_ios_gClass':'']"  :style="{height:newContainHeight+80+'px'}" id="allPage"  ref="allPage">
        <!-- <div class="header"><Icon type="ios-arrow-back" @click="go('/newIndex')"/>{{changeStrEmptyName(typeName)}}<span class="setupyi">SET UP</span></div> -->
        <Head :wantTo="'/newIndex'" :typeName="typeName" :pageFrom="'/weld_tig_syn'" :nowModalTypeId="nowModalTypeId"></Head>
        <div class="mmp" ref="mmpId" id="idid">
                <div class="con-box">
                     <div class="containList" v-for="(item,index) in nowTypeList" :key="index" >
                        <div class="common" >
                            <!-- <div class="typename" :class="item.typeName">{{changeStrShowName(item.typeName)}}</div> -->
                            <div class="typename" v-if="UnitFlag==1" :class="item.typeName" @click="openModal(item.typeName,item.inchComList,item.chooseKey)">{{changeStrShowName(item.typeName)}}</div>
                            <div class="typename" v-if="UnitFlag!=1" :class="item.typeName" @click="openModal(item.typeName,item.comList,item.chooseKey)">{{changeStrShowName(item.typeName)}}</div>
                            <div class="btn" v-if="UnitFlag==0">    
                                <!-- 只是加了个判断区分处理 thinkness数据  根据id判断选中-->
                                <div  class="btRight"  v-for="(bean,index1) in item.comList" :key="index1" type="primary"
                                v-if="item.chooseKey==bean.id"
                                :class="item.chooseKey==bean.id?'':'unchoose'"
                                @click="openModal(item.typeName,item.comList,item.chooseKey)"
                                >
                                    <span style="padding-right:11px">{{bean.value}}</span>
                                    <span style="padding-right:10px;" v-if="item.typeName!='POLATRITY'"><img src="../../assets/images/edit.png" ></span>
                                </div>
                            </div>
                            <div class="btn" v-if="UnitFlag==1">
                                <!-- 只是加了个判断区分处理 thinkness数据  根据id判断选中-->
                                <div  class="btRight"  v-for="(bean,index1) in item.inchComList" :key="index1" type="primary"
                                v-if="item.chooseKey==bean.id"
                                :class="item.chooseKey==bean.id?'':'unchoose'"
                                @click="openModal(item.typeName,item.inchComList,item.chooseKey)"
                                >
                                    <span style="padding-right:11px">{{bean.value}}</span>
                                    <span style="padding-right:10px;" v-if="item.typeName!='POLATRITY'"><img src="../../assets/images/edit.png" ></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="midLine1">
                    <div class="left"></div>
                    <div class="right"></div>
                </div>
                <!-- 电流 -->
                <div class="electricCurrent">
                    <div class="up">
                        <div class="u-left">
                            <img  src="../../assets/images/weld_icon_current.png">
                        </div>
                        <div class="u-right">
                            <div class="bt del" @click="delFuc()"></div>
                            <div class="value"  :class="nowPosionX<diffMin || nowPosionX>diffMax?'dangerColor':''">{{nowPosionX}}</div>
                            <div class="bt add" @click="addFuc()"></div>
                        </div>
                    </div>
                    <div class="slider" ref="mySlider">
                        <div class="bgSlider"></div>
                        <div class="dangerRange" ref="dangerRange"></div>
                        <div class="sliderBtn" ref="sbtn">
                            <div class="left"></div>
                            <div class="right"></div>
                        </div>
                    </div>
                    <div class="rdown">
                        {{min}}~{{max}}A
                    </div>
                </div>
                <!-- 电压 -->
                <div class="electricCurrent Voltage">
                    <div class="up">
                        <div class="u-left"><img  src="../../assets/images/postGas.png"></div>
                        <div class="u-right">
                            <div class="bt del" @click="delFuc2()"></div>
                            <div class="value" :class="nowPosionX2<diffMin2 || nowPosionX2>diffMax2?'dangerColor':''">{{nowPosionX2}}</div>
                            <div class="bt add" @click="addFuc2()"></div>
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
                    <div class="rdown">
                        {{min2}}~{{max2}}s
                    </div>
                </div>
                 <div class="inducance">
                    <div class="showna">PostGasTime:<span>{{postGasTime}}</span></div>
                </div>
        </div>
   <div class="footers" :class="btFooterFlag?'unEnough':''">
                       
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
            <div class="down" v-if="downshowFlag && nowtypename!='THICKNESS'" :class="closeClass?'transdown':''">
                <div class="title">
                    <div class="le">
                        <img v-if="nowtypename=='MATERIAL'" src="../../assets/images/blue_weld_icon_new_meterial.png"> 
                        <img v-if="nowtypename=='DIAMETER'" src="../../assets/images/blue_tig_diameter.png"> 
                        <img v-if="nowtypename=='MODE'" src="../../assets/images/blue_weld_icon_new_mode.png"> 
                    </div>
                    <div class="ri">{{changeStrShowName(nowtypename)}}</div>
                </div>
                <ul class="btlist">
                    <li  v-for="(bean,index1) in showBtnList" :key="index1" type="primary" @click="modalChangeChecked(bean.id)"
                   >
                        <div class="con" :class="nowChoose==bean.id?'choose':''">{{bean.value}}</div>
                    </li>
                    <div style="clear:both;"></div>
                </ul>
                <div class="confirm" @click="newCloseModal">
                    OK
                </div>
            </div>
            <!-- 厚度专用可拉动选择弹层 -->
            <div class="down thinkness"  v-if="downshowFlag && nowtypename=='THICKNESS'" ref="dth" :class="closeClass?'transdown':''">
                    <div class="d-t-name">
                        <div class="t-icon">
                            <img src="../../assets/images/blue_weld_icon_new_thinkness.png">
                        </div>
                        <div class="t-name">
                            Thickness
                        </div>
                    </div>
                    <div class="d-t-value">{{actualNum}}&nbsp;&nbsp;<span class="range">({{minTRange}}~{{maxTRange}})</span></div>
                    <div class="ncommon ruler" :style="{height:commonContainHeight+'px'}" @touchstart.stop="handleTouchstart">
                        <ul class="rulers" ref="rulerMySlider">
                                <li class="r-li" v-for="(item,index) in disNumAtr"   :style="{height:item.height+'px'}">
                                    <span class="line" :style="{top:item.height+'px'}"></span>
                                    <span :style="{top:(item.height-3)+'px'}">{{item.num}}</span>
                                </li>
                        </ul>
                        <div class="r-begin"></div>
                        <div class="r-end"></div>
                        <span class="snum" v-if="UnitFlag==0">0mm</span>
                        <span class="enum" v-if="UnitFlag==0">13mm</span>
                        <span class="snum" v-if="UnitFlag==1">12GA</span>
                        <span class="enum" v-if="UnitFlag==1">10/16"</span>
                    </div>
                    <div class="newContian" :style="{height:commonContainHeight+'px'}" ref="downLineSlider">
                        <div class="ncommon distance" :style="{height:commonContainHeight+'px'}">
                            <div class="up">
                                <div class="jiantou"></div>
                            </div>
                            <div class="mid" ref="rMidLine">
                                <div class="ErectLine"></div>
                                <div class="bt"></div>
                            </div>
                            <!-- <div class="rdown" ref="downLineSlider"> -->
                                <div class="rdown">
                                <div  class="contain" ></div>
                                <div class="djiantou"></div>
                            </div>
                        </div>
                        <div class="ncommon cube-wrapper" :style="{height:commonContainHeight+'px'}">
                            <div class="cube-box" ref="cubeBox1">
                                <div class="cube2 cube"></div>
                                <div class="cube4 cube"></div>
                                <!-- <div class="cube1 cube"></div> -->

                                <div class="cube6 cube"></div>
                            </div>
                        </div>
                    </div>     
                    <div class="b-t-btn-sub">
                        <div class="subbtn"  @click="newCloseModal('THICKNESS')">OK</div>
                    </div>
            </div>
            
     </div>
     <!-- 底部抽屉弹层 按钮组 end -->
     <Loading :is-loading="isLoading"></Loading>
  </div>
</template>

<script>
import { MessageBox ,Popup,Toast ,Indicator } from 'mint-ui'
import Head from "@/components/base/header";
import Loading from "@/components/base/Loading";
import $ from 'jquery'
export default {
  name: '',
  components: {
   Loading,
   Head
  },
  data () {
    return {
        newContainHeight:200,
        firstInit:true,
        isReadyFlag:0,//是否焊接准备完毕
        minTRange:'',
        maxTRange:'',
        winHeight:'',
        autoTimeoutFlag:{},//自动跳转定时器
        isLoading:false,
        nowModalTypeId:'',//当前焊接模式的id
        MIG_MATERIAL:'',//联动控制 gas选项出现
        UnitFlag:0,//是否是inch单位
        btFooterFlag:false,//置底
        timeInterval1:'',//获取安卓原生信息定时器
        //begin 开始弹层中可滑动选择参数开始
        ifFixedFlag:'',//控制不同层滑动
        distanceBegin:'',//区间值最小值
        distanceEnd:'',//区间值最大值
        unit:'mm',//单位
        increaseNum:'',//每次增加的数量值
        disNum:0,//刻度数量
        disNumAtr:[],//数组
        commonContainHeight:150,//内容的高度
        avgHeight:'',//平均的刻度高度 百分比数值
        avgHeightValue:'',//间隔 相对于总高度的值
        actualNum:'',//实时数值
        sTopValue:'',//指示器高度位置
        sTopCard:'',//标尺
        clacHeaderHeigt:'',//抽屉弹层顶部的距离 
        nowTouchIndex:'',//当前滑动的位置
        touchStartY:'',//触摸位移记录
        //end 开始弹层中可滑动选择参数开始
        // 底部抽屉动画
        showBtnList:[],//弹出的按钮内容集合
        nowChoose:'',//当前选中
        nowtypename:'',//当前选中 的typename
        hideFlag: false,
        closeClass: false,
        upshowFlag:false,
        downshowFlag:false,
        // 电流控制器 begin
        myPosition:{
					left:0,
					right:0,
					now:0,
					isBtn:2,//焦点
					propoWidth:0
				},
        max:10,//默认
        min:0,//默认
        block:10,//总的区间
        diffMin:3,//特殊区间段最小值
        diffMax:4,//特殊区间最大值
        nowPosionX:3,//当前位置
        oldPosionX:'',//老的值用于判断是否需要发送给安卓内容
        timerPosition1:'',//定时器避免重复点击 造成连续发送
        touchStartFlag:false,
        InDangerFlag:false,
        paramIncreaseDistance:1,//加减法 按钮的增长幅度
        // 电流控制器 end
         // 电压控制器 begin
         myPosition2:{
					left:0,
					right:0,
					now:0,
					isBtn:2,//焦点
					propoWidth:0
				},
        max2:100,
        min2:0,
        block2:100,//总的区间
        diffMin2:0,//特殊区间段最小值
        diffMax2:0,//特殊区间最大值
        nowPosionX2:36,//当前位置
        oldNowPosionX2:'',
        timerPosition2:'',//定时器避免重复点击 造成连续发送
        touchStartFlag2:false,
        InDangerFlag2:false,
        paramIncreaseDistance2:0.1,//加减法 按钮的增长幅度
        // 电压控制器 end
        model_0:'2T',
        model_1:'AC',
        model:[{key:'model_0'},{key:'model_1'}],
        typeName:'',
        nowTypeList:[],//共通title数据集合
        chooseKey:[],//共通选中集合
        rulerNumAtrMap:  new Map([
            [0,{num:'0.6mm',height:6,id:0}],
            [1,{num:'0.7mm',height:7,id:1}],
            [2,{num:'0.9mm',height:9,id:2}],
            [3,{num:'1.2mm',height:12,id:3}],
            [4,{num:'1.6mm',height:16,id:4}],
            [5,{num:'2.1mm',height:21,id:5}],
            [6,{num:'2.8mm',height:28,id:6}],
            [7,{num:'3.4mm',height:34,id:7}],
            [8,{num:'4.8mm',height:48,id:8}],
            [9,{num:'6.4mm',height:64,id:9}],
            [10,{num:'8.0mm',height:88,id:10}],
            [11,{num:'9.5mm',height:95,id:11}],
            [12,{num:'11mm',height:110,id:12}],
            [13,{num:'12.7mm',height:127,id:13}]
        ]),
           rulerInchNumAtrMap:  new Map([
            [0,{num:'24GA',height:6,id:0}],
            [1,{num:'22GA',height:7,id:1}],
            [2,{num:'20GA',height:9,id:2}],
            [3,{num:'18GA',height:12,id:3}],
            [4,{num:'16GA',height:16,id:4}],
            [5,{num:'14GA',height:21,id:5}],
            [6,{num:'12GA',height:28,id:6}],
            [7,{num:'1/8"',height:34,id:7}],
            [8,{num:'3/16"',height:48,id:8}],
            [9,{num:'1/4"',height:64,id:9}],
            [10,{num:'5/16"',height:88,id:10}],
            [11,{num:'3/8"',height:95,id:11}],
            [12,{num:'7/16"',height:110,id:12}],
            [13,{num:'1/2"',height:127,id:13}]
        ]),
        rulerNumAtr:[],
        rulerInchNumAtr:[],
        nowThinknessSendIndex:'',
        postGasTime:''
     }
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
      getBleRespMsg(){
          
        //   Toast({
        //         message: '蓝牙返回数据是：'+window.android.getBleRespMsg(),
        //         position: 'middle',
        //         iconClass: 'icon icon-success',
        //         duration: 1500
        //     });
      },
      //滑动选择组件begin
      sliderParentInit(){
        //初始化
        let self =this;
    //    if(self.init()){
        if(true){
          
           if(this.UnitFlag==1){
                self.disNumAtr=[
                    {num:'19GA',height:8.05},
                    {num:'2/16"',height:37.95},
                    {num:'5/16"',height:55.2},
                    {num:'9/16"',height:36.8}
                ]
           }else{
                self.disNumAtr=[
                    {num:'1mm',height:8.05},
                    {num:'4mm',height:37.95},
                    {num:'8mm',height:55.2},
                    {num:'12mm',height:36.8}
                ]
           }
            let mySlider = self.$refs.rulerMySlider;
            var midLine =self.$refs.rMidLine;
            let cubeBox1 =  self.$refs.cubeBox1;
            let downLineSlider =self.$refs.downLineSlider;

                if(self.actualNum){
                    for (let i = 0; i < self.rulerNumAtr.length; i++) {
                        if(self.rulerNumAtr[i].num==self.actualNum){
                            self.nowThinknessSendIndex = self.rulerNumAtr[i].id;//当前的厚度索引值
                            midLine.style.height = self.rulerNumAtr[i].height+'px';
                            cubeBox1.style.height =self.rulerNumAtr[i].height+'px';
                            self.nowTouchIndex =i;
                            break;
                       }
                        
                    }
                 
                    // midLine.style.height = (self.actualNum/self.increaseNum )*self.avgHeightValue+'px';
                    // cubeBox1.style.height =(self.actualNum/self.increaseNum )*self.avgHeightValue+'px';
                }

            downLineSlider.addEventListener('touchstart',(e)=>{//屏幕触摸事件
                    self.touchStartY =e.changedTouches[0].pageY;
                })
            let settimeOutFlag =true;
            downLineSlider.addEventListener('touchmove',(e)=>{ //屏幕滑动事件
                    self.clacThinknessByTouch(e.changedTouches[0].pageY);
                     //1、下滑 增加
                    // if(e.changedTouches[0].pageY>self.touchStartY){
                    //     if(self.nowTouchIndex==(self.rulerNumAtr.length-1)){//已经最大
                    //         return;
                    //     }else{
                    //         if(settimeOutFlag){
                    //             settimeOutFlag=false;
                    //             setTimeout(() => {
                    //                 ++self.nowTouchIndex;
                    //                 midLine.style.height = self.rulerNumAtr[self.nowTouchIndex].height+'px';
                    //                 cubeBox1.style.height =self.rulerNumAtr[self.nowTouchIndex].height+'px';
                    //                 self.actualNum =self.rulerNumAtr[self.nowTouchIndex].num;
                    //                 self.nowThinknessSendIndex = self.rulerNumAtr[self.nowTouchIndex].id;//当前的厚度索引值
                    //                 settimeOutFlag=true;
                    //             },150);
                    //         }
                            
                           
                    //     }
                    // //2、上滑 减少
                    // }else{
                    //     if(self.nowTouchIndex==0){//已经最小
                    //         return;
                    //     }else{
                    //         if(settimeOutFlag){
                    //             settimeOutFlag=false;
                    //             setTimeout(() => {
                    //                 --self.nowTouchIndex;
                    //                 midLine.style.height = self.rulerNumAtr[self.nowTouchIndex].height+'px';
                    //                 cubeBox1.style.height =self.rulerNumAtr[self.nowTouchIndex].height+'px';
                    //                 self.actualNum =self.rulerNumAtr[self.nowTouchIndex].num;
                    //                 settimeOutFlag=true;
                    //             },100);
                    //         }
                    //     }
                    // }

            })
             downLineSlider.addEventListener('touchend',(e)=>{ //屏幕滑动事件
                    self.touchStartY='';//清除

            })
              
                //获取浏览器高度
                self.winHeight =window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                let dth = this.$refs.dth;
                self.clacHeaderHeigt =self.winHeight-dth.offsetHeight+85;//85是抽屉盒里元素的距离
               
       }else{
           if(this.UnitFlag==1){
               this.disNumAtr =[
                     {num:'19GA',height:8.05},
                    {num:'2/16"',height:37.95},
                    {num:'5/16"',height:55.2},
                    {num:'9/16"',height:36.8}
               ]
           }else {
               this.disNumAtr=[
                    {num:'1mm',height:8.05},
                    {num:'4mm',height:37.95},
                    {num:'8mm',height:55.2},
                    {num:'12mm',height:36.8}
                    
                ]
           }
           
       }
        
      
      },
           //根据手的滑动位置 来计算厚度值
    clacThinknessByTouch(pagey){
        let self =this;
        let midLine =self.$refs.rMidLine;
        let cubeBox1 =  self.$refs.cubeBox1;
        var btTY = self.winHeight;
        var maxTY =btTY-90;//去除底部高度
        var minTY =btTY -90-150;
        var circlrTY=maxTY-minTY;//范围区间
        //计算出每个长度对应的位置
         for (let i = 0; i < self.rulerNumAtr.length; i++) {
            // if(pagey>(((self.rulerNumAtr[i].height/130)*circlrTY+minTY)-1) && pagey<(((self.rulerNumAtr[i].height/130)*circlrTY+minTY)+1) ){
            if(pagey>(((self.rulerNumAtr[i].height/130)*circlrTY+minTY)-6) && pagey<(((self.rulerNumAtr[i].height/130)*circlrTY+minTY)+1) ){
                console.log(i)
                console.log(self.rulerNumAtr)
                midLine.style.height = self.rulerNumAtr[i].height+'px';
                cubeBox1.style.height =self.rulerNumAtr[i].height+'px';
                self.actualNum =self.rulerNumAtr[i].num;
                self.nowTouchIndex =self.rulerNumAtr[i].id;//这里应该使用id不能用i i只是循环标记
                self.nowThinknessSendIndex =self.rulerNumAtr[i].id
                break;
            }
        }
       
    },
      //滑动选择组件end
      modalChangeChecked(key){
          this.nowChoose =key;
      },
    openModal(typename,comList,chooseKey){
        let self =this;
        //00、 判断是不是焊接中，焊接中不能编辑部分参数
        if(self.$store.state.weldingStatus==1){
            return;
        }
        if(typename=='POLATRITY'){//不能修改
            return;
        }
     
      self.showBtnList=comList;
      self.nowChoose =chooseKey;
      self.nowtypename=typename;
      self.ifFixedFlag=true;//固定 弹层出现底部不能滑动了
      self.hideFlag=true;
      self.downshowFlag=true;
       setTimeout(
          function fuc(params) {
            self.upshowFlag=true;//延迟显示底色
            //延迟初始化 否则会读取不到原素！！！！！！！！
            if(typename=='THICKNESS'){
                //底部 需要fixed化 避免滚动重复
                self.ifFixedFlag=true;
                //初始化滑动组件
                // self.actualNum=chooseValue.replace('mm','');
                self.getNowThinknessChoosed(chooseKey);
                self.sliderParentInit();
            }
          }
          
        ,200)
   
    },
     getNowThinknessChoosed(id){
        //选中的id
        if( this.UnitFlag==1){
                this.rulerNumAtr =this.rulerInchNumAtr;
                this.rulerNumAtr.forEach(element => {
                    if(element.id==id){
                        this.actualNum =element.num;
                    }
                });
            }else{
                this.rulerNumAtr.forEach(element => {
                    if(element.id==id){
                        this.actualNum =element.num;
                    }
                });
            }
    },
    //抽屉弹层的确认键
    newCloseModal(modalType){
         let self =this;
         self.ifFixedFlag=false;
         //1、对于选中的值赋值到主页中
         if(modalType=='THICKNESS'){
            //厚度的特殊处理
            self.changeThinckChecked(self.nowtypename, self.actualNum,0);
         }else if(self.nowtypename=='MATERIAL'){//材料切换由于POLATRITY要联动
            //1、是否有必要更新
            //2、同时修改电压电流模式
            self.changeMetirialChecked(self.nowtypename, self.nowChoose,0);
         }else{
            self.changeChecked(self.nowtypename, self.nowChoose,0);
         }
         
         //2、原来关闭逻辑
         self.closeClass=true;
         self.upshowFlag=false;
        setTimeout(
          function fuc(params) {
            self.hideFlag=false;
            self.downshowFlag=false;
            self.closeClass=false;
          }
          ,500)
    }, closeModal(){
         let self =this;
         self.ifFixedFlag=false;
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
      addFuc(){
        
        if(this.nowPosionX==this.max){
            return;
        }else{
            this.nowPosionX=Math.round((parseFloat(this.nowPosionX)+this.paramIncreaseDistance)*10)/10;
            let sliderBtn =  this.$refs.sbtn;
            //00、初始化滚动条位置 占比是百分比
            sliderBtn.style.left = (this.nowPosionX-this.min)/this.block*100+'%' ;
            //开启定时器 发送给安卓
            clearTimeout(this.timerPosition1);
            this.timerPosition1 = setTimeout(() => {
                    if(this.nowPosionX!=this.oldPosionX){
                        this.oldPosionX =this.nowPosionX;
                        this.buildSliderChangeData(this.nowPosionX,'WELDCUR');
                    }
            }, 1000);
        }
    },
    buildSliderChangeData(value,type){
        // var aa = (Array(2).join('0') + parseInt(positionNum*10,10).toString(16)).slice(-2);
        //计算 查找 发送请求给ble告知 修改了
        var dirctCode = this.getDirective(this.typeName,type)//电流;
        //新规则占两个字节的字段需要特殊处理
        var  num =this.jinzhiChangeFuc(value);
        // var num = (Array(4).join('0') + parseInt(value,10).toString(16)).slice(-4);
        //     num= num.substring(2,4)+num.substring(0,2);
        var crc =this.crcModelBusClacQuery(dirctCode+num, true);
        var sendData ="DA"+dirctCode+num+crc;
        console.log(value+'||'+sendData)
        this.callSendDataToBleUtil('weld_tig_syn',sendData,crc);
    },
    delFuc(){
            if(this.nowPosionX==this.min){
            return;
        }else{
            this.nowPosionX=Math.round((this.nowPosionX-this.paramIncreaseDistance)*10)/10;
            let sliderBtn =  this.$refs.sbtn
            //00、初始化滚动条位置 占比是百分比
            sliderBtn.style.left = (this.nowPosionX-this.min)/this.block*100+'%';
            clearTimeout(this.timerPosition1);
            this.timerPosition1 = setTimeout(() => {
                    if(this.nowPosionX!=this.oldPosionX){
                        this.oldPosionX =this.nowPosionX;
                        this.buildSliderChangeData(this.nowPosionX,'WELDCUR');
                    }
            }, 1000);
        }
    },addFuc2(){
        if(this.nowPosionX2==this.max2){
            return;
        }else{
            this.nowPosionX2= Math.round((parseFloat(this.nowPosionX2)+this.paramIncreaseDistance2)*10)/10;
            let sliderBtn =  this.$refs.sbtn2
            //00、初始化滚动条位置 占比是百分比
            sliderBtn.style.left = (this.nowPosionX2-this.min2)/this.block2*100+'%';
            clearTimeout(this.timerPosition2);
            this.timerPosition2 = setTimeout(() => {
                    if(this.oldNowPosionX2!=this.nowPosionX2){
                        this.oldNowPosionX2 =this.nowPosionX2;
                        this.buildSliderChangeData(this.nowPosionX2*10,'slowDownTime');
                    }
            }, 1000);
        }
    },
    delFuc2(){
            if(this.nowPosionX==this.min2){
            return;
        }else{
            this.nowPosionX2=Math.round((parseFloat(this.nowPosionX2)-this.paramIncreaseDistance2)*10)/10;
            let sliderBtn =  this.$refs.sbtn2
            //00、初始化滚动条位置 占比是百分比
            sliderBtn.style.left = (this.nowPosionX2-this.min2)/this.block2*100+'%';
            clearTimeout(this.timerPosition2);
            this.timerPosition2 = setTimeout(() => {
                    if(this.oldNowPosionX2!=this.nowPosionX2){
                        this.oldNowPosionX2 =this.nowPosionX2;
                        this.buildSliderChangeData(this.nowPosionX2*10,'slowDownTime');
                    }
            }, 1000);
        }
    },
      getmodel(index){
          return "model_"+index;
      },
       go(url){
        if(url=='/welding'){
            //执行焊接
            var data = "";
            if(this.isModbusModal){
                var list  ={};
                if(this.pageBackTo=='/memoryManage'){//来自momery页
                    list  =this.$store.state.memoryInfo;
                }else{
                    list  =this.$store.state.rstInfo;
                }
                let bitInfoList = list.initBean.bitInfoList;
                let num =this.jinzhiChange2jinzhiFuc(`0000011${bitInfoList.tigsynWeldMode}${bitInfoList.tigmanCurrent}${bitInfoList.tigmanGas}${bitInfoList.tigmanMc}${bitInfoList.tigmanPinglv}${bitInfoList.tigmanWeldMode}`);
                data =  this.getDirective(this.typeName, 'Getready')+num;//011000000000 tigsyn
            }else{
                data =  this.getDirective(this.typeName, 'Getready')+ '0000';
            }
            var crc = this.crcModelBusClacQuery(data, true);
            var sendData = "DA" + data + crc;        
            this.callSendDataToBleUtil('weld_tig_syn',sendData,crc);
        }else{
            this.$router.push({path:url,query:{type: this.typeName ,nowModalTypeId:this.nowModalTypeId,pageFrom:'/weld_tig_syn'}});
        }
        
    },
    onlyChangeCheckedNoSend(type,value,index){
        this.nowTypeList.forEach(element => {
            if(element.typeName==type){
                if(type=='MATERIAL'){
                    this.MIG_MATERIAL =value;
                }
                element.chooseKey=value;
            }
        });
    },
    changeChecked(type,value,index){
        this.nowTypeList.forEach(element => {
            if(element.typeName==type){
                if(type=='MATERIAL'){
                    this.MIG_MATERIAL =value;
                }
                element.chooseKey=value;
                //计算 查找 发送请求给ble告知 修改了
                var dirctCode = this.getDirective(this.typeName,type);
                // (Array(2).join('0') + parseInt(1,10).toString(16)).slice(-2)
                //    var num = (Array(4).join('0') + parseInt(value,10).toString(16)).slice(-4);
                //new 新规则
                let num ='';
                if(this.isModbusModal){
                var list  ={};
                if(this.pageBackTo=='/memoryManage'){//来自momery页
                    list  =this.$store.state.memoryInfo;
                }else{
                    list  =this.$store.state.rstInfo;
                }
                let bitInfoList = list.initBean.bitInfoList;
                    // 0~1	焊接模式
                    // 0:短焊    1:长焊
                    // 2:点焊    3:重复
                    // 2	0:无高频   1:有高频
                    // 3	0:非脉冲   1:脉冲
                    // 4	0:气冷       1:水冷
                    // 5~7	0:交流       1:直流
                    // 8	0:短焊    1:长焊
                    // 9~11	焊接电源工作模式
                    switch (type) {
                        case 'MODE':
                        num =this.jinzhiChange2jinzhiFuc(`00000000${value}${bitInfoList.tigmanCurrent}${bitInfoList.tigmanGas}${bitInfoList.tigmanMc}${bitInfoList.tigmanPinglv}${bitInfoList.tigmanWeldMode}`);
                        break;
                        default:
                            reurn;
                        break;
                    }
                }else{
                    num =this.jinzhiChangeFuc(value);
                }
               var crc =this.crcModelBusClacQuery(dirctCode+num, true);
               var sendData =this.GLOBAL_CONFIG.DirectStart+dirctCode+num+crc;
               this.callSendDataToBleUtil('weld_tig_syn',sendData,crc);
            }
        });
    },
    //材料专用
    changeMetirialChecked(type,value,index){
        console.log(type,value,index)
        this.nowTypeList.forEach(element => {
            if(element.typeName==type){
                //硬件逻辑已做处理 
                // if(value!=1){//不是选铝改成dc
                //     this.changeChecked('POLATRITY',1);
                // }else{
                //     this.changeChecked('POLATRITY',0);
                // }
                if(value!=1){//不是选铝改成dc
                    this.onlyChangeCheckedNoSend('POLATRITY',1);
                }else{
                    this.onlyChangeCheckedNoSend('POLATRITY',0);
                }
                element.chooseKey=value;
                //计算 查找 发送请求给ble告知 修改了
                var dirctCode = this.getDirective(this.typeName,type);
                // (Array(2).join('0') + parseInt(1,10).toString(16)).slice(-2)
            //    var num = (Array(4).join('0') + parseInt(value,10).toString(16)).slice(-4);
              //new 新规则
                var num =this.jinzhiChangeFuc(value);
               var crc =this.crcModelBusClacQuery(dirctCode+num, true);
               var sendData =this.GLOBAL_CONFIG.DirectStart+dirctCode+num+crc;
               this.callSendDataToBleUtil('weld_tig_syn',sendData,crc);
            }
        });
    },
    //厚度专用
     changeThinckChecked(type,value,index){
         console.log(this.nowTypeList);
         console.log(this.nowTouchIndex)
        this.nowTypeList.forEach(element => {
            if(element.typeName==type){
                element.chooseKey=this.nowTouchIndex;//修改当前选中的数值 改造为以index为记录值 兼容不同单位
                var dirctCode = this.getDirective('TIGSYN','THICKNESS');
                // (Array(2).join('0') + parseInt(1,10).toString(16)).slice(-2)
            //    var num = (Array(4).join('0') + parseInt(this.nowThinknessSendIndex,10).toString(16)).slice(-4);
              //new 新规则
                var num =this.jinzhiChangeFuc(this.nowThinknessSendIndex);
               var crc =this.crcModelBusClacQuery(dirctCode+num, true);
               var sendData ="DA"+dirctCode+num+crc;
               this.callSendDataToBleUtil('weld_tig_syn',sendData,crc);              
            }
        });
    },
    initElecticCurrent(){
                let mySlider = this.$refs.mySlider;
                let dangerRange = this.$refs.dangerRange;
                let sliderBtn =  this.$refs.sbtn;
                // let btnWidth = (sliderBtn.offsetWidth/mySlider.offsetWidth)*100;//滑动块所占百分比
                //     btnWidth = btnWidth.toFixed(2);//保留两位有效数字
                let mySliderWidth =mySlider.offsetWidth;//条子宽度
                //00、初始化滚动条位置 占比是百分比
                sliderBtn.style.left = (this.nowPosionX-this.min)/this.block*100+'%' 
                //01、初始化 危险区域位置
                dangerRange.style.width=((this.diffMax-this.diffMin)/this.block) *mySliderWidth+'px';
                dangerRange.style.left =((this.diffMin-this.min)/this.block)*100+'%';

                let myWidth = 0;
                let propo = mySlider.children[0];//底色不变
                //1、
                const elementLeft = (e) => { //计算x坐标
				var offset = e.offsetLeft;
				if(e.offsetParent != null) offset += elementLeft(e.offsetParent);
                    return offset;
                }
                //2、
                const myCount = () => { //计算滑动
                        if(this.myPosition.right>this.myPosition.left){ //判断滑动范围
                            this.myPosition.propoWidth = this.myPosition.right - this.myPosition.left
                            // this.valueFun(parseInt(this.myPosition.left),parseInt(this.myPosition.right),parseInt(this.myPosition.propoWidth))
                        }else if(this.myPosition.right<this.myPosition.left){
                            this.myPosition.propoWidth = this.myPosition.left - this.myPosition.right
                            // this.valueFun(parseInt(this.myPosition.right),parseInt(this.myPosition.left),parseInt(this.myPosition.propoWidth))
                        }else if(this.myPosition.right==this.myPosition.left){//按钮位置滑到最大值或者最小值
                            this.myPosition.propoWidth = this.myPosition.left - this.myPosition.right
                            // this.valueFun(parseInt(this.myPosition.right),parseInt(this.myPosition.left),parseInt(this.myPosition.propoWidth))
                        }
                        
                }

                let mySliderX = elementLeft(mySlider) //滑动块x坐标
				mySlider.addEventListener('touchmove',(e)=>{ //屏幕滑动事件
                let pageX = e.touches[0].pageX-mySliderX //获取滑动x坐标
				myWidth = (pageX/mySlider.offsetWidth)*100 //计算百分比
				if(myWidth>100){ //判断不超出范围 扣除按钮所在百分比
                    myWidth=100;
                    
				}else if(myWidth<0){
                    myWidth=0;
                }
                // this.nowPosionX=Math.round(this.block*(Math.round(myWidth)/100));//四舍五入取舍
                this.nowPosionX=Math.round(this.block*(Math.round(myWidth)/100))+this.min;//电流没有小数点
				if(this.myPosition.isBtn == 1){//判断焦点
					this.myPosition.left = myWidth
					rightBtn.style.left = myWidth+'%' 
				}else if(this.myPosition.isBtn == 2){
					this.myPosition.right = myWidth
					sliderBtn.style.left = myWidth+'%' 
				}
				myCount()
                e.preventDefault()
			})

			mySlider.addEventListener('touchstart',(e)=>{//屏幕触摸事件
                let touchX = e.touches[0].pageX-mySliderX;
				this.myPosition.now = (touchX/mySlider.offsetWidth)*100
				mySliderX = elementLeft(mySlider) //滑动块x坐标
            })
            mySlider.addEventListener('touchend',(e)=>{//屏幕触摸结束事件
                // 发送请求给ble告诉 修改了
                this.buildSliderChangeData(this.nowPosionX,'WELDCUR');
            })
          
    },
    initVotalage(){
                let mySlider = this.$refs.mySlider2;
                let dangerRange = this.$refs.dangerRange2;
                let mySliderWidth =mySlider.offsetWidth;//条子宽度
                // let btnWidth='';//滑动块所占百分比
                let sliderBtn =  this.$refs.sbtn2;
                //00、初始化滚动条位置 占比是百分比
                sliderBtn.style.left = (this.nowPosionX2-this.min2)/this.block2*100+'%' 
                //01、初始化 危险区域位置
                dangerRange.style.width=((this.diffMax2-this.diffMin2)/this.block2) *mySliderWidth+'px';
                dangerRange.style.left =((this.diffMin2-this.min2)/this.block2)*100+'%';

                let myWidth = 0;
                let propo = mySlider.children[0];//底色不变
                //1、
                const elementLeft = (e) => { //计算x坐标
				var offset = e.offsetLeft;
				if(e.offsetParent != null) offset += elementLeft(e.offsetParent);
                    return offset;
                }
                //2、
                const myCount = () => { //计算滑动
                        if(this.myPosition2.right>this.myPosition2.left){ //判断滑动范围
                            this.myPosition2.propoWidth = this.myPosition2.right - this.myPosition2.left
                            // this.valueFun(parseInt(this.myPosition.left),parseInt(this.myPosition.right),parseInt(this.myPosition.propoWidth))
                        }else if(this.myPosition2.right<this.myPosition2.left){
                            this.myPosition2.propoWidth = this.myPosition2.left - this.myPosition2.right
                            // this.valueFun(parseInt(this.myPosition.right),parseInt(this.myPosition.left),parseInt(this.myPosition.propoWidth))
                        }else if(this.myPosition2.right==this.myPosition2.left){//按钮位置滑到最大值或者最小值
                            this.myPosition2.propoWidth = this.myPosition2.left - this.myPosition2.right
                            // this.valueFun(parseInt(this.myPosition.right),parseInt(this.myPosition.left),parseInt(this.myPosition.propoWidth))
                        }
                        
                }

            let mySliderX = elementLeft(mySlider) //滑动块x坐标
            mySlider.addEventListener('touchmove',(e)=>{ //屏幕滑动事件
                    let pageX = e.touches[0].pageX-mySliderX; //获取滑动x坐标
                    myWidth = (pageX/mySlider.offsetWidth)*100 //计算百分比
                    if(myWidth>100){ //判断不超出范围
                        myWidth=100;
                    }else if(myWidth<0){
                        myWidth=0
                    }
                     this.nowPosionX2=Math.round(this.block2*(Math.round(myWidth)/100)*10)/10+this.min2;//四舍五入保留一位小数
                    // this.nowPosionX2=Math.round(this.block2*(Math.round(myWidth)/100))+this.min2;//四舍五入取舍
                    //判断是否在危险区
                    // if(this.myPosition2>=){
                    //    InDangerFlag2=true; 
                    // }
                    if(this.myPosition2.isBtn == 1){//判断焦点
                        this.myPosition.left = myWidth
                        rightBtn.style.left = myWidth+'%' 
                    }else if(this.myPosition2.isBtn == 2){
                        this.myPosition.right = myWidth
                        sliderBtn.style.left = myWidth+'%' 
                    }
                    myCount()
                    e.preventDefault()

			})

			mySlider.addEventListener('touchstart',(e)=>{//屏幕触摸事件
				let touchX = e.touches[0].pageX-mySliderX
                // btnWidth = (sliderBtn.offsetWidth/mySlider.offsetWidth)*100; //计算按钮宽度
                // btnWidth=btnWidth.toFixed(2);//保留两位有效数字
				this.myPosition2.now = (touchX/mySlider.offsetWidth)*100
				mySliderX = elementLeft(mySlider) //滑动块x坐标
            })
            mySlider.addEventListener('touchend',(e)=>{//屏幕触摸结束事件
                // 发送请求给ble告诉 修改了
               this.buildSliderChangeData(this.nowPosionX2*10,'slowDownTime');
            })
    },
    //数组 滑动 数组构造 废弃
    // buildRulerArrRangeBak(min,max){
       
    //     alert(max)
    //     max =parseInt(max);
    //     min =parseInt(min);
    //     var tempArr =[];
    //     var tempInchArr =[];
    //     var i =min;
    //     //根据上传的范围显示出范围 先轴的值不变值限范围就好
    //     if(max<=min){
    //         return;
    //     }else{
    //           let tempRulerNumAtrMap =  new Map([
    //             [0,{num:'0.6mm',height:6,id:0}],
    //             [1,{num:'0.7mm',height:7,id:1}],
    //             [2,{num:'0.9mm',height:9,id:2}],
    //             [3,{num:'1.2mm',height:12,id:3}],
    //             [4,{num:'1.6mm',height:16,id:4}],
    //             [5,{num:'2.1mm',height:21,id:5}],
    //             [6,{num:'2.8mm',height:28,id:6}],
    //             [7,{num:'3.4mm',height:34,id:7}],
    //             [8,{num:'4.8mm',height:48,id:8}],
    //             [9,{num:'6.4mm',height:64,id:9}],
    //             [10,{num:'8.0mm',height:88,id:10}],
    //             [11,{num:'9.5mm',height:95,id:11}],
    //             [12,{num:'11.0mm',height:110,id:12}],
    //             [13,{num:'12.7mm',height:127,id:13}]
    //         ]);
    //         let   tempRulerInchNumAtrMap=new Map([
    //             [0,{num:'24GA',height:6,id:0}],
    //             [1,{num:'22GA',height:7,id:1}],
    //             [2,{num:'20GA',height:9,id:2}],
    //             [3,{num:'18GA',height:12,id:3}],
    //             [4,{num:'16GA',height:16,id:4}],
    //             [5,{num:'14GA',height:21,id:5}],
    //             [6,{num:'12GA',height:28,id:6}],
    //             [7,{num:'1/8"',height:34,id:7}],
    //             [8,{num:'3/16"',height:48,id:8}],
    //             [9,{num:'1/4"',height:64,id:9}],
    //             [10,{num:'5/16"',height:88,id:10}],
    //             [11,{num:'3/8"',height:95,id:11}],
    //             [12,{num:'7/16"',height:110,id:12}],
    //             [13,{num:'1/2"',height:127,id:13}]
    //         ]);
    //         for( i;i<=max;i++){
    //             // console.log(this.rulerNumAtrMap.get(parseInt(i)))
    //              let aa= tempRulerInchNumAtrMap.get(i);
    //            this.rulerInchNumAtr.push(aa);
    //            let bb= tempRulerNumAtrMap.get(i);
    //            this.rulerNumAtr.push(bb);
    //         }
    //     }
       
    //   let vag =Math.round((this.commonContainHeight/130)*100)/100;
    //   this.rulerNumAtr.forEach(element => {
    //      element.height= Math.round((vag * element.height)*10)/10;
    //      console.log(element.height)
    //   });
    //   console.log(this.rulerNumAtr);
    // },
    //数组 滑动 数组构造 来自weldcommon
    buildRulerArrRange(min,max){
        // var tempArr =[];
        // var tempInchArr =[];
        this.rulerInchNumAtr=[];
        this.rulerNumAtr=[];

        min =parseInt(min);
        var i =parseInt(min);
        max =parseInt(max);
        if(max>13){
            max=13;
        }
        //根据上传的范围显示出范围 先轴的值不变值限范围就好
        if(max<=min){
            return;
        }else{
             let tempRulerNumAtrMap =  new Map([
                [0,{num:'0.6mm',height:6,id:0}],
                [1,{num:'0.7mm',height:7,id:1}],
                [2,{num:'0.9mm',height:9,id:2}],
                [3,{num:'1.2mm',height:12,id:3}],
                [4,{num:'1.6mm',height:16,id:4}],
                [5,{num:'2.1mm',height:21,id:5}],
                [6,{num:'2.8mm',height:28,id:6}],
                [7,{num:'3.4mm',height:34,id:7}],
                [8,{num:'4.8mm',height:48,id:8}],
                [9,{num:'6.4mm',height:64,id:9}],
                [10,{num:'8.0mm',height:88,id:10}],
                [11,{num:'9.5mm',height:95,id:11}],
                [12,{num:'11.0mm',height:110,id:12}],
                [13,{num:'12.7mm',height:127,id:13}]
            ]);
            let   tempRulerInchNumAtrMap=new Map([
                [0,{num:'24GA',height:6,id:0}],
                [1,{num:'22GA',height:7,id:1}],
                [2,{num:'20GA',height:9,id:2}],
                [3,{num:'18GA',height:12,id:3}],
                [4,{num:'16GA',height:16,id:4}],
                [5,{num:'14GA',height:21,id:5}],
                [6,{num:'12GA',height:28,id:6}],
                [7,{num:'1/8"',height:34,id:7}],
                [8,{num:'3/16"',height:48,id:8}],
                [9,{num:'1/4"',height:64,id:9}],
                [10,{num:'5/16"',height:88,id:10}],
                [11,{num:'3/8"',height:95,id:11}],
                [12,{num:'7/16"',height:110,id:12}],
                [13,{num:'1/2"',height:127,id:13}]
            ]);
           while (i<=max)
            {
                let aa= tempRulerInchNumAtrMap.get(i);
               this.rulerInchNumAtr.push(aa);
               let bb= tempRulerNumAtrMap.get(i);
               this.rulerNumAtr.push(bb);
                i++;
            }
        }
        
      let vag =Math.round((this.commonContainHeight/130)*100)/100;
      this.rulerNumAtr.forEach(element => {
         element.height= Math.round((vag * element.height)*10)/10;
      });
      console.log(this.rulerNumAtr)
    },
    initFuc(){
        var list  ={};
        if(this.pageBackTo=='/memoryManage'){//来自momery页
            list  =this.$store.state.memoryInfo;
        }else{
            list  =this.$store.state.rstInfo;
        }
        console.log(list)       
        //最新的
        // list.initBean.unit=1;
        if(true){
            this.firstInit=false;
            //滑动thinkness赋值
            this.buildRulerArrRange(list.TIG_MIN_THICHNESS,list.TIG_MAX_THICHNESS);
            this.typeName=list.weldType;
            
            // this.typeName='TIG SYN';
            if(list.initBean.unit==1){
                this.UnitFlag=1;
                this.rulerNumAtr =this.rulerInchNumAtr;
                this.rulerNumAtr.forEach(element => {
                    if(element.id==list.THINKNESS_VALUE){
                        this.actualNum =element.num;
                        return false;
                    }
                });
                // this.actualNum = '24GA'
            }else{
                this.rulerNumAtr.forEach(element => {
                    if(element.id==list.THINKNESS_VALUE){
                        this.actualNum =element.num;
                        return false;
                    }
                });
                this.UnitFlag=0;
            }
        }else{
            this.typeName=list.weldType;
            
            // this.typeName='TIG SYN';
            if(list.initBean.unit==1){
                this.UnitFlag=1;
                this.rulerNumAtr =this.rulerInchNumAtr;
                this.rulerNumAtr.forEach(element => {
                    if(element.id==list.THINKNESS_VALUE){
                        this.actualNum =element.num;
                        return false;
                    }
                });
                // this.actualNum = '24GA'
            }else{
                this.rulerNumAtr.forEach(element => {
                    if(element.id==list.THINKNESS_VALUE){
                        this.actualNum =element.num;
                        return false;
                    }
                });
                this.UnitFlag=0;
            }
        }
        
        this.isReadyFlag =list.initBean.isReadyFlag;//是否焊接准备完毕
        this.minTRange = this.rulerNumAtr[0].num;
        this.maxTRange = this.rulerNumAtr[this.rulerNumAtr.length-1].num;
        //单位文本赋值
        this.nowModalTypeId =list.weldTypeNum;//后退回去时用
        this.nowTypeList =list.nowTypeList;
        //特殊处理过滤gas 显示 不需要硬件端子机处理
        // this.nowTypeList.forEach(element => {
          
        //     if(element.typeName=='MATERIAL'){
        //           console.log(element)
        //        this.changeMetirialChecked('MATERIAL' ,element.chooseKey, 0);
        //     }
        // });
        //处理POLATRITY显示
        this.nowTypeList.forEach(element => {
            if(element.typeName=='MATERIAL'){
                if(element.chooseKey!=1){//不是选铝改成dc
                    this.onlyChangeCheckedNoSend('POLATRITY',1);
                }else{
                    this.onlyChangeCheckedNoSend('POLATRITY',0);
                }
            }
        });
        //weld_cur赋值----电流
        this.min = list.TIGSYN_MIN_CUR;
        this.max = list.TIGSYN_MAX_CUR;//要根据单位区分
        this.nowPosionX=list.SYN_WELD_CUR;
        this.oldPosionX =this.nowPosionX;
             //weld_cur赋值----电流
            
            this.diffMin = this.clacDangerRang(+this.min,parseInt(list.SYN_RECOMMEND_CUR),'min');
            this.diffMax = this.clacDangerRang(+this.max,parseInt(list.SYN_RECOMMEND_CUR),'max');
            
            // this.diffMin = 80;
            // this.diffMax = 100;
            this.block =this.max-this.min;
        //缓降时间 初始化
        this.min2=list.sdTime_min/10;
        this.max2 =list.sdTime_max/10;
        
        this.nowPosionX2 =list.slowDownTime/10;
        this.oldNowPosionX2 =this.nowPosionX2;
             //电压初始化  推荐值正负20即可
            this.diffMin2 =this.min2;
            this.diffMax2 =this.max2;
            this.block2 =this.max2-this.min2;
        console.log(list.slowDownTime,this.max2,this.block2)
    //初始化 电流控制器
    this.initElecticCurrent();
    //初始化 缓降时间 控制器
    this.initVotalage();
    this.postGasTime=list.postGasTime;//前送气时间
    //初始化滑动选择器 不在这里初始化
    // this.sliderParentInit();
    
    // let vag =Math.round((this.commonContainHeight/130)*100)/100;
    // this.rulerNumAtr.forEach(element => {
    //     element.height= Math.round((vag * element.height)*10)/10;
    // });
    // this.initWeldingAutoRouter();
    }, getModelType(elementKey){
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
      },
        //手动选择 刻度值
    handleTouchstart(e){
        this.clacThinknessByTouch(e.changedTouches[0].pageY);
        
    },
    clacDangerRang(limitValue,recommedValue,type){
        if(type=='min'){
            if((recommedValue-20)<limitValue){
                return limitValue;
            }else{
                return recommedValue-20;
            }
        }else{
            if((recommedValue+20)>limitValue){
                return limitValue;
            }else{
                return recommedValue+20;
            }
        }
    },
    goBack(){
        this.$router.push({path:'/newIndex',query:{}});
    }

  },
  mounted: function () {

        // var list ={"nowTypeList":[{"typeName":"MODE","chooseKey":"0","comList":[{"id":0,"key":"2T","value":"2T"},{"id":1,"key":"4T","value":"4T"}],"inchComList":[{"id":0,"key":"2T","value":"2T"},{"id":1,"key":"4T","value":"4T"}]},{"typeName":"MATERIAL","chooseKey":"0","comList":[{"id":0,"key":"FE","value":"FE"},{"id":1,"key":"SS","value":"SS"},{"id":2,"key":"AL","value":"AL"},{"id":3,"key":"FCAW-S","value":"FCAW-S"},{"id":4,"key":"FCAW-G","value":"FCAW-G"}],"inchComList":[{"id":0,"key":"FE","value":"FE"},{"id":1,"key":"SS","value":"SS"},{"id":2,"key":"AL","value":"AL"},{"id":3,"key":"FCAW-S","value":"FCAW-S"},{"id":4,"key":"FCAW-G","value":"FCAW-G"}]},{"typeName":"GAS","chooseKey":"0","comList":[{"id":0,"key":"CO2","value":"CO2"},{"id":1,"key":"MIX","value":"MIX"}],"inchComList":[{"id":0,"key":"CO2","value":"CO2"},{"id":1,"key":"MIX","value":"MIX"}]},{"typeName":"DIAMETER","chooseKey":"0","comList":[{"id":0,"key":"6MM","value":"0.6mm"},{"id":1,"key":"8MM","value":"0.8mm"},{"id":2,"key":"9MM","value":"0.9mm"},{"id":3,"key":"10MM","value":"1.0mm"},{"id":4,"key":"12MM","value":"1.2mm"}],"inchComList":[{"id":0,"key":"6MM","value":".023\""},{"id":1,"key":"8MM","value":".030\""},{"id":2,"key":"9MM","value":".035\""},{"id":3,"key":"10MM","value":".040\""},{"id":4,"key":"12MM","value":".045\""}]},{"typeName":"THICKNESS","chooseKey":"0","comList":[{"id":0,"key":"6MM","value":"0.6mm"},{"id":1,"key":"7MM","value":"0.7mm"},{"id":2,"key":"9MM","value":"0.9mm"},{"id":3,"key":"12MM","value":"1.2mm"},{"id":4,"key":"16MM","value":"1.6mm"},{"id":5,"key":"21MM","value":"2.1mm"},{"id":6,"key":"28MM","value":"2.8mm"},{"id":7,"key":"34MM","value":"3.4mm"},{"id":8,"key":"48MM","value":"4.8mm"},{"id":9,"key":"64MM","value":"6.4mm"},{"id":10,"key":"80MM","value":"8.0mm"},{"id":11,"key":"95MM","value":"9.5mm"},{"id":12,"key":"110MM","value":"11mm"},{"id":13,"key":"127MM","value":"12.7mm"}],"inchComList":[{"id":0,"key":"6MM","value":"24GA"},{"id":1,"key":"7MM","value":"22GA"},{"id":2,"key":"9MM","value":"20GA"},{"id":3,"key":"12MM","value":"18GA"},{"id":4,"key":"16MM","value":"16GA"},{"id":5,"key":"21MM","value":"14GA"},{"id":6,"key":"28MM","value":"12GA"},{"id":7,"key":"34MM","value":"1/8\""},{"id":8,"key":"48MM","value":"3/16\""},{"id":9,"key":"64MM","value":"1/4\""},{"id":10,"key":"80MM","value":"5/16\""},{"id":11,"key":"95MM","value":"3/8\""},{"id":12,"key":"110MM","value":"7/16\""},{"id":13,"key":"127MM","value":"1/2\""}]}],"weldType":"migSyn","INDUCTANCE":"0","RECOMMEND_INDUCTANCE":"0","RECOMMEND_SPEED_DISPLAY":"60","SPEED_DISPLAY":"61","RECOMMEND_V_WELDING":"180","V_WELDING":"200","MIG_MIN_THICHNESS":"0","MIG_MAX_THICHNESS":"13","initBean":{"unit":"0","pfc":"0","weldStatus":"0","hotStatus":"0","flowStatus":"0","empty1":"0","empty2":"0","mode":"0"},"MAX_SPEED_DISPLAY":10,"MIN_SPEED_DISPLAY":1.5,"MAX_WELD_V_DISPLAY":23,"MIG_MATERIAL":"0"};
        // var list ={"nowTypeList":[{"typeName":"MODE","chooseKey":"2T","comList":[{"key":"2T","value":"2T"},{"key":"4T","value":"4T"}],"inchComList":[{"key":"2T","value":"2T"},{"key":"4T","value":"4T"}]},{"typeName":"MATERIAL","chooseKey":"FE","comList":[{"key":"FE","value":"FE"},{"key":"SS","value":"SS"},{"key":"AL","value":"AL"},{"key":"FCAW-S","value":"FCAW-S"},{"key":"FCAW-G","value":"FCAW-G"}],"inchComList":[{"key":"FE","value":"FE"},{"key":"SS","value":"SS"},{"key":"AL","value":"AL"},{"key":"FCAW-S","value":"FCAW-S"},{"key":"FCAW-G","value":"FCAW-G"}]},{"typeName":"GAS","chooseKey":"CO2","comList":[{"key":"MIX","value":"MIX"},{"key":"CO2","value":"CO2"}],"inchComList":[{"key":"MIX","value":"MIX"},{"key":"CO2","value":"CO2"}]},{"typeName":"DIAMETER","chooseKey":"6MM","comList":[{"key":"6MM","value":"0.6mm"},{"key":"8MM","value":"0.8mm"},{"key":"9MM","value":"0.9mm"},{"key":"10MM","value":"1.0mm"},{"key":"12MM","value":"1.2mm"}],"inchComList":[{"key":"6MM","value":".023\""},{"key":"8MM","value":".030\""},{"key":"9MM","value":".035\""},{"key":"10MM","value":".040\""},{"key":"12MM","value":".045\""}]},{"typeName":"THICKNESS","chooseKey":"0","comList":[{"id":0,"key":"6MM","value":"0.6mm"},{"id":1,"key":"7MM","value":"0.7mm"},{"id":2,"key":"9MM","value":"0.9mm"},{"id":3,"key":"12MM","value":"1.2mm"},{"id":4,"key":"16MM","value":"1.6mm"},{"id":5,"key":"21MM","value":"2.1mm"},{"id":6,"key":"28MM","value":"2.8mm"},{"id":7,"key":"34MM","value":"3.4mm"},{"id":8,"key":"48MM","value":"4.8mm"},{"id":9,"key":"64MM","value":"6.4mm"},{"id":10,"key":"80MM","value":"8.0mm"},{"id":11,"key":"95MM","value":"9.5mm"},{"id":12,"key":"110MM","value":"11mm"},{"id":13,"key":"127MM","value":"12.7mm"}],"inchComList":[{"id":0,"key":"6MM","value":"24GA"},{"id":1,"key":"7MM","value":"22GA"},{"id":2,"key":"9MM","value":"20GA"},{"id":3,"key":"12MM","value":"18GA"},{"id":4,"key":"16MM","value":"16GA"},{"id":5,"key":"21MM","value":"14GA"},{"id":6,"key":"28MM","value":"12GA"},{"id":7,"key":"34MM","value":"1/8\""},{"id":8,"key":"48MM","value":"3/16\""},{"id":9,"key":"64MM","value":"1/4\""},{"id":10,"key":"80MM","value":"5/16\""},{"id":11,"key":"95MM","value":"3/8\""},{"id":12,"key":"110MM","value":"7/16\""},{"id":13,"key":"127MM","value":"1/2\""}]}],"weldType":"migSyn","MIG_MIN_THICHNESS":"2","MIG_MAX_THICHNESS":"5","INDUCTANCE":"10","RECOMMEND_INDUCTANCE":"15","SPEED_DISPLAY":"20","RECOMMEND_SPEED_DISPLAY":"40","V_WELDING":"150","RECOMMEND_V_WELDING":"189","initBean":{"unit":"1","pfc":"0","weldStatus":"0","hotStatus":"0","flowStatus":"0","empty1":"0","empty2":"1","mode":"0"},"MAX_SPEED_DISPLAY":40,"MIN_SPEED_DISPLAY":1.5,"MAX_WELD_V_DISPLAY":23}
        this.$route.query.nowModalTypeId=2;
       
       this.pageBackTo =this.$route.query.pageBackTo;
       this.initFuc();
    // console.log(this.$store.state.rstInfo)
    // if (window.history && window.history.pushState) {
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
  created () {
      window['broastFromAndroid'] = (val) => {
        //全局都要 改造一起返回
        if(this.$store.state.AdroidOldMsg){
            this.$store.state.AdroidNewMsg =val;
        }else{
            this.$store.state.AdroidNewMsg =val;
            this.$store.state.AdroidOldMsg=val;
        }
        // alert("mainNew"+data)
        this.wtlLog('layout','broastFromAndroid='+val);
        this.modelType=this.getModelType(val.substring(2,4));
        console.log(val,this.$store.state.AdroidOldMsg)
        if(val!=this.$store.state.AdroidOldMsg){
                
                this.$store.state.AdroidOldMsg=val;
                //更新操作
                this.modelType=this.getModelType(val.substring(2,4));
                
                this.wtlLog('weld_tigsyn_bfa3','this.modelType'+this.modelType);
                  
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
    }
  },
  computed:{
        envType(){
            return this.$store.state.envType;　　//需要监听的数据
        },
        isModbusModal(){
            return this.$store.state.isModbusModal;
        },
        // getAndriodNewMsg () {
            
        //     return this.$store.state.AdroidNewMsg;　　//需要监听的数据
        // }
  },
  watch: {
        //    getAndriodNewMsg(val, oldVal){
        //     if(val!=this.$store.state.AdroidOldMsg){
                
        //         this.$store.state.AdroidOldMsg=val;
        //         //更新操作
        //         this.modelType=this.getModelType(val.substring(2,4));
                
        //         this.wtlLog('weld_tigsyn_bfa3','this.modelType'+this.modelType);
                  
        //         var rst =this.buildData('newIndex',this.modelType,val.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
                 
        //          if(JSON.stringify(rst) != "{}"){
        //             //发送确认收到的指令给安卓
        //             var invalue =val.substring(val.length-4,val.length);
        //             //新规则: 指令ff+crc+检验crc   测试模式不发送
        //             this.callSendDataToBleUtil('newIndex','DAFF'+invalue+this.crcModelBusClacQuery('FF'+invalue, true),invalue);
        //             //重新初始化
                    
        //             this.initFuc();
        //         }
                
        //     }
        //     },
        //list渲染完执行高度计算 更精确
           nowTypeList:function() {
                  this.$nextTick(function(){
                      let mmpId = this.$refs.mmpId;
                      var hei =mmpId.offsetHeight;
                      //初始化 内容高度 置低元素
                        if(hei+90>window.innerHeight){//元素高度加上底部高度超出否
                            this.btFooterFlag =true;
                        }
                 });               
            },
            nowPosionX2(val, oldVal){//普通的watch监听
                    var now = val+'';
                    if(now.indexOf('.')<0){
                        this.nowPosionX2+='.0';
                    }
            },
            // nowPosionX(val, oldVal){//普通的watch监听
            //     var now = val+'';
            //     if(now.indexOf('.')<0){
            //         this.nowPosionX+='.0';
            //     }
            // }
  },
  destroyed(){
      this.firstInit =true;
       clearTimeout(this.autoTimeoutFlag);
    //    clearInterval(this.$store.state.modbusCircleTimer)//假如是焊接中跳走的就不能清除
        window.removeEventListener('popstate', this.goBack, false);
    //    window.removeEventListener('popstate', this.go('/newIndex'), false);
  }

}
</script>
<style lang="scss" scoped>
.weldMMA{
    background: #01303e;
    width: 100%;
    min-height: 100vh;
    overflow: auto;
    // flex-flow: row wrap;
    // display: flex;
    position: relative;
    .mmp{
        position: absolute;
        left: 0;
        top: 0;
        height: auto;
        width: 100%;
        margin-bottom: 50px;
        // align-self: flex-start;
    }
    // opacity: 0.1;
  .header{
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
    .ivu-icon{
      font-size: 20px;
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translate(0,-50%)
    }
    .setupyi{
        padding-left: 10px;
    }
  }
  .con-box{
        margin-top: 50px;
        padding-top: 2px;
        .containList{
        //   padding: 0 20px;
        .typename{
            width: 40%;
            float: left;
            font-size: 14px;
            color: #fff;
            //   opacity: .6;
            padding-left: 60px;
            //   margin-top: 15px;
        }
            .typename.ELECTRODE{
            background: url(../../assets/images/weld_icon_new_elecode.png) no-repeat;
            background-size: 40px;
            background-position: left center;
        }
        .typename.POLATRITY{
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
            background: url(../../assets/images/tig_diameter.png) no-repeat;
            background-size: 40px;
            background-position: left center;
        }
        .typename.THICKNESS{
            background: url(../../assets/images/weld_icon_new_thinkness.png) no-repeat;
            background-size: 40px;
            background-position: left center;
        }
        .btn{
            width: 60%;
            float: right;
            .btRight{
                text-align: right;
                color: #fff;
                //   opacity: .8;
                img{
                    width: 13px;
                    height: 17px;
                    vertical-align: middle;
                }
            }
        }
        .btn .ivu-btn{
            width: 90px;
            margin-right: 20px;
            margin-top: 10px;
        }
        .common{
            height: 40px;
            line-height: 40px;
            background: red;
            margin: 10px 20px;
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
        }
    }
  }
  .midLine1{
        opacity: 0.5;
        width: 100%;
        height: 2px;;
        margin-top: 20px;
        //  background: linear-gradient(to left, #173d4a , #fdfcff,#173d4a);
          background: linear-gradient( 
            to right, 
            rgba(23,61,74,.6) 0%,  
            rgba(158,180,189,1) 20%, 
            
            rgba(244,253,255,1) 50%,
            
            rgba(158,180,189,1) 90%, 
            rgba(23,61,74,.6)  100%);
  }
  .electricCurrent{
      margin: 25px 15px;
          padding: 20px 0;
      border-radius: 5px;
    //   box-shadow: 0px 0px 2px 1px #103f4b;
    	-moz-box-shadow:0px 0px 10px 5px #2d5360 inset;               /* For Firefox3.6+ */
	-webkit-box-shadow:0px 0px 10px 5px #2d5360 inset;            /* For Chrome5+, Safari5+ */
	box-shadow:0px 0px 10px 5px #2d5360 inset;                    /* For Latest Opera */
    //   background: red;
       .up{
           height: 50px;
            .u-left{
                width: 40%;
                float: left;
                height: 100%;
                text-align: center;
                img{
                    width: 50px;
                    vertical-align: middle;
                }
            }   
            .u-right{
                width: 60%;
                float: left;
                text-align: center;
                height: 100%;
                // position: relative;
                .bt{
                    float: left;
                   width: 35px;
                   height: 50px;
                   font-size: 16px;
                   background: #163749;
                   color: #fff;
                //    position: absolute;
                //    top: 50%;
                //    transform: translate(0,-50%)
                }
               .del{
                  background: url(../../assets/images/jian.png) no-repeat;
                    background-size: 35px;
                    background-position: left center;
               } 
               .value{
                   float: left;
                   width: 120px;
                   height: 50px;
                   line-height: 50px;
                   color: #fff;
                   font-size: 48px;
                //    position: absolute;
                //    top: 37%;
                //    transform: translate(0,-50%);
                //    left: 30px;
               }.dangerColor{
                   color: red;
               }
               .add{
                    background: url(../../assets/images/jia.png) no-repeat;
                    background-size: 35px;
                    background-position: left center;
               }
               
            }  
        }
       .slider{
        position: relative;
        margin-top: 100px;
        height: 40px;
        width: 90%;
        // background: green;
        margin: 0 auto;
        .bgSlider{
		    background: #ca3231;
            position: absolute;
            height: 5px;
            width: 100%;
            left: 0;
            top: 50%;
            transform: translate(0,-50%)
        }
        .dangerRange{
            background: #fbfffc;
            position: absolute;
            height: 5px;
            width: 100px;
            left: 100px;
            top: 50%;
            transform: translate(0,-50%)

        }
        .sliderBtn{
            height: 20px;
            width: 10px;
            background: #333;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translate(0,-50%);
            border-radius: 2px;
            .left{
                float: left;
                width: 3px;
                height: 100%;
                background: #08221f;
            }
            .right{
                float: left;
                width: 7px;
                background: #00c2ee;
                height: 100%;
                opacity: .8;
            }
        }
	 }
     .rdown{
         font-size: 16px;
         height: 30px;
         line-height: 30px;
         text-align: center;
         font-weight: bold;
         color: #00c6ff;
     }
  }
//   .inducance{
//       height: 50px;
//       line-height: 50px;
//       color: #fff;
//       text-align: center;
//       background: #01303e;
//       background: linear-gradient(to top, #0c3648 , #2c5361,#0c3648);
//   }
.inducance{
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      color: #8a9cab;
      text-align: left;
      background: #01303e;
      background: linear-gradient(to top, #0c3648 , #2c5361,#0c3648);
      .showna{
        height: 50px;
        line-height: 50px;
        background: url(../../assets/images/slowTime.png) no-repeat;
        background-size: 20px;
        background-position: left center;
        padding-left: 25px;
        margin-left: 25px;
        span{
            font-size: 20px;
            padding-left: 15px;
        }
        .red{
            color: red;
        }
      }
  }
  .new-footer-btns{
        // position: fixed;
        // bottom: 0;
        margin-top: 0;
        width: 100%;
        height: 40px;
        background: #000; /* For browsers that do not support gradients */
        // background: -webkit-linear-gradient(#fff, #333, #fff); /* For Safari 5.1 to 6.0 */
      .btn{
          width: 50%;
          height: 40px;
          float: left;
          text-align: center;
          color: #fff;
          // color: #000;
          font-size: 18px;
          line-height: 40px;
        //   border-right: 2px solid;
        //    background:linear-gradient(to top, #354141 0%, #000 100%) ;
        //   background: -moz-linear-gradient(to top, #354141 0%, #000 100%) ;
        //   background: -webkit-gradient(linear, to left to top, to left to bottom, color-stop(0%,#354141), color-stop(100%,#000))  ;
        //   background: -webkit-linear-gradient(to top, #354141 0%,#000 100%) ;
        //   background: -o-linear-gradient(to top, #354141 0%,#000 100%) ;
        //   background: -ms-linear-gradient(to top, #354141 0%,#000 100%) ;
      }.n-1{
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
        span{
          background:url(../../assets/images/memory.png) no-repeat;    
          background-size: 26px;
          background-position:left center;
          padding-left: 33px;
        }

      }.n-2{
        //   width: 60%;
        span{
            color: #fff;
            font-weight: bold;
            opacity: .8;
        }
      }
      .btn:last-of-type{
        border-right: none
      }
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
      animation:btmoveOne .5s;
      -webkit-animation:btmoveOne .5s;
      animation-fill-mode: forwards;/*当动画完成时，动画会停留在最后一帧。*/
      
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
      .btlist{
          margin: 0 20px;
          margin-bottom: 10px;
          font-size: 16px;
          li{
              width: 33.33%;
              height: 60px;
              float: left;
              margin-bottom: 20px;
             .con{
                 background: #3f4043;
                 height: 100%;
                 border-radius: 20px;
                 text-align: center;
                 height: 60px;
                 line-height: 60px;
                 color:#fff;
             }.choose{
                 background: #214360;
             }
            
          }
          li:nth-child(1) {
            padding-right: 10px;
            }
         li:nth-child(2) {
            padding:0 10px;
         }
          li:nth-child(3n+3) {
            padding-left: 10px;
         }
          li:nth-child(4n+4) {
            padding-right: 10px;
         }
         li:nth-child(5n+5) {
            padding:0 10px;
         }

      }
      .title{
          width: 100%;
        //   min-height: 280px;
         height: 130px;
          
          .le{
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
          .ri{
              text-align: center;
              font-size: 24px;
              height: 100px;
              line-height: 100px;
              float: left;
              width: 40%;
              color: #fff;
            opacity: .8;
          }
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
            text-align: center;
            margin-bottom: 5px;
            padding-left: 35px;
            .t-icon{
                width: 60%;
                float: left;
                zoom: 1;
                position: relative;
                height: 50px;;
                img{
                    position: absolute;
                    left: 0px;
                    top: -80px;
                    width: 140px;
                }
            }
            .t-name{
                width: 40%;
                float: left;
                zoom: 1;
            }
        }
        .d-t-value{
            height: 30px;
            line-height: 30px;
            padding-left: 160px;
            font-size: 18px;
            margin-bottom: 17px;
            .range{
                font-size: 12px;
            }
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
        .newContian{
            margin-left:100px;
            margin-right: 50px;
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
  .footers{
    //   align-self: flex-end;
      position: fixed;
      bottom: 0;
      width: 100%;
  }
}
/deep/ .ivu-radio-group-button.ivu-radio-group-large .ivu-radio-wrapper{
    height: 25px;
    line-height: 23px;
}

.unchoose{
    color: #000;
    background: #fff;
}
.weldFixed{
    position: fixed;
    left: 0;
    top:0;
    bottom: 0px; /*距离底部的距离为底部盒子的高度，自己也可以设置*/
    overflow-y:hidden;
    width: 100%;
    -webkit-overflow-scrolling: touch;   /*这句是为了滑动更顺畅*/
}
.weldMMA .footers.unEnough{
    // position: unset;
}
.eleUnShow{
    display: none;
}
/***iPhone5以下机型特殊处理***/
@media(max-width:320px) and (min-height:490px){  
  .weldMMA .electricCurrent .up .u-right .bt{
      width: 20px;
  }
  .weldMMA .electricCurrent .up .u-right .del,.weldMMA .electricCurrent .up .u-right .add{
      background-size: 20px;
  }
}
/* x xs */
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
   // iphoneX iphoneXS样式
   .weldMMA .new-footer-btns{
     height: 50px;
     .btn{
       height: 50px;
     }
   }
   .weldMMA .header{
        height: 65px;
        line-height: 1;
        padding-top: 30px;
            .ivu-icon{
                top:37px;
            }
    }
    .weldMMA .con-box{
        margin-top: 65px;
    }
}
/* xr */
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {
    // iphoneXR样式
    // iphoneX iphoneXS样式
   .weldMMA .new-footer-btns{
     height: 50px;
     .btn{
       height: 50px;
     }
   }
   .weldMMA .header{
        height: 65px;
        line-height: 1;
        padding-top: 30px;
            .ivu-icon{
                top:37px;
            }
    }
    .weldMMA .con-box{
        margin-top: 65px;
    }
}
/* xs max */
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
   // iphoneX iphoneXS样式
   .weldMMA .new-footer-btns{
     height: 50px;
     .btn{
       height: 50px;
     }
   }
   .weldMMA .header{
        height: 65px;
        line-height: 1;
        padding-top: 30px;
            .ivu-icon{
                top:37px;
            }
    }
    .weldMMA .con-box{
        margin-top: 65px;
    }
}
</style>