<template>
  <div class='header-container' :class="envType=='env_ios'?'env_ios_component':''">
        <div class="header">
            <div class="iAB-box">
                <Icon type="ios-arrow-back" @click="handleGo()"/>
            </div>
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
            }else if(this.pageFrom=='/saveDetail'){
                this.goWeldPage(this.nowModalTypeId);
            }else{
                this.$router.push({path:this.wantTo,query:{}});
            }
      },
      //应该是去之前的焊接页
    goWeldPage(newIndexId){
        console.log(newIndexId);
        newIndexId =parseInt(newIndexId || 0);
        let self =this;
        // alert(newIndexId)
        switch (newIndexId) {
            case self.GLOBAL_CONFIG.callWeldTypeData.migsyn.newIndex://migsyn
                self.$router.push({ path: '/weld_common', query:{type:'MIGSYN',pageBackTo:'/newIndex'} });
                break;
            case self.GLOBAL_CONFIG.callWeldTypeData.migman.newIndex://migman
                self.$router.push({ path: '/weld_common', query:{type:'MIGMAN',pageBackTo:'/newIndex'} });
                break;
            case self.GLOBAL_CONFIG.callWeldTypeData.tigsyn.newIndex://tigsyn
                self.$router.push({ path: '/weld_tig_syn', query:{type:'TIGMAN',pageBackTo:'/newIndex'} });
                break;
            case self.GLOBAL_CONFIG.callWeldTypeData.tigman.newIndex://tigman
                self.$router.push({ path: '/weld_tig_man', query:{type:'TIGMAN',pageBackTo:'/newIndex'} });
                break;
            case self.GLOBAL_CONFIG.callWeldTypeData.mma.newIndex://mma
                self.$router.push({ path: '/weld_mma', query:{type:'MMA',pageBackTo:'/newIndex'} });
                break;
            default:
                break;
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
            width: 50px;
            height: 50px;
            line-height: 50px;
            font-size: 20px;
            position: fixed;
            left: 15px;
            top: 30px;
        }
        .setupyi{
            padding-left: 10px;
        }
  }
  .env_ios_component{
        .header{
            height: 80px !important;
            line-height: 1px !important;
            .ivu-icon{
                
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
