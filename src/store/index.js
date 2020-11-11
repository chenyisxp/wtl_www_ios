import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
// state (类似存储全局变量的数据)
// getters (提供用来获取state数据的方法)
// actions (提供跟后台接口打交道的方法，并调用mutations提供的方法)
// mutations (提供存储设置state数据的方法)
const state = {
    havedClickPage:false,//页面点击
    oldBroastData:'',//旧的广播参数
    nowModalTypeId:'',//当前模式id全局存储，每个页面也有相同的变量
    nowModelDirectice:'',//当前数据焊接指令
    routerOpreteTo:'',
    routerOpreteFrom:'',
    routerOprete:'',//是否是主动前往的 操作类型
    AdroidOldMsg:'',
    AdroidNewMsg:'',
    nowRouter:'',
    globalGetConnectStatus:{},//全局定时器 
    getConnectStatus:'',//获取连接状态
    weldingStatus:0,//0不是在焊接中 1是
    getWeldingInfoTimes:0,//收到数据的次数
    weldingCur:'',//焊接中的电流
    weldingVoltage:'',//焊接中的电压
    weldingInfo:{},//焊接中这个对象
    weldingDelay:false,//8秒没上传 跳走
    nowConnectMachine:'',
    nowConnectAddress:'',
    rstInfo:{},//存储不同模式里解析后的值
    memoryInfo:{},//存储不同模式memory里解析后的值
    allowBack:true,
    hasPoup:true,
    isLogin: 0,
    LoginedUser:{
        'custId':'',
        'custName':'',
        'custType':'',
        'corName':'',
        'deptCode':'',
        'deptName':'',
        'userCode':'',
        'userMobile':'',
        'userName':'',
        'wxUuid':'',
        'headImage':''
    },
    purchasList:[],
    envType:'',//当前环境
    nowPageFrom:'',
    updateBlelistDB:[],//蓝牙连接或则重命名的数据
    tigManChooseLineKey:'',
    callMemoryRemarks:[],
    rizhiList:[],
    rizhiListFlag:true,
    saveManagePageTo:'',
    saveManagePageToName:'',
    testModalDoorFlag:false
}

const mutations = {
    changeLogin(state,status){
        // 然后去sessionStorage取用户数据
        if(status=='1'){
            let user = JSON.parse(sessionStorage.getItem('user'))
            console.log(user)
            // 再把用户数据发下去
            state.isLogin = user.isLogin;
            state.LoginedUser.custId = user.custId
            state.LoginedUser.custName = user.custName
            state.LoginedUser.custType = user.custType
        }
    },

    changePurchase(state,purchasList){
        state.purchasList = purchasList
    }
}

const actions = {
    loginAction({commit},status){
        console.log('8888888'+status)
        console.log(JSON.parse(sessionStorage.getItem('user')))
        commit('changeLogin',status);
    },

    purchaseAction({commit},purchasList){
        console.dir(purchasList)
        commit('changePurchase',purchasList);
    }
}

export default new Vuex.Store({
    state,
    actions,
    mutations
})