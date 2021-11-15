<template>
    <div class="loginIndex">
        <div class="upContent">
            <div class="cancelBtn" @click="handleBack">Cancel</div>
            <div class="attenWord">Reset password</div>
            <div class="inBox i-1">
                <input placeholder="Please enter your Email" v-model="email" maxlength="50"/>
            </div>
            <div class="inBox i-2">
                <input  placeholder="Input graghic code"  v-model="checkCode" maxlength="4"/>
                <div class="checkCodeBox" v-html="checkCodeSvg.svgcheckCode" @click="getMainCheckCode()"></div>
            </div>
            <div class="btnBox b-1">
                <div class="signBox" @click="handleSubmit">Confirm</div>
            </div>
        </div>
        <div class="lastWord">We will send the verification code to your email,please check.</div>
    </div>
</template>

<script>
import { MessageBox ,Popup,Toast ,Indicator } from 'mint-ui'
import {InterfaceService} from '@/services/api'
import { BASE_CONFIG } from '../../lib/config/config'
export default {
  data() {
    return {
        email:'',
        checkCode:'',
        checkCodeSvg:''
    };
  },
  methods: {
    getCheckCode(){
        InterfaceService.getCheckCode('/api/getCaptcha/',(data)=>{
            console.log(data)
            this.checkCodeSvg=data;
            Toast("2222222")
        })
    },
    getMainCheckCode(){
        InterfaceService.getMainCheckCode({actionType:'code',uuid:this.userUuid},(data)=>{
            this.checkCodeSvg=data.respData.msgList[0];
        },function(data){
        });
    },
    handleBack(){
        this.$router.back();
    },
    handleSubmit(){
        if(!this.email){
            Toast(BASE_CONFIG.errorMsgMap['邮箱不能为空'])
            return;
        }
        let re = /^\w+(?:\.\w+){0,1}@[a-zA-Z0-9]{2,14}(?:\.[a-z]{2,4}){1,2}$/;
        if(this.email && !re.test(this.email)){
            Toast(BASE_CONFIG.errorMsgMap['邮箱格式不正确'])
             return;
        }
        if(!this.checkCode || this.checkCode.length<4){
            Toast(BASE_CONFIG.errorMsgMap['请输入验证码'])
            return;
        }
        localStorage.setItem("wtl_email",this.email);
        if(this.checkCode.toUpperCase() == this.checkCodeSvg.newCheckCode.toUpperCase()){
            if(!this.GLOBAL_CONFIG.TESTFLAG){
                InterfaceService.queryUserInfo({email:this.email,uuid:this.userUuid},(data)=>{
                    if(data && data.respData && data.respData.respCode == '0000' ){
                        if(data.respData.msgList && data.respData.msgList.length>0){
                            this.nextFuc();
                        }else{
                            //邮箱已注册
                            Toast(BASE_CONFIG.errorMsgMap['当前邮箱还未注册'])
                        }
                    }
                },function(data){
                
                });
            }else{
                this.go('/resetPasswordStep2')
            }
        }else{
            Toast(BASE_CONFIG.errorMsgMap['请输入正确的验证码'])
        }
    },
    nextFuc(){
        InterfaceService.sendEmailCode({email:this.email,uuid:this.userUuid},(data)=>{
            if(data && data.respData && data.respData.respCode == '0000'){
                this.go('/resetPasswordStep2')
            }else if(data && data.respData && data.respData.respCode == '0013'){
                this.$router.push({
                    path:'/resetPasswordStep2',
                    query:{
                        limitTime:data.respData.limitTime
                    }
                });
            }else{
                Toast(BASE_CONFIG.errorMsgMap['邮件验证码发送失败'])
            }
        },function(data){
        
        });
    },
    go(url){
       this.$router.push(url);
    },
    gogo(){
        this.go('/weld_mma?type='+'MMA');
    }
  },
  mounted() {
    this.email = localStorage.getItem("wtl_email") || '';
    //   this.getCheckCode();
    this.getMainCheckCode();
  },created () {
   
  
  },
  computed: {
      userUuid(){
          return this.$store.state.userUuid;
      }
  }
};
</script>

<style lang="scss" scoped>
.loginIndex{
    color:#333;
    width: 100%;
    height: 100vh;
    padding-top: 6rem; 
    position: relative;
    .upContent{
        padding: 0 1.5rem;
    }
    .cancelBtn{
        position: absolute;
        right: 1.5rem;
        top:1rem;
        color: #03a2c0;
        padding: 0.4rem 0.0rem 1rem 1rem;
    }
    .logoBox{
        text-align: center;
        img{
          
        }
    }
    .attenWord{
        font-size: 24px;
        font-style: italic;
        font-weight: bold;
        margin-bottom: 1.5rem;
        background-image: linear-gradient(#04303d,#ffffff);//背景色渐变，默认从上到下
        -webkit-background-clip: text;//CSS3属性：设定背景的绘制范围为文字
        color: transparent;//将字的颜色设置透明，只露出背景色
    }
    .inBox{
        position: relative;
        height: 2rem;
        
        &::before{
            content: '';
            position: absolute;
            left: 0;
            top:50%;
            transform: translate(0,-50%);
            background: url(../../assets/images/userCenter/acctIcon.png);
            width: 1rem;
            height: 1rem;
            background-repeat: no-repeat;
            background-size: contain;
        }
        &.i-2{
            margin-top: 0.5rem;
            input{
                padding-left: 0rem;
                float: left;
                width: calc(100% - 3rem);
            }
            img{
                float: left;
                width: 3rem;
            }
            &::before{
                background:none
            }
            .checkCodeBox{
                background: #fff;
                position: absolute;
                right: 0;
            }
        }
        input{
            height: 2rem;
            width: 100%;
            border-bottom: 1px solid #13566a;
            padding-left: 1.5rem;
            background: #01303e;
            color: #fff;
            &:focus{
                border-bottom: 1px solid #13566a;
            }
        }
        
    }
    .btnBox{
        text-align: center;
        width: 100%;
        padding: 0 3rem;
        &.b-1{
            margin-top: 2rem;
        }
        &.b-2{
            margin-top: 1.5rem;
            .signBox{
                background: #03a2c0;
            }
        }
        .signBox{
            color: #fff;
            font-size: 1rem;
            width: 100%;
            height: 2.5rem;
            line-height: 2.5rem;
            border-radius: 2rem;
            display: inline-block;
            background: #238fe7; /* Old browsers */
            background: -moz-linear-gradient(top,  #0897b9 0%, #1c6da0 100%); /* FF3.6-15 */
            background: -webkit-linear-gradient(top,  #0897b9 0%,#1c6da0 100%); /* Chrome10-25,Safari5.1-6 */
            background: linear-gradient(to bottom,  #0897b9 0%,#1c6da0 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        }
    }
    .lastWord{
        margin-top: 1rem;
        color: #03a2c0;
        text-align: center;
        width: 100%;
    }
}
</style>

