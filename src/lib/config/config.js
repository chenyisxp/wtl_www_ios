

// const ROOT_URL = 'http://bozhi.greenlandfs.com';//http://47.98.83.29';
// const ROOT_URL = 'http://10.105.113.211:11001';//永刚本地ip
// const ROOT_URL = 'http://10.105.113.212:11001';//赛老板本地ip
// const ROOT_URL = 'http://10.105.113.212:11001';//赛老板本地ip

let BASE_CONFIG = {
   ONLY_CONNECT_STATUS_TOAST:false,
   DEVELOPERMODEFLAG:false,//开发者模式本地完全不和安卓交互
   LOGFLAG:false,
   TESTFLAG : false,//测试开关
   TESTDEEPTH:0,//深度
   autoRouterTime:5000,//自动前往焊接中页面的时间：ms
   scaningDuring:15000,//扫描时间
   ENV_IOS_FLAG : true,//ios安卓环境
   DirectStart:'DA',
   callWeldTypeData:{//注意utils中有独立crccode注意一起改
       migsyn:{data:'100000',crcCode:'0570',name:'MIG SYN',modelKey:'MIGSYN',url:'/weld_common?type=MIGSYN',newIndex:0},
       migman:{data:'100100',crcCode:'9571',name:'MIG MAN',modelKey:'MIGMAN',url:'/weld_common?type=MIGMAN',newIndex:1},
       tigsyn:{data:'100200',crcCode:'6571',name:'TIG SYN',modelKey:'TIGSYN',url:'/weld_tig_syn',newIndex:2},
       tigman:{data:'100300',crcCode:'F570',name:'TIG MAN',modelKey:'TIGMAN',url:'/weld_tig_man',newIndex:3},
          mma:{data:'100400',crcCode:'C572',name:'MMA',modelKey:'MMA',url:'/weld_mma',newIndex:4}
   },
   testData:{
        //1、常规的模拟
        // migsyn:{heade:'dae',headm:'dad',headc:'dac',data:'1 00 00 00 00 02 00 3C00 3D00 b400 c800 02 09 2E77'},
        // migsyn:{heade:'dae',headm:'dad',headc:'dac',data:'1 02 04 01 04 0a a5 4600 4600 f000 f000 020a ae3c1'},//板厚异常
        migsyn:{heade:'dae',headm:'dad',headc:'dac',data:'1 82 04 01 04 05 35 2800 2800 c800 c800 020a 204c'},//diameter异常
        migsyn:{heade:'dae',headm:'dad',headc:'dac',data:'1 4A 00 01 03 03 A3 2700 3A00 A000 A000 020C 1FDB'},//安卓5.1.1 抖动
        // migman:{heade:'dae',headm:'dad',headc:'dac',data:'2 00 3D00 c800 00 3535'},
        // tigsyn:{heade:'dae',headm:'dad',headc:'dac',data:'3 00 00 03 6400 6400 02 09  2C61'},
        // tigman:{heade:'dae',headm:'dad',headc:'dac',data:'4 00 c0 32 3200 32 3200 3200 e800 32 32 3200 32 50 23 3082'},
        // tigman:{heade:'dae',headm:'dad',headc:'dac',data:'442063A0F004F15000F000A00050052000A320F4A13'},
        // tigman:{heade:'dae',headm:'dad',headc:'dac',data:'44202041e004f690069000a0005001e001e32ff4f1'},
        //tigman新规则
        // tigman:{heade:'dae',headm:'dad',headc:'dac',data:'4 42 02 04  1100 D923'},//模拟04线条
        // tigman:{heade:'dae',headm:'dad',headc:'dac',data:'4 42 02 08  1100 DAE3'},//模拟04线条
        // tigman:{heade:'dae',headm:'dad',headc:'dac',data:'4 42 08 0b 32 00 3209'},//问题
        // tigman:{heade:'dae',headm:'dad',headc:'dac',data:'4 42 0d 04 42 00 3d1c'},//问题
        // tigman:{heade:'dae',headm:'dad',headc:'dac',data:'4 42 0d 0a 1b 00 ae47'},//post gas问题
        tigman:{heade:'dae',headm:'dad',headc:'dac',data:'4 42 06 02 5f 00 48f7'},//slow up问题

        // mma:{heade:'dae',headm:'dad',headc:'dac',data:'5 82 00 01 09 6400 6400 01 09 8768'},
        // mma:{heade:'dae',headm:'dad',headc:'dac',data:'5 02 00 01 09 6400 6400 01 09 6F6F'},
        // mma:{heade:'dae',headm:'dad',headc:'dac',data:'5 02 10 09 09 aa00 aa00 07 09 6f8e'},
        mma:{heade:'dae',headm:'dad',headc:'dac',data:'5 02 10 09 09 aa00 aa00 07 09 6f8e'},
        //2、焊接准备中的状态 参数模拟       
        // migsyn:{heade:'dae',headm:'dad',headc:'dac',data:'1 40 00 00 00 02 00 3C00 3D00 b400 c800 02 09 DE46'},
        // migman:{heade:'dae',headm:'dad',headc:'dac',data:'2 40 3D00 c800 00 F53B'},
        migman:{heade:'dae',headm:'dad',headc:'dac',data:'2 42 6a00 ac00 03 054e'},
        tigsyn:{heade:'dae',headm:'dad',headc:'dac',data:'3 40 00 03 6400 6400 02 09 50 05  8F81'},
        // tigman:{heade:'dae',headm:'dad',headc:'dac',data:'4 40 c0 32 3200 32 3200 3200 e800 32 32 3200 32 50 23 FF97'},
        // mma:{heade:'dae',headm:'dad',headc:'dac',data:'5 c2 00 01 09 6400 6400 CD99'},
   },
   //焊接中模拟数据
   testWeldingData:{
        migsyn:{data:'dae1 04 00 00 00 02 00 3C00 3D00 b400 c800 02 09 ED75'},
        migman:{data:'dae2 04 3D00 c800 00 B134'},
        tigsyn:{data:'dae3 04 00 03 6400 6400 02 09 50 05 7EC1'},
        tigman:{data:'dae4 04 c0 32 3200 32 3200 3200 e800 32 32 3200 32 50 23 0073'},
        mma:{data:'dae5 04 00 01 09 6400 6400  01 09 708F'}
   },
   callEditDirect:{
       migsyn:{
            mode:'A0',
            material:'A1',
            gas:'A2',
            diameter:'A3',
            thickness:'A4',
            speed:'A5',
            v_welding:'A6',
            getready:'AE',
            memory:'AF'
       },
       migman:{
            mode:'B0',
            speed:'B1',
            v_welding:'B2',
            getready:'BE',
            memory:'BF'
        },
       tigsyn:{
            diameter:'C0',
            material:'C1',
            thickness:'C2',
            polatrity:'C3',
            slowDownTime:'C5',
            mode:'C6',
            getready:'CE',
            memory:'CF'
        },
        tigman:{
            tacdchfpulse:'D0',
            pre_gas_val:'D1',
            start_cur_val:'D2',
            slop_up_val:'D3',
            weld_cur_val:'D4',
            base_cur_val:'D5',
            pulse_fre_val:'D6',
            duty_val:'D7',
            slop_down_val:'D8',
            crater_cur_val:'D9',
            post_gas_val:'DA',
            AC_fre_val:'DB',
            AC_duty_val:'DC',
            getready:'DE',
            memory:'DF'
        },
        mma:{
            acdc:'E0',
            electrode:'E1',
            diameter:'E2',
            thickness:'E3',
            arc_force_val:'E4',
            weld_cur_val:'E5',
            getready:'ED',
            memory:'EF'
        }

   },
   //根据版本号指定不同 最大最小区间值
   initLimitVersion_100:{
       migsyn:{
           min_speed_display:15,
           min_inch_speed_display:60,
           pfc0_max_speed_display:100,
           pfc1_max_speed_display:164,
           pfc0_inch_max_speed_display:400,
           pfc1_inch_max_speed_display:656,
           min_v_welding:100,
           pfc0_max_v_welding:230,
           pfc1_max_v_welding:260,
       },
       migman:{
            min_speed_display:15,
            pfc0_max_speed_display:100,
            pfc1_max_speed_display:164,
            min_inch_speed_display:60,
            pfc0_inch_max_speed_display:400,
            pfc1_inch_max_speed_display:656,
            min_v_welding:100,
            pfc0_max_v_welding:230,
            pfc1_max_v_welding:260,
        },
        tigsyn:{
            min_cur:10,
            max_pfc0_cur:140,
            max_pfc1_cur:200,
        },
        tigman:{

        },
        mma:{
            min_cur:10,
            pfc0_max_cur:110,
            pfc1_max_cur:200
        }
   }

};

export {BASE_CONFIG};