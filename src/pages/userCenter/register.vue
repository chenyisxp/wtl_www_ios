<template>
    <div class="loginIndex">
        <div class="logoBox"><img src="../../assets/images/jian.png"></div>
        <div class="attenWord">Sign up</div>
        <div class="inBox i-1">
            <input placeholder="email" v-model="email"/>
        </div>
        <div class="pc_in">
            <div>
                
                <span :class="nowFocus && (codeList.length-1)==index1?'focus_on':''" class="g_hx" v-for="(item1,index1) in codeList" :key="'i1_'+index1">{{item1}}</span>
                <span class="g_hx" :class="nowFocus && index2==0 && codeList.length==0?'focus_on':''"  v-for="(item2,index2) in otherListNum" :key="'i2_'+index2"></span>
            </div>
            <p>
                <input type="text" v-model.trim="registerCodeValue" @input="handleIn" maxlength="4" @focus="nowFocus=true;" @blur="nowFocus=false;" @click="nowFocus=true;"/>
            </p>
        </div>
        <div class="wordBox clearfloat">
            <span class="w-1">Input verification code</span>
            <span class="w-2">(300s) Resend</span>
        </div>
        <div class="btnBox b-1">
            <div class="signBox" @click="handleSubmit">Confirm</div>
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
        registerCodeValue:'',
        codeList:[],
        otherListNum:4,
        nowFocus:false
    };
  },
  methods: {
    handleIn(){
        this.codeList = this.registerCodeValue.split("");
        this.otherListNum = 4-this.codeList.length>0?4-this.codeList.length:0;
        console.log(this.otherListNum)
    },
    handleOnIn(postion){
        switch (postion) {
            case 1:

                break;
            case 2:
                
                break;
            case 3:
                
                break;
            case 4:
                
                break;
            default:
                break;
        }
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
  },created () {
  },
  watch: {
      registerCodeValue(oldval,newval){
          console.log(oldval,newval)
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
            display: flex;
            &::before{
                background: none;
            }
            span{
                display: inline-block;
                width: 25%;
                
                &:nth-child(1){
                    margin-right: 0.3rem;
                }
                &:nth-child(2){
                    margin-left: 0.1rem;
                    margin-right: 0.1rem;
                }
                &:nth-child(3){
                    margin-left: 0.3rem;
                    margin-right: 0.1rem;
                }
                &:nth-child(4){
                    margin-left: 0.3rem;
                }
                input{
                    width: 100%;
                    padding-left: 0;
                }
            }
        }
        input{
            height: 2rem;
            width: 100%;
            border-bottom: 1px solid #13566a;
            padding-left: 1.5rem;
           
            &:focus{
                border-bottom: 1px solid #13566a;
            }
        }
        
    }
    .pc_in {
        position: relative;
        width: 100%;
        height: 1.12rem;
        margin-top: 0.92rem;
        div {
            display: flex;
            width: 100%;
            height: 1.12rem;
            span {
                flex: 1;
                height: 200%;
                border-bottom: #13566a solid 1px;
                border-right: none;
                margin-top: -0.56rem;
                text-align: center;
                line-height: 200%;
                font-size: 20px;
                &:nth-child(1){
                    margin-right: 0.2rem;
                }
                &:nth-child(2){
                    margin-left: 0.2rem;
                    margin-right: 0.2rem;
                }
                &:nth-child(3){
                    margin-left: 0.2rem;
                    margin-right: 0.2rem;
                }
                &:nth-child(4){
                    margin-left: 0.2rem;
                }
                display: inline-block;
                position: relative;
                &.focus_on::after{
                    position: absolute;
                    content: '';
                    width: 0.05rem;
                    height: 1rem;
                    background: #333;
                    right: 0;
                    top:50%;
                    transform: translate(0,-50%);
                    -webkit-animation: Blink 1s ease-in 0s infinite;
                    animation: Blink 1s ease-in 0s infinite;
                }
            }
            
        }
        p {
            position: absolute;
            overflow: hidden;
            width: 100%;
            height: 1.12rem;
            line-height: 1.12rem;
            top: 0;
            left: 0;
            background: none;
            overflow: hidden;
            input {
                opacity: 0;
                float: left;
                width: 120%;
                height: 2rem;
                line-height: 0.8rem;
                letter-spacing: 0.5rem;
                background: none;
                text-indent: 2.5rem;
            }
        }
    }
    .wordBox{
        color: #03a2c0;
        margin-top: 1rem;
        .w-1{
            float: left;
        }
        .w-2{
            float: right;
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
        position: absolute;
        bottom: 2rem;
        left: 50%;
        transform: translate(-50%,0);
    }
}
@-webkit-keyframes Blink {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
@keyframes Blink {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
</style>