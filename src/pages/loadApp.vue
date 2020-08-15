<template>
  <div class="appLoad">
    <!-- <div class="modal" :class="{'mhid':mhidFlag}">

    </div> -->
   <div class="video" :class="{'hid':hidFlag}">
       <!-- <video   preload='auto' muted=“muted” src="../assets/video/app_video.mp4"  autoplay="autoplay"  width='100%' height='100%'> -->
        <!-- <source src="../assets/video/app_video.mp4" type="video/mp4" />
        loading... -->
        <!-- </video> -->
   </div>
  </div>
</template>

<script>
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
    
  },
  mounted: function () {
    this.hidTimer = setTimeout(() => {
      this.hidFlag=true;
    }, 110);
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
