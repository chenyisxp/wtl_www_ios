<template>
    <div class="loginIndex">
        <div class="logoBox">
            <!-- <img src="../../assets/images/jian.png"> -->
        </div>
        <div class="attenWord">Sign in with your Email</div>
        <div class="inBox i-1">
            <input placeholder="Email" v-model="email" maxlength="50"/>
        </div>
        <div class="inBox i-2">
            <input placeholder="Password"  v-model="password" maxlength="20"/>
        </div>
        <div class="wordBox" @click.stop="handleGo(1)">Forgot your password?</div>
        <div class="btnBox b-1">
            <div class="signBox" @click="handleSubmit">Sign in</div>
        </div>
        <div class="btnBox b-2">
            <div class="signBox" @click.stop="handleGo(2)">Sign Up</div>
        </div>
        <div class="lastWord" @click="handleToIndex">Use it without an account ></div>
    </div>
</template>

<script>
import { MessageBox ,Popup,Toast ,Indicator } from 'mint-ui'
import {InterfaceService} from '@/services/api'
import { BASE_CONFIG } from '../../lib/config/config'
import CryptoJS from "crypto-js";
export default {
  data() {
    return {
        email:'',
        password:''
    };
  },
  methods: {
    handleToIndex(){
        localStorage.setItem("wtl_without_login",1);
        this.$router.push({path:'/newIndex',query:{}});
    },
    handleGo(num){
        // alert(11)
        this.$store.state.nowLoginStauts = num;
        switch (num) {
            case 1:
                this.$router.push('/resetPasswordStep1');
                break;
            case 2:
                this.$router.push('/registerStep1');
                break;
            default:
                break;
        }
        
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
        }else{
            localStorage.setItem("wtl_email",this.email);
        }
        if(!this.password){
            Toast(BASE_CONFIG.errorMsgMap['密码不能为空'])
            return;
        }
        if(this.GLOBAL_CONFIG.TESTFLAG){
            Toast(BASE_CONFIG.errorMsgMap['登录成功'])
            localStorage.setItem("wtl_login_email",this.email);
            this.$router.push('/newIndex');
            return;
        }
        // Toast("Sign in successful")
        
        var param={
            email:this.email,
            password: CryptoJS.MD5(this.password).toString(),
            uuid:this.userUuid,
            btAddress:this.$store.state.btAddress
        }
        Indicator.open({
            text: '',
            spinnerType: 'fading-circle'
          });
        InterfaceService.login(param,(data)=>{
            this.$store.state.email=this.email;
            
            if(data && data.respData.respCode=='0000' && data.respData.msgList  && data.respData.msgList.length>0){
                Toast(BASE_CONFIG.errorMsgMap['登录成功'])
                localStorage.setItem("wtl_login_email",this.email);
                setTimeout(() => {
                    this.$router.push('/newIndex');
                }, 1000);
                //登录成功
            }else if(data && data.respData.respCode=='1001'){
                // respCode: "1001"
                // respMsg: "当前邮箱还未注册"
                Toast(data.respData.respMsg);
                setTimeout(() => {
                   this.handleGo(2);
                }, 1000);
            }else if(data && data.respData.respCode=='0001'){
                Toast(BASE_CONFIG.errorMsgMap['密码不正确'])
            }
            else{
                Toast(data.respData.respMsg || BASE_CONFIG.errorMsgMap['请检查帐号或密码是否正确']);
            }
            Indicator.close();
        },function(data){
            Indicator.close();
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
    //   this.$router.push('/forgotPassword');
    this.email = localStorage.getItem("wtl_email") || '';
    
  },created () {
   
  
  },
  computed:{
      netWorkStatus(){
          return this.$store.state.netWorkStatus;
      },
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
    padding: 0 1.5rem;
    position: relative;
    .logoBox{
        padding-bottom: 7rem;
        text-align: center;
        img{
          
        }
    }
    .attenWord{
        font-size: 24px;
        font-style: italic;
        font-weight: bold;
        // height: 1.6rem;
        // line-height: 1.6rem;
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
            &::before{
                background: url(../../assets/images/userCenter/acctIcon2.png);
                width: 1rem;
                height: 1rem;
                background-repeat: no-repeat;
                background-size: contain;
            }
        }
        input{
            background: #01303e;
            height: 2rem;
            width: 100%;
            border-bottom: 1px solid #13566a;
            padding-left: 1.5rem;
            color:#fff;
            &:focus{
                border-bottom: 1px solid #13566a;
            }
        }
        
    }
    .wordBox{
        color: #03a2c0;
        text-align: right;
        margin-top: 0.5rem;
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
        position: absolute;
        bottom: 2rem;
        left: 50%;
        transform: translate(-50%,0);
        color: #fff;
    }
}
</style>

