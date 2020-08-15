/*
    *工具 公用方法 全局方法
    *
    *
    *
*/ 
Array.prototype.in_array = function (element) { 
    　　for (var i = 0; i < this.length; i++) {  
    　　if (this[i] == element) {  
    　　  return true; 
        }
      } 
      return false;  
    }
    import { BASE_CONFIG } from './config/config'
    import store from '../store/index.js'
    import { Toast} from "mint-ui";
    export default {
        install(Vue, options) {
            var weldParam ={
                //inch单位下的直径
                inChDiameterComList:[
                    // {key:'6MM',value:'0.6mm'},{key:'8MM',value:'0.8mm'},{key:'9MM',value:'0.9mm'},{key:'10MM',value:'1.0mm'},{key:'12MM',value:'1.2mm'}
                ],
                /** mma**/
                mmaTypeList:[
                    {
                        typeName:'POLATRITY',
                        chooseKey:0,//默认选中
                        comList:[
                            {id:0,key:'AC',value:'AC'},{id:1,key:'DC',value:'DC'}
                        ],
                        inchComList:[
                            {id:0,key:'AC',value:'AC'},{id:1,key:'DC',value:'DC'}
                        ]
                    },{
                        typeName:'ELECTRODE',
                        chooseKey:0,//默认选中
                        comList:[
                            {id:0,key:'60XX',value:'60XX'},{id:1,key:'70XX',value:'70XX'}
                        ],
                        inchComList:[
                            {id:0,key:'60XX',value:'60XX'},{id:1,key:'70XX',value:'70XX'}
                        ]
                    },{
                        typeName:'DIAMETER',
                        chooseKey:0,//默认选中
                        comList:[
                            {id:0,key:'25MM',value:'2.5MM'},{id:1,key:'32MM',value:'3.2MM'},{id:2,key:'40MM',value:'4.0MM'},{id:2,key:'50MM',value:'5.0MM'}
                        ],
                         //单位切换inch
                         inchComList:[
                            {id:0,key:'25MM',value:'3/32"'},{id:1,key:'32MM',value:'1/8"'},{id:2,key:'40MM',value:'5/32"'},{id:4,key:'50MM',value:'3/16"'}
                        ]
                    },{
                        typeName:'THICKNESS',
                        chooseKey:0,//默认选中
                        comList:[
                            {id:0,key:'6MM',value:'0.6mm'},{id:1,key:'8MM',value:'0.8mm'},{id:2,key:'9MM',value:'0.9mm'},{id:3,key:'12MM',value:'1.2mm'},{id:4,key:'16MM',value:'1.6mm'},{id:5,key:'20MM',value:'2.0mm'},{id:6,key:'25MM',value:'2.5mm'},{id:7,key:'32MM',value:'3.2mm'},{id:8,key:'48MM',value:'4.8mm'},{id:9,key:'64MM',value:'6.4mm'},{id:10,key:'80MM',value:'8.0mm'},{id:11,key:'95MM',value:'9.5mm'}
                            ,{id:12,key:'110MM',value:'11mm'},{id:13,key:'127MM',value:'12.7mm'}
                        ],
                        //单位切换inch
                        inchComList:[
                            {id:0,key:'6MM',value:'24GA'},{id:1,key:'8MM',value:'22GA'},{id:2,key:'9MM',value:'20GA'},{id:3,key:'12MM',value:'18GA'},{id:4,key:'16MM',value:'16GA'},{id:5,key:'20MM',value:'14GA'},{id:6,key:'25MM',value:'12GA'},{id:7,key:'32MM',value:'1/8"'},{id:8,key:'48MM',value:'3/16"'},{id:9,key:'64MM',value:'1/4"'},{id:10,key:'80MM',value:'5/16"'},{id:11,key:'95MM',value:'3/8"'}
                            ,{id:12,key:'110MM',value:'7/16"'},{id:13,key:'127MM',value:'1/2"'}
                        ]
                    }
                ], /** tigsyn模式**/
                tigsynList:[
                    {
                        typeName:'MATERIAL',
                        chooseKey:0,//默认选中
                        comList:[
                            {id:0,key:'FE',value:'FE'},{id:1,key:'AL',value:'AL'},{id:2,key:'Ss',value:'Ss'}
                        ],
                        inchComList:[
                            {id:0,key:'FE',value:'FE'},{id:1,key:'AL',value:'AL'},{id:2,key:'Ss',value:'Ss'}
                        ]
                    },{
                        typeName:'DIAMETER',
                        chooseKey:0,//默认选中
                        comList:[
                            {id:0,key:'16MM',value:'1.6mm'},{id:1,key:'24MM',value:'2.4mm'},{id:2,key:'32MM',value:'3.2mm'},{id:3,key:'40MM',value:'4.0mm'}
                        ],
                        //单位切换inch
                        inchComList:[
                            {id:0,key:'16MM',value:'1/16"'},{id:1,key:'24MM',value:'3/32"'},{id:2,key:'32MM',value:'1/8"'},{id:4,key:'40MM',value:'5/32"'}
                        ]
                    },
                    {
                        typeName:'THICKNESS',
                        chooseKey:0,//默认选中
                        comList:[
                            {id:0,key:'6MM',value:'0.6mm'},{id:1,key:'7MM',value:'0.7mm'},{id:2,key:'9MM',value:'0.9mm'},{id:3,key:'12MM',value:'1.2mm'},{id:4,key:'16MM',value:'1.6mm'},{id:5,key:'21MM',value:'2.1mm'},{id:6,key:'28MM',value:'2.8mm'},{id:7,key:'34MM',value:'3.4mm'},{id:8,key:'48MM',value:'4.8mm'},{id:9,key:'64MM',value:'6.4mm'},{id:10,key:'80MM',value:'8.0mm'},{id:11,key:'95MM',value:'9.5mm'}
                            ,{id:12,key:'110MM',value:'11mm'},{id:13,key:'127MM',value:'12.7mm'}
                        ],
                        //单位切换inch
                        inchComList:[
                            {id:0,key:'6MM',value:'24GA'},{id:1,key:'7MM',value:'22GA'},{id:2,key:'9MM',value:'20GA'},{id:3,key:'12MM',value:'18GA'},{id:4,key:'16MM',value:'16GA'},{id:5,key:'21MM',value:'14GA'},{id:6,key:'28MM',value:'12GA'},{id:7,key:'34MM',value:'1/8"'},{id:8,key:'48MM',value:'3/16"'},{id:9,key:'64MM',value:'1/4"'},{id:10,key:'80MM',value:'5/16"'},{id:11,key:'95MM',value:'3/8"'}
                            ,{id:12,key:'110MM',value:'7/16"'},{id:13,key:'127MM',value:'1/2"'}
                        ]

                    },{
                        typeName:'POLATRITY',
                        chooseKey:0,//默认选中
                        comList:[
                            {id:0,key:'AC',value:'AC'},{id:1,key:'DC',value:'DC'}
                        ],  //单位切换inch
                        inchComList:[
                            {id:0,key:'AC',value:'AC'},{id:1,key:'DC',value:'DC'}
                        ]
                    }

                ],
                /** tigman模式 折线图**/
                tigmanList:[
                    {
                        typeName:'MODE',
                        chooseKey:0,//默认选中
                        comList:[
                            {id:0,key:'2T',value:'2T'},{id:1,key:'4T',value:'4T'}
                        ]
                    },{
                        typeName:'POLATRITY',
                        chooseKey:0,//默认选中
                        comList:[
                            {id:0,key:'DC',value:'DC'},{id:1,key:'AC',value:'AC'}
                        ]
                    },{
                        typeName:'IFPLUS',
                        chooseKey:0,//默认选中
                        comList:[
                            {id:0,key:'PULSE',value:'PULSE'},{id:1,key:'NOPULSE',value:'NO PULSE'}
                        ]
                    },{
                        typeName:'IFHF',
                        chooseKey:0,//默认选中
                        comList:[
                            {id:0,key:'HF',value:'HF'},{id:1,key:'LIFT',value:'LIFT'}
                        ]
                    }
                ],
                /** MIGMAN**/
                migmanTypeList:[
                    {
                        typeName:'MODE',
                        chooseKey:'2T',//默认选中
                        comList:[
                            {id:0,key:'2T',value:'2T'},{id:1,key:'4T',value:'4T'}
                        ],
                        inchComList:[
                            {id:0,key:'2T',value:'2T'},{id:1,key:'4T',value:'4T'}
                        ]
                    }
                ],
                /** MIGSYN模式**/
                migsynTypeList:[
                    {
                        typeName:'MODE',
                        chooseKey:'2T',//默认选中
                        comList:[
                            {id:0,key:'2T',value:'2T'},{id:1,key:'4T',value:'4T'}
                        ],
                        inchComList:[
                            {id:0,key:'2T',value:'2T'},{id:1,key:'4T',value:'4T'}
                        ]
                    },{
                        typeName:'MATERIAL',
                        chooseKey:'FE',//默认选中
                        comList:[
                            {id:0,key:'FE',value:'FE'},{id:1,key:'SS',value:'SS'},{id:2,key:'AL',value:'AL'},{id:3,key:'FCAW-S',value:'FCAW-S'},{id:4,key:'FCAW-G',value:'FCAW-G'}
                        ],
                        inchComList:[
                            {id:0,key:'FE',value:'FE'},{id:1,key:'SS',value:'SS'},{id:2,key:'AL',value:'AL'},{id:3,key:'FCAW-S',value:'FCAW-S'},{id:4,key:'FCAW-G',value:'FCAW-G'}
                        ]
                    },{
                        // typeName:'GAS',
                        // chooseKey:'Ar',//默认选中
                        // comList:[
                        //     {key:'Ar',value:'Ar'},{key:'MIX',value:'MIX'},{key:'CO2',value:'CO2'}
                        // ]
                        //和设计稿有出入
                        typeName:'GAS',
                        chooseKey:'CO2',//默认选中
                        comList:[
                            {id:0,key:'CO2',value:'CO2'},{id:1,key:'MIX',value:'MIX'}
                        ],
                        inchComList:[
                            {id:0,key:'CO2',value:'CO2'},{id:1,key:'MIX',value:'MIX'}
                        ]
                    },{
                        typeName:'DIAMETER',
                        chooseKey:'6MM',//默认选中
                        comList:[
                            {id:0,key:'6MM',value:'0.6mm'},{id:1,key:'8MM',value:'0.8mm'},{id:2,key:'9MM',value:'0.9mm'},{id:3,key:'10MM',value:'1.0mm'},{id:4,key:'12MM',value:'1.2mm'}
                        ],
                        //单位切换inch
                        inchComList:[
                            {id:0,key:'6MM',value:'.023"'},{id:1,key:'8MM',value:'.030"'},{id:2,key:'9MM',value:'.035"'},{id:3,key:'10MM',value:'.040"'},{id:4,key:'12MM',value:'.045"'}
                        ]
                    },{
                        typeName:'THICKNESS',
                        chooseKey:0,//默认选中
                        comList:[
                            {id:0,key:'6MM',value:'0.6mm'},{id:1,key:'7MM',value:'0.7mm'},{id:2,key:'9MM',value:'0.9mm'},{id:3,key:'12MM',value:'1.2mm'},{id:4,key:'16MM',value:'1.6mm'},{id:5,key:'21MM',value:'2.1mm'},{id:6,key:'28MM',value:'2.8mm'},{id:7,key:'34MM',value:'3.4mm'},{id:8,key:'48MM',value:'4.8mm'},{id:9,key:'64MM',value:'6.4mm'},{id:10,key:'80MM',value:'8.0mm'},{id:11,key:'95MM',value:'9.5mm'}
                            ,{id:12,key:'110MM',value:'11mm'},{id:13,key:'127MM',value:'12.7mm'}
                        ],
                        //单位切换inch
                        inchComList:[
                            {id:0,key:'6MM',value:'24GA'},{id:1,key:'7MM',value:'22GA'},{id:2,key:'9MM',value:'20GA'},{id:3,key:'12MM',value:'18GA'},{id:4,key:'16MM',value:'16GA'},{id:5,key:'21MM',value:'14GA'},{id:6,key:'28MM',value:'12GA'},{id:7,key:'34MM',value:'1/8"'},{id:8,key:'48MM',value:'3/16"'},{id:9,key:'64MM',value:'1/4"'},{id:10,key:'80MM',value:'5/16"'},{id:11,key:'95MM',value:'3/8"'}
                            ,{id:12,key:'110MM',value:'7/16"'},{id:13,key:'127MM',value:'1/2"'}
                        ]

                    }
                ]
            }
            //焊接指令集合 crc值
            const  weldDirctive={
                    migSyn:'0570',//mig一元化
                    migMan:'C5B1',//mig非一元化
                    tigSyn:'C4F1',//Tig一元化
                    tigMan:'0430',//Tig非一元化
                    mma:'C671'
            }
            //定义常量map数组  改数据结构没用了
            // const MODE_MAP = new Map([['0', '2T'], ['1', '4T']]);
            // const MATERIAL_MAP = new Map([['0', 'FE'], ['1', 'SS'], ['2', 'AL']], ['3', 'FCAW-S'], ['4', 'FCAW-G']);
            // const GAS_MAP = new Map([['0', 'CO2'], ['1', 'MIX']]);
            // const DIAMETER_MAP = new Map([['0', '6MM'], ['1', '8MM'], ['2', '9MM']], ['3', '10MM'], ['4', '12MM']);
            // const THICKNESS_MAP =new Map([['0', '6MM'], ['1', '7MM'], ['2', '9MM']], ['3', '12MM'], ['4', '16MM'], ['5', '21MM'], ['6', '28MM'], ['7', '34MM'], ['8', '48MM'], ['9', '64MM'],['10','80MM'],['11','95MM'],['12','110MM'],['13','127MM']);
            //指令数组
            const MIGSYN_DIRECTIVE_MAP=new Map([['MODE','A0'],['MATERIAL','A1'],['GAS','A2'],['DIAMETER','A3'],['THICKNESS','A4'],['SPEED','A5'],['V_WELDING','A6'],['Getready','AE'],['Memory','AF']]);
            const MIGMAN_DIRECTIVE_MAP=new Map([['MODE','B0'],['SPEED','B1'],['V_WELDING','B2'],['Getready','BE'],['Memory','BF']]);
            const TIGSYN_DIRECTIVE_MAP=new Map([['DIAMETER','C0'],['MATERIAL','C1'],['THICKNESS','C2'],['POLATRITY','C3'],['WELDCUR','C4'],['Getready','CE'],['Memory','CF']]);
            const MMA_DIRECTIVE_MAP = new Map([['POLATRITY','E0'],['ELECTRODE','E1'],['DIAMETER','E2'],['THICKNESS','E3'],['FORCE','E4'],['MMA_CURRENT','E5'],['Getready','EE'],['Memory','EF']]);
            const TIGMAN_DIRECTIVE_MAP =new Map([['TDCHFPULSE','D0'],['pre_gas','D1'],['start_cur_end','D2'], ['slop_up','D3'],['weld_cur','D4'],['base_cur','D5'],['pulse_fre','D6'],['pulse_duty','D7'],['slop_down','D8'],['crater_cur','D9'],['post_gas','DA'],['ac_fre','DB'],['ac_balance','DB'],['Getready','DE'],['Memory','DF']]);
           //特殊指令数组 存储、历史等
           const SPECIAL_DIRECTIVE_MAP =new Map([['CALL_MEMORY','20'],['APPY_MEMORY','21'],['CALL_LAST_WELD','30'],['APPY_LAST_WELD','31'],['EDIT_UNIT','40'],['OVERRIDE','22']]);
            //设置参数
            function setWeldParams(type,value){
                switch (type) {
                    case 'MODE':
                        if( value){
                            return  value;
                        }else{
                            return 0;//默认
                        }
                        break;
                    case 'MATERIAL':
                        if(value){
                            value;
                        }else{
                            return 0;//默认
                        }
                        break;
                    case 'GAS':
                        if(value){
                            return value;
                        }else{
                            return 0;//默认
                        }
                        break;
                    case 'DIAMETER':
                        return value?value:'0';
                        break;
                    case 'THICKNESS':
                        // if(THICKNESS_MAP.get(value)){
                        //     return THICKNESS_MAP.get(value);
                        // }else{
                        //     return '0';//默认
                        // }
                        return value?value:'0';
                        break;
                    default:
                        break;
                }
               
            }
             //设值
             function  setWeldDataByType(arrayList,type,pageFrom){ 
                 console.log(pageFrom+'|||||')
               var rstInfo={};
               switch (type) {
                   case weldDirctive.migSyn:
                        //确认指令
                        rstInfo.nowTypeList=weldParam.migsynTypeList;
                        console.log('33333'+arrayList.length);
                        
                        if((arrayList[1]=='225'||arrayList[1]=='209'||arrayList[1]=='193') &&arrayList.length==14){
                            console.log(4444);
                            //赋值开始  ......
                            rstInfo.weldType='MIGSYN';
                            rstInfo.weldTypeNum=1;//这个和首页里的配对
                            //对第一个元素进行解析 拆成数组
                            var byte1Bean = num16To2Arr(arrayList[2],'');
                            rstInfo.nowTypeList.forEach(element => {
                                switch (element.typeName) {
                                    case 'MODE':
                                        // element.chooseKey=setWeldParams('MODE',byte1Bean.mode);
                                        element.chooseKey=byte1Bean.mode?byte1Bean.mode:0;
                                        break;
                                    case 'MATERIAL':
                                        element.chooseKey=arrayList[3]?arrayList[3]:0;
                                        // element.chooseKey=setWeldParams('MATERIAL',arrayList[3]);
                                        break;
                                    case 'GAS':
                                        // element.chooseKey=setWeldParams('GAS',arrayList[4]);
                                        element.chooseKey=arrayList[4]?arrayList[4]:0;
                                        break;
                                    case 'DIAMETER':
                                        // element.chooseKey=setWeldParams('DIAMETER',arrayList[5]);
                                        element.chooseKey=arrayList[5]?arrayList[5]:0;
                                        break;
                                    case 'THICKNESS':
                                        element.chooseKey=arrayList[6]?arrayList[6]:0;
                                        // element.chooseKey=setWeldParams('THICKNESS',arrayList[6]);
                                        break;
                                    default:
                                        break;
                                }
                            });

                             //bit4-7
                             rstInfo.INDUCTANCE =parseInt(((Array(8).join(0) + parseInt(arrayList[7],10).toString(2)).slice(-8)).substring(0,4),2).toString(10);//机器上发不能改 不知道干嘛的
                             //bit0-3
                            rstInfo.RECOMMEND_INDUCTANCE =parseInt(((Array(8).join(0) + parseInt(arrayList[7],10).toString(2)).slice(-8)).substring(4,8),2).toString(10);//机器上发不能改 不知道干嘛的
                            rstInfo.RECOMMEND_SPEED_DISPLAY=arrayList[8];//推荐值
                            rstInfo.SPEED_DISPLAY =arrayList[9];//送丝速度
                            rstInfo.RECOMMEND_V_WELDING=arrayList[10];
                            rstInfo.V_WELDING=arrayList[11];
                            //其他属性不需要 赋值直接赋值 到时再取
                            rstInfo.THINKNESS_VALUE = arrayList[6]?arrayList[6]:0;
                            rstInfo.MIG_MIN_THICHNESS=arrayList[12];//最小厚度值
                            rstInfo.MIG_MAX_THICHNESS=arrayList[13];//最小厚度值
                            rstInfo.initBean=byte1Bean;
                            //最大送丝速度
                            rstInfo.MAX_SPEED_DISPLAY=maxSpeedBuild(byte1Bean.unit,byte1Bean.pfc);
                            //最小送丝速度
                            rstInfo.MIN_SPEED_DISPLAY=minSpeedBuild(byte1Bean.unit,byte1Bean.pfc);
                            //最大电压值
                            rstInfo.MAX_WELD_V_DISPLAY=maxVWeldBuild(byte1Bean.pfc);
                            //mig_material 值 ==0 显示gas选项否则隐藏
                            rstInfo.MIG_MATERIAL =arrayList[3]?arrayList[3]:0;
                        }
                       break;
                    case weldDirctive.migMan:
                        //确认指令
                        rstInfo.nowTypeList=weldParam.migmanTypeList;
                        rstInfo.weldType='MIGMAN';
                        rstInfo.weldTypeNum=3;//这个和首页里的配对
                        console.log('1111112222233333:'+arrayList.length)
                        
                        if((arrayList[1]=='226'||arrayList[1]=='210'||arrayList[1]=='194') && arrayList.length==6){
                            //赋值开始  ......
                            //对第一个元素进行解析 拆成数组
                            var byte1Bean = num16To2Arr(arrayList[2],'');
                            rstInfo.nowTypeList.forEach(element => {
                                if(element.typeName=='MODE'){
                                    element.chooseKey=byte1Bean.mode?byte1Bean.mode:0;
                                }
                            });
                            rstInfo.SPEED_DISPLAY =arrayList[3];//送丝速度
                            rstInfo.V_WELDING =arrayList[4];//电压
                            // rstInfo.INDUCTANCE =arrayList[5];//机器上发不能改 不知道干嘛的
                            //bit4-7
                            rstInfo.INDUCTANCE =parseInt(((Array(8).join(0) + parseInt(arrayList[5],10).toString(2)).slice(-8)).substring(0,4),2).toString(10);//机器上发不能改 不知道干嘛的
                            //bit0-3
                            rstInfo.RECOMMEND_INDUCTANCE =parseInt(((Array(8).join(0) + parseInt(arrayList[5],10).toString(2)).slice(-8)).substring(4,8),2).toString(10);//机器上发不能改 不知道干嘛的
                            rstInfo.initBean=byte1Bean;
                            //最大送丝速度
                            rstInfo.MAX_SPEED_DISPLAY=maxSpeedBuild(byte1Bean.unit,byte1Bean.pfc);
                            //最小送丝速度
                            rstInfo.MIN_SPEED_DISPLAY=1.5;
                            //最大电压值
                            rstInfo.MAX_WELD_V_DISPLAY=maxVWeldBuild(byte1Bean.pfc);
                        }
                       break;
                    case weldDirctive.tigSyn:
                        rstInfo.nowTypeList=weldParam.tigsynList;
                        rstInfo.weldType='TIGSYN';
                        rstInfo.weldTypeNum=4;//这个和首页里的配对
                       //确认指令
                       console.log('arrayList.length'+arrayList.length)
                       if((arrayList[1]=='227'||arrayList[1]=='211'||arrayList[1]=='195') &&arrayList.length==9){
                           //赋值开始  ......
                           var byte1Bean = num16To2Arr(arrayList[2],'');
                           //拆解成
                           var  arrtwo= num16To2ArrSpecial02(arrayList[3]);
                           rstInfo.nowTypeList.forEach(element => {
                                switch (element.typeName) {
                                    case 'MATERIAL':
                                        element.chooseKey=arrtwo.material;
                                        break;
                                    case 'DIAMETER':
                                        element.chooseKey=arrtwo.diameter;
                                        break;
                                    case 'THICKNESS':
                                        element.chooseKey=arrayList[4]?arrayList[4]:0;
                                        break;
                                    default:
                                        break;
                                }
                            });
                            // arrayList[3];//钨棒直径+金属
                            // arrayList[4];//板厚
                            // arrayList[5];//电流推荐值
                            rstInfo.SYN_RECOMMEND_CUR= arrayList[5];//电流推荐值
                            rstInfo.SYN_WELD_CUR = arrayList[6];//电流
                            rstInfo.THINKNESS_VALUE = arrayList[4]?arrayList[4]:0;
                            rstInfo.TIG_MIN_THICHNESS = arrayList[7];//最小厚度值
                            rstInfo.TIG_MAX_THICHNESS = arrayList[8];//最大厚度值
                            rstInfo.TIGSYN_MIN_CUR=10;
                            rstInfo.TIGSYN_MAX_CUR=byte1Bean.pfc==1?200:140;
                            rstInfo.initBean=byte1Bean;//包含很多焊接状态和单位等
                       }
                      break;
                    case weldDirctive.tigMan:
                        rstInfo.nowTypeList=weldParam.tigmanList;
                        rstInfo.weldType='TIGMAN';
                        rstInfo.weldTypeNum=2;//这个和首页里的配对
                       //确认指令
                       console.log(arrayList.length+'aa')
                       if((arrayList[1]=='228'||arrayList[1]=='212'||arrayList[1]=='196') &&arrayList.length==16){
                           var  rstBean = tigmanSpecilBuildHeader(arrayList[2],arrayList[3]);
                           rstInfo.nowTypeList.forEach(element => {
                                switch (element.typeName) {
                                    case 'MODE':
                                        element.chooseKey=rstBean.mode;
                                        break;
                                    case 'POLATRITY':
                                        element.chooseKey=rstBean.polatrity;
                                        break;
                                    case 'IFPLUS':
                                        element.chooseKey=rstBean.ifpulse;
                                        break;
                                    case 'IFHF':
                                        element.chooseKey=rstBean.ifhf
                                        break;
                                    default:
                                        break;
                                }
                            });
                           //赋值开始  ......
                           rstInfo.PRE_GAS_VAL =arrayList[4];
                           rstInfo.START_CUR_VAL =arrayList[5];
                           rstInfo.STOP_UP_VAL =arrayList[6];
                           rstInfo.WELD_CUR_VAL =arrayList[7];
                           rstInfo.BASE_CUR_VAL =arrayList[8];
                           rstInfo.PULSE_FRE_VAL =arrayList[9];
                           rstInfo.DUTY_VAL =arrayList[10];
                           rstInfo.SLOP_DOWN_VAL =arrayList[11];
                           rstInfo.CRATER_CUR_VAL =arrayList[12];
                           rstInfo.POST_GAS_VAL=arrayList[13];
                           rstInfo.AC_FRE_VAL =arrayList[14];
                           rstInfo.AC_DUTY_VAL =arrayList[15];
                           
                           rstInfo.initBean=rstBean;//包含很多焊接状态和单位等
                       }
                      break;
                    case weldDirctive.mma:
                        rstInfo.nowTypeList=weldParam.mmaTypeList;
                        rstInfo.weldType='MMA';
                        rstInfo.weldTypeNum=0;//这个和首页里的配对
                       //确认指令
                       if((arrayList[1]=='229'||arrayList[1]=='213'||arrayList[1]=='197') &&arrayList.length==8){
                           //赋值开始  ......
                           var byte1Bean = num16To2Arr(arrayList[2],'MMA');
                           //拆解成
                           var  arrthree= num16To2ArrSpecial03(arrayList[3]);
                           rstInfo.nowTypeList.forEach(element => {
                                switch (element.typeName) {
                                    case 'POLATRITY':
                                        element.chooseKey=byte1Bean.acdc;
                                        break;
                                    case 'ELECTRODE':
                                        element.chooseKey=arrthree.electrode;
                                        break;
                                    case 'DIAMETER':
                                        element.chooseKey=arrthree.diameter;
                                        break;
                                    case 'THICKNESS':
                                        element.chooseKey=arrayList[4]?arrayList[4]:0;
                                        break;
                                    default:
                                        break;
                                }
                            });
                           rstInfo.ARC_FORCE_VAL =arrayList[5];
                        //    alert(  rstInfo.ARC_FORCE_VAL)
                           rstInfo.MMA_RECOMMEND_CURRENT =arrayList[6];//推荐电流
                           rstInfo.MMA_CURRENT_VAL=arrayList[7];

                           rstInfo.MMA_MIN_CUR=10;
                           rstInfo.MMA_MAX_CUR=byte1Bean.pfc==1?200:110;
                           rstInfo.initBean=byte1Bean;//包含很多焊接状态和单位等
                       }
                      break;
                   default:
                       break;
               }
               //全局存储
               if(pageFrom=='memory'){
                store.state.memoryInfo = rstInfo;
               }else{
                store.state.rstInfo = rstInfo;
               }
            //    alert(JSON.stringify(rstInfo));
               console.log(rstInfo);
               return rstInfo;
             }
            //比较字符串是否相等 忽略大小写
            function  compareString(subStr,str){
                var reg = eval("/"+subStr+"/ig");
                return reg.test(str);
             }
             //计算max最大送丝速度
             function maxSpeedBuild(unit,pfc){
                if(unit==1){//单位 inch
                    if(pfc==0){
                        return 40;
                    }else{
                        return 65.6;
                    }
                }else{
                    if(pfc==0){
                        return 10;
                    }else{
                        return 16.4;
                    }
                }
             }
              //计算min最小送丝速度
              function minSpeedBuild(unit,pfc){
                if(unit==1 && pfc==1){//单位 inch
                   return 6;
                }else{
                   return 1.5;
                }
             }
              function maxVWeldBuild(pfc){
                if(pfc==1){//单位 inch
                    return 26;
                }else{
                    return  23;
                }
              }
            //蓝牙返回的数据解析公用工具类
            //参数：页面，指令(这指令不是传输的指令用户自定义！！！)，数据
            Vue.prototype.buildData = function(pageFrom,dirctiveType,data) {
                // data =data.replace(' ', '');
                var rstInfo ={};
                if(!pageFrom){
                    return;
                }
                console.log(pageFrom+'laolao');
                //1、来自那个页面有自己独立的数据处理方式
                switch (pageFrom) {
                    case 'newIndex':
                        console.log(dirctiveType+':llll');
                        rstInfo =buidDataByPagefrom(pageFrom,dirctiveType,data);
                        break;
                    case 'memory':
                        console.log(dirctiveType+':ll22ll');
                        rstInfo =buidDataByPagefrom(pageFrom,dirctiveType,data);
                        //  alert(JSON.stringify(rstInfo))
                        break;
                    default:
                        break;
                }
                return rstInfo;
            }
            //抽取的公共部分
            function buidDataByPagefrom(pageFrom,dirctiveType,data){
                var rstInfo ={};
                //请求mig syn模式数据
                if(compareString(dirctiveType,weldDirctive.migSyn)){
                    var strArr =data.split(' ');
                    console.log(1111112222333);
                    console.log(strArr);
                    //注意有些字段是占用两个字节的
                    var temp10 =[];
                    temp10.push(parseInt(("0x"+strArr[0]),16).toString(10));//da
                    temp10.push(parseInt(("0x"+strArr[1]),16).toString(10));//指令
                    
                    temp10.push(parseInt(("0x"+strArr[2]),16).toString(10));//mode及焊接状态
                    temp10.push(parseInt(("0x"+strArr[3]),16).toString(10));//材料material
                    temp10.push(parseInt(("0x"+strArr[4]),16).toString(10));//气体GAS
                    temp10.push(parseInt(("0x"+strArr[5]),16).toString(10));//直径
                    temp10.push(parseInt(("0x"+strArr[6]),16).toString(10));//板厚
                    //特殊的
                    temp10.push(parseInt(("0x"+strArr[7]),16).toString(10));//电感推荐值和电感量！！！
                    temp10.push(parseInt(("0x"+strArr[8]+strArr[9]),16).toString(10));//送丝推荐值
                    temp10.push(parseInt(("0x"+strArr[10]+strArr[11]),16).toString(10));//送丝速度
                    temp10.push(parseInt(("0x"+strArr[12]+strArr[13]),16).toString(10));//电压推荐值
                    temp10.push(parseInt(("0x"+strArr[14]+strArr[15]),16).toString(10));//电压

                    temp10.push(parseInt(("0x"+strArr[16]),16).toString(10));//板厚最小值
                    temp10.push(parseInt(("0x"+strArr[17]),16).toString(10));//板厚最大值
                    //转成10进制
                    rstInfo = setWeldDataByType(temp10,weldDirctive.migSyn,pageFrom);
                 //请求mig mma模式数据
                }else if(compareString(dirctiveType,weldDirctive.migMan)){
                    var strArr =data.split(' ');
                    console.log(strArr);
                    var temp10 =[];
                    temp10.push(parseInt(("0x"+strArr[0]),16).toString(10));//da
                    temp10.push(parseInt(("0x"+strArr[1]),16).toString(10));//指令
                    console.log(strArr[1]+'kkkkk');
                    temp10.push(parseInt(("0x"+strArr[2]),16).toString(10));//mode及焊接状态
                    temp10.push(parseInt(("0x"+strArr[3]+strArr[4]),16).toString(10));//送丝速度
                    temp10.push(parseInt(("0x"+strArr[5]+strArr[6]),16).toString(10));//送丝速度
                    temp10.push(parseInt(("0x"+strArr[7]),16).toString(10));//电感量
                    //转成10进制
                    rstInfo = setWeldDataByType(temp10,weldDirctive.migMan,pageFrom);
                }else if(compareString(dirctiveType,weldDirctive.tigSyn)){
                    var strArr =data.split(' ');
                    var temp10 =[];
                    temp10.push(parseInt(("0x"+strArr[0]),16).toString(10));//头DA
                    temp10.push(parseInt(("0x"+strArr[1]),16).toString(10));//指令
                    temp10.push(parseInt(("0x"+strArr[2]),16).toString(10));//mode及焊接状态
                    temp10.push(parseInt(("0x"+strArr[3]),16).toString(10));//钨丝直径+金属
                    temp10.push(parseInt(("0x"+strArr[4]),16).toString(10));//板厚
                    temp10.push(parseInt(("0x"+strArr[5]+strArr[6]),16).toString(10));//电流推荐值
                    temp10.push(parseInt(("0x"+strArr[7]+strArr[8]),16).toString(10));//电流
                    temp10.push(parseInt(("0x"+strArr[9]),16).toString(10));//板厚最小值
                    temp10.push(parseInt(("0x"+strArr[10]),16).toString(10));//板厚最大值
                    //转成10进制
                    rstInfo = setWeldDataByType(temp10,weldDirctive.tigSyn,pageFrom);
                }else if(compareString(dirctiveType,weldDirctive.mma)){
                    var strArr =data.split(' ');
                    var temp10 =[];
                    temp10.push(parseInt(("0x"+strArr[0]),16).toString(10));//头DA
                    temp10.push(parseInt(("0x"+strArr[1]),16).toString(10));//指令
                    temp10.push(parseInt(("0x"+strArr[2]),16).toString(10));//直流、交流类型及焊接状态
                    temp10.push(parseInt(("0x"+strArr[3]),16).toString(10));//焊条类型+直径
                    temp10.push(parseInt(("0x"+strArr[4]),16).toString(10));//板厚
                    temp10.push(parseInt(("0x"+strArr[5]),16).toString(10));//电弧推力
                    temp10.push(parseInt(("0x"+strArr[6]+strArr[7]),16).toString(10));//电流推荐值
                    temp10.push(parseInt(("0x"+strArr[8]+strArr[9]),16).toString(10));//电流
                    //转成10进制
                    rstInfo = setWeldDataByType(temp10,weldDirctive.mma,pageFrom);
                }else if(compareString(dirctiveType,weldDirctive.tigMan)){
                    var strArr =data.split(' ');
                    console.log(strArr)
                    var temp10 =[];
                    temp10.push(parseInt(("0x"+strArr[0]),16).toString(10));//头DA
                    temp10.push(parseInt(("0x"+strArr[1]),16).toString(10));//指令
                    temp10.push(parseInt(("0x"+strArr[2]),16).toString(10));//焊接状态等
                    temp10.push(parseInt(("0x"+strArr[3]),16).toString(10));//MODE+ADCD+2T4T+PULSE
                    temp10.push(parseInt(("0x"+strArr[4]),16).toString(10));//PRE_GAS_VAL
                    temp10.push(parseInt(("0x"+strArr[5]+strArr[6]),16).toString(10));//START_CUR_VAL
                    temp10.push(parseInt(("0x"+strArr[7]),16).toString(10));//SLOP_UP
                    temp10.push(parseInt(("0x"+strArr[8]+strArr[9]),16).toString(10));//WELD_CUR
                    temp10.push(parseInt(("0x"+strArr[10]+strArr[11]),16).toString(10));//BASE_CUR
                    temp10.push(parseInt(("0x"+strArr[12]+strArr[13]),16).toString(10));//PULSE_FRE
                    temp10.push(parseInt(("0x"+strArr[14]),16).toString(10));//DUTY-VAL
                    temp10.push(parseInt(("0x"+strArr[15]),16).toString(10));//SLOP-DOWN
                    temp10.push(parseInt(("0x"+strArr[16]+strArr[17]),16).toString(10));//CRATER-CUR
                    temp10.push(parseInt(("0x"+strArr[18]),16).toString(10));//POST-GAS
                    temp10.push(parseInt(("0x"+strArr[19]),16).toString(10));//AC-FRE-VAL
                    temp10.push(parseInt(("0x"+strArr[20]),16).toString(10));//AC-DUTY-VAL
                    //转成10进制
                    console.log(temp10)
                    rstInfo = setWeldDataByType(temp10,weldDirctive.tigMan,pageFrom);
                }
                return rstInfo;
            }
            //获取指令
            Vue.prototype.getDirective = function(type,paramKey) {
                switch (type) {
                    case 'MIGSYN':
                        return MIGSYN_DIRECTIVE_MAP.get(paramKey);
                        break;
                    case 'MIGMAN':
                        return MIGMAN_DIRECTIVE_MAP.get(paramKey);
                        break;
                    case 'TIGSYN':
                        return TIGSYN_DIRECTIVE_MAP.get(paramKey);
                        break;
                    case 'MMA':
                        return MMA_DIRECTIVE_MAP.get(paramKey);
                        break;
                    case 'TIGMAN':
                        return TIGMAN_DIRECTIVE_MAP.get(paramKey);
                        break;
                    case 'CALL_MEMORY':
                        return SPECIAL_DIRECTIVE_MAP.get(paramKey);
                        break;
                    case 'APPY_MEMORY':
                        return SPECIAL_DIRECTIVE_MAP.get(paramKey);
                        break;
                    case 'CALL_LAST_WELD':
                        return SPECIAL_DIRECTIVE_MAP.get(paramKey);
                        break;
                    case 'APPY_LAST_WELD':
                        return SPECIAL_DIRECTIVE_MAP.get(paramKey);
                        break;
                    case 'EDIT_UNIT':
                        return SPECIAL_DIRECTIVE_MAP.get(paramKey);
                        break;
                    default:
                        break;
                }
            }
            
            function tigmanSpecilBuildHeader(arr1,arr2){
                 var buildArr = ((Array(8).join(0) + parseInt(arr1,10).toString(2)).slice(-8)).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' ');
                 var secdArr = ((Array(8).join(0) + parseInt(arr2,10).toString(2)).slice(-8)).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' ');
                 var bean ={};
                 //0|单位
                     bean.unit=buildArr[0];
                 //1|pfc
                     bean.pfc=buildArr[1];
                 //2|焊接
                     bean.weldStatus =buildArr[2]
                     //焊接中状态赋值
                     if(bean.weldStatus==1){
                        store.state.weldingStatus=1
                     }else{
                        store.state.weldingStatus=0;
                        store.state.getWeldingInfoTimes=0;//重置
                     }
                 //3|过热
                     bean.hotStatus =buildArr[3]
                 //4|过流
                     bean.flowStatus =buildArr[4]
                 //5|空
                     bean.empty1 =buildArr[5]
                 //6|空
                     bean.empty2 =buildArr[6]
                 //7|空
                     bean.empty3 =buildArr[7]
                    /***2222222 begin***/
                     //0|2t4t
                      bean.mode=secdArr[0];
                      bean.modeValue = bean.mode==1?'4T':'2T';
                    //1|acdc
                        bean.polatrity=secdArr[1];
                    //2|hf
                        bean.ifhf =secdArr[2]
                    //3|pulse
                        bean.ifpulse =secdArr[3]
                        bean.ifpulseValue =bean.ifpulse==1?'PULSE':'NOPULSE';
                    //4|空
                        bean.empty20 =secdArr[5]
                    //5|空
                        bean.empty21 =secdArr[5]
                    //6|空
                        bean.empty22 =secdArr[6]
                    //7|空
                        bean.empty23 =secdArr[7]
                        bean.nowChooseModel=bean.modeValue+'_'+bean.ifpulseValue+'_DC';
                              
                     /***2222222 end***/
                 return bean;
            }
              //转成16进制转2进制 之后不足的位数补零 MMA
              function num16To2ArrSpecial03(num,len){
                var buildArr = ((Array(8).join(0) + parseInt(num,10).toString(2)).slice(-8)).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' ');
                // var buildArr = parseInt(num,10).toString(2);
                var bean ={};
                //钨丝直径
                bean.electrode= parseInt(buildArr[0]+buildArr[1],2);
                //校验结果
                if( bean.electrode>1){
                    bean.electrode=0;//默认值
                }
                bean.diameter= parseInt(buildArr[2]+buildArr[3]+buildArr[4],2);
                if( bean.diameter>3){
                    bean.diameter=0;//默认值
                }
                return bean;
            }
             //转成16进制转2进制 之后不足的位数补零 TIGSYN
            function num16To2ArrSpecial02(num,len){
                var buildArr = ((Array(8).join(0) + parseInt(num,10).toString(2)).slice(-8)).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' ');
                // var buildArr = parseInt(num,10).toString(2);
                var bean ={};
                //钨丝直径
                bean.diameter= parseInt(buildArr[0]+buildArr[1]+buildArr[2],2);
                //校验结果
                if( bean.diamete>3){
                    bean.diamete=0;//默认值
                }
                bean.material= parseInt(buildArr[3]+buildArr[4]+buildArr[5],2);
                if( bean.material>2){
                    bean.material=0;//默认值
                }
                return bean;
            }
            //转成16进制转2进制 之后不足的位数补零
            function num16To2Arr(num,type){

                // return (Array(len).join('0') + parseInt(num,16).toString(2)).slice(-len);
                //直接返回切割后的数组
                // var buildArr = (Array(len).join('0') + parseInt(num,16).toString(2)).slice(-len).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' ');
                var buildArr = ((Array(8).join(0) + parseInt(num,10).toString(2)).slice(-8)).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' ');
                // var buildArr = parseInt(num,10).toString(2);
                var bean ={};
                //0|单位
                    bean.unit=buildArr[0];
                //1|pfc
                    bean.pfc=buildArr[1];
                //2|焊接
                    bean.weldStatus =buildArr[2]
                    //焊接中状态赋值
                    // alert('焊接状态'+bean.weldStatus);
                    if(bean.weldStatus==1){
                       store.state.weldingStatus=1
                    }else{
                        store.state.weldingStatus=0;
                        store.state.getWeldingInfoTimes=0;//重置
                     }
                    //  alert("getWeldingInfoTimes:"+ store.state.getWeldingInfoTimes+"weldingStatus:"+ store.state.weldingStatus)
                //3|过热
                    bean.hotStatus =buildArr[3]
                //4|过流
                    bean.flowStatus =buildArr[4]
                //5|空
                    bean.empty1 =buildArr[5]
                //6|空
                    bean.empty2 =buildArr[6]
                //7|mode  AD/DC
                    if(type=='MMA'){
                        bean.acdc =buildArr[7]
                    }else{
                        bean.mode =buildArr[7]
                    }
                    
                return bean;
            }
            //crc16位数字处理
            Vue.prototype.crcModelBusClacQuery = function(data) {      
                    var CRC = {};
                    CRC._auchCRCHi = [
                        0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0,
                        0x80, 0x41, 0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41,
                        0x00, 0xC1, 0x81, 0x40, 0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0,
                        0x80, 0x41, 0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1, 0x81, 0x40,
                        0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1,
                        0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
                        0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1,
                        0x81, 0x40, 0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41,
                        0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0,
                        0x80, 0x41, 0x00, 0xC1, 0x81, 0x40, 0x00, 0xC1, 0x81, 0x40,
                        0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1,
                        0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1, 0x81, 0x40,
                        0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0,
                        0x80, 0x41, 0x00, 0xC1, 0x81, 0x40, 0x00, 0xC1, 0x81, 0x40,
                        0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0,
                        0x80, 0x41, 0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1, 0x81, 0x40,
                        0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0,
                        0x80, 0x41, 0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41,
                        0x00, 0xC1, 0x81, 0x40, 0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0,
                        0x80, 0x41, 0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41,
                        0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0,
                        0x80, 0x41, 0x00, 0xC1, 0x81, 0x40, 0x00, 0xC1, 0x81, 0x40,
                        0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1,
                        0x81, 0x40, 0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41,
                        0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0,
                        0x80, 0x41, 0x00, 0xC1, 0x81, 0x40
                    ];
                    CRC._auchCRCLo = [
                        0x00, 0xC0, 0xC1, 0x01, 0xC3, 0x03, 0x02, 0xC2, 0xC6, 0x06,
                        0x07, 0xC7, 0x05, 0xC5, 0xC4, 0x04, 0xCC, 0x0C, 0x0D, 0xCD,
                        0x0F, 0xCF, 0xCE, 0x0E, 0x0A, 0xCA, 0xCB, 0x0B, 0xC9, 0x09,
                        0x08, 0xC8, 0xD8, 0x18, 0x19, 0xD9, 0x1B, 0xDB, 0xDA, 0x1A,
                        0x1E, 0xDE, 0xDF, 0x1F, 0xDD, 0x1D, 0x1C, 0xDC, 0x14, 0xD4,
                        0xD5, 0x15, 0xD7, 0x17, 0x16, 0xD6, 0xD2, 0x12, 0x13, 0xD3,
                        0x11, 0xD1, 0xD0, 0x10, 0xF0, 0x30, 0x31, 0xF1, 0x33, 0xF3,
                        0xF2, 0x32, 0x36, 0xF6, 0xF7, 0x37, 0xF5, 0x35, 0x34, 0xF4,
                        0x3C, 0xFC, 0xFD, 0x3D, 0xFF, 0x3F, 0x3E, 0xFE, 0xFA, 0x3A,
                        0x3B, 0xFB, 0x39, 0xF9, 0xF8, 0x38, 0x28, 0xE8, 0xE9, 0x29,
                        0xEB, 0x2B, 0x2A, 0xEA, 0xEE, 0x2E, 0x2F, 0xEF, 0x2D, 0xED,
                        0xEC, 0x2C, 0xE4, 0x24, 0x25, 0xE5, 0x27, 0xE7, 0xE6, 0x26,
                        0x22, 0xE2, 0xE3, 0x23, 0xE1, 0x21, 0x20, 0xE0, 0xA0, 0x60,
                        0x61, 0xA1, 0x63, 0xA3, 0xA2, 0x62, 0x66, 0xA6, 0xA7, 0x67,
                        0xA5, 0x65, 0x64, 0xA4, 0x6C, 0xAC, 0xAD, 0x6D, 0xAF, 0x6F,
                        0x6E, 0xAE, 0xAA, 0x6A, 0x6B, 0xAB, 0x69, 0xA9, 0xA8, 0x68,
                        0x78, 0xB8, 0xB9, 0x79, 0xBB, 0x7B, 0x7A, 0xBA, 0xBE, 0x7E,
                        0x7F, 0xBF, 0x7D, 0xBD, 0xBC, 0x7C, 0xB4, 0x74, 0x75, 0xB5,
                        0x77, 0xB7, 0xB6, 0x76, 0x72, 0xB2, 0xB3, 0x73, 0xB1, 0x71,
                        0x70, 0xB0, 0x50, 0x90, 0x91, 0x51, 0x93, 0x53, 0x52, 0x92,
                        0x96, 0x56, 0x57, 0x97, 0x55, 0x95, 0x94, 0x54, 0x9C, 0x5C,
                        0x5D, 0x9D, 0x5F, 0x9F, 0x9E, 0x5E, 0x5A, 0x9A, 0x9B, 0x5B,
                        0x99, 0x59, 0x58, 0x98, 0x88, 0x48, 0x49, 0x89, 0x4B, 0x8B,
                        0x8A, 0x4A, 0x4E, 0x8E, 0x8F, 0x4F, 0x8D, 0x4D, 0x4C, 0x8C,
                        0x44, 0x84, 0x85, 0x45, 0x87, 0x47, 0x46, 0x86, 0x82, 0x42,
                        0x43, 0x83, 0x41, 0x81, 0x80, 0x40
                    ];
                    
                    CRC.CRC16 = function (buffer) {
                        var hi = 0xff;
                        var lo = 0xff;
                        for (var i = 0; i < buffer.length; i++) {
                            var idx = hi ^ buffer[i];
                            hi = (lo ^ CRC._auchCRCHi[idx]);
                            lo = CRC._auchCRCLo[idx];
                        }
                        // 高低位的替换 只要修改lo和hi的位置即可
                        var ccc =(lo << 8 | hi).toString(16).toUpperCase();
                            // ccc=  ((lo & 0x00ff) << 8) | (hi & 0x00ff) & 0xffff;
                        return CRC.padLeft(ccc, 4, '0');
                    };
                    
                    CRC.isArray = function (arr) {
                        return Object.prototype.toString.call(arr) === '[object Array]';
                    };
                    
                    CRC.ToCRC16 = function (str) {
                        return CRC.CRC16(CRC.isArray(str) ? str : CRC.strToByte(str));
                    };
                    
                    CRC.ToModbusCRC16 = function (str) {
                        return CRC.CRC16(CRC.isArray(str) ? str : CRC.strToHex(str));
                    };
                    
                    CRC.strToByte = function (str) {
                        var tmp = str.split(''), arr = [];
                        for (var i = 0, c = tmp.length; i < c; i++) {
                            var j = encodeURI(tmp[i]);
                            if (j.length == 1) {
                                arr.push(j.charCodeAt());
                            } else {
                                var b = j.split('%');
                                for (var m = 1; m < b.length; m++) {
                                    arr.push(parseInt('0x' + b[m]));
                                }
                            }
                        }
                        return arr;
                    };
                    
                    CRC.convertChinese = function (str) {
                        var tmp = str.split(''), arr = [];
                        for (var i = 0, c = tmp.length; i < c; i++) {
                            var s = tmp[i].charCodeAt();
                            if (s <= 0 || s >= 127) {
                                arr.push(s.toString(16));
                            }
                            else {
                                arr.push(tmp[i]);
                            }
                        }
                        return arr;
                    };
                    
                    CRC.filterChinese = function (str) {
                        var tmp = str.split(''), arr = [];
                        for (var i = 0, c = tmp.length; i < c; i++) {
                            var s = tmp[i].charCodeAt();
                            if (s > 0 && s < 127) {
                                arr.push(tmp[i]);
                            }
                        }
                        return arr;
                    };
                    
                    CRC.strToHex = function (hex, isFilterChinese) {
                        hex = isFilterChinese ? CRC.filterChinese(hex).join('') : CRC.convertChinese(hex).join('');
                    
                        //清除所有空格
                        hex = hex.replace(/\s/g, "");
                        //若字符个数为奇数，补一个空格
                        hex += hex.length % 2 != 0 ? " " : "";
                    
                        var c = hex.length / 2, arr = [];
                        for (var i = 0; i < c; i++) {
                            arr.push(parseInt(hex.substr(i * 2, 2), 16));
                        }
                        return arr;
                    };
                    
                    CRC.padLeft = function (s, w, pc) {
                        if (pc == undefined) {
                            pc = '0';
                        }
                        for (var i = 0, c = w - s.length; i < c; i++) {
                            s = pc + s;
                        }
                        return s;
                    };
                    
                    // console.log(Date.parse(new Date()));
                    // console.log(CRC.ToCRC16('12345678', true));
                    // console.log(CRC.ToCRC16('12345678', false));
                    // console.log(CRC.ToModbusCRC16('12345678', true));
                    // console.log(Date.parse(new Date()));
                    return CRC.ToModbusCRC16(data, true);
                    
            }
            // Vue.prototype.getConfig = function(){
            //     return BASE_CONFIG
            // }
            Vue.prototype.GLOBAL_CONFIG = BASE_CONFIG;
            Vue.prototype.goHome = function (currentRout){
                let indexChildRout = ['home','productList','service','notice','partner','news','helpCenter']  
                if(!indexChildRout.in_array(currentRout)){
                    this.$router.push('/home')
                }
            }
            Vue.prototype.removeRootScope = function (key){
                if(sessionStorage.getItem(key)){
                    sessionStorage.removeItem(key);
                }
            }
            Vue.prototype.setRootScope = function (key,value){
                if(sessionStorage.getItem(key)){
                    sessionStorage.removeItem(key);
                }
                sessionStorage.setItem(key,value)
                //localStorage.setItem(key, value);
            }
    
            Vue.prototype.getRootScope = function (key){
                let res = sessionStorage.getItem(key)
                return res
            }
    
            Vue.prototype.getQueryString = function(name) {
                
                let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                let getUrl = window.location.href
     
                if (getUrl.indexOf("?") != -1) {
                    var url = getUrl.substr(getUrl.indexOf("?"))
           
                    let r = url.substr(1).match(reg);
                
                    if (r != null) return decodeURIComponent(r[2]);
                    return null;
                    
                }
            }
            //设计三种模式的日志：info、debug、error
            Vue.prototype.wtlLog = function(pageFrom,msg) {
                if(this.GLOBAL_CONFIG.LOGFLAG){
                        switch (this.GLOBAL_CONFIG.TESTDEEPTH) {
                            case 0:
                                    console.log(pageFrom+'::'+msg);
                                break;
                            case 1:
                                    alert(pageFrom+'::'+msg);
                                break;
                            case 2:
                                Toast({
                                    message: pageFrom+'::'+msg,
                                    position: 'middle',
                                    iconClass: 'icon icon-success',
                                    duration: 1500
                                });
                                break;
                            default:
                                break;
                        }
                }
            } 
            //公共 ：安卓蓝牙交互出入口
            Vue.prototype.callSendDataToBleUtil = function(pageFrom,sendData,crc) {
                this.wtlLog(pageFrom,'sendData='+sendData+',crc='+crc);
                if(!this.GLOBAL_CONFIG.TESTFLAG){
                    window.android.callSendDataToBle(pageFrom,sendData,crc);
                }
            } 
        }
    }
    
    