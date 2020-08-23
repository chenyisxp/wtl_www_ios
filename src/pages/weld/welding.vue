<template>
  <div class="weldingManage">
   <div class="header">
       <div class="licon" @click="goback">
            <span></span>
      </div>
     WELDING
    </div>
    <!-- <div class="backBtn">
        BACK
    </div> -->
    <div class="main">
        <div class="welding">{{typeShowName}}</div>
        <div class="m-main">
            <div class="fl left">{{weldingCur}}{{unit1}}</div>
            <div class="fl mid"></div>
            <div class="fl right">{{weldingVoltage}}{{unit2}}</div>
        </div>
         <div class="m-mainbtf">
            <div class="fl left">current</div>
            <div class="fl mid"></div>
            <div class="fl right">voltage</div>
        </div>
        <div class="midLine"></div>
        <!-- 滑动块1 -->
          
        <div class="electricCurrent" v-if="false" >
            <div class="up">
                <div class="u-left" v-if="bleParamKey1=='FORCE'"><img  src="../../assets/images/weld_icon_newForce.png"></div>
                <div class="u-left" v-if="bleParamKey1=='SPEED'"><img  src="../../assets/images/speed.png"></div>
                <div class="u-left" v-if="bleParamKey1=='WELDCUR' ||bleParamKey1=='weld_cur'"><img  src="../../assets/images/weld_icon_current.png"></div>
                <div class="u-right">
                    <div class="bt del" @click="delFuc()"></div>
                    <div class="value"  :class="nowPosionX<diffMin || nowPosionX>diffMax?'dangerColor':''">{{nowPosionX}}</div>
                    <div class="bt add" @click="addFuc()"></div>
                </div>
            </div>
            <div class="slider" ref="mySlider">
                <div class="bgSlider"></div>
                <div class="dangerRange" ref="dangerRange"></div>
                <!-- <div class="sliderBtn" @touchstart="tStart()" @touchmove="tmove()" @touchend="tEnd()" ref="silderBtnId" :style="{left:nowPosionX+'px'}"></div> -->
                <div class="sliderBtn" ref="sbtn">
                    <div class="left"></div>
                    <div class="right"></div>
                </div>
            </div>
           
            <div class="rdown">
                {{min}}~{{max}}{{unitslider1}}
            </div>
        </div>
        <!-- 滑块2 -->
        <div class="electricCurrent Voltage" v-if="false  && hidSlide2">
            <div class="up">
                <div class="u-left"><img  src="../../assets/images/voltage.png"></div>
               

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
                {{min2}}~{{max2}}{{unitslider2}}
            </div>
        </div>

        <!-- 滑动块2 -->
    </div>

  </div>
</template>

<script>

export default {
  name: "",
  components: {},
  data() {
    return {
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
        paramIncreaseDistance:0.1,//加减法 按钮的增长幅度
        // 电流控制器 end
         // 电压控制器 begin
         myPosition2:{
					left:0,
					right:0,
					now:0,
					isBtn:2,//焦点
					propoWidth:0
				},
        max2:200,
        min2:10,
        block2:190,//总的区间
        diffMin2:20,//特殊区间段最小值
        diffMax2:60,//特殊区间最大值
        nowPosionX2:36,//当前位置
        oldNowPosionX2:'',
        timerPosition2:'',//定时器避免重复点击 造成连续发送
        touchStartFlag2:false,
        InDangerFlag2:false,
        paramIncreaseDistance2:0.1,//加减法 按钮的增长幅度
        // 电压控制器 end
        UnitFlag:0,
        typeName:'',//当前模式key
        typeShowName:'',
        hidSlide2:true,
        unit1:'A',
        unit2:'V',
        unitslider1:'',
        unitslider2:'',
        bleParamKey1:'',
        bleParamKey2:'',
        pfc_num:'',
        ac_dc_num:'',
        hf_lift_num:'',
        tigman_min_cur:'',
        tigman_max_cur:'',
        max_ac_fre:'',
        weldingCur:'',
        weldingVoltage:'',
        experialTimer:{},
        operateTimer:{}

    }
      
  },

  methods: {
        goback(){
            //返回编辑页只有部分参数可以编辑哦
             this.$router.push(this.$store.state.weldingInfo.url);
        },
       //计算最小电流最大电流区间
        clacTigManCur(){
        //最大只看 pfc
        if(this.pfc_num==1){
            this.tigman_max_cur=200;
        }else{
            this.tigman_max_cur=140;
        }
        //最小 ac和hf
        if(this.ac_dc_num==1){
            if(this.hf_lift_num==1){
                this.tigman_min_cur=10;
            }else{
                this.tigman_min_cur=30;
            }
        }else{
                this.tigman_min_cur=30;
        }
        },
        initData(){
        //  var rst =this.buildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.migsyn.crcCode,'dae1 00 00 00 00 02 00 003C 003D 00b4 00c8 02 09 5952'.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
        // var rst =this.buildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.migman.crcCode,'dae2 00 003D 00c8 00 6283'.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
        // var rst =this.buildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.tigsyn.crcCode,'dae3 00 00 03 0064 0064 02 09  8C75'.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
        // var rst =this.buildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.mma.crcCode,'dae5 82 00 01 09 0064 0064 C54A'.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
        // var rst =this.buildData('newIndex',this.GLOBAL_CONFIG.callWeldTypeData.tigman.crcCode,'dae4 00 c0 32 0032 32 0032 0032 03e8 32 32 0032 32 50 23 4CCA'.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
         var list =this.$store.state.rstInfo;
          console.log(list)
            if(JSON.stringify(list) != "{}"){
                  //1、tig模式的话关闭第二个滑块 且第一个滑块单位是A
                    if(list.weldType=='TIGSYN'){
                        
                        this.unitslider1='A';
                        //params:min+max+nowpositionx+dffmin+difmax
                        this.min = list.TIGSYN_MIN_CUR;
                        this.max = list.TIGSYN_MAX_CUR;//要根据单位区分
                        this.nowPosionX=list.SYN_WELD_CUR;
                        this.oldPosionX =this.nowPosionX;
                            this.diffMin = list.TIGSYN_MIN_CUR
                            this.diffMax = list.TIGSYN_MAX_CUR
                            console.log('diffMin'+this.diffMin+'||'+'diffMax'+this.diffMax)
                            this.block =this.max-this.min;
                       this.buildSliderData1(this.min,this.max,this.nowPosionX, this.diffMin,this.diffMax);
                       this.paramIncreaseDistance=1;
                       this.bleParamKey1 ='WELDCUR';//参照util里
                       //2、缓降时间
                        this.hidSlide2 =false;
                        this.unitslider2='s';
                        this.min2=list.sdTime_min;
                        this.max2 =list.sdTime_max/10;
                        this.nowPosionX2 =list.slowDownTime/10;
                        this.oldNowPosionX2 =this.nowPosionX2;
                        //电流初始化  推荐值正负20即可
                        this.diffMin2 =list.sdTime_min;
                        this.diffMax2 =list.sdTime_max/10;
                        this.block2 =this.max2-this.min2;
                        this.buildSliderData2(this.min2,this.max2,this.nowPosionX2, this.diffMin2,this.diffMax2);
                        this.paramIncreaseDistance2=0.1; 
                        this.bleParamKey2 ='slowDownTime';//参照util里
                    }else if(list.weldType=='TIGMAN'){
                        this.hidSlide2 =false;
                        this.unitslider1='A';
                        //params:min+max+nowpositionx+dffmin+difmax
                          //11、范围构建函数 初始化
                        this.pfc_num =list.initBean.pfc==1?list.initBean.unit:0;
                        this.ac_dc_num=list.initBean.polatrity==1?list.initBean.polatrity:0;
                        this.hf_lift_num=list.initBean.ifhf==1?list.initBean.ifhf:0;
                        this.clacTigManCur();
                        this.min = this.tigman_min_cur;
                        this.max = this.tigman_max_cur;//要根据单位区分
                        this.nowPosionX=list.WELD_CUR_VAL;
                        this.oldPosionX =this.nowPosionX;
                            this.diffMin = this.min
                            this.diffMax = this.max
                            this.block =this.max-this.min;
                       this.buildSliderData1(this.min,this.max,this.nowPosionX, this.diffMin,this.diffMax);
                       this.paramIncreaseDistance=1;
                       this.bleParamKey1 ='weld_cur';//参照util里
                    }else if(list.weldType=='MMA'){
                        this.hidSlide2 =true;
                        this.unitslider1='F';
                        this.unitslider2='A';
                        
                        this.min = 0;//最小推力
                        this.max = 10;//最大推力
                        this.nowPosionX=list.ARC_FORCE_VAL;
                        this.oldPosionX =this.nowPosionX;
                        this.diffMin =0;
                        this.diffMax =10;//都是推荐值
                        this.block =this.max-this.min;

                        this.min2=list.MMA_MIN_CUR;
                        this.max2 =list.MMA_MAX_CUR;
                        this.nowPosionX2 =list.MMA_CURRENT_VAL;
                        this.oldNowPosionX2 =this.nowPosionX2;
                        //电流初始化  推荐值正负20即可
                        this.diffMin2 =Math.round((parseInt(list.MMA_RECOMMEND_CURRENT)-20));
                        this.diffMax2 =Math.round((parseInt(list.MMA_RECOMMEND_CURRENT)+20));
                        if(this.diffMax2>this.max2){
                            this.diffMax2=this.max2;
                        }else if(this.diffMin2< this.min2){
                            this.diffMin2= this.min2;
                        }
                        this.block2 =this.max2-this.min2;
                        this.buildSliderData1(this.min,this.max,this.nowPosionX, this.diffMin,this.diffMax);
                        this.buildSliderData2(this.min2,this.max2,this.nowPosionX2, this.diffMin2,this.diffMax2);
                        this.paramIncreaseDistance=1;
                        this.paramIncreaseDistance2=1;
                        this.bleParamKey1 ='FORCE';//参照util里
                        this.bleParamKey2 ='MMA_CURRENT';//参照util里
                    }else{
                        
                        //3、mig模式
                        this.min = list.MIN_SPEED_DISPLAY;//最小送丝速度
                        this.max = list.MAX_SPEED_DISPLAY;//要根据单位区分
                        this.nowPosionX=list.SPEED_DISPLAY/10;
                        this.oldPosionX =this.nowPosionX;
                            //送丝速度初始化  推荐值正负10即可
                            this.diffMin =Math.round((parseInt(list.RECOMMEND_SPEED_DISPLAY)-10))/10;
                            this.diffMax =Math.round((parseInt(list.RECOMMEND_SPEED_DISPLAY)+10))/10;
                            this.block =this.max-this.min;
                        //电压初始化  推荐值正负10即可
                        this.min2=10;
                        this.max2 =list.MAX_WELD_V_DISPLAY;
                        this.nowPosionX2 =list.V_WELDING/10;
                        this.oldNowPosionX2 =this.nowPosionX2;
                            //电压初始化  推荐值正负20即可
                            console.log('list.RECOMMEND_V_WELDING'+list.RECOMMEND_V_WELDING)
                            this.diffMin2 =Math.round((parseInt(list.RECOMMEND_V_WELDING)-20))/10;
                            this.diffMax2 =Math.round((parseInt(list.RECOMMEND_V_WELDING)+20))/10;
                            if(this.diffMax2>this.max2){
                                this.diffMax2=this.max2;
                            }else if(this.diffMin2< this.min2){
                                this.diffMin2= this.min2;
                            }
                            this.block2 =this.max2-this.min2;

                        this.hidSlide2 =true;
                        if( list.initBean.unit==1){
                            this.unitslider1='inch/min';
                        }else{
                            this.unitslider1='m/min';
                        }
                        this.unitslider2='V';
                        this.buildSliderData1(this.min,this.max,this.nowPosionX, this.diffMin,this.diffMax);
                        this.buildSliderData2(this.min2,this.max2,this.nowPosionX2, this.diffMin2,this.diffMax2);
                        this.paramIncreaseDistance=0.1;
                        this.paramIncreaseDistance=0.1;
                        
                        this.bleParamKey1 ='SPEED';//参照util里
                        this.bleParamKey2 ='V_WELDING';//参照util里
                      console.log('整的爱的'+this.diffMin);
                    }
                    //20190620 关闭不显示
                   //初始化 第一个滑动控制器
                    // this.initElecticCurrent();
                    //初始化 第二个滑动控制器
                    // if(this.hidSlide2 ){
                        // this.initVotalage();
                    // }
                   
            }
        
        },
        buildSliderData1(min,max,nowPosionX,diffMin,diffMax){
             console.log('min::'+min+'   max:: '+max+'  diffMin::'+diffMin+'  diffMax:: '+diffMax+'  nowPosionX::  '+nowPosionX);
            this.min = min;//最小送丝速度
            this.max = max;//要根据单位区分
            this.nowPosionX=nowPosionX;
            this.oldPosionX =this.nowPosionX;
                //送丝速度初始化  推荐值正负10即可
                this.diffMin =diffMin;
                this.diffMax =diffMax;
                this.block =this.max-this.min;
        },
        buildSliderData2(min2,max2,nowPosionX2,diffMin2,diffMax2){
            console.log('min2::'+min2+'   max2:: '+max2+'  diffMin2::'+diffMin2+'  diffMax2:: '+diffMax2+'  nowPosionX2::  '+nowPosionX2);
               //电压初始化  推荐值正负10即可
            this.min2=min2;
            this.max2 =max2;
            this.nowPosionX2 =nowPosionX2;
            this.oldNowPosionX2 =this.nowPosionX2;
                //电压初始化  推荐值正负20即可
                this.diffMin2 =diffMin2;
                this.diffMax2 =diffMax2;
                this.block2 =this.max2-this.min2;
        },
        buildSliderChangeData(value,type,mulity){
            // var aa = (Array(2).join('0') + parseInt(positionNum*10,10).toString(16)).slice(-2);
            //计算 查找 发送请求给ble告知 修改了
            var dirctCode = this.getDirective(this.typeName,type);
            console.log(11+this.typeName+'22'+type);
            var num = (Array(4).join('0') + parseInt(value/mulity,10).toString(16)).slice(-4);
                num= num.substring(2,4)+num.substring(0,2);
            var crc =this.crcModelBusClacQuery(dirctCode+num, true);
            var sendData ="DA"+dirctCode+num+crc;
            this.callSendDataToBleUtil('weld_tig_syn',sendData,crc);
        },
       addFuc(){
        if(this.nowPosionX>=this.max){
            this.nowPosionX2 =this.max2;
            return;
        }else{
            this.nowPosionX=Math.round((parseFloat(this.nowPosionX)+this.paramIncreaseDistance)*10)/10;
            let sliderBtn =  this.$refs.sbtn
            //00、初始化滚动条位置 占比是百分比
            sliderBtn.style.left = (this.nowPosionX-this.min)/this.block*100+'%' ;
            //开启定时器 发送给安卓
            clearTimeout(this.timerPosition1);
            this.timerPosition1 = setTimeout(() => {
                    if(this.nowPosionX!=this.oldPosionX){
                        this.oldPosionX =this.nowPosionX;
                        this.buildSliderChangeData(this.nowPosionX,this.bleParamKey1);
                    }
            }, 1000);
        }
    },
        delFuc(){
            if(this.nowPosionX==this.min){
            return;
            }else{
                this.nowPosionX=Math.round((parseFloat(this.nowPosionX)-this.paramIncreaseDistance)*10)/10;
                let sliderBtn =  this.$refs.sbtn
                //00、初始化滚动条位置 占比是百分比
                sliderBtn.style.left = (this.nowPosionX-this.min)/this.block*100+'%';
                clearTimeout(this.timerPosition1);
                this.timerPosition1 = setTimeout(() => {
                        if(this.nowPosionX!=this.oldPosionX){
                            this.oldPosionX =this.nowPosionX;
                            this.buildSliderChangeData(this.nowPosionX,this.bleParamKey1);
                        }
                }, 1000);
            }
    },addFuc2(){
        console.log('adfuc222');
        if(this.nowPosionX2==this.max2){
            return;
        }else{
            this.nowPosionX2= Math.round((parseFloat(this.nowPosionX2)+this.paramIncreaseDistance2)*10)/10;
            let sliderBtn =  this.$refs.sbtn2
            //00、初始化滚动条位置 占比是百分比
            sliderBtn.style.left = (this.nowPosionX2-this.min2)/this.block2*100+'%';
            this.timerPosition2 = setTimeout(() => {
                    if(this.oldNowPosionX2!=this.nowPosionX2){
                        this.oldNowPosionX2 =this.nowPosionX2;
                        this.buildSliderChangeData(this.nowPosionX2,this.bleParamKey2);
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
            this.timerPosition2 = setTimeout(() => {
                    if(this.oldNowPosionX2!=this.nowPosionX2){
                        this.oldNowPosionX2 =this.nowPosionX2;
                        this.buildSliderChangeData(this.nowPosionX2,this.bleParamKey2);
                    }
            }, 1000);
        }
    }, 
    initElecticCurrent(){
                let mySlider = this.$refs.mySlider;
                let dangerRange = this.$refs.dangerRange;
                let sliderBtn =  this.$refs.sbtn;
                // let btnWidth = (sliderBtn.offsetWidth/mySlider.offsetWidth)*100;//滑动块所占百分比
                //     btnWidth = btnWidth.toFixed(2);//保留两位有效数字
                let mySliderWidth =mySlider.offsetWidth;//条子宽度
                console.log('mySliderWidth'+mySliderWidth);
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
                // console.log(pageX)
				myWidth = (pageX/mySlider.offsetWidth)*100 //计算百分比
				if(myWidth>100){ //判断不超出范围 扣除按钮所在百分比
                    myWidth=100;
                    
				}else if(myWidth<0){
                    myWidth=0;
                }
                // this.nowPosionX=Math.round(this.block*(Math.round(myWidth)/100));//四舍五入取舍
                // console.log('mywidth'+myWidth);//63.70370370370371
                // this.nowPosionX=Math.round(this.block*(Math.round(myWidth)/100))+this.min;//电流没有小数点
                this.nowPosionX=Math.round(this.block*(Math.round(myWidth)/100)*(1/this.paramIncreaseDistance))/(1/this.paramIncreaseDistance)+this.min;//四舍五入保留一位小数
                console.log('nowposionx:'+this.nowPosionX)
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
            console.log(1111+this.typeName)
                // 发送请求给ble告诉 修改了
                this.buildSliderChangeData(this.nowPosionX,this.bleParamKey1,this.paramIncreaseDistance);
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
                    console.log('pageX'+mySlider.offsetWidth)
                    myWidth = (pageX/mySlider.offsetWidth)*100 //计算百分比
                    if(myWidth>100){ //判断不超出范围
                        myWidth=100;
                    }else if(myWidth<0){
                        myWidth=0
                    }
                     this.nowPosionX2=Math.round(this.block2*(Math.round(myWidth)/100)*(1/this.paramIncreaseDistance2))/(1/this.paramIncreaseDistance2)+this.min2;//四舍五入保留一位小数
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
                console.log(e)
				let touchX = e.touches[0].pageX-mySliderX
                // btnWidth = (sliderBtn.offsetWidth/mySlider.offsetWidth)*100; //计算按钮宽度
                // btnWidth=btnWidth.toFixed(2);//保留两位有效数字
				this.myPosition2.now = (touchX/mySlider.offsetWidth)*100
				mySliderX = elementLeft(mySlider) //滑动块x坐标
            })
            mySlider.addEventListener('touchend',(e)=>{//屏幕触摸结束事件
                // 发送请求给ble告诉 修改了
               this.buildSliderChangeData(this.nowPosionX2,this.bleParamKey2,this.paramIncreaseDistance2);
            })
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
        // if(!this.GLOBAL_CONFIG.TESTFLAG){
        //     window.android.callSendDataToBle('newIndex','DAFF'+oldCrc+this.crcModelBusClacQuery('FF'+oldCrc, true),oldCrc);
        // } 
        this.callSendDataToBleUtil('welding','DAFF'+oldCrc+this.crcModelBusClacQuery('FF'+oldCrc, true),oldCrc);

        this.$store.state.getWeldingInfoTimes = this.$store.state.getWeldingInfoTimes+1;
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
      },
      initFuc(){
          	// mig里是送丝速度和电压
		// tig里是电流
		// mma里是电流和force电弧推力
        // weldingCur:'',//焊接中的电流
        // weldingVoltage:'',//焊接中的电压
        //:值+单位
       this.initData();
       
        //电压 电流
       this.weldingCur=  this.$store.state.weldingCur+'.0';
        this.weldingVoltage= this.$store.state.weldingVoltage+'.0';
        this.typeName =this.$store.state.weldingInfo.modelKey;
        this.typeShowName =this.$store.state.weldingInfo.name;
        // console.log(' this.weldingCur'+ this.weldingCur);
        // window['tellVueWelding'] = (data) => {
        //     //处理返回的焊接中的数据...DAB1 0000 0000 E721
        //     alert("welding"+data); 
        //      this.buildWeldingData(data);
        // }
      },
       getModelType(elementKey){
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
      initExperialModel(){
          //初始化 如果是体验模式则开启
        if(this.GLOBAL_CONFIG.TESTFLAG){
            this.experialTimer =setInterval(() => {
                this.weldingCur =this.random(1,50);
                this.weldingVoltage =this.random(1,50);
            }, 1000);
        }
      },
        random(lower, upper) {
            return Math.floor(Math.random() * (upper - lower)) + lower;
        }

  
  },
  mounted: function() {
      this.initFuc();
      this.initExperialModel();
  },
  created() {
   
  },
  computed: {
       getWeldingDelayFlag(){
            return this.$store.state.weldingDelay;
       },
        getNowWeldStatus(){
             return this.$store.state.weldingStatus;　　//需要监听的数据
        },
       getAndriodNewMsg () {
            // alert(this.$store.state.AdroidNewMsg+'||||'+this.$store.state.AdroidOldMsg);
            return this.$store.state.AdroidNewMsg;　　//需要监听的数据
        },
        getWeldingCur () {
            return this.$store.state.weldingCur;　　//需要监听的数据
        },
        getWeldingVol () {
            return this.$store.state.weldingVoltage;　　//需要监听的数据
        },
        getmodelKey(){
            console.log('ooooooooooooooo::'+JSON.stringify(this.$store.state.weldingInfo.modelKey));
            return this.$store.state.weldingInfo.modelKey;
        }

  },
  watch:{
      getWeldingDelayFlag(val,oldval){
         
          if(val){
              this.goback();
          }
      },
      getNowWeldStatus(val, oldVal){
          if(val==0){//非焊接中 离开本页面 
             this.$router.push('/newIndex');
          }
      },
        getAndriodNewMsg(val, oldVal){
            if(val!=this.$store.state.AdroidOldMsg){
                
                this.$store.state.AdroidOldMsg=val;
                //更新操作
                this.modelType=this.getModelType(val.substring(2,4));
                //   alert(this.modelType)
                this.wtlLog('weld_tigman_bfa3','this.modelType'+this.modelType);
                  
                var rst =this.buildData('newIndex',this.modelType,val.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
                 alert(rst)
                 if(JSON.stringify(rst) != "{}"){
                    //发送确认收到的指令给安卓
                    var invalue =val.substring(val.length-4,val.length);
                    //新规则: 指令ff+crc+检验crc   测试模式不发送
                    this.callSendDataToBleUtil('newIndex','DAFF'+invalue+this.crcModelBusClacQuery('FF'+invalue, true),invalue);
                    //重新初始化
                    // alert(11)
                    this.initFuc();
                }
                
            }
        },
      getWeldingCur(val, oldVal){
           this.weldingCur=val+'.0';
      },
      getWeldingVol(val, oldVal){
            this.weldingVoltage=val+'.0';
      },
      getmodelKey(val, oldVal){
            this.typeName=val;
            console.log('valval'+val);
      },
        nowPosionX2(val, oldVal){//普通的watch监听
                var now = val+'';
                if(now.indexOf('.')<0){
                    this.nowPosionX2+='.0';
                }
        },
        nowPosionX(val, oldVal){//普通的watch监听
                var now = val+'';
            if(now.indexOf('.')<0){
                this.nowPosionX+='.0';
            }
        }
  },
  destroyed(){
      clearInterval(this.experialTimer);
      clearTimeout(this.operateTimer);
      console.log('welding destroyed')
  }
};
</script>
<style lang="scss" scoped>
.weldingManage {
    
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
//   .backBtn{
//     color: #fff;
//     text-align: center;
//     height: 30px;
//     line-height: 30px;
//     width: 80px;
//     margin-left: 20px;
//     margin-top: 20px;
//     background:url(../../assets/images/weld_icon_welding.png) no-repeat;    
//     background-size: 80px;
//     background-position:center center;
//   }
  .main{
      padding-bottom: 10px;
      -webkit-box-shadow: 0px 0px 10px 5px #2d5360 inset;
      box-shadow: 0px 0px 10px 5px #2d5360 inset; 
      margin: 0 20px;
      margin-top: 20px;
      .welding{
          height: 30px;
          line-height: 30px;
          font-size: 16px;
          color: #fff;
          padding-left: 15px;
      }
      .m-main{
          height: 100px;
          color: #fff;
          .fl{
              float: left;
              text-align: center;
            //    background: red;
             height: 100px;;
             line-height: 100px;
             font-size: 20px;
          }
         .left{
             width: 45%;
             background:url(../../assets/images/weld_icon_welding.png) no-repeat;    
            background-size: 100px;
            background-position:center center;
         }
         .mid{
             width: 10%;
            background:url(../../assets/images/weld_icon_welding_mid.png) no-repeat;    
            background-size: 35px;
            background-position:center center;
         }
         .right{
             width: 45%;
            background:url(../../assets/images/weld_icon_welding.png) no-repeat;    
            background-size: 100px;
            background-position:center center;
         }
      }
     .m-mainbtf{
          height: 20px;
          color: #fff;
          .fl{
              float: left;
              text-align: center;
             height: 20px;;
             line-height: 20px;
             font-size: 20px;
          }
         .left{
             width: 45%;
           
         }
         .mid{
             width: 10%;
         }
         .right{
             width: 45%;
          
         }
     }
     .midLine{
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
                    height: 50px;;
                    float: left;
                   width: 35px;
                   height: 50px;
                   font-size: 16px;
                //    background: #163749;
                   color: #fff;
                //    position: absolute;
                //    top: 50%;
                //    transform: translate(0,-50%)
                }
               .del{
                   
                   height: 50px;
                 left: -5px;
                  background: url(../../assets/images/jian.png) no-repeat;
                    background-size: 35px;
                    background-position: center center;
               } 
               .value{
                   line-height: 50px;
                   float: left;
                   width: 120px;
                   height: 50px;
                   color: #fff;
                   font-size: 48px;
                //    position: absolute;
                //    top: 37%;
                //    transform: translate(0,-50%);
                //    left: 15px;
               }.dangerColor{
                   color: red;
               }
               .add{
                    height: 50px;
                    background: url(../../assets/images/jia.png) no-repeat;
                    background-size: 35px;
                    background-position: center center;
                   left:145px;
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
         color: #96d3e8;
     }
  }
  }
}
@media screen and (max-width: 400px) {
  .weldingManage .main .electricCurrent .up .u-right .value{font-size: 36px;width: 100px;}
}
</style>
