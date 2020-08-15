<template>
  <div class="mSalary-modal">
    <div class="close-btn"><span>关闭</span></div>
    <table>
        <tbody>
          <tr class="fs14 ftwet">
          基本信息
          </tr>
          <tr>
            <td class="t-name">姓名</td>
            <td class="t-msg ffColor">xxxx</td>
          </tr>
          <tr>
            <td class="t-name">公司</td>
            <td class="t-msg">xxx</td>
            <td class="t-name">薪资职级</td>
            <td class="t-msg">xxxxx</td>
          </tr>
          <tr>
            <td class="t-name">部门</td>
            <td class="t-msg">xxx</td>
            <td class="t-name">身份证号</td>
            <td class="t-msg">xxxxx</td>
          </tr>
          <tr class="midLine">
            <td class="txLeft fs14" >薪资明细</td>
            <td class="eeColor">单位：元</td>
          </tr>
          <tr>
            <td class="t-name">基本工资</td>
            <td class="t-msg ffColor">10000.00</td>
            <td class="t-name">社保个人部分</td>
            <td class="t-msg">xxxxx</td>
          </tr>
          <tr>
            <td class="t-name">调整前工资</td>
            <td class="t-msg">xxx</td>
            <td class="t-name">社保个人补缴</td>
            <td class="t-msg">xxxxx</td>
          </tr>
          <tr>
            <td class="t-name">餐补</td>
            <td class="t-msg">xxx</td>
            <td class="t-name">公积金个人部分</td>
            <td class="t-msg">xxxxx</td>
          </tr>
          <tr>
            <td class="t-name">异地调遣津贴</td>
            <td class="t-msg">xxx</td>
            <td class="t-name">公积金个人补缴</td>
            <td class="t-msg">xxxxx</td>
          </tr>
           <tr>
            <td class="t-name">值班费</td>
            <td class="t-msg">xxx</td>
            <td class="t-name">补充公积金个人</td>
            <td class="t-msg">xxxxx</td>
          </tr>
          <tr>
            <td class="t-name">其他补款</td>
            <td class="t-msg">xxx</td>
            <td class="t-name">奖金/福利</td>
            <td class="t-msg">xxxxx</td>
          </tr>
          <tr>
            <td class="t-name">事假/旷工扣款</td>
            <td class="t-msg">xxx</td>
            <td class="t-name">应税收入</td>
            <td class="t-msg">xxxxx</td>
          </tr>
          <tr>
            <td class="t-name">病假扣款</td>
            <td class="t-msg">-</td>
            <td class="t-name">个人所得税</td>
            <td class="t-msg">-</td>
          </tr>
          <tr>
            <td class="t-name">迟到早退扣款</td>
            <td class="t-msg">-</td>
            <td class="t-name">税后调整</td>
            <td class="t-msg">-</td>
          </tr>
          <tr>
            <td class="t-name">其他扣款</td>
            <td class="t-msg">-</td>
            <td class="t-name">工会费</td>
            <td class="t-msg">-</td>
          </tr>
          <tr>
            <td class="t-name">应付工资</td>
            <td class="t-msg">xxxxxxxxx</td>
            <td class="t-name">实发工资</td>
            <td class="t-msg">xxxx</td>
          </tr>
        </tbody>
    </table>
    <div class="footer-btns">
        <div class="f-contain">
          <span class="left"><上一个</span>
          <span class="right">下一个></span>
        </div>
    </div>
  </div>
</template>

<script>
//引入远程访问service
import { InterfaceService } from '../lib/service'
import { MessageBox ,Popup,Toast ,Indicator } from 'mint-ui'
export default {
  name: 'register',
  components: {
   MessageBox
  },
  data () {
    return {
      // featurePopupResultBean:{contentText:'<span style="color:red">1111</span><img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2200166214,500725521&fm=27&gp=0.jpg">',routeId:'goIndex|goIndex',displayType:"2",buttonText:"前往左边|前往右边",imgUrl:'http://120.55.176.236/greenlandfs_admin/attachGet?path=/productFile/popupAttach/20170106193704827/wechat_20170106_01.png'},//弹层bean
      featurePopupResultBean:{},//弹层bean
      mobilePhone:'',
      countDown:'',
      countDownFlag:false,
      phoneCode:'',
      phoneCodeLimit:false,//60秒倒计时是否结束
      timer:null,//定时器
      show:true,
      shareId:this.$route.query.shareId, //是否来自分享链接点击注册
      pageFrom:this.$route.query.pageFrom,//来自那里，准备跳往那里
      returnmsg:'未取值',
      hidFlag:true,
     } 
  },

  methods: {
    testAndroidset(){
      var aa=  window.android.setSettingInfo("unit","MM");
      Toast({
            message: '成功!'+aa,
            position: 'middle',
            iconClass: 'icon icon-success',
            duration: 2500
        });
    },
    testAndroidget(){
      var aa=  window.android.getSettingInfo("unit");
      Toast({
            message: '成功!'+aa,
            position: 'middle',
            iconClass: 'icon icon-success',
            duration: 2500
        });
    },
    testSqliteset(){
      //设值
       var aa=  window.android.testSqliteset("chenyi",10);
    },
    testSqliteget(){
      //取值
       var aa=  window.android.testSqliteget();
       this.returnmsg=aa;
      Toast({
            message: '成功!npm'+aa,
            position: 'middle',
            iconClass: 'icon icon-success',
            duration: 2500
        });
    },
    //更新
    testSqliteupdate(){
      window.android.testSqliteupdate();
    },
     //删除
    testSqlitedelete(){
      window.android.testSqlitedelete();
    }
  },
  mounted: function () {
    this.wtlLog('hahha','testpage');
    setTimeout(() => {
      this.hidFlag=false;
    }, 210);
  },
  created () {
   
  },
  computed:{
       
  }
}
</script>

<style scoped>
.mSalary-modal .close-btn{
  height: 20px;
  font-size: 14px;
  text-align: right;
  color: #148afb;
  cursor: pointer;
}
.mSalary-modal table tr td{
  border: 1px solid #333;
  text-align: right;
  padding-right: 6px;
}
.mSalary-modal table tr{
  font-size: 13px;
  height: 30px;
  line-height: 30px;
}
.mSalary-modal table{
  width: 100%;
}
.mSalary-modal{
  background: #fff;
  width: 700px;
  padding: 15px 35px;
}
.mSalary-modal .bnn{
  border: none;
}
.mSalary-modal table tr td:nth-child(1){
  background: #f2f2f2;
  min-width: 55px;
  font-weight: bold;
}
.mSalary-modal table tr td:nth-child(2){
  border-right: 2px solid #333;
  min-width: 75px;
  
}
.mSalary-modal table tr td:nth-child(3){
  background: #f2f2f2;
  min-width: 55px;
  font-weight: bold;
}
.mSalary-modal table tr td:nth-child(4){
  min-width: 75px;

}
.mSalary-modal .midLine {
  height:50px;
 
}
.mSalary-modal .midLine  td{
  border:none;
  border-right:none !important;
  background: #fff !important;
  padding-top: 20px;
}
.mSalary-modal .txLeft{
  text-align: left;
}
.mSalary-modal .eeColor{
  color: #999999;
}
.mSalary-modal .ffColor{
  color: #50c35f;
}
.mSalary-modal .fs14{
  font-size: 14px;
}
.mSalary-modal .ftwet{
  font-weight: bold;
}
.mSalary-modal .footer-btns{
  font-size: 14px;
  height: 75px;
  line-height: 75px;
  text-align: center;
}
.mSalary-modal .footer-btns .left{
  padding-right: 20px;
  cursor: pointer;
}
.mSalary-modal .footer-btns .right{
  padding-left: 20px;
  color: #148afb;
  cursor: pointer;
}
</style>
