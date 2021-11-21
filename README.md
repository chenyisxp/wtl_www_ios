#此项目使用说明

1. 确保安装了nodejs，以及版本"node": ">= 4.0.0", "npm": ">= 3.0.0"
2. 在终端里运行如下步骤
```
	cd 项目地址
```
```
	npm install --registry=https://registry.npm.taobao.org
```
3. 运行下面命令启动项目
```
	npm run start
```
* 注意终端里的端口提示，新版模板采用了自动寻找端口功能，端口由8080叠加

4. 运行下面命令打包项目
```
	npm run build

```
5.打包后的文件在dist目录下 想dist目录的内容上传到服务器即可(测试阶段上传到10.139.34.219堡垒机上 D:\edtrade\www_etrade下)
```
	npm run build

```




开发顺手：
1、所有开发在src目录下
2、	pages：页面

	compnents:公用组件

	router:路由配置

	新增页面：首先在pages里加页面文件 --->  在router下去配置路由

3、本项目引入mint-ui组建库 文档查阅：http://mint-ui.github.io/docs/#/zh-cn2

4、小程序开发 需引入weixin-js-sdk 用于小程序必须的部分初始化操作
```
    npm install weixin-js-sdk --save-dev
```


######## 威特力焊机项目 begin ########
1|引用了ivew的手机端样式控件
	npm install iview --save
2|前往 焊接中....页面的时机  welding
  a、当首页点击后 ，byte0里是焊接中的状态。前往
  b、可以返回到编辑页
  c、焊接中那些参数可以调？
  		mig里是送丝速度和电压
		tig里是电流
		mma里是电流和force电弧推力
    ？？会出现选择了和当前焊接模式不同的数据？？
	 0.5s会上发一次，焊接中的状态...电流、电压
3|首页逻辑需要修正
  a、点击后判断当前的是否焊接中...--第一次收到需要判断用户当前操作的模式对不对，不对切换 ，第一次收到直接跳转
  b、是前往焊接中页面，同时会返回当前模式的数据;
  c、焊接中只能在当前焊接模式下编辑和查阅，不能切换模式，也不能修改太多的参数
  d、TODO:焊接中返回到每个模式编辑页中，只有部分参数可以被编辑
  e、TODO:在每个编辑页中逗留五秒未操作就自动前往焊接中的页面...
4、焊接中的状态
   a、模式里参数不能改
   b、历史和存储的数据不能应用
5、蓝牙模块逻辑
	a、显示上次连接的蓝牙
	b、扫描加载更多
	c、扫描more
	d、怎么修改呢？？？在首页。。
	e、目前有三种扫描状态：0、1、2
6、接收、下发
	a、时间间隔1400ms,次数5次  安卓中配置

7、关于首页的逻辑梳理
	a、点击选择蓝牙后跳转至本页面
	b、编辑页返回至本页面
		---常规编辑页
		---焊接中的编辑页
	c、初始化 默认选中一个c位模式 不触发请求蓝牙
	d、焊接状态：
		---焊接中：
		    i.点击选择非当前焊接模式则提示warning,可切换，存储和历史可查看不能应用
		   ii.点击同一个模式，不需要重新发请求了，机器会一直上发。
		  iii.如果,有上发焊接中状态和电压、电流，且五秒内没有操作界面前往welding页
		---非焊接中：
		   点击选择模式出现loading,所有流程都可通行
8、全局控制参数及日志设计
	a、定时器时间
	b、开启开关(日志，测试等)
	c、深度日志设计改造(console,alert):
		---wtlLog:info、error
9、蓝牙细致控制
    a、点击选择的话，关闭蓝牙连接，重新连接
	b、否则回到首页不发起，连接操作，可以获取连接状态
######## 威特力焊机项目 end   #######
打包注意：
	1、各种开关
	2、router.index.js:默认的路由路径
20190301
	a、tig_man模式中:
		//关闭 折线动图
		// this.drawCharMainContrl(this.nowModelTypeName);
		//关闭重新赋值
		// this.keysChangelistMap(list);
		推荐值修正成正负10 调整为9
	b、关于高低位调整如89字节，8存的是低位9是高位，数据解析已经修正应该是先转成2进制
		69 01000101 则高位是：0101 低位：0100 组成一组：89字节数据即 0405
		通用方法：jinzhiChangeFuc
	c、新增安卓通用sharepreferences存储模式
		queryKeyStorage
		saveKeyStorage
	d、mma tig 中整数变量不需要小数点 --取消监听 和特殊处理
	e、上传了不是当前选中的模式的话，返回，页面不再跳转
	f、tig_man模式增加 记忆之前修改的参数key
	g|在memorymanage和savemanage页 把self.$store.state.nowModelDirectice='';//置空要不然utils中builddata的逻辑会return，造成不及时的数据
	i、 savedetail中
		// this.nowModalTypeId=this.$route.query.nowModalTypeId;//主页中的id
    	this.nowModalTypeId=this.$store.state.nowModalTypeId;//主页中的id
20190324
	a、图标替换
	b、弹层图标替换
20190325
   a、首页修改 man和syn合并成一个页面上
20190425
	1、thinckness除了util里维护，每个用到的模式里也有自己的一个数组
	2、thinkness 选择值没对应  self.nowTouchIndex =self.rulerNumAtr[i].id; 应该用真实值之前是用循环的index 导致数值不对应
20190426
	关于直径
	mig 焊丝直径
	tig 钨棒直径
	mma 焊条直径
20190525
  mma
  焊条直径只有 2.5 3.2 4.0
  增加两个字节 板厚限制
  板厚显示值不对应(板厚值就没传...)
// 20190623 比较大的改动主调这两个不知道会不会有影响 newindex
		// this.$store.state.memoryInfo ={};//清空
		// this.$store.state.rstInfo={};

20190720
注意用hc-8调试蓝牙，扫描出地址后要想看到除规定名称的蓝牙外。
需在blueToothManage把more 开关打开
######## 威特力焊机项目 end   #######
######## 威特力焊机项目_IOS begin   #######
逻辑抽取到html5中：
1、发送蓝牙数据，注意超出长度的数据分段传输;
2、发送失败时的重发机制，成功后的去除数据;
3、数据16进制转换；
4、数据收发的正确性校验，去重，检查是否需要重发；
5、获取蓝牙名字，过滤；
6、检查是否需要重发->是否超出总的重发次数->是否大于四百ms->更新时间戳->更新重发次数->重发给蓝牙消息
7、通用蓝牙返回数据处理格式
######## 威特力焊机项目_IOS end   #######
2021-11-16 21:52
四合一如何记录焊接数据。
五合一的在返回机器信息时，把机器信息进行采集。焊接结束后会采集。

self.theWebView!.evaluateJavaScript("iosBleDataLayoutFuc('\([UInt8](data))')",
//                                       completionHandler: nil)
//            20211010 modbus协议改造支持
self.theWebView!.evaluateJavaScript("iosModbusBleDataLayoutFuc('\([UInt8](data))')",
completionHandler: nil)


 //原来安卓里处理的逻辑（废弃）
//     commonBleRespData(bleRespInfo.replaceAll(" ", "").toUpperCase());
     //modbus
     Log.i("=============", bleRespInfo);
     mWebView.post(new Runnable() {
         @Override
         public void run() {
          mWebView.loadUrl("javascript:modbusBroastFromApp('" + bleRespInfo.replaceAll(" ", "").toUpperCase() +"')");
         
     }});