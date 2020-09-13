<template>
  <div class='header-container' :class="envType=='env_ios'?'env_ios_component':''">
        <div class="header">
            <Icon type="ios-arrow-back" @click="handleGo()"/>
            <div class="headInBox" >
                <span v-if="typeName">{{changeStrEmptyName(typeName)}}<span class="setupyi">SET UP</span></span>
                <span v-if="headName">{{headName}}</span>
            </div>
        </div>
  </div>
</template>

<script>
export default {
  props: ['align','wantTo','pageBackTo','typeName','pageFrom','nowModalTypeId','headName'],
  data () {
    return {
    }
  },mounted(){
      
      
  },
  methods:{
      handleGo(){
            if(this.pageBackTo){
                // 回退
                this.$router.push({path:this.pageBackTo,query:{}});
                return;
            }else if(this.typeName){
                this.$router.push({path:this.wantTo,query:{type: this.typeName ,nowModalTypeId:this.nowModalTypeId,pageFrom:this.pageFrom}});
            }else{
                this.$router.push({path:this.wantTo,query:{}});
            }
      }
  },
  updated () {},
  computed:{
        envType(){
            return this.$store.state.envType;　　//需要监听的数据
        }
  }
       
}
</script>

<style scoped lang="scss">
.header-container{
    height: auto;
}
    .header{
        z-index: 111111;
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
  .env_ios_component{
        .header{
            height: 70px !important;
            line-height: 1px !important;
            .ivu-icon{
                top: 70%;
                -webkit-transform: translate(0, -50%);
                -ms-transform: translate(0, -50%);
                transform: translate(0, -50%);
            }
            .headInBox{
                position: absolute;
                top: 70%;
                -webkit-transform: translate(0, -50%);
                -ms-transform: translate(0, -50%);
                transform: translate(0, -50%);
            }

        }
      
  }
</style>
