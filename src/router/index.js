import Vue from 'vue'
import Router from 'vue-router'
import Weld_mma from '@/pages/weld/weld_mma'
import Welding from '@/pages/weld/welding'
import MemoryManage from '@/pages/memory/memoryManage'
import HisWeldList from '@/pages/historyWeld/hisWeldList'
import HisWeldInfo from '@/pages/historyWeld/hisWeldInfo'
import Weld_common from '@/pages/weld/weld_common'
import NewIndex from '@/pages/newIndex';
import LoadApp from '@/pages/loadApp.vue';
import Login from '@/pages/userCenter/login';
import Register from '@/pages/userCenter/register';
import BeforeRegister from '@/pages/userCenter/beforeRegister';
import ForgotPassword from '@/pages/userCenter/forgotPassword';

import store from '../store/index'
Vue.use(Router)
const router = new Router({
	routes: [
		{ //测试页
			path: '/testPage',
			name: 'testPage',
			meta:{index:1000},
			component: resolve => require(['@/pages/testPage.vue'],resolve)
		},
		{ //焊接 模式MMA
			path: '/weld_mma',
			name: 'weld_mma',
			meta:{index:3},
			component: Weld_mma
		},
		{ //焊接页面 焊接中....
			path: '/welding',
			name: 'welding',
			meta:{index:55},
			component: Welding
		},{ //焊接页面 存储....
			path: '/memoryManage',
			name: 'memoryManage',
			meta:{index:6},
			component: MemoryManage
		},{ //焊接历史
			path: '/hisWeldList',
			name: 'hisWeldList',
			meta:{index:7},
			component: HisWeldList
		},{ //焊接历史 单条记录
			path: '/hisWeldInfo',
			name: 'hisWeldInfo',
			meta:{index:8},
			component: HisWeldInfo
		},
		{ //通用焊接参数初始页
			path: '/weld_common',
			name: 'weld_common',
			meta:{index:10},
			component:  resolve => require(['@/pages/weld/weld_common.vue'],resolve)
		},
		{ //新首页
			path: '/newIndex',
			name: 'newIndex',
			meta:{index:12},
			component: NewIndex
		},{ //蓝牙管理页面
			path: '/blueToothManage',
			name: 'blueToothManage',
			meta:{index:15},
			component: resolve => require(['@/pages/blueToothManage.vue'],resolve)
		},{ //存储详情
			path: '/memoryDetail',
			name: 'memoryDetail',
			meta:{index:16},
			component: resolve => require(['@/pages/memory/memoryDetail.vue'],resolve)
		},{ //TIGMAm模式
			path: '/weld_tig_man',
			name: 'weld_tig_man',
			meta:{index:17},
			component: resolve => require(['@/pages/weld/weld_tig_man.vue'],resolve)
		},{ //TIGM his memory
			path: '/weld_tig_man_his',
			name: 'weld_tig_man_his',
			meta:{index:24},
			component: resolve => require(['@/pages/weld/weld_tig_man_his.vue'],resolve)
		},{ //TIGsyn模式
			path: '/weld_tig_syn',
			name: 'weld_tig_syn',
			meta:{index:18},
			component: resolve => require(['@/pages/weld/weld_tig_syn.vue'],resolve)
		},{ //点击savee去的存储列表
			path: '/saveManage',
			name: 'saveManage',
			meta:{index:19},
			component: resolve => require(['@/pages/save/saveManage.vue'],resolve)
		},{ //点击save去的存储详情
			path: '/saveDetail',
			name: 'saveDetail',
			meta:{index:20},
			component: resolve => require(['@/pages/save/saveDetail.vue'],resolve)
		},
		{ //开发者设置页面
			path: '/develeperManage',
			name: 'develeperManage',
			meta:{index:200},
			component: resolve => require(['@/pages/setting/develeperManage.vue'],resolve)
		},{ //setting
			path: '/setmanage',
			name: 'setmanage',
			meta:{index:21},
			component: resolve => require(['@/pages/setting/setmanage.vue'],resolve)
		},{ 
			path: '/modelList',
			name: 'modelList',
			meta:{index:22},
			component: resolve => require(['@/pages/experiential/modelList.vue'],resolve)
		},{ 
			path: '/loadApp',
			name: 'loadApp',
			meta:{index:23},
			component:LoadApp
		},{ 
			path: '/login',
			name: 'login',
			meta:{index:24},
			component:Login
		},
		{ 
			path: '/register',
			name: 'register',
			meta:{index:24},
			component:Register
		},
		{ 
			path: '/beforeRegister',
			name: 'beforeRegister',
			meta:{index:24},
			component:BeforeRegister
		},
		{ 
			path: '/forgotPassword',
			name: 'forgotPassword',
			meta:{index:24},
			component:ForgotPassword
		},
		{
			path: '*',
			component:Register
			// component:NewIndex
			// component: LoadApp
			// component: resolve => require(['@/pages/testPage.vue'],resolve)
			// component:resolve => require(['@/pages/test07.vue'],resolve)//测试接收数据处理结果
			// component:resolve => require(['@/pages/setting/setmanage.vue'],resolve)
			// component:resolve => require(['@/pages/memory/memoryManage.vue'],resolve)
			// component:resolve => require(['@/pages/blueToothManage.vue'],resolve)
			// component:resolve => require(['@/pages/weld/welding.vue'],resolve)
			// component:resolve => require(['@/pages/weld/weld_tig_man.vue'],resolve)
			// component:resolve => require(['@/pages/testJ.vue'],resolve)
		}
	]
})
const normalPath = ['/login','/register','/beforeRegister','/forgotPassword','/develeperManage','/blueToothManage','/testPage','/setmanage','/newIndex','/modelList','loadApp']; //不需要蓝牙的页面
const normalPathStr = normalPath.join('') && (normalPath.join('')).toLocaleLowerCase();
const parentRouter =['/newIndex','/saveManage','/hisWeldList','/memoryManage'];
const parentRouterSrt =parentRouter.join('') && (parentRouter.join('')).toLocaleLowerCase();
router.beforeEach((to, from, next) => {
	//当前的路由
	store.state.nowRouter=to.path;
	store.state.routerOpreteTo=to.path;
    store.state.routerOpreteFrom=from.path;
	// alert(to.path+'||'+from.path);
	if(normalPathStr.indexOf(to.path && (to.path).toLocaleLowerCase()) > -1){//不需要蓝牙连接的页面
		// alert('kk')
		store.state.routerOprete='';
		next();
	}else{
		//  alert(store.state.getConnectStatus+'||')
		if(store.state.getConnectStatus=='connected'){
			//1、方案一：有值主动前往不是返回键
			// if(parentRouterSrt.indexOf(from.path && (from.path).toLocaleLowerCase()) > -1){
			// 	if(store.state.routerOprete){
			// 		store.state.routerOprete='';
			// 		next();
			// 	}
			// }else{
			// 	store.state.routerOprete='';
			// 	next();
			// }
			//2、方案二：
			// if(from.path=='/newIndex'){
			// 	if(store.state.routerOprete){
			// 		store.state.routerOprete='';
			// 		next();
			// 	}
			// }else if(from.path=='/memoryManage'){
			// 	// alert(11)
			// 	if(!store.state.routerOprete){//前往首页
			// 		// alert(store.state.routerOprete)
			// 		store.state.routerOprete=100;
			// 		next({ path: '/newIndex' });
			// 	}else{
			// 		// alert(store.state.routerOprete)
			// 		store.state.routerOprete='';
			// 		next();
			// 	}
			// }
			// else{
			// 	store.state.routerOprete='';
				// next();
			// }
			//方案三：
			// if(from.path=='/blueToothManage'){
			// 	if(store.state.routerOprete){
			// 		store.state.routerOprete='';
			// 		next();
			// 	}
			// }else if(from.path=='/newIndex'){
			// 	// alert(store.state.routerOprete);				
			// 	if(store.state.routerOprete){
			// 		store.state.routerOprete='';
			// 		next();
			// 	}
			// }else{
				next();
			// }
		}else{
			// Toast({
			// 	message: 'blueToothManaged'+store.state.getConnectStatus,
			// 	position: 'middle',
			// 	iconClass: 'icon icon-success',
			// 	duration: 1500
			// });
			store.state.routerOprete='';
			//前往蓝牙连接页
			next({ path: '/blueToothManage' });
		}
	}
	
	window.scrollTo(0, 0)
});

export default router;

