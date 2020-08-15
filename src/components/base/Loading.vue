<template>
  <div class='loading-container' :class="{'loading visible':isLoading}">
    <!-- <div class="loading">
      <div class="loading-inner"></div>
      <div class="loading-outer"></div>
    </div> -->
  </div>
</template>

<script>
import { Indicator } from 'mint-ui'
export default {
  props: ['isLoading'],
  data () {
    return {
       innerTimer:{}//内部定时器
    }
  },mounted(){
      if(this._props.isLoading){
           Indicator.open({
                text: 'waiting.....',
                spinnerType: 'fading-circle'
        });
     
      }else{
         
          Indicator.close();
      }
    console.log('_this._props;'+JSON.stringify(this._props))
      
  },
  updated () {
        if(this._props.isLoading){
            Indicator.open({
                    text: 'waiting.....',
                    spinnerType: 'fading-circle'
            });
           
        }else{
            
            Indicator.close();
        }
    }
}
</script>

<style scoped>
    .loading-container {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 99999;
        width: 100%;
        height: 100%;
        -webkit-transition: .2s opacity linear;
        transition: .2s opacity linear;
        visibility: hidden;
        opacity: 0;
        background-color: rgba(0,0,0,.2);
    }
    .loading-container .loading {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 85px;
        height: 85px;
        margin-top: -42px;
        margin-left: -42px;
        padding: 20px;
        border-radius: 5px;
        /* background-color: #fff; */
        color: #fff;
        text-align: center;
        text-overflow: ellipsis;
        font-size: 15px;
       /*  box-shadow: 1px 0 6px rgba(0,0,0,0.1),-1px 0 6px rgba(0,0,0,0.1),0 1px 6px rgba(0,0,0,0.1),0 -1px 6px rgba(0,0,0,0.1); */
    }
    .loading-inner {
        position: absolute;
        top: 26px;
        left: 25px;
        width: 35px;
        height: 30px;
        /* background-image: url(../../assets/images/loading_inner.png); */
        -webkit-background-size: contain;
        background-size: contain;
    }

    .loading-outer {
        position: absolute;
        top: 15px;
        left: 13px;
        width: 58px;
        height: 58px;
        /* background-image: url(../../assets/images/loading_outer.png); */
        -webkit-background-size: contain;
        background-size: contain;
        animation: roller 1s linear infinite;
        -webkit-animation: roller 1s linear infinite;
    }

    .loading-container.visible {
        visibility: visible;
    }

    .loading-container.loading {
        opacity: 1;
        background-color: rgba(0,0,0,.2);
    }
    .loading-container .loading-outer {
        animation-play-state: paused;
        -webkit-animation-play-state: paused;
    }
    .loading-container.loading .loading-outer {
        animation: roller 1s linear infinite;
        -webkit-animation: roller 1s linear infinite;
        animation-play-state: running;
        -webkit-animation-play-state: running;
    }

    @-webkit-keyframes roller {
        from { -webkit-transform: rotate(0deg); }
        to { -webkit-transform: rotate(360deg); }
    }
    @keyframes roller {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
</style>
