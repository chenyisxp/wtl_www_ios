


const ROOT_URL = 'http://127.0.0.1:3001';//本地
// const ROOT_URL = 'http://47.242.175.65:3001';//sit
// const ROOT_URL = 'http://api.shwtl.net';//sit



let BASE_CONFIG = {
    tenantID:'wtl',//商户号 打包不同app需改动pwd
    ROOT_URL:ROOT_URL,
    // 主服务地址
    SERVICE_ADDRESS : ROOT_URL + '/front/mainactivity',
    liulanqiConnect:true,//浏览器调试的时候 !!!!!!!!!!!
    ONLY_CONNECT_STATUS_TOAST:false,
    DEVELOPERMODEFLAG:false,//开发者模式本地完全不和安卓交互
    LOGFLAG:false,
    TESTFLAG : false,//测试开关
    TESTDEEPTH:0,//深度
    autoRouterTime:5000,//自动前往焊接中页面的时间：ms
    scaningDuring:15000,//扫描时间
    ENV_IOS_FLAG : true,//true:ios、fasle:安卓环境 !!!!!!!!!!!!!!!!!!!!!!!!!!
    DirectStart:'DA',
    callWeldTypeData:{//注意utils中有独立crccode注意一起改
       migsyn:{data:'100000',crcCode:'0570',name:'MIG SYN',modelKey:'MIGSYN',url:'/weld_common?type=MIGSYN',newIndex:0},
       migman:{data:'100100',crcCode:'9571',name:'MIG MAN',modelKey:'MIGMAN',url:'/weld_common?type=MIGMAN',newIndex:1},
       tigsyn:{data:'100200',crcCode:'6571',name:'TIG SYN',modelKey:'TIGSYN',url:'/weld_tig_syn',newIndex:2},
       tigman:{data:'100300',crcCode:'F570',name:'TIG MAN',modelKey:'TIGMAN',url:'/weld_tig_man',newIndex:3},
          mma:{data:'100400',crcCode:'C572',name:'MMA',modelKey:'MMA',url:'/weld_mma',newIndex:4},
          cut:{data:'100500',crcCode:'5573',name:'CUT',modelKey:'CUT',url:'/weld_cut',newIndex:5}
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
        // tigman:{heade:'dae',headm:'dad',headc:'dac',data:'4 42 02 04 1e 00 4f 69 00 69 00 0a 00 05 00 1e 00 1e 32 ff4f1'},
        //tigman新规则
        // tigman:{heade:'dae',headm:'dad',headc:'dac',data:'4 42 02 04  1100 D923'},//模拟04线条
        // tigman:{heade:'dae',headm:'dad',headc:'dac',data:'4 42 02 08  1100 DAE3'}s,//模拟04线条
        // tigman:{heade:'dae',headm:'dad',headc:'dac',data:'4 42 08 0b 32 00 3209'},//问题
        // tigman:{heade:'dae',headm:'dad',headc:'dac',data:'4 42 0d 04 42 00 3d1c'},//问题
        // tigman:{heade:'dae',headm:'dad',headc:'dac',data:'4 42 0d 0a 1b 00 ae47'},//post gas问题
        // tigman:{heade:'dae',headm:'dad',headc:'dac',data:'4 42 06 02 5f 00 48f7'},//slow up问题
        // tigman:{heade:'dae',headm:'dad',headc:'dac',data:'4 42 06 08 5f 00 48f7'},//slow down
        tigman:{heade:'dae',headm:'dad',headc:'dac',data:'4 08 03 03 23 00 63 4e 00 23 00 64 00 05 30 23 00 64 32'},//history
        
        // mma:{heade:'dae',headm:'dad',headc:'dac',data:'5 82 00 01 09 6400 6400 01 09 8768'},
        // mma:{heade:'dae',headm:'dad',headc:'dac',data:'5 02 00 01 09 6400 6400 01 09 6F6F'},
        // mma:{heade:'dae',headm:'dad',headc:'dac',data:'5 02 10 09 09 aa00 aa00 07 09 6f8e'},
        // mma:{heade:'dae',headm:'dad',headc:'dac',data:'5 02 10 09 09 aa00 aa00 07 09 6f8e'},
        mma:{heade:'dae',headm:'dad',headc:'dac',data:'5 4A 00 07 05 5A00 3800 04 07 6134'},//20201028真实焊机上发
        //2、焊接准备中的状态 参数模拟       
        // migsyn:{heade:'dae',headm:'dad',headc:'dac',data:'1 40 00 00 00 02 00 3C00 3D00 b400 c800 02 09 DE46'},
        // migman:{heade:'dae',headm:'dad',headc:'dac',data:'2 40 3D00 c800 00 F53B'},
        // migman:{heade:'dae',headm:'dad',headc:'dac',data:'2 42 6a00 ac00 03 054e'},
        // migman:{heade:'dae',headm:'dad',headc:'dac',data:'2 4A 5B00 BA00 0A 4B13'},//20201028真实焊机上发 正常
        migman:{heade:'dae',headm:'dad',headc:'dac',data:'2 CB 5B00 BA00 0A 5A0D'},//模拟MODE=4T
        // tigsyn:{heade:'dae',headm:'dad',headc:'dac',data:'3 40 00 03 6400 6400 02 09 50 05  8F81'},
        tigsyn:{heade:'dae',headm:'dad',headc:'dac',data:'3 4A 0A 0A C300 C300 06 0A 46 0A FA07'},
        
        // tigman:{heade:'dae',headm:'dad',headc:'dac',data:'4 40 c0 32 3200 32 3200 3200 e800 32 32 3200 32 50 23 FF97'},
        // mma:{heade:'dae',headm:'dad',headc:'dac',data:'5 c2 00 01 09 6400 6400 CD99'},
        cut:{heade:'dae',headm:'dad',headc:'dac',data:'6 0A 03 16 0000 0000 0033 0001 0000 0003 000B 0000 0032 0064 000A 54F5'}
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
            weld_cur_val:'C4',//后发现20210728
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
        },
        // 新模式为了兼容旧的
        cut:{
            getready:'FD',
            memory:'FG'//FF会冲突
        }

    },
   modbusReadCode:'03',
   modbusWriteCode:'06',
   modbusSlave:'0A',//从机地址
   callMobusEditDirect:{
        '40':{
            type:'6',//类型1代表momery模式数据
            parentName:'SETTING_INCH',
            name:'SETTING_INCH',
            modbusWriteAdr:'0406',//起始地址 1030
            modbusReadAdr:'0406',//起始地址 1030
            modbusNum:'0001',//数量 1个 2
        },
        '30':{
            type:'4',//类型1代表momery模式数据
            parentName:'CALL_LAST_WELD',
            name:'CALL_LAST_WELD',
            modbusWriteAdr:'0320',//起始地址 800
            modbusReadAdr:'032A',//起始地址 810
            modbusNum:'0034',//数量 52个 104
        },
        '31':{
            type:'5',//类型1代表history模式数据
            parentName:'history',
            name:'history',
            modbusWriteAdr:'0321',//起始地址 801
        },
        '21':{
            type:'3',//类型1代表momery模式数据
            parentName:'momeryDetail',
            name:'momeryDetail',
            modbusWriteAdr:'0321',//起始地址 801
        },
        '20':{
            type:'2',//类型1代表momery模式数据
            parentName:'momery',
            name:'momery',
            modbusWriteAdr:'0320',//起始地址 800
            modbusReadAdr:'032A',//起始地址 810
            modbusNum:'0034',//数量 52个 104
            // modbusNumMap:{
            //     '01':'',
            //     '02':'',
            //     '03':'',
            //     '04':'',
            //     '0':'',
            //     '04':'',
            //     '04':'',
            //     '04':'',
            //     '04':'',
            //     '04':'',
            // }
        },
        '100000':{
            type:'1',//类型1代表模式数据
            parentName:'migsyn',
            name:'migsyn',
            modbusAdr:'0064',//起始地址 100=64
            modbusNum:'001F',//数量 31个
            // modbusAdrMap:{
            //     '0A':'0003',//地址50  0-2   数量3字节  16进制03
            //     '3A':'0003',//地址58  8-10  数量3字节  16进制03
            //     '3D':'000a',//地址61  11-20 数量10字节 16进制0a
            //     '47':'000a'// 地址71  21-30 数量10字节 16进制0a
            // }//数据起始地址高位+数据起始地址低位
        },
        '100100':{
            type:'1',//类型1代表模式数据
            parentName:'migman',
            name:'migman',
            modbusAdr:'0064',//起始地址 100
            modbusNum:'000F',//数量 15个
            // modbusAdrMap:{
            //     '0A':'0003',//地址50 0-2
            //     '3A':'0007',//地址58 8-14
            // },//数据起始地址高位+数据起始地址低位
        },
        '100200':{
            type:'1',//类型1代表模式数据
            parentName:'tigsyn',
            name:'tigsyn',
            modbusAdr:'012C',//起始地址 300
            modbusNum:'002C',//数量 44个
        },
        '100300':{
            type:'1',//类型1代表模式数据
            parentName:'tigman',
            name:'tigman',
            modbusAdr:'012C',//起始地址 300
            modbusNum:'0030',//数量 48个
        },
        '100400':{
            type:'1',//类型1代表模式数据
            parentName:'mma',
            name:'mma',
            modbusAdr:'01F4',//起始地址 500
            modbusNum:'0011',//数量 17个
            // modbusAdrMap:{
            //     '0A':'0003',//地址50 0-2
            //     '3A':'0007',//地址58 8-14
            // },//数据起始地址高位+数据起始地址低位
        },
        
        '100500':{
            type:'1',//类型1代表模式数据
            parentName:'cut',
            name:'cut',
            modbusAdr:'02BC',//起始地址 700
            modbusNum:'000B'//数量 11个
            // modbusNum:'002e'//数量 46个
        },
        'A0':{
            parentName:'migsyn',
            name:'mode',
            modbusAdr:'0008'//8
        },
        'A1':{
            parentName:'migsyn',
            name:'material',
            modbusAdr:'0009'//9
        },
        'A2':{
            parentName:'migsyn',
            name:'gas',
            modbusAdr:'000A'//10
        },
        'A3':{
            parentName:'migsyn',
            name:'diameter',
            modbusAdr:'000B'//11
        },
        'A4':{
            parentName:'migsyn',
            name:'thickness',
            modbusAdr:'000C'//12
        },
        'A5':{
            parentName:'migsyn',
            name:'speed',
            modbusAdr:'000D'//13
        },
        'A6':{
            parentName:'migsyn',
            name:'v_welding',
            modbusAdr:'000E'//14
        },
        'AE':{
            type:'7',//类型1代表模式数据
            parentName:'migsyn',
            name:'getready',
            modbusAdr:'0000'//0
        },
        'AF':{
            type:'override',
            parentName:'migsyn',
            name:'override',
            modbusAdr:'0322'//802 
        },
        'B0':{
            parentName:'migman',
            name:'mode',
            modbusAdr:'0008'//8
        },
        'B1':{
            parentName:'migman',
            name:'speed',
            modbusAdr:'0002'//2
        },
        'B2':{
            parentName:'migman',
            name:'v_welding',
            modbusAdr:'0003'//3
        },
        'BE':{
            type:'7',//类型1代表模式数据
            parentName:'migman',
            name:'getready',
            modbusAdr:'0000'//0
        },
        'BF':{
            type:'override',
            parentName:'migman',
            name:'override',
            modbusAdr:'0322'//802
        },
        'C0':{
            parentName:'tigsyn',
            name:'diameter',
            modbusAdr:'00D7'//215
        },
        'C1':{
            parentName:'tigsyn',
            name:'material',
            modbusAdr:'00D8'//216
        },
        'C2':{
            parentName:'tigsyn',
            name:'thickness',
            modbusAdr:'00D9'//217
        },
        // 'C3':{
        //     parentName:'tigsyn',
        //     name:'polatrity',
        //     modbusAdr:''//
        // },
        'C4':{
            parentName:'tigsyn',
            name:'weld_cur_val',
            modbusAdr:'00DC'//218
        },
        'C5':{
            parentName:'tigsyn',
            name:'slowDownTime',
            modbusAdr:'00DA'//218
        },
        'C6':{
            parentName:'tigsyn',
            name:'mode',
            modbusAdr:'00C8'//200
        },
        'CE':{
            type:'7',//类型1代表模式数据
            parentName:'tigsyn',
            name:'getready',
            modbusAdr:'00C8'//200
        },
        'CF':{
            type:'override',
            parentName:'tigsyn',
            name:'override',
            modbusAdr:'0322'//802
        },
        // tigman:{
        //     tacdchfpulse:'D0',
        //     pre_gas_val:'D1',
        //     start_cur_val:'D2',
        //     slop_up_val:'D3',
        //     weld_cur_val:'D4',
        //     base_cur_val:'D5',
        //     pulse_fre_val:'D6',
        //     duty_val:'D7',
        //     slop_down_val:'D8',
        //     crater_cur_val:'D9',
        //     post_gas_val:'DA',
        //     AC_fre_val:'DB',
        //     AC_duty_val:'DC',
        //     getready:'DE',
        //     memory:'DF'
        // },
        'D0':{
            parentName:'tigman',
            name:'tacdchfpulse',//也就是mode
            modbusAdr:'00C8'//200
        },
        'D1':{
            parentName:'tigman',
            name:'pre_gas_val',
            modbusAdr:'00C9'//201
        },
        'D2':{
            parentName:'tigman',
            name:'start_cur_val',
            modbusAdr:'00CB'//203
        },
        'D3':{
            parentName:'tigman',
            name:'slop_up_val',
            modbusAdr:'00CC'//204
        },
        'D4':{
            parentName:'tigman',
            name:'weld_cur_val',
            modbusAdr:'00CD'//205
        },
        'D5':{
            parentName:'tigman',
            name:'base_cur_val',
            modbusAdr:'00D0'//208
        },
        'D6':{
            parentName:'tigman',
            name:'pulse_fre_val',
            modbusAdr:'00CF'//207 脉冲频率
        },
        'D7':{
            parentName:'tigman',
            name:'duty_val',
            modbusAdr:'00CE'//206 pulse_duty 脉冲占空比
        },
        'D8':{
            parentName:'tigman',
            name:'slop_down_val',
            modbusAdr:'00D1'//209 slop_down 缓降时间
        },
        'D9':{
            parentName:'tigman',
            name:'crater_cur_val',
            modbusAdr:'00D2'//210 /crater_cur ????????? 收弧电流
        },
        'DA':{
            parentName:'tigman',
            name:'post_gas_val',
            modbusAdr:'00D3'//211 post_gas 后送气时间
        },
        'DB':{
            parentName:'tigman',
            name:'AC_fre_val',
            modbusAdr:'00D4'//212 ac_fre 交流频率 0A0600D4008c2CC9
        },
        'DC':{
            parentName:'tigman',
            name:'AC_duty_val',
            modbusAdr:'00D5'//213 ac_balance 交流占空比 0A0600D5001A1882
        },
        'DE':{
            type:'7',//类型1代表模式数据
            parentName:'tigman',
            name:'getready',
            modbusAdr:'00C8'//200 
        },
        'DF':{
            type:'override',
            parentName:'tigman',
            name:'override',
            modbusAdr:'0322'//802
        },
        // mma:{
        //     acdc:'E0',
        //     electrode:'E1',
        //     diameter:'E2',
        //     thickness:'E3',
        //     arc_force_val:'E4',
        //     weld_cur_val:'E5',
        //     getready:'ED',
        //     memory:'EF'
        // }
        'E0':{
            parentName:'mma',
            name:'acdc',
            modbusAdr:'0190'//400
        },
        'E1':{
            parentName:'mma',
            name:'electrode',
            modbusAdr:'0192'//402
        },
        'E2':{
            parentName:'mma',
            name:'diameter',
            modbusAdr:'0193'//403
        },
        'E3':{
            parentName:'mma',
            name:'thickness',
            modbusAdr:'0194'//404
        },
        'E4':{
            parentName:'mma',
            name:'arc_force_val',
            modbusAdr:'0195'//405
        },
        'E5':{
            parentName:'mma',
            name:'weld_cur_val',
            modbusAdr:'0191'//401
        },
        'EE':{
            type:'7',//类型1代表模式数据
            parentName:'mma',
            name:'getready',
            modbusAdr:'0190'//400
        },
        'EF':{
            type:'override',
            parentName:'mma',
            name:'override',
            modbusAdr:'0322'//802
        },
        'F0':{
            parentName:'cut',
            name:'mode',
            modbusAdr:'025A'//602
        },
        'F1':{
            parentName:'cut',
            name:'material',
            modbusAdr:'025B'//603
        },
        'F2':{
            parentName:'cut',
            name:'thickness',
            modbusAdr:'025C'//604
        },
        'F3':{
            parentName:'cut',
            name:'weld_cur_val',
            modbusAdr:'0259'// 601
        },
        'FD':{
            type:'7',//类型1代表模式数据
            parentName:'cut',
            name:'getready',
            modbusAdr:'0258'// 600
        },
        
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
   },
   errorMsgMap:{
       "登录成功":"Login succeeded",
       "密码不正确":"Incorrect password",
       "邮箱不能为空":"Mailbox cannot be empty",
       "邮箱格式不正确":"The mailbox format is incorrect",
       "密码不能为空":"Password cannot be empty",
       "请检查帐号或密码是否正确":"Please check whether the account or password is correct",
       "当前邮箱已注册":"The current mailbox is already registered",
       "请输入正确的验证码":"Please enter the correct verification code",
       "邮件已发送请注意查收":"The mail has been sent. Please check it",
       "邮件验证码发送失败":"Mail verification code sending failed",
       "请输入验证码":"Please enter the verification code",
       "邮件验证码已重新发送，请注意查收":"The email verification code has been sent again. Please check it!",
       "请输入密码":"Please input a password",
       "前后输入的密码不一致":"The passwords entered before and after are inconsistent",
       "注册成功":"login was successful",
       "当前邮箱还未注册":"The current mailbox has not been registered",
       "密码重置成功":"Password reset succeeded",
       "重置密码失败":"Failed to reset password"
   }

};

export {BASE_CONFIG};