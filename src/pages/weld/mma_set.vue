<template>
  <div class="mmaSet">
    <div class="header"><Icon type="ios-arrow-back" @click="go('/weldManage')"/>MMA SET UP</div>
    <div class="setlist">
        <div v-for="(item,index) in setlist" class="li" :key="index">
            <div class="left"> 
                {{item.key}}
            </div>
            <div class="right">
                 {{item.value}}
            </div>
        </div>
    </div>
    <div class="slider current">
      <div>CURRENT(10-200A)</div>
      <Slider v-model="currentNum" show-input :min=10 :max=200></Slider>
    </div>
    <div class="slider push">
      <div>push(0-10)</div>
      <Slider v-model="pushNum" show-input :min=0 :max=10></Slider>
    </div>
    <div class="introduce">
      <p>注：以上提供三种调节方式</p>
      <p>1.可以左右推移</p>
      <p>2.加减号微调</p>
      <p>3.点击数字修改精确调</p>
    </div>
    <div class="subbtn">
          <Button type="primary" long @click="go('/welding')" >焊接</Button>
          <br><br>
          <Button type="info" long @click="go('/memoryManage')">保存焊接参数</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  components: {
   
  },
  data () {
    return {
       currentNum: 90,//电流
       pushNum:5,//推力
      setlist:[{key:'POLATRITY',value:'AC'},{key:'ELECTRODE',value:'60XX'},{key:'DIAMETER',value:'2.5MM'},{key:'THICKNESS',value:'0.6MM'}]
     } 
  },

  methods: {
       go(url){
          this.$router.push(url);
        }
  },
  mounted: function () {
    
  },
  created () {
   
  },
  computed:{
       
  }
}
</script>
<style lang="scss" scoped>
.mmaSet{
  width: 100%;
  .header{
    position: relative;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    text-align: left;
    color: #fff;
    background: #333;
    padding-left: 60px;
    .ivu-icon{
      font-size: 20px;
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translate(0,-50%)
    }
  }
  .setlist{
      margin: 0 20px;
      margin-top: 10px;
      font-size: 14px;
      padding-bottom: 15px;
      border-bottom: 1px solid #999;
      .li{
          height: 30px;
          line-height: 30px;
          .left{
              width: 50%;
              float: left;
              
          }
          .right{
              width: 50%;
              float: left;
              text-align: right;
          }
      }
  }
  .slider{
    padding: 0 20px;
    margin-top: 20px;
  }
  .introduce{
    padding: 0 20px;
    margin-top: 10px;
    line-height: 20px;
  }
  .subbtn{
    margin-top: 20px;
    padding: 0 20px;
  }
}
</style>