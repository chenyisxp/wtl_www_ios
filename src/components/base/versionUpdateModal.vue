<template>
    <div class="vUpModalBox">
      <mt-popup v-model="popupVisible" v-if="vuPType==1" :closeOnClickModal="closeFlag">
          <div  class="image-modal-content">
                <!-- App版本更新 -->
                <div class="i-1">App version update</div> 
                <!-- APP有重要功能上线，请更新下载 -->
                <div class="i-2">App has important functions online, please update and download</div>
                <div class="i-3" @click="hanleGoAppStoreConnect">Go to update</div>
          </div>
      </mt-popup>
  </div>
</template>

<script>
import { Popup ,Indicator} from 'mint-ui'
export default {
  props: {
        vuPType:{
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
      this.vuPType='';
      this.popup2Visible =false;
    },
    hanleGoAppStoreConnect(){
      if(this.envType=='env_ios'){
        this.vuPType=0;
        this.globalSendMsgToIos('handOpenWeb',"https://itunes.apple.com/app/apple-store/id1557474403",'')
      }
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
  },
  computed: {
      envType(){
        return this.$store.state.envType;　　//需要监听的数据
      }
  }
}
</script>

<style scoped lang="scss">
.vUpModalBox{
  background: #333;
  .mint-popup{
    border-radius: 10px;
  }
  .image-modal-content{
    padding: 0 10px;
    text-align: center;
    border-radius: 100px;
    width: 80vw;
    height: auto;
    background: #fff;
      .i-1{
          padding-top: 20px;
          font-size: 20px;
      }
      .i-2{
        font-size: 14px;
        padding-top: 20px;
        padding-bottom: 20px;
      }
      .i-3{
        color: #4169e1;//#4169e1367af5
        border-top:1px solid #eee;
        padding: 15px 0;
        font-size: 20px;
      }
  }
}

</style>