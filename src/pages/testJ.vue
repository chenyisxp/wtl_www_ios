<template>
    <div class="testPage">
        <div @click="handleOn()">11{{value}}</div>
        <input v-model="value">
        <ul>
            <li v-for="item in 5" :key="item">{{item}}</li>
        </ul>
        <div v-if="value==1">我是1</div>
        <div v-if="value==2">我是2</div>
    </div>
</template>

<script>
import { Indicator,Toast } from 'mint-ui'
export default {
  data() {
    return {
     value:''
    };
  },
  methods: {
    doCrcCheck(){
        // alert(this.crcModelBusClacQuery('12 34 56 78'));
    }  ,
    go(url){
       this.$router.push(url);
    },
    gogo(){
        this.go('/weld_mma?type='+'MMA');
    },
    handleOn(){
        Toast("11")
    }
  },
  mounted() {
   
  },created () {
   
  
  }
};
</script>

<style lang="scss" scoped>
.testPage{
    height: 100vh;
    background: #fff !important;
    color: #333;
}
</style>

