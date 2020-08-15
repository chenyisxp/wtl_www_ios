<template>
  <!-- <div class="newIndex"  :style="{height:this.screenHeight+'px'}"> -->
    <div class="newIndex">
       <!-- {{showRespData}} -->
    <div class="header">
        <div class="blue-icon" @click="go('/blueToothManage')"></div>
        <div class="connectedstatus">Bluetooth {{nowConnectStatus}}</div>
        <div class="mechineId" @click="handleRender" v-if="nowConnectStatus=='connected'">{{bleName}}</div>
        <!-- <div class="connectTime">connected start time 18:18:18</div> -->
    </div>
    <div class="line">
        <div class="left"></div>
        <div class="right"></div>
    </div>
    <div class="typechoose"  ref="newIndexRef">
          <div class="contain" :style="{height:this.conHeight}" 
         >
            <div class="c-img  i-3" v-bind:class="classAtr[0].name"> 
              <img src="../assets/images/mig.png" :style="{height:this.imgHeight,width:this.imgWidth}">
              <div class="tr01" @click="newChangeFuc(1,1)">mig</div>
              <div class="tr02" @click="newChangeFuc(0,1)">mig</div>
            </div>
            <div class="c-img  i-2" v-bind:class="classAtr[1].name"> 
              <img src="../assets/images/tig.png" :style="{height:this.imgHeight,width:this.imgWidth}">
              <div class="tr01" @click.stop="newChangeFuc(3,1)">tig</div>
              <div class="tr02" @click.stop="newChangeFuc(2,1)">tig</div>
            </div>
            <div class="c-img i-0" v-bind:class="classAtr[2].name"  @click.stop="newChangeFuc(4,1)">
                <img src="../assets/images/weld_mma.png" :style="{height:this.imgHeight,width:this.imgWidth}">
            </div>
        </div>
        <div class="btn-list">
            <div class="list-contain">
                <div class="btn" v-for="(item,index) in arrChooseBtn" :key="index" :class="[item==reClacClass()?'nowChoose':'','btn_'+index]"></div>
            </div>
        </div>
    </div>
    <div class="footer-btns">
        <div class="btn n-1" @click="go('/memoryManage')">
            <div class="shuxian"></div>
            <span>Memory</span>
        </div>
        <div class="btn n-2"  @click="go('/hisWeldList')">
            <div class="shuxian"></div>
            <span>History</span>
        </div>
        <div class="btn n-3"  @click="go('/setmanage')">
            <span>Settings</span>
        </div>
    </div>
     <Loading :is-loading="isLoading"></Loading>
       <!-- 底部抽屉弹层 按钮组 begin -->
     <div class="hideWid" v-if="hideFlag">
            <div class="up" v-if="upshowFlag" @click="closeModal"></div>
            <div class="down" v-if="downshowFlag" :class="closeClass?'transdown':''">    
              <div class="changeBleName">
                  <button class="el-message-box__headerbtn"  @click="closeModal">
                    <i class="el-icon-close"></i>
                  </button>
                  <div class="attention">attention</div>
                  <div class="info">You can input new name or reset. </div>
                  <input class="inner_input" v-model="inputBleName">
                  <div class="btns">
                    <div class="bt first"  @click="changeBleName(0)"><span>reset</span></div>
                    <div class="bt second" @click="changeBleName(1)"><span>confirm</span></div>
                  </div>
              </div>  
            </div>
     </div>
     <!-- 底部抽屉弹层 按钮组 end -->
  </div>
</template>

<script>
import { MessageBox ,Popup,Toast ,Indicator } from 'mint-ui'
import Loading from "@/components/base/Loading";
import utils from '../lib/util'
export default {
  name: '',
  components: {
   MessageBox
   ,Indicator
   ,Loading
  },
  data () {
    return {
      showRespData:'',
      arrChooseBtn:[0,2,4],
      hideFlag: false,
      closeClass: false,
      upshowFlag:false,
      downshowFlag:false,
      pageHeight:'',//解决输入框顶起页面 缩小的问题
      loadingTimer:'',
      pageFrom:'',
      address:'',
      bleName:'',
      inputBleName:'',//正在输入的名字
      isLoading:false,
    // oprateArr:[{type:'',url:'',param:''}],//操作数据记录 用于安卓知道下一步要做什么
    oprateArr:[],//操作数据记录 用于安卓知道下一步要做什么
	  timeInterval1:{},
	  nowConnectStatus:'',
      changePosition:false,
      modelNumIdx:4,//最大索引也就是总的图片数减一
      originClassAtr:[{name:'cla_0',value:0},{name:'cla_1',value:1},{name:'cla_2',value:2}],
      classAtr:[{name:'cla_0',value:0},{name:'cla_1',value:1},{name:'cla_2',value:2}],
      screenWidth:'',//宽度
      screenHeight:'',//高度
      classContain:{height:''},
      classObj:{height:'',width:''},//图片动态样式
      conHeight:'',
      imgHeight:'',
      imgWidth:'',
      touchStartNum:'',
      nowMainIndex:1,//当前在c位显示的的index 默认值在mounted里设置
      modelType:'',//模式用于消息的发送和获取
      comfromFlag:false,//是否是按钮
      unconnectedTimer:{}//未连接时延时跳转
     } 
  },

  methods: {
    //新的选择器 man和syn 合并
    newChangeFuc(idx,type){
      // this.$event.preventDefault();
      this.$store.state.havedClickPage =true;
      //不是c位的图不能选中
      // if(this.reClacExit(idx)!=this.nowMainIndex){
      //   return;
      // }
      this.changeFuc(idx,type);
      console.log(this.nowMainIndex);
    },
    changeBleName(type){
      if(type==0){
        //重置 
        this.bleName =  window.android.updateBleRemarkByAddress(this.$store.state.nowConnectAddress.replace(/:/g, "").replace(/\"/g, ""),'',this.$store.state.nowConnectAddress,1);
        if(result!='fail'){
          this.inputBleName=this.bleName;
          this.$store.state.nowConnectMachine = this.bleName;
          //更新成功
            Toast({
                message: 'Reset success!',
                position: 'middle',
                iconClass: 'icon icon-success',
                duration: 1000
            });
            this.closeModal();
        }else{
          //更新失败
            Toast({
                message: 'Reset failed!',
                position: 'middle',
                iconClass: 'icon icon-success',
                duration: 1500
            });
            this.closeModal();
        }
      }else if(type==1){
        //确认
       
        var result = window.android.updateBleRemarkByAddress(this.$store.state.nowConnectAddress.replace(/:/g, "").replace(/\"/g, ""),this.inputBleName,this.$store.state.nowConnectAddress,0);
        if(result!='fail'){
          this.bleName=this.inputBleName;
          this.$store.state.nowConnectMachine=this.inputBleName;
          //更新成功
            Toast({
                message: 'Saved success!',
                position: 'middle',
                iconClass: 'icon icon-success',
                duration: 1000
            });
            this.closeModal();
        }else{
          //更新失败
            Toast({
                message: 'Saved failed!',
                position: 'middle',
                iconClass: 'icon icon-success',
                duration: 1500
            });
            this.closeModal();
        }
      }
    },
    closeModal(){
         let self =this;
         self.ifFixedFlag=false;
         self.closeClass=true;
         self.upshowFlag=false;
        // setTimeout(
        //   function fuc(params) {
            self.hideFlag=false;
            self.downshowFlag=false;
            self.closeClass=false;
          // }
          // ,500)
    },
     handleRender () {
                // this.$Modal.confirm({
                //     okText: 'CONFIRM',
                //     cancelText: 'Cancel',
                //     maskClosable:true,
                //     mask:true,
                //     render: (h) => {
                //         return h('Input', {
                //             props: {
                //                 value: this.value,
                //                 autofocus: true,
                //                 placeholder: 'Enter a new name.'
                //             },
                //             on: {
                //                 input: (val) => {
                                 
                //                     this.value = val;
                //                 }
                //             },
                           
                //         })
                //     },
                //     onOk: () => {
                //       if(this.value){
                //         // alert(this.value)
                //         if(this.value.replace(/\s+/g,"").length>0 && this.value.length<50 ){
                //           //更新
                //           this.bleName =this.value;
                //           window.android.updateBleRemarkByAddress(this.$store.state.nowConnectAddress.replace(/:/g, "").replace(/\"/g, ""),this.value,this.$store.state.nowConnectAddress);
                //           // alert(indow.android.getLastConnectBleAddress());
                //        }else{
                //              Toast({
                //                 message: 'Inappropriate length!',
                //                 position: 'middle',
                //                 iconClass: 'icon icon-success',
                //                 duration: 1500
                //               });
                //         }
                //       }
                       
                //     }
                // });
                let self =this;
                self.inputBleName=self.bleName;
                self.hideFlag=true;
                self.downshowFlag=true;
                self.closeClass=false; 
                setTimeout(
                    function fuc(params) {
                      self.upshowFlag=true;//延迟显示底色
                    }
                ,200)
    },
    newIndexToAndroid(data,crcCode){
       console.log(crcCode);
       //测试模式that
       if(this.GLOBAL_CONFIG.TESTFLAG){
        //  alert('this.GLOBAL_CONFIG.TESTFLAG'+this.modelType);
         switch (this.modelType) {
            case this.GLOBAL_CONFIG.callWeldTypeData.migsyn.crcCode://migsyn
            // alert(33)
                this.broastFromAndroid3(this.GLOBAL_CONFIG.testData.migsyn.heade+this.GLOBAL_CONFIG.testData.migsyn.data,'newIndex');
                // this.go('/weld_common?type=MIGSYN');
                break;
            case this.GLOBAL_CONFIG.callWeldTypeData.migman.crcCode://migman
                this.broastFromAndroid3(this.GLOBAL_CONFIG.testData.migman.heade+this.GLOBAL_CONFIG.testData.migman.data,'newIndex');
                // this.go('/weld_common?type=MIGMAN');
                break;
            case this.GLOBAL_CONFIG.callWeldTypeData.tigsyn.crcCode://tig syn
                this.broastFromAndroid3(this.GLOBAL_CONFIG.testData.tigsyn.heade+this.GLOBAL_CONFIG.testData.tigsyn.data,'newIndex');
                // this.go('/weld_tig_syn');
                break;
            case this.GLOBAL_CONFIG.callWeldTypeData.tigman.crcCode://tig MAN
                this.broastFromAndroid3(this.GLOBAL_CONFIG.testData.tigman.heade+this.GLOBAL_CONFIG.testData.tigman.data,'newIndex');
                // this.go('/weld_tig_man');//最复杂
                break;
            case this.GLOBAL_CONFIG.callWeldTypeData.mma.crcCode://mma
              
                this.broastFromAndroid3(this.GLOBAL_CONFIG.testData.mma.heade+this.GLOBAL_CONFIG.testData.mma.data,'newIndex');
                // this.go('/weld_mma');
                break;
            default:
              break;
         }
       }else {
          //假如是焊接中则直接过
          if(this.$store.state.weldingStatus==1){
              this.isLoading =false;
              clearTimeout(this.loadingTimer);
              this.comfromFlag=false;
              if(this.modelType==this.GLOBAL_CONFIG.callWeldTypeData.tigman.crcCode){
                this.go('/weld_tig_man');//最复杂
              }else if(this.modelType==this.GLOBAL_CONFIG.callWeldTypeData.tigsyn.crcCode){
                this.go('/weld_tig_syn');
              }else if(this.modelType==this.GLOBAL_CONFIG.callWeldTypeData.mma.crcCode){
                this.go('/weld_mma');
              }else{
                if(this.nowMainIndex==1){
                    this.go('/weld_common?type=MIGSYN');
                }
                if(this.nowMainIndex==3){
                    this.go('/weld_common?type=MIGMAN');
                }
              }
          }else{
           
            this.callSendDataToBleUtil('newIndex','DA'+data+crcCode,crcCode);
          }
          
       }
       
    },
    //for android 给安卓用的方法 begin
    broastFromAndroid3(data,pageFrom){
      console.log(data)
      let that =this;
        // alert('newindex::'+that.modelType+'|||'+that.$store.state.nowModelDirectice);
       if(that.$store.state.nowModelDirectice!='' && that.modelType!=that.$store.state.nowModelDirectice){
          // alert(11)
          return;
        }else{
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
            clearTimeout(that.loadingTimer);
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
                clearTimeout(that.loadingTimer);
              
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
                }else{
                  that.go('/weld_common?type='+rst.weldType);
                }
            }    
        }
         
    },
    upConnectStatus(status){
      // this.nowConnectStatus =status?status:'disconnected';
    },
    //for android 给安卓用的方法 end
    touchStart(e){
      
      this.touchStartNum =e.changedTouches[0].pageX;
      // alert(this.touchStartNum )

    },
    touchMove(e){

    },
    touchEnd(e){
       let that =this;
      //寻找当前中间位置的值
      var  nowChooseIndex ='';
      for(var i in that.classAtr){
        if(that.classAtr[i].value==1){
          nowChooseIndex =i;
          break;
        }
      }
     
      // alert(that.touchStartNum)
      // alert(that.touchStartNum-e.changedTouches[0].pageX)
      if(that.touchStartNum-e.changedTouches[0].pageX>30){
        // alert('左滑'+nowChooseIndex)
        //左滑
        
        if(that.reClacClass()==0){
          that.choose(2);
        }else if(that.reClacClass()==2){
          that.choose(4);
        }else if(that.reClacClass()==4){
          that.choose(0);
        }
      }else if(  that.touchStartNum-e.changedTouches[0].pageX<-30){
        // alert('又滑')
        //右滑
        if(that.reClacClass()==0){
          that.choose(4);
        }else if(that.reClacClass()==2){
          that.choose(0);
        }else if(that.reClacClass()==4){
          that.choose(2);
        }
      }
      that.touchStartNum='';
    },
        //下面这一排可选的 有点恶心啊
        choose(index){
          // alert('choose'+index)
            if(index==0 || index==1){
                this.nowMainIndex =index;
                //classAtr 数组每个index代表不同主页的id id=0在主位置
                // this.classAtr=[{name:'cla_2',value:2},{name:'cla_0',value:1},{name:'cla_1',value:3}]
                 this.classAtr=[{name:'cla_1',value:1},{name:'cla_2',value:2},{name:'cla_0',value:3}]
                
            }
            if(index==2 || index==3){
               this.nowMainIndex =index;
               this.classAtr=[{name:'cla_0',value:1},{name:'cla_1',value:2},{name:'cla_2',value:0}]
            }
             if(index==4){
               this.nowMainIndex =4;
                this.classAtr=[{name:'cla_2',value:1},{name:'cla_0',value:2},{name:'cla_1',value:2}]
            }
        },
        reClacClass(){
          //  for(var i in this.classAtr){
          //      if(this.classAtr[i].value==1){
          //          return i;
          //          break;
          //      }
          //  }
          if(this.nowMainIndex==0 || this.nowMainIndex==1){
            return 0;
          }
          if(this.nowMainIndex==2 || this.nowMainIndex==3){
            return 2;
          }
          if(this.nowMainIndex==4){
            return 4;
          }
        },
         reClacExit(val){
          if(val==0 || val==1){
            return 0;
          }
          if(val==2 || val==3){
            return 2;
          }
          if(val==4){
            return 4;
          }
        },
        go(url){
          
            if(url=='/blueToothManage'){
              //  window.android.closeBleConnect();//不应该关闭 移到buluetoothmanage页
               this.$router.push(url);
            }else if(url=='/hisWeldList'||url=='/memoryManage'){
              //是否已连接
              if(this.nowConnectStatus=='connected'){
                
                this.$router.push(url);
              }else{
                
                this.timeOutGo('/blueToothManage',{},1500);
                Toast({
                  message: 'Please connect to Bluetooth first',
                  position: 'middle',
                  iconClass: 'icon icon-success',
                  duration: 1500
                });
                return;
              }
            }
            else{
                this.$router.push(url);
            }
         
        },
        //type 操作类型 来自初始化还是功能点击的
        changeFuc(index,type){
          console.log('changeFuc::'+index);
          this.$store.state.nowModalTypeId=index;
          this.$store.state.nowModelDirectice='';
          this.$store.state.routerOprete=2;
          // Toast({
          //       message: this.GLOBAL_CONFIG.TESTFLAG,
          //       position: 'middle',
          //       iconClass: 'icon icon-success',
          //       duration: 1500
          //     });
         
          if(type==1){
            this.comfromFlag=true;
          }
          //已连接蓝牙
          if(type==1 && this.nowConnectStatus!='connected'){
              this.timeOutGo('/blueToothManage',{},1500);
              Toast({
                  message: 'Please connect to Bluetooth first',
                  position: 'middle',
                  iconClass: 'icon icon-success',
                  duration: 1500
              });
              return;
          }
          
          // if( this.nowMainIndex==index){
              // alert('index'+index)
              //来自编辑页
              if(this.pageFrom=='weldManage'){
                this.pageFrom='';
                this.isLoading=false;
                clearTimeout(this.loadingTimer);
                return;
              }
              //焊接中的状态
            if(this.$store.state.weldingStatus==1){
                if(JSON.stringify(this.$store.state.weldingInfo) != "{}"){
                      if(index!=this.$store.state.weldingInfo.newIndex){
                            Toast({
                                message: 'now is welding on '+this.$store.state.weldingInfo.name,
                                position: 'middle',
                                iconClass: 'icon icon-success',
                                duration: 500
                            });
                            this.isLoading=false;
                            clearTimeout(this.loadingTimer);
                            return;
                      }
                }
            }
            if(!this.comfromFlag){
              return;//初始化的
            }
            this.isLoading =true;
            this.loadingTimer =setTimeout(() => {
              if(this.isLoading){
                this.isLoading=false;
              }
            }, 11000);
            if(index==4){
               this.modelType =this.GLOBAL_CONFIG.callWeldTypeData.mma.crcCode;
               //1、发起获取migmma模式相关数据 2、携带着到第二个页面 或则存储在全局变量store里
                //调用安卓方法告诉需要的数据
                this.newIndexToAndroid(this.GLOBAL_CONFIG.callWeldTypeData.mma.data,this.GLOBAL_CONFIG.callWeldTypeData.mma.crcCode);
            }else if(index==0){
              this.modelType =this.GLOBAL_CONFIG.callWeldTypeData.migsyn.crcCode;
              //1、发起获取migsyn模式相关数据 2、携带着到第二个页面 或则存储在全局变量store里
                // Indicator.open({
                //      text: 'waiting.....',
                //      spinnerType: 'fading-circle'
                // });
                // this.isLoading =true;
                //调用安卓方法告诉需要的数据
                this.newIndexToAndroid(this.GLOBAL_CONFIG.callWeldTypeData.migsyn.data,this.GLOBAL_CONFIG.callWeldTypeData.migsyn.crcCode);
              // this.go('/weld_common?type=MIGSYN');
            }else if(index==3){
                 let  self =this;
                //  MessageBox.confirm('', { 
                //  message: '这个模式数据过长，是否进入模拟操作模式？', 
                //  title: '提示', 
                //  confirmButtonText: 'YES', 
                //  cancelButtonText: 'NO' 
                //  }).then(action => { 
                //   self.isLoading =false;
                //    if (action == 'confirm') {     //确认的回调
                //       self.buildData('newIndex',self.GLOBAL_CONFIG.callWeldTypeData.tigman.crcCode,'dae4 00 c0 32 0032 32 0032 0032 03e8 32 32 0032 32 50 23 4CCA'.replace(/\s+/g,"").replace(/(.{2})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, ""));
                //       self.go('/weld_tig_man');//最复杂
                //    }
                //  }).catch(err => { 
                //      if (err == 'cancel') {     //取消的回调
                          self.modelType =self.GLOBAL_CONFIG.callWeldTypeData.tigman.crcCode;
                      //1、发起获取migmma模式相关数据 2、携带着到第二个页面 或则存储在全局变量store里
                      
                        //调用安卓方法告诉需要的数据
                        self.newIndexToAndroid(self.GLOBAL_CONFIG.callWeldTypeData.tigman.data,self.GLOBAL_CONFIG.callWeldTypeData.tigman.crcCode);
                //      } 
                //  });


              
            }else if(index==1){
               this.modelType =this.GLOBAL_CONFIG.callWeldTypeData.migman.crcCode;//mig非一元化
               //1、发起获取migmma模式相关数据 2、携带着到第二个页面 或则存储在全局变量store里
               
                //调用安卓方法告诉需要的数据
                this.newIndexToAndroid(this.GLOBAL_CONFIG.callWeldTypeData.migman.data,this.GLOBAL_CONFIG.callWeldTypeData.migman.crcCode);
              // this.go('/weld_common?type=MIGMAN');
            }else if(index==2){
                  this.modelType =this.GLOBAL_CONFIG.callWeldTypeData.tigsyn.crcCode;//mig非一元化
                //1、发起获取migmma模式相关数据 2、携带着到第二个页面 或则存储在全局变量store里
                
                  //调用安卓方法告诉需要的数据
                  this.newIndexToAndroid(this.GLOBAL_CONFIG.callWeldTypeData.tigsyn.data,this.GLOBAL_CONFIG.callWeldTypeData.tigsyn.crcCode);
              // this.go('/weld_common?type=TIGSYN');
            }
          // }else{
           
          //    this.choose(index);
          // }
        },
        turns(){

        },
       clacHeightAndWidth(){
          //  alert( window.screen.availHeight);
            this.screenWidth = document.body.clientWidth;
            this.screenHeight =  window.innerHeight;
            // this.screenHeight =  document.body.clientHeight;
            if( this.screenWidth<this.screenHeight){
            this.conHeight = this.screenHeight-95-100+'px';
            this.imgHeight = this.screenHeight-95-100;
            this.imgWidth = this.imgHeight*0.7 +'px';//宽高比列5：3
            this.imgHeight+='px';//去除头部底部高度 上下距离
            }else{
            this.conHeight = this.screenWidth-95-100+'px';
            this.imgWidth = this.screenWidth*0.7+'px';
            this.imgHeight = this.screenWidth-95-100+'px';//去除头部底部高度 上下距离
            }
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
    goBack(){
      // alert('cso');
      this.$router.push({path:'/blueToothManage',query:{}});
      // this.$router.back() 
      return;
    },
    timeOutGo(url,params,delayTime){
      this.unconnectedTime =setTimeout(() => {
        this.$router.push({path:url,query:params});
      }, delayTime);
    },
    initTouch(){
      let newIndexRef = this.$refs.newIndexRef;
      newIndexRef.addEventListener('touchstart',(e)=>{//屏幕触摸事件
        this.touchStartNum =e.changedTouches[0].pageX;
        
      },false)
      newIndexRef.addEventListener('touchmove',(e)=>{//屏幕触摸事件
                  e.preventDefault();
      });
      newIndexRef.addEventListener('touchend',(e)=>{//屏幕触摸结束事件
        this.touchEnd(e);

      },false)
      //  this.$refs.migClickRef.onclick = function(e) {
      //     // e.preventDefault()
      //     // @click="newChangeFuc(1,1)"
      //   console.log('level11莫名被点击了');
      // }
    }
  },
  mounted: function () {
     let that = this;
     
     if(!that.GLOBAL_CONFIG.TESTFLAG){//测试模式不走
      clearInterval(that.$store.state.globalGetConnectStatus);
      that.$store.state.globalGetConnectStatus = setInterval(() => {
        if(that.GLOBAL_CONFIG.TESTFLAG){
          clearInterval(that.$store.state.globalGetConnectStatus);
          return;
        }
          that.$store.state.getConnectStatus =  window.android.getConStatus();
          if(that.GLOBAL_CONFIG.ONLY_CONNECT_STATUS_TOAST){
            Toast({
                message: '连接状态：：'+that.$store.state.getConnectStatus,
                position: 'middle',
                iconClass: 'icon icon-success',
                duration: 1000
            });
          }
        that.nowConnectStatus =that.$store.state.getConnectStatus;
      }, 1000);
     }else{
       that.$store.state.getConnectStatus='connected';
     }

     that.nowConnectStatus =that.$store.state.getConnectStatus;
      //触发原生安卓的应用
      that.bleName = that.$store.state.nowConnectMachine;
      that.inputBleName=that.bleName;
      // that.bleName = 'aa';
      that.address = that.$store.state.nowConnectAddress;
      that.pageFrom =that.$route.query.pageFrom;

      that.clacHeightAndWidth();

      // window.onresize = () => {
      //   return (() => {
      //       that.clacHeightAndWidth();
      //   })()
      // }
      //默认选中 1
      that.wtlLog('newIndex','mountedParams=bleName:'+that.bleName+'.address='+that.address+',pageFrom='+that.pageFrom+',nowModalTypeId='+that.$route.query.nowModalTypeId);
      // alert(that.$route.query.nowModalTypeId)
      if(that.$route.query.nowModalTypeId>=0){
        // that.changeFuc(that.$route.query.nowModalTypeId,0);//第二个参数初始化
        that.choose(that.$route.query.nowModalTypeId);
      }else{
        that.choose(0);
        // that.changeFuc(1,0);//第二个参数初始化
      }
	  
      //获取蓝牙连接状态  如果是测试模式就不开启 且本地开发开关关闭  移到初始页去记录
      if(that.GLOBAL_CONFIG.TESTFLAG){
        //测试模式模拟打开开关
        that.nowConnectStatus='connected';
      } 
       window['broastFromAndroid'] = (data,pageFrom) => {
            // 20190623 比较大的改动主调这两个不知道会不会有影响
            // this.$store.state.memoryInfo ={};//清空
            // this.$store.state.rstInfo={};
          //如果和现在选的模式不一致，不进行跳转
          //  alert(data)
          that.showRespData =data;
          // if(that.$store.state.oldBroastData && that.$store.state.oldBroastData===data){
          //   //重复不做处理
          //   if(!that.$store.state.havedClickPage){
          //       return;
          //   }
            
          // }
          // alert(data)
          that.$store.state.havedClickPage=false;
          that.$store.state.oldBroastData =data;
          
          var tempType=that.getModelType(data.substring(2,4));
          if(that.modelType!=tempType){
            return;
          }
          that.wtlLog("newindex",'ppp::'+that.$store.state.AdroidNewMsg+'||||'+that.$store.state.AdroidOldMsg);
          // alert('ppp::'+that.$store.state.AdroidNewMsg+'||||'+that.$store.state.AdroidOldMsg);
          if(that.$store.state.AdroidOldMsg){
            that.$store.state.AdroidNewMsg =data;
          }else{
            that.$store.state.AdroidNewMsg =data;
            that.$store.state.AdroidOldMsg=data;
          }
          that.wtlLog('newIndex','broastFromAndroid3='+data);
         
         
          
          // if(that.modelType==tempType){
            that.broastFromAndroid3(data,pageFrom,that);
          // // }else if(that.comfromFlag){
            
          //   that.broastFromAndroid3(data,pageFrom);
          // }  
          
      }
      //禁止使用返回键
      // window.history.pushState(null, null, "#");
      // window.addEventListener("popstate", function(e) {
      //   window.history.pushState(null, null, "#");
      // })
      this.$nextTick(() => {
        this.initTouch();
      })
      if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.goBack, false);
      } 
  },
  created () {
      this.pageHeight=window.innerHeight+'px';
    
  },
  computed:{
       
  },destroyed(){
    console.log('1111111:'+this.nowMainIndex)
    clearInterval(this.timeInterval1);
    clearTimeout(this.loadingTimer);
    clearTimeout(this.unconnectedTimer);
    this.isLoading=false;
    MessageBox.close(); 
    window.removeEventListener('popstate',this.goBack, false);
    //记录当前模式id
    // this.$store.state.nowModalTypeId =;
    
  }
}
</script>
<style lang="scss" scoped>
.newIndex{
  // opacity: 0.1;
  width: 100%;
  height: 100vh;
  background: #053342;
  position: relative;
  .header{
    color: #638190;
    font-family: Arial;
    position: relative;
    height: 50px;
    .blue-icon{
       z-index: 100;
       height: 50px;
       width: 125px;
       position: absolute;
       background:url(../assets/images/bluetooths.png) no-repeat; 
       background-position: left center;
       background-size: 25px;
       left: 10px;
       top: 50%;
       transform: translate(0,-50%);
    }
    .connectedstatus{
       position: absolute;
       padding-left: 20px;
       left: 15px;
       top: 55%;
       color: #fff;
       font-size: 14px;
       font-weight: bold;
       transform: translate(0,-50%);
    }
    .mechineId{
      
      color: #dbf1f5;
      position: absolute;
      font-size: 18px;
      right: 10px;
      top: 50%;
      transform: translate(0,-50%);
      background:url(../assets/images/edit.png) no-repeat;    
      background-size: 10px;
      background-position:right center;
      padding-right: 14px;
    }
  
    .connectTime{
       position: absolute;
       right: 5px;
       top: 65%;
       transform: translate(0,-50%)
    }
  }
  .line{
      width: 100%;
      height: 2px;;
      // background:url(../assets/images/line.png) no-repeat; 
      // background-position: center;
      // margin-bottom: 20px;
      .left{
        float: left;
        zoom: 1;
        width: 50%;
        height: 100%;
        background: linear-gradient(to left, #083846 , #fdfcff);
        background: -webkit-linear-gradient(left, #083846 , #fdfcff);
      }
      .right{
        zoom: 1;
        width: 50%;
        height: 100%;
        float: left;
        background: linear-gradient(to right, #083846 , #fdfcff);
        background: -webkit-linear-gradient(right, #083846 , #fdfcff);
      }
  }
  .typechoose{
            overflow: hidden;
            width: 100%;
            height: auto;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translate(0,-50%);
      .contain{
            width: 100%;
            height: 400px;
            
            .c-img{
              float: left;
              zoom: 1;
              position: absolute;
              img{
                width: 300px;
                height: 400px;
                border-radius: 5px;
              }
            }
            .c-img.i-2,.c-img.i-3{
              // opacity: 0.4;
              overflow: hidden;
               .tr01{
                  position: absolute;
                  top: 6px;
                  left: 0px;
                  width: 100%;
                  height: 130%;
                  background: red;
                  opacity: 0;
                  -webkit-transform-origin: 100% 0;
                  transform-origin: 0 0;
                  -webkit-transform: rotate(-25deg);
                  transform: rotate(-25deg);
              }
              .tr02{      
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 103%;
                    height: 120%;
                    background: blue;
                    opacity: 0;
                    -webkit-transform-origin: 100% 0;
                    transform-origin: 100% 100%;
                    -webkit-transform: rotate(-31deg);
                    transform: rotate(-31deg);
              }

            }
            .c-img.i-3{
              .tr01{
                 background: green;
              }
              .tr02{
                background: #409EFF;
              }
            }
            .c-img.cla_0{
              top: 40px;
              left: -150px;
              z-index: 2;
              zoom: .8;
              transition-duration:.05s;
              // linear匀速 ease-in加速 ease-out减速 ease-in-out先加速再减速*/
              transition-timing-function:linear;
            }
            .c-img.cla_1{
              z-index: 3;
              left: 50%;
              top: 0;
              zoom: 1;
              transform: translate(-50%,0%);
              transition-duration:.05s;
              // linear匀速 ease-in加速 ease-out减速 ease-in-out先加速再减速*/
              transition-timing-function:linear;
            }
            .c-img.cla_2{
              top: 40px;
              z-index: 1;
              right: -150px;
              zoom: .8;
              transition-duration:.05s;
              // linear匀速 ease-in加速 ease-out减速 ease-in-out先加速再减速*/
              transition-timing-function:linear;
              
            }
            .c-img.cla_3{
              top: 40px;
              z-index: 1;
              left: 50%;
              transform: translate(-50%,0) scale(.8);
              transition-duration:.05s;
              // linear匀速 ease-in加速 ease-out减速 ease-in-out先加速再减速*/
              transition-timing-function:linear;
              
            }
            .c-img.cla_4{
              top: 40px;
              z-index: 1;
              left: 50%;
              transform: translate(-50%,0) scale(.8);
              transition-duration:.05s;
              // linear匀速 ease-in加速 ease-out减速 ease-in-out先加速再减速*/
              transition-timing-function:linear;
            }
          }
          .btn-list{
            width: 100%;
            height: 20px;
            padding: 0 20px;
            margin-top: 20px;
            .list-contain{
              margin: 0 auto;
              width: 50px;
              height: 20px;
              position: relative;
                .btn{
                float: left;
                zoom: 1;
                width: 10px;
                height: 10px;
                border-radius: 10px;
                background: #888;
                position: absolute;
              }.nowChoose{
                background: #fff;    
              }
              .btn.btn_0{
                left: 0; 
              }
              .btn.btn_1{
                left:20px; 
              }
              .btn.btn_2{
                right: 0px; 
              }
            }
            

          }
  }
  
  .footer-btns{
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 40px;
        background: #333; /* For browsers that do not support gradients */
        // background: -webkit-linear-gradient(#fff, #333, #fff); /* For Safari 5.1 to 6.0 */
      .btn{
          width: 33.33%;
          height: 40px;
          float: left;
          zoom: 1;
          text-align: center;
          color: #fff;
          // color: #000;
          font-size: 16px;
          line-height: 40px;
          // border-right: 2px solid;
          background: #000;
          // background: -moz-linear-gradient(top, #354141 0%, #000 100%) ;
          // background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#354141), color-stop(100%,#000))  ;
          // background: -webkit-linear-gradient(top, #354141 0%,#000 100%) ;
          // background: -o-linear-gradient(top, #354141 0%,#000 100%) ;
          // background: -ms-linear-gradient(top, #354141 0%,#000 100%) ;
      }.n-1{
          position: relative;
          .shuxian{
            width: 2px;
            height: 40px;
            position: absolute;
            right: 0;
            background:url(../assets/images/shuxian.png) no-repeat;    
            background-size: 2px;
            background-position:right center;
          }
          span{
            height: 40px;
            display: inline-block;
            background:url(../assets/images/memory.png) no-repeat;    
            background-size: 25px;
            background-position:top center;
            padding-top: 7px;
            margin: 3px 0;
          }
      }.n-2{
         position: relative;
          .shuxian{
            width: 2px;
            height: 40px;
            position: absolute;
            right: 0;
            background:url(../assets/images/shuxian.png) no-repeat;    
            background-size: 2px;
            background-position:right center;
          }
        span{
          height: 40px;
          display: inline-block;
          background:url(../assets/images/history.png) no-repeat;    
          background-size: 20px;
          background-position:top center;
          padding-top: 7px;
          margin: 3px 0;
        }
      }.n-3{
        span{
          height: 40px;
          display: inline-block;
          background:url(../assets/images/setting.png) no-repeat;    
          background-size: 20px;
          background-position:top center;
          
          padding-top: 7px;
          margin: 3px 0;
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
        // border-top-left-radius: 10px;
        // border-top-right-radius: 10px;
        border-top: 1px solid #999;
      background: #2b2c30;
      height: auto;
      display: inline-block;
      /* top: 50%; */
      bottom: 0;
      right: 0;
      
      width: 90%;
      left: 5%;
      position: fixed;
      animation:btmoveOne .5s;
      -webkit-animation:btmoveOne .5s;
      animation-fill-mode: forwards;/*当动画完成时，动画会停留在最后一帧。*/
      overflow: hidden;
      
      .changeBleName{
        text-align: center;
        background: #fff;
        height: 170px;
        border-radius: 4px;
        position: relative;
        .el-message-box__headerbtn{
            position: absolute;
            top: 15px;
            right: 15px;
            padding: 0;
            border: none;
            outline: none;
            background: transparent;
            font-size: 16px;
            cursor: pointer;
            font-family: inherit;
            font-size: inherit;
            line-height: inherit;
            color: inherit;
            .el-icon-close{
              color: #909399;
              font-family: 'element-icons' !important;
              speak: none;
              font-style: normal;
              font-weight: normal;
              font-variant: normal;
              text-transform: none;
              line-height: 1;
              vertical-align: baseline;
              display: inline-block;
              -webkit-font-smoothing: antialiased;
            }:before{
              content: "\E60F";
            }
        }
        .attention{
          font-size: 16px;
          height: 30px;
          line-height: 30px; 
          text-align: left;
          padding-left: 20px;
        }
        .info{
          height: 20px;
          line-height: 20px;
          font-size: 14px;
          text-align: left;
          padding-left: 20px;
        }
        .inner_input{
          margin-top: 20px;
          -webkit-appearance: none;
          background-color: #fff;
          background-image: none;
          border-radius: 4px;
          border: 1px solid #dcdfe6;
          box-sizing: border-box;
          color: #606266;
          display: inline-block;
          font-size: inherit;
          height: 40px;
          line-height: 40px;
          outline: none;
          padding: 0 15px;
          transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
          width: 90%;
        }:focus{
              outline: none;
            border-color: #409EFF;
        }
        .btns{
          zoom: 1;
          width: 100%;
          height: 40px;
          position: relative;
          .bt{
          
            position: absolute;
            text-align: center;
            width: 60px;
            height: 30px;
            line-height: 30px;
            border-radius: 3px;
          }
          .bt.first{
            right: 100px;
            top: 15px;
            border: 1px solid #eee;
          }
          .bt.second{
            right: 20px;
            top: 15px;
            color: #fff;
            background: #409EFF;
          }
        }
        
      }
      
    }
    @-webkit-keyframes btmoveOne /* Safari and Chrome */
      {
            0%   {bottom:-70%;}
            100% {bottom:40%;}
      }
    @-webkit-keyframes btmoveSecond /* Safari and Chrome */
    {
          0%   {bottom:40%;}
          100% {bottom:-70%;}
    }
  }
}

/* media */
@media(max-width:320px){
   .newIndex .header .mechineId{
    font-size: 16px;
  }
  // .newIndex .typechoose .contain{
  //   height: 300px;
  // }
  // .newIndex .typechoose .contain .c-img img{
  //   height: 300px;
  //   width: 200px;;
  // }
}

@media(max-width:384px) and (max-height:567px){
}

    
@media(max-width:320px) and (min-height:490px){ 
  
}

@media (min-width:360px) {
    
    
}
@media (min-width:370px) {
    


}
@media (min-width:384px) {
    
   

}
@media (min-width:410px) {

}
</style>
