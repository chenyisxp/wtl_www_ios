<template>
  <div class="appLoad">
    <!-- <div class="modal" :class="{'mhid':mhidFlag}">

    </div> -->
    <!-- :class="{'hid':hidFlag}" -->
   <!-- <div class="video hid" >
        <video id="myAudio" @onended="handleOnended"  preload='auto' muted=“muted” src="../assets/video/app_open_h24.mp4"  autoplay="autoplay"  width='100%' height='100%'>
        <source src="../assets/video/app_open_h24.mp4" type="video/mp4" />
        loading...</video>
   </div> -->
  </div>
</template>

<script>
import { MessageBox ,Popup,Toast ,Indicator } from 'mint-ui'
export default {
  name: 'appLoad',
  components: {
   
  },
  data () {
    return {
      hidFlag:true,
      hidTimer:{},
      goTimer:{},
      mhidFlag:false
     } 
  },

  methods: {
    handleOnended(){
      alert(11)
    }
  },
  mounted: function () {
     Toast({
                message: 'mounted!',
                position: 'middle',
                iconClass: 'icon icon-success',
                duration: 1000
            });
            document.getElementById('myAudio').play(); 
    setTimeout(() => {
       Toast({
              message: '走!',
              position: 'middle',
              iconClass: 'icon icon-success',
              duration: 1000
          });
      // this.$router.push({path:'/newIndex',query:{}});
    }, 3000);
    // var aud = document.getElementById("myAudio");
    // aud.onended = ()=>{
    //     //跳走
    //     this.$router.push({path:'/newIndex',query:{}});
    // };
    // this.hidTimer = setTimeout(() => {
    //   this.hidFlag=true;
    // }, 110);
//    this.goTimer = setTimeout(() => {
//         this.$router.push({path:'/newIndex',query:{}});
//     }, 4210);
  },
  created () {
   
  },
  computed:{
       
  },destroyed(){
    //   alert(11)
      console.log('ooout');
      clearTimeout(this.hidTimer)
      clearTimeout(this.goTimer)
  }
}
</script>

<style  scoped>
.appLoad{background: #007196;width: 100%;position: relative;height: 100vh;}

.video{
    position: absolute;
    left: 1000px;
}
.video.hid{
  opacity: 1;
  left: 0;
}
.modal{
    z-index: 100;
    height: 100vh;
    width: 100%;
    background: red;
}
.modal.mhid{
    display: none;
}
</style>
