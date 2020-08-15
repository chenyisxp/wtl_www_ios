<template>
    <div class="connectingPage">
      <mt-popup v-model="popupVisible" v-if="displayType==1" :closeOnClickModal="closeFlag">
          <div  class="image-modal-content">
                  <!-- <div class="close-icon" @click="closeConnectingLayer"></div> -->
                  <div class="title">Reconnect Bluetooth</div>
                  <div class="loadings">
                        <div class="loadingCirlce"></div>
                         <div class="loadingCirlce"></div>
                         <div class="loadingCirlce"></div>
                         <div class="loadingCirlce"></div>
                         <div class="loadingCirlce"></div>
                  </div>
                  <!-- <button class="btn-close" @click="closeConnectingLayer"></button> -->
        </div>
      </mt-popup>
  </div>
</template>

<script>
import { Popup ,Indicator} from 'mint-ui'
export default {
  props: {
        displayType:{
            type:Number,
            default:0
        }
  },
  components: {
    
  },
  data: function () {
    return {
     closeFlag:false,
      popupVisible:true,//获取积分弹层
      nowPoup:'',     
      leftButton:'',//左按钮 键值
      rightButton:'',//右按钮 键值
      leftRoute:'',//路由
      rightRoute:''//路由
    }
  },
  methods: {
    goUrl(type){
      this.$router.push(type);
    },
    closeConnectingLayer(){
      this.displayType='';
      this.popup2Visible =false;
    }
  },
  mounted () {
  

  },
  created () {
    this.bean=this.featurePopupResultBean;
  },
  destroyed: function () {
    
    
  },
  watch: {
  }
}
</script>

<style scoped>

.connectingPage{background-color: transparent;position: relative;}
.connectingPage .v-modal{
  opacity: 1;
}
.connectingPage.holdover{
    background: #333;
    /* opacity: .8; */
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
}
.connectingPage .connectingPageContent{background-color: transparent;}
.image-modal-content .image-fix { width: 19rem; height: auto; display: block;}
.image-modal-content .close-icon{
  width: 24px;
  height: 24px;
  color: #fff;
  border: 1px solid #fff;
  position: absolute;
  right: 2px;
  top: 2px;
  border-radius: 15px;
  opacity: 0.8;
}
.image-modal-content .close-icon::before,
.image-modal-content .close-icon::after{
  content: "";
  position: absolute;  /*方便进行定位*/
  height: 15px;
  width: 1px;
  top: 4px;
  right: 10px;
  background: #fff;
}
.image-modal-content .close-icon::before{
  transform: rotate(45deg);  /*进行旋转*/
}
.image-modal-content .close-icon::after{
  transform: rotate(-45deg);
}
/* 图文弹层 */
.connectingPage .image-modal-content{
  background-color: transparent;position: absolute;top: 50%;left: 50%;
    /* width: 18rem;
    height: 30.5rem; */
    transform: translate(-50%,-50%);}
.connectingPage .image-modal-content .btn-close{
    right: 0.3rem;
    top: 0.3rem;
    background: none;
    border: none;
    height: 20px;
    width: 20px;
    position: absolute;
}

.connectingPage .image-modal-content .btn-wrap{font-size: 1rem;color: #c59833;height: 30%;text-align: center;line-height: 30%;position: absolute;left: 0;bottom: 0;width: 100%;}
.connectingPage .image-modal-content .btn-wrap div{height: 100%;}
/* 文本弹层 */
.connectingPage .title-modal-content{z-index: 20;width: 17.5rem;background-color: #f5f5f5;border-radius: 10px;position: absolute;left:50%;top: 50%;-webkit-transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);-o-transform: translate(-50%,-50%);transform: translate(-50%,-50%);}
.connectingPage .title-modal-content .btn-close{position:absolute;right:-1.3rem;top:-1.3rem;display:block;overflow:hidden;width: 0.875rem; height: 0.875rem;padding:2rem; 
/* background:url(../assets/images/reward_close_btn.png) no-repeat center center; 
background-size:0.875rem 0.875rem;  */
text-indent: -9999px;
}
.connectingPage .title-modal-content .modal-content{padding:0;}
.connectingPage .title-modal-content .title{margin-bottom: 0;padding: 15px 15px 13px;font-size: 16px;color: #333;font-weight: bold;text-align: center;line-height: 20px;}
.connectingPage .title-modal-content .title span{text-align:justify;display:inline-block;}
.connectingPage .title-modal-content .content{padding: 0 15px 22px;font-size: 14px;color: #333;line-height: 20px;text-align: left;}
.connectingPage .title-modal-content .btn-wrap{font-size: 16px;color: #c59833;background-color: #fff;border-radius: 0 0 10px 10px;height: 50px;text-align: center;border-top: 1px solid #ddd;line-height: 50px;}
.connectingPage .title-modal-content .btn-wrap div{height: 100%;}
.connectingPage .title-modal-content .btn-wrap div+div{border-left: 1px solid #ddd;}
/* 全屏遮罩弹层 */
/*嵌套html----------*/
.connectingPage-htmlmodal-content{ background-color: transparent; position: absolute; top: 50%; left: 50%; width: 304px; height: auto; transform: translate(-50%,-50%); -webkit-transform: translate(-50%,-50%); -o-transform: translate(-50%,-50%); -moz-transform: translate(-50%,-50%); }

.connectingPage-html-content-bg{position:relative;width: 100%;max-height:147px;z-index: 99;}
.connectingPage-html-content-bg img{width: 100%;}
.connectingPage-html{padding:15px 15px 20px;}
.e-html-item{height:80px;background-color:red}
.connectingPage-html-button{height: 45px;width: 270px;border-radius: 8px;margin:10px auto 0;font-size: 20px;line-height: 45px;text-align:center;background-color: #f0a53d;color: #393058;}
/*background: linear-gradient(rgb(207, 180, 119) 0%, rgba(182, 144, 69, 0.59) 100%); background:-webkit-linear-gradient(rgb(207, 180, 119) 0%, rgba(182, 144, 69, 0.59) 100%);*/
.connectingPage-htmlmodal-content .btn-close{right: -0.7rem;top: 1.3rem;border: none;z-index:9999;background: rgba(0,0,0,0);top:-0.7rem;}
.connectingPage-html .coupon-wrap{margin-top: 6px;}
.connectingPage-html .coupon-wrap:first-child{margin-top:0;}
.get-coupons-no{position: absolute;width: 100%;line-height: 1;font-size: 14px;top: -12px;left:0;text-align: center;color: #fff;}
.connectingPage-htmlmodal-content .coupon-wrap{height: 70px;}
.connectingPage-htmlmodal-content .money-account{    font-size: 40px; vertical-align: middle; margin-left: 0; font-weight: 600;}
.connectingPage-htmlmodal-content .coupon-logo img{height: 69px;width: 84px;}
.connectingPage-htmlmodal-content .money-bd{top:46%;left: 1rem;line-height: 1;transform: translate(0,-50%);-webkit-transform: translate(0,-50%);-o-transform: translate(0,-50%);-moz-transform: translate(0,-50%);}
.connectingPage-htmlmodal-content .coupons-title{bottom: 10px;left: 1rem;font-size: 12px;}
.connectingPage-htmlmodal-content .money-unit-percent{font-size: 14px;font-weight: 500;    vertical-align: middle;    position: relative; bottom: -10px;}
.connectingPage-htmlmodal-content .money-unit{position: relative; top: -8px; vertical-align: middle; font-size: 14px;}
.connectingPage-htmlmodal-content .coupon-tradition-e{left: 55%;bottom: 12px;position: absolute; overflow: hidden; height: 20px; font-size: 12px; color: #fff;}
.connectingPage-htmlmodal-content .coupons-name{left: 55%;top:15px;}
 .connectingPage-htmlmodal-content .coupon-orange .money-unit-percent{font-weight: 700;bottom: -10px;}
.coupon-universal-f{  position: absolute; top: 4px; right: 10px; font-size: 12px; color: #fff; border: 1px solid #fff; border-radius: 2px; padding: 0px 2px 1px; line-height: 1;}
.connectingPage-html-list{position: relative;border-radius: 0 0 8px 8px;margin-top: -1px}
.connectingPage-html-title{color: #fae526;font-size: 18px;line-height: 1;}
.connectingPage-html-sub-title{color: #fff;font-size: 12px;line-height: 1;margin-top: 8px;padding:0 20px;}
.connectingPage-html-top-text{padding-top: 12px}

.connectingPage-html .coupon-wrap .coupon-con{position: relative;}
.connectingPage-html .water_market_logo{width: 99px;position: absolute;top:2px;left:50%;margin-left:-48px;z-index:90;}
.connectingPage-html .water_market_wan{ width: 56px; position: absolute; top: 0px; left: 50%; margin-left: -55px;z-index:99;}
.connectingPage-html .water_market_wan img,.connectingPage-html .water_market_logo img{width: 100%;}

/* .connectingPage-html .coupon-wrap.coupon-other{background: url(../img/coupon/water_market_other.png) no-repeat 0 0;background-size: 100%;} */
.connectingPage-htmlmodal-content .coupon-wrap.coupon-other .coupons-name{left: 1rem;font-size: 18px;top:12px;}
.connectingPage-htmlmodal-content .coupon-wrap.coupon-other .coupon-tradition-e{left: 1rem;font-size: 12px;bottom: 18px;}

/*嵌套html-----------*/

.connectingPage .modal-screen-content{width:100%; height: 100%;}
.connectingPage .modal-screen-content img{width:100%; height: 100%;}

/* 新的一套 loading */
.connectingPage .title{
  height: 40px;
  width: 200px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  z-index: 10000;
}
.loadings{
  width: 60px;
  height: 20px;
  line-height: 20px;
  margin: 0 auto;
}

.loadingCirlce {
    width: 5px;
    height: 5px;
    border-radius: 2px;
    background: #fff;
    float: left;
    margin: 0 3px;
    animation: loadingCirlce linear 1s infinite;
    -webkit-animation: loadingCirlce linear 1s infinite;
}
.loadingCirlce:nth-child(1){
    animation-delay:0s;
}
.loadingCirlce:nth-child(2){
    animation-delay:0.15s;
}
.loadingCirlce:nth-child(3){
    animation-delay:0.3s;
}
.loadingCirlce:nth-child(4){
    animation-delay:0.45s;
}
.loadingCirlce:nth-child(5){
    animation-delay:0.6s;
}
@keyframes loadingCirlce 
{
    0%,60%,100% {transform: scale(1);}
    30% {transform: scale(2.5);}
}
@-webkit-keyframes loadingCirlce 
{
    0%,60%,100% {transform: scale(1);}
    30% {transform: scale(2.5);}
}
</style>
