<template>
    <div class="loginIndex">
        <div class="logoBox"><img src="../../assets/images/jian.png"></div>
        <div class="attenWord">Sign in with your Email</div>
        <div class="inBox i-1">
            <input placeholder="email" v-model="email"/>
        </div>
        <div class="inBox i-2">
            <input placeholder="password"  v-model="password"/>
        </div>
        <div class="wordBox" @click.stop="handleGo">Forgot your password?</div>
        <div class="btnBox b-1">
            <div class="signBox" @click="handleSubmit">Sign in</div>
        </div>
        <div class="btnBox b-2">
            <div class="signBox">Sign Up</div>
        </div>
        <div class="lastWord">Use it without an account ></div>
    </div>
</template>

<script>
import { MessageBox ,Popup,Toast ,Indicator } from 'mint-ui'
export default {
  data() {
    return {
        email:'',
        password:''
    };
  },
  methods: {
    handleGo(){
        // alert(11)
        this.$router.push('/beforeRegister');
    },
    handleSubmit(){
        if(this.email && this.password){
            Toast("Sign in successful")
        }
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
  },created () {
   
  
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
        text-align: center;
        img{
          
        }
    }
    .attenWord{
        font-size: 24px;
        font-style: italic;
        font-weight: bold;
        height: 1.6rem;
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
    }
}
</style>

