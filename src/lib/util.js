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
            Vue.prototype.GLOBAL_CONFIG = BASE_CONFIG;
            //安卓逻辑迁移 循环定时器 
            /**
             * 1、校验数据的当前状态
             * 2、正确性
             * 3、页面来源
             * 4、重发时用 时间戳
             * 5、数据会太长的指令集合 配置项
             */
            var checkData={};
            var checkPage={};
            var checkStatus={};
            var checkTime={};
            var checkSendTimes={};
            var mayTooLong={};
            var mayTooLongList=[
                // {
                // times:0,
                // directive:'',
                // value:''
                // }
            ];
            let TimerTask ={};
            // private static HashMap<String, String> checkPage=new HashMap<String, String>();
            // private static HashMap<String, Boolean> checkStatus=new HashMap<String, Boolean>();
            // private static HashMap<String, Long> checkTime=new HashMap<String, Long>();
            // private static HashMap<String, Integer> checkSendTimes=new HashMap<String, Integer>();
            // private static HashMap<String, Integer> mayTooLong=new HashMap<String, Integer>();
            // private static ArrayList<BleTooLongBean> mayTooLongList =new  ArrayList<BleTooLongBean>();
            // 增加节流函数
            var delayTimer={};
            var lastTimesReceiveData=''; 

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
                            {id:0,key:'60xx',value:'60xx'},{id:1,key:'70xx',value:'70xx'}
                        ],
                        inchComList:[
                            {id:0,key:'60xx',value:'60xx'},{id:1,key:'70xx',value:'70xx'}
                        ]
                    },{
                        typeName:'DIAMETER',
                        chooseKey:0,//默认选中
                        comList:[
                            {id:0,key:'25mm',value:'2.5mm'},{id:1,key:'32mm',value:'3.2mm'},{id:2,key:'40mm',value:'4.0mm'}
                        ],
                         //单位切换inch
                         inchComList:[
                            {id:0,key:'25mm',value:'3/32"'},{id:1,key:'32mm',value:'1/8"'},{id:2,key:'40mm',value:'5/32"'}
                        ]
                    },{
                        typeName:'THICKNESS',
                        chooseKey:0,//默认选中
                        // comList:[
                        //     {id:0,key:'6mm',value:'0.6mm'},{id:1,key:'8mm',value:'0.8mm'},{id:2,key:'9mm',value:'0.9mm'},{id:3,key:'12mm',value:'1.2mm'},{id:4,key:'16mm',value:'1.6mm'},{id:5,key:'20mm',value:'2.0mm'},{id:6,key:'25mm',value:'2.5mm'},{id:7,key:'32mm',value:'3.2mm'},{id:8,key:'48mm',value:'4.8mm'},{id:9,key:'64mm',value:'6.4mm'},{id:10,key:'80mm',value:'8.0mm'},{id:11,key:'95mm',value:'9.5mm'}
                        //     ,{id:12,key:'110mm',value:'11mm'},{id:13,key:'127mm',value:'12.7mm'}
                        // ],
                        // //单位切换inch
                        // inchComList:[
                        //     {id:0,key:'6mm',value:'24GA'},{id:1,key:'8mm',value:'22GA'},{id:2,key:'9mm',value:'20GA'},{id:3,key:'12mm',value:'18GA'},{id:4,key:'16mm',value:'16GA'},{id:5,key:'20mm',value:'14GA'},{id:6,key:'25mm',value:'12GA'},{id:7,key:'32mm',value:'1/8"'},{id:8,key:'48mm',value:'3/16"'},{id:9,key:'64mm',value:'1/4"'},{id:10,key:'80mm',value:'5/16"'},{id:11,key:'95mm',value:'3/8"'}
                        //     ,{id:12,key:'110mm',value:'7/16"'},{id:13,key:'127mm',value:'1/2"'}
                        // ]
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
                ], /** tigsyn模式**/
                tigsynList:[
                    {
                        typeName:'MODE',
                        chooseKey:0,//默认选中
                        comList:[
                            {id:0,key:'2T',value:'2T'},{id:1,key:'4T',value:'4T'}
                        ]
                    },{
                        typeName:'MATERIAL',
                        chooseKey:0,//默认选中
                        comList:[
                            {id:0,key:'Fe',value:'Fe'},{id:1,key:'AI',value:'AI'},{id:2,key:'Ss',value:'Ss'}
                        ],
                        inchComList:[
                            {id:0,key:'Fe',value:'Fe'},{id:1,key:'AI',value:'AI'},{id:2,key:'Ss',value:'Ss'}
                        ]
                    },{
                        typeName:'DIAMETER',
                        chooseKey:0,//默认选中
                        comList:[
                            {id:0,key:'16MM',value:'1.6mm'},{id:1,key:'24MM',value:'2.4mm'},{id:2,key:'32MM',value:'3.2mm'}
                            // ,{id:3,key:'40MM',value:'4.0mm'}
                        ],
                        //单位切换inch
                        inchComList:[
                            {id:0,key:'16MM',value:'1/16"'},{id:1,key:'24MM',value:'3/32"'},{id:2,key:'32MM',value:'1/8"'}
                            // ,{id:4,key:'40MM',value:'5/32"'}
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
                            {id:0,key:'AC',value:'AC'},{id:1,key:'DC',value:'DC'}
                        ]
                    },{
                        typeName:'Pulse',
                        chooseKey:0,//默认选中
                        comList:[
                            {id:0,key:'NOPULSE',value:'Off'},{id:1,key:'PULSE',value:'On'}
                        ]
                    },{
                        typeName:'HF',
                        chooseKey:0,//默认选中
                        comList:[
                            {id:0,key:'HF',value:'On'},{id:1,key:'LIFT',value:'Off'}
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
                        // comList:[
                        //     {id:0,key:'Fe',value:'Fe'},{id:1,key:'Ss',value:'Ss'},{id:2,key:'AI',value:'AI'},{id:3,key:'FCAW-S',value:'FCAW-S'},{id:4,key:'FCAW-G',value:'FCAW-G'}
                        // ],
                        // inchComList:[
                        //     {id:0,key:'Fe',value:'Fe'},{id:1,key:'Ss',value:'Ss'},{id:2,key:'AI',value:'AI'},{id:3,key:'FCAW-S',value:'FCAW-S'},{id:4,key:'FCAW-G',value:'FCAW-G'}
                        // ]
                        comList:[
                            {id:0,key:'Fe',value:'Fe'},{id:1,key:'Ss',value:'Ss'},{id:2,key:'AI',value:'AI'},{id:4,key:'FCAW-G',value:'FCAW-G'}
                        ],
                        inchComList:[
                            {id:0,key:'Fe',value:'Fe'},{id:1,key:'Ss',value:'Ss'},{id:2,key:'AI',value:'AI'},{id:4,key:'FCAW-G',value:'FCAW-G'}
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
                            {id:0,key:'CO2',value:'CO2'},{id:1,key:'MIX',value:'MIX'},{id:2,key:'Ar',value:'Ar'}
                        ],
                        inchComList:[
                            {id:0,key:'CO2',value:'CO2'},{id:1,key:'MIX',value:'MIX'},{id:2,key:'Ar',value:'Ar'}
                        ]
                    },{
                        typeName:'DIAMETER',
                        chooseKey:'6mm',//默认选中
                        comList:[
                            {id:0,key:'6mm',value:'0.6mm'},{id:1,key:'8mm',value:'0.8mm'},{id:2,key:'9mm',value:'0.9mm'},{id:3,key:'10mm',value:'1.0mm'},{id:4,key:'12mm',value:'1.2mm'}
                        ],
                        //单位切换inch
                        inchComList:[
                            {id:0,key:'6mm',value:'.023"'},{id:1,key:'8mm',value:'.030"'},{id:2,key:'9mm',value:'.035"'},{id:3,key:'10mm',value:'.040"'},{id:4,key:'12mm',value:'.045"'}
                        ]
                    },{
                        typeName:'THICKNESS',
                        chooseKey:0,//默认选中
                        comList:[
                            {id:0,key:'6mm',value:'0.6mm'},{id:1,key:'7mm',value:'0.7mm'},{id:2,key:'9mm',value:'0.9mm'},{id:3,key:'12mm',value:'1.2mm'},{id:4,key:'16mm',value:'1.6mm'},{id:5,key:'21mm',value:'2.1mm'},{id:6,key:'28mm',value:'2.8mm'},{id:7,key:'34mm',value:'3.4mm'},{id:8,key:'48mm',value:'4.8mm'},{id:9,key:'64mm',value:'6.4mm'},{id:10,key:'80mm',value:'8.0mm'},{id:11,key:'95mm',value:'9.5mm'}
                            ,{id:12,key:'110mm',value:'11mm'},{id:13,key:'127mm',value:'12.7mm'}
                        ],
                        //单位切换inch
                        inchComList:[
                            {id:0,key:'6mm',value:'24GA'},{id:1,key:'7mm',value:'22GA'},{id:2,key:'9mm',value:'20GA'},{id:3,key:'12mm',value:'18GA'},{id:4,key:'16mm',value:'16GA'},{id:5,key:'21mm',value:'14GA'},{id:6,key:'28mm',value:'12GA'},{id:7,key:'34mm',value:'1/8"'},{id:8,key:'48mm',value:'3/16"'},{id:9,key:'64mm',value:'1/4"'},{id:10,key:'80mm',value:'5/16"'},{id:11,key:'95mm',value:'3/8"'}
                            ,{id:12,key:'110mm',value:'7/16"'},{id:13,key:'127mm',value:'1/2"'}
                        ]

                    }
                ]
            }
            //焊接指令集合 crc值
            const  weldDirctive={
                    migSyn:'0570',//mig一元化
                    migMan:'9571',//mig非一元化
                    tigSyn:'6571',//Tig一元化
                    tigMan:'F570',//Tig非一元化
                    mma:'C572'
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
            const TIGSYN_DIRECTIVE_MAP=new Map([['DIAMETER','C0'],['MATERIAL','C1'],['THICKNESS','C2'],['POLATRITY','C3'],['WELDCUR','C4'],['slowDownTime','C5'],['MODE','C6'],['Getready','CE'],['Memory','CF']]);
            const MMA_DIRECTIVE_MAP = new Map([['POLATRITY','E0'],['ELECTRODE','E1'],['DIAMETER','E2'],['THICKNESS','E3'],['FORCE','E4'],['MMA_CURRENT','E5'],['Getready','EE'],['Memory','EF']]);
            const TIGMAN_DIRECTIVE_MAP =new Map([['TDCHFPULSE','D0'],['pre_gas','D1'],['start_cur_end','D2'], ['slop_up','D3'],['weld_cur','D4'],['base_cur','D5'],['pulse_fre','D6'],['pulse_duty','D7'],['slop_down','D8'],['crater_cur','D9'],['post_gas','DA'],['ac_fre','DB'],['ac_balance','DB'],['Getready','DE'],['Memory','DF']]);
           //特殊指令数组 存储、历史等
           const SPECIAL_DIRECTIVE_MAP =new Map([['CALL_MEMORY','20'],['APPY_MEMORY','21'],['CALL_LAST_WELD','30'],['APPY_LAST_WELD','31'],['EDIT_UNIT','40'],['OVERRIDE','22']]);
            //tigman映射关系
            const tigmanLineMap = new Map([
                [0,'pre_gas'],
                [1,'start_cur_end'],
                [2,'slop_up'],
                [3,'weld_cur'],
                [4,'peak_cur'],
                [5,'pulse_duty'],
                [6,'pulse_fre'],
                [7,'base_cur'],
                [8,'slop_down'],
                [9,'crater_cur'],
                [10,'post_gas'],
                [11,'ac_fre'],
                [12,'ac_balance']
            ]);
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
             function  setWeldDataByType(arrayList,type,pageFrom,_this){ 
                 console.log(pageFrom+'|||||'+type);
                 console.log(arrayList)
                 
               var rstInfo={};
               switch (type) {
                   case weldDirctive.migSyn:
                        //确认指令
                        rstInfo.nowTypeList=JSON.parse(JSON.stringify(weldParam.migsynTypeList))
                        console.log('33222222222222222222333');
                        console.log(weldParam.migsynTypeList)
                        
                        if((arrayList[1]=='225'||arrayList[1]=='209'||arrayList[1]=='193') &&arrayList.length==14){
                            
                            //赋值开始  ......
                            rstInfo.weldType='MIGSYN';
                            rstInfo.weldTypeNum=_this.GLOBAL_CONFIG.callWeldTypeData.migsyn.newIndex;//这个和首页里的配对
                            //对第一个元素进行解析 拆成数组
                            var byte1Bean = num16To2Arr(arrayList[2],'',pageFrom);
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
                                        // alert(element.chooseKey);
                                        break;
                                    case 'THICKNESS':
                                        element.chooseKey=arrayList[6]?arrayList[6]:0;
                                        // element.chooseKey=setWeldParams('THICKNESS',arrayList[6]);
                                        break;
                                    default:
                                        break;
                                }
                            });
                            console.log(rstInfo.nowTypeList)
                            var parr7 =((Array(8).join(0) + parseInt(arrayList[7],10).toString(2)).slice(-8));
                             //bit4-7
                             rstInfo.INDUCTANCE =parseInt(parr7.substring(0,4),2).toString(10);//机器上发不能改 不知道干嘛的
                             //bit0-3
                            rstInfo.RECOMMEND_INDUCTANCE =parseInt(parr7.substring(4,8),2).toString(10);//机器上发不能改 不知道干嘛的
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
                        rstInfo.weldTypeNum=_this.GLOBAL_CONFIG.callWeldTypeData.migman.newIndex;//这个和首页里的配对
                        console.log('1111112222233333:'+arrayList.length)
                        
                        if((arrayList[1]=='226'||arrayList[1]=='210'||arrayList[1]=='194') && arrayList.length==6){
                            //赋值开始  ......
                            //对第一个元素进行解析 拆成数组
                            var byte1Bean = num16To2Arr(arrayList[2],'',pageFrom);
                            rstInfo.nowTypeList.forEach(element => {
                                if(element.typeName=='MODE'){
                                    element.chooseKey=byte1Bean.mode?byte1Bean.mode:0;
                                }
                            });
                            rstInfo.SPEED_DISPLAY =arrayList[3];//送丝速度
                            rstInfo.V_WELDING =arrayList[4];//电压
                            // rstInfo.INDUCTANCE =arrayList[5];//机器上发不能改 不知道干嘛的
                            var parr5 =((Array(8).join(0) + parseInt(arrayList[5],10).toString(2)).slice(-8));
                            // alert(arrayList[5]+"||"+parr5)
                            //bit4-7
                            rstInfo.INDUCTANCE =parseInt(parr5.substring(4,8),2).toString(10);//机器上发不能改 不知道干嘛的
                            //bit0-3
                            rstInfo.RECOMMEND_INDUCTANCE =parseInt(parr5.substring(0,4),2).toString(10);//机器上发不能改 不知道干嘛的
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
                        console.log(rstInfo.nowTypeList)
                        rstInfo.weldType='TIGSYN';
                        rstInfo.weldTypeNum=_this.GLOBAL_CONFIG.callWeldTypeData.tigsyn.newIndex;//这个和首页里的配对
                       //确认指令
                       
                       if((arrayList[1]=='227'||arrayList[1]=='211'||arrayList[1]=='195') &&arrayList.length==11){
                           //赋值开始  ......
                           var byte1Bean = num16To2Arr(arrayList[2],'',pageFrom);
                           //拆解成
                           var  arrtwo= num16To2ArrSpecial02(arrayList[3]);
                           
                           rstInfo.nowTypeList.forEach(element => {
                                switch (element.typeName) {
                                    case 'MODE':
                                        element.chooseKey=byte1Bean.mode;
                                        break;
                                    case 'MATERIAL':
                                        element.chooseKey=arrtwo.material;
                                        break;
                                    case 'DIAMETER':
                                        element.chooseKey=arrtwo.diameter;
                                        break;
                                    case 'THICKNESS':
                                        element.chooseKey=arrayList[4]?arrayList[4]:0;
                                        break;
                                    case 'POLATRITY':
                                        element.chooseKey=arrtwo.material==1?0:1;//只有al是ac
                                        break;
                                    default:
                                        break;
                                }
                            });
                            console.log(rstInfo,arrayList)
                            
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
                            //新增
                            console.log(arrayList)
                            rstInfo.slowDownTime =arrayList[9];//缓降时间
                            rstInfo.sdTime_min=0;
                            rstInfo.sdTime_max=100;
                            rstInfo.postGasTime =arrayList[10] || '-';//后送气时间
                       }
                      break;
                    case weldDirctive.tigMan:
                        rstInfo.nowTypeList=weldParam.tigmanList;
                        console.log(rstInfo.nowTypeList)
                        rstInfo.weldType='TIGMAN';
                        rstInfo.weldTypeNum=_this.GLOBAL_CONFIG.callWeldTypeData.tigman.newIndex;//这个和首页里的配对
                       //确认指令
                       console.log(arrayList.length+'aa')
                       if((arrayList[1]=='228'||arrayList[1]=='212'||arrayList[1]=='196') &&arrayList.length==16){
                           var  rstBean = tigmanSpecilBuildHeader(arrayList[2],arrayList[3],pageFrom);
                           console.log(rstBean);
                           rstInfo.nowTypeList.forEach(element => {
                                switch (element.typeName) {
                                    case 'MODE':
                                        element.chooseKey=rstBean.mode;
                                        break;
                                    case 'POLATRITY':// POLATRITY 20201024 不对应啊 所以值没改
                                        element.chooseKey=rstBean.polatrity;
                                        break;
                                    case 'Pulse'://"Pulse" Pluse 20201024 不对应啊 所以值没改
                                       console.log(rstBean.ifpulse)
                                        element.chooseKey=rstBean.ifpulse;
                                        break;
                                    case 'HF':
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
                        rstInfo.weldTypeNum=_this.GLOBAL_CONFIG.callWeldTypeData.mma.newIndex;//这个和首页里的配对
                       //确认指令
                       if((arrayList[1]=='229'||arrayList[1]=='213'||arrayList[1]=='197') &&arrayList.length==10){
                           //赋值开始  ......
                           var byte1Bean = num16To2Arr(arrayList[2],'MMA',pageFrom);
                           //拆解成
                           var  arrthree= num16To2ArrSpecial03(arrayList[3]);
                           rstInfo.nowTypeList.forEach(element => {
                                switch (element.typeName) {
                                    case 'POLATRITY':
                                        element.chooseKey=byte1Bean.acdc;
                                        // alert(element.chooseKey)
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
                           rstInfo.THINKNESS_VALUE=arrayList[4]?arrayList[4]:0;
                           rstInfo.ARC_FORCE_VAL =arrayList[5];
                        //    alert(  rstInfo.ARC_FORCE_VAL)
                           rstInfo.MMA_RECOMMEND_CURRENT =arrayList[6];//推荐电流
                           rstInfo.MMA_CURRENT_VAL=arrayList[7];

                           rstInfo.MMA_MIN_CUR=10;
                        //    rstInfo.MMA_MAX_CUR=byte1Bean.pfc==1?200:110;
                        //    rstInfo.MMA_MAX_CUR=byte1Bean.pfc==1?220:200;//2019.01.25修改之前错了？？？
                        //    rstInfo.MMA_MAX_CUR=byte1Bean.pfc==1?220:110;//2019.05.25修改之前错了？？？
                           rstInfo.MMA_MAX_CUR=byte1Bean.pfc==1?200:110;//2019.07.29
                           rstInfo.MMA_MIN_THICHNESS= arrayList[8] ||0;//板厚最小值
                           rstInfo.MMA_MAX_THICHNESS= arrayList[9] ||13;//板厚最大值
                           rstInfo.initBean=byte1Bean;//包含很多焊接状态和单位等
                       }
                      break;
                   default:
                       break;
               }
               
               //全局存储
               if(pageFrom=='memory'){
                //    alert(JSON.stringify(rstInfo))
                store.state.memoryInfo =JSON.parse(JSON.stringify(rstInfo));//深度复制
               }else{
                store.state.rstInfo = JSON.parse(JSON.stringify(rstInfo));//深度复制
               }
            //    alert(JSON.stringify(rstInfo));
               console.log(rstInfo);
               return rstInfo;
             }
             function newTigmanDataBuild(arrayList,type,pageFrom,_this){
                var rstInfo={};
                rstInfo.nowTypeList=weldParam.tigmanList;
                console.log(rstInfo.nowTypeList)
                rstInfo.weldType='TIGMAN';
                rstInfo.weldTypeNum=_this.GLOBAL_CONFIG.callWeldTypeData.tigman.newIndex;//这个和首页里的配对
                //确认指令
                console.log(arrayList.length+'aa')
                if((arrayList[1]=='228'||arrayList[1]=='212'||arrayList[1]=='196') &&arrayList.length==6){
                    var  rstBean = tigmanSpecilBuildHeader(arrayList[2],arrayList[3],pageFrom);
                    console.log(rstBean);
                    rstInfo.nowTypeList.forEach(element => {
                        console.log(element.typeName)
                            switch (element.typeName) {
                                case 'MODE':
                                    element.chooseKey=rstBean.mode;
                                    break;
                                case 'POLATRITY':
                                    element.chooseKey=rstBean.polatrity;
                                    break;
                                case 'Pulse':
                                    console.log(rstBean.ifpulse)
                                    element.chooseKey=rstBean.ifpulse;
                                    break;
                                case 'HF':
                                    element.chooseKey=rstBean.ifhf
                                    break;
                                default:
                                    break;
                            }
                        });
                    //赋值开始  ......
                    rstInfo.nowChooseIndex =arrayList[4];//
                    rstInfo.nowChoosedKeyName=tigmanLineMap.get(parseInt(arrayList[4]));
                    rstInfo.paramValue =arrayList[5];
                    
                    rstInfo.initBean=rstBean;//包含很多焊接状态和单位等
                } 
                store.state.rstInfo = rstInfo;
                console.log(rstInfo)
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
                console.log(weldParam.migsynTypeList,pageFrom,dirctiveType,data);
                // alert(dirctiveType+'||'+store.state.nowModelDirectice+'||'+pageFrom)
                
                var rstInfo ={};
                if(!pageFrom){
                    return;
                }
                console.log(pageFrom+'laolao');
                //1、来自那个页面有自己独立的数据处理方式
                switch (pageFrom) {
                    case 'newIndex':
                        //首页去除 放外面会导致memory也去除
                        if(store.state.nowModelDirectice!='' &&dirctiveType!=store.state.nowModelDirectice){
                            return;
                        }
                    
                        rstInfo =buidDataByPagefrom(pageFrom,dirctiveType,data,this);
                        break;
                    case 'memory':
                        console.log(dirctiveType+':ll22ll');
                        
                        // let temp =data.substring(0,5)+data.substring(8,data.length)
                        
                        rstInfo =buidDataByPagefrom(pageFrom,dirctiveType,data,this);
                        //  alert(JSON.stringify(rstInfo))
                        break;
                    case 'hisweldlist':
                        rstInfo =buidDataByPagefrom('newIndex',dirctiveType,data,this);
                        break;
                    default:
                        break;
                }
                return rstInfo;
            }
            //焊接中 处理类
            // Vue.prototype.weldBuildData = function(pageFrom,dirctiveType,data){
                
            // }
            //抽取的公共部分
            function buidDataByPagefrom(pageFrom,dirctiveType,data,_this){
                console.log(data)
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
                    temp10.push(parseInt(("0x"+strArr[9]+strArr[8]),16).toString(10));//送丝推荐值
                    temp10.push(parseInt(("0x"+strArr[11]+strArr[10]),16).toString(10));//送丝速度
                    temp10.push(parseInt(("0x"+strArr[13]+strArr[12]),16).toString(10));//电压推荐值
                    temp10.push(parseInt(("0x"+strArr[15]+strArr[14]),16).toString(10));//电压

                    temp10.push(parseInt(("0x"+strArr[16]),16).toString(10));//板厚最小值
                    temp10.push(parseInt(("0x"+strArr[17]),16).toString(10));//板厚最大值
                    //转成10进制
                    rstInfo = setWeldDataByType(temp10,weldDirctive.migSyn,pageFrom,_this);
                 //请求mig mma模式数据
                }else if(compareString(dirctiveType,weldDirctive.migMan)){
                    var strArr =data.split(' ');
                    console.log(strArr);
                    var temp10 =[];
                    temp10.push(parseInt(("0x"+strArr[0]),16).toString(10));//da
                    temp10.push(parseInt(("0x"+strArr[1]),16).toString(10));//指令
                    console.log(strArr[1]+'kkkkk');
                    temp10.push(parseInt(("0x"+strArr[2]),16).toString(10));//mode及焊接状态
                    temp10.push(parseInt(("0x"+strArr[4]+strArr[3]),16).toString(10));//送丝速度
                    temp10.push(parseInt(("0x"+strArr[6]+strArr[5]),16).toString(10));//电压
                    temp10.push(parseInt(("0x"+strArr[7]),16).toString(10));//电感量
                    //转成10进制
                    rstInfo = setWeldDataByType(temp10,weldDirctive.migMan,pageFrom,_this);
                }else if(compareString(dirctiveType,weldDirctive.tigSyn)){
                    var strArr =data.split(' ');
                    var temp10 =[];
                    temp10.push(parseInt(("0x"+strArr[0]),16).toString(10));//头DA
                    temp10.push(parseInt(("0x"+strArr[1]),16).toString(10));//指令
                    temp10.push(parseInt(("0x"+strArr[2]),16).toString(10));//mode及焊接状态
                    temp10.push(parseInt(("0x"+strArr[3]),16).toString(10));//钨丝直径+金属
                    temp10.push(parseInt(("0x"+strArr[4]),16).toString(10));//板厚
                    temp10.push(parseInt(("0x"+strArr[6]+strArr[5]),16).toString(10));//电流推荐值
                    temp10.push(parseInt(("0x"+strArr[8]+strArr[7]),16).toString(10));//电流
                    temp10.push(parseInt(("0x"+strArr[9]),16).toString(10));//板厚最小值
                    temp10.push(parseInt(("0x"+strArr[10]),16).toString(10));//板厚最大值
                    temp10.push(parseInt(("0x"+strArr[11]),16).toString(10));//缓降时间
                    temp10.push(parseInt(("0x"+strArr[12]),16).toString(10));//后置气时间
                    //转成10进制
                    rstInfo = setWeldDataByType(temp10,weldDirctive.tigSyn,pageFrom,_this);
                }else if(compareString(dirctiveType,weldDirctive.mma)){
                    var strArr =data.split(' ');
                    var temp10 =[];
                    temp10.push(parseInt(("0x"+strArr[0]),16).toString(10));//头DA
                    temp10.push(parseInt(("0x"+strArr[1]),16).toString(10));//指令
                    temp10.push(parseInt(("0x"+strArr[2]),16).toString(10));//直流、交流类型及焊接状态
                    temp10.push(parseInt(("0x"+strArr[3]),16).toString(10));//焊条类型+直径
                    temp10.push(parseInt(("0x"+strArr[4]),16).toString(10));//板厚
                    temp10.push(parseInt(("0x"+strArr[5]),16).toString(10));//电弧推力
                    temp10.push(parseInt(("0x"+strArr[7]+strArr[6]),16).toString(10));//电流推荐值
                    temp10.push(parseInt(("0x"+strArr[9]+strArr[8]),16).toString(10));//电流
                    temp10.push(parseInt(("0x"+strArr[10]),16).toString(10));//板厚最小值
                    temp10.push(parseInt(("0x"+strArr[11]),16).toString(10));//板厚最大值
                    //转成10进制
                    rstInfo = setWeldDataByType(temp10,weldDirctive.mma,pageFrom,_this);
                }else if(compareString(dirctiveType,weldDirctive.tigMan) && pageFrom=='memory'){
                    var strArr =data.split(' ');
                    console.log(strArr)
                    var temp10 =[];
                    temp10.push(parseInt(("0x"+strArr[0]),16).toString(10));//头DA
                    temp10.push(parseInt(("0x"+strArr[1]),16).toString(10));//指令
                    temp10.push(parseInt(("0x"+strArr[2]),16).toString(10));//焊接状态等
                    temp10.push(parseInt(("0x"+strArr[3]),16).toString(10));//MODE+ADCD+2T4T+PULSE
                    temp10.push(parseInt(("0x"+strArr[4]),16).toString(10));//PRE_GAS_VAL
                    temp10.push(parseInt(("0x"+strArr[6]+strArr[5]),16).toString(10));//START_CUR_VAL
                    temp10.push(parseInt(("0x"+strArr[7]),16).toString(10));//SLOP_UP
                    temp10.push(parseInt(("0x"+strArr[9]+strArr[8]),16).toString(10));//WELD_CUR
                    temp10.push(parseInt(("0x"+strArr[11]+strArr[10]),16).toString(10));//BASE_CUR
                    temp10.push(parseInt(("0x"+strArr[13]+strArr[12]),16).toString(10));//PULSE_FRE
                    temp10.push(parseInt(("0x"+strArr[14]),16).toString(10));//DUTY-VAL
                    temp10.push(parseInt(("0x"+strArr[15]),16).toString(10));//SLOP-DOWN
                    temp10.push(parseInt(("0x"+strArr[17]+strArr[16]),16).toString(10));//CRATER-CUR
                    temp10.push(parseInt(("0x"+strArr[18]),16).toString(10));//POST-GAS
                    temp10.push(parseInt(("0x"+strArr[19]),16).toString(10));//AC-FRE-VAL
                    temp10.push(parseInt(("0x"+strArr[20]),16).toString(10));//AC-DUTY-VAL
                    //转成10进制
                    console.log(temp10)
                    rstInfo = setWeldDataByType(temp10,weldDirctive.tigMan,pageFrom,_this);
                }else if(compareString(dirctiveType,weldDirctive.tigMan) && pageFrom=='newIndex'){
                    //新规则
                    var strArr =data.split(' ');
                    var temp10 =[];
                    temp10.push(parseInt(("0x"+strArr[0]),16).toString(10));//头DA 218
                    temp10.push(parseInt(("0x"+strArr[1]),16).toString(10));//指令 228
                    temp10.push(parseInt(("0x"+strArr[2]),16).toString(10));//焊接状态等 66
                    temp10.push(parseInt(("0x"+strArr[3]),16).toString(10));//MODE+ADCD+2T4T+PULSE 2
                    temp10.push(parseInt(("0x"+strArr[4]),16).toString(10));//count 对应当前选中哪个参数 4
                    temp10.push(parseInt(("0x"+strArr[6]+strArr[5]),16).toString(10));//数值 0
                    // ["218", "228", "66", "2", "4", "0"]
                    //转成10进制
                    console.log(temp10)
                    rstInfo = newTigmanDataBuild(temp10,weldDirctive.tigMan,pageFrom,_this);
                    console.log(rstInfo)
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
            
            function tigmanSpecilBuildHeader(arr1,arr2,pageFrom){
                 var buildArr = ((Array(8).join(0) + parseInt(arr1,10).toString(2)).slice(-8)).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' ');
                 console.log(arr1,arr2)
                 var secdArr = ((Array(8).join(0) + parseInt(arr2,10).toString(2)).slice(-8)).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' ');
                 var bean ={};
                 //0|单位
                     bean.unit=buildArr[7];
                 //1|pfc
                     bean.pfc=buildArr[6];
                 //2|焊接
                     bean.weldStatus =buildArr[5]
                     //焊接中状态赋值
                     if(bean.weldStatus==1){
                       if(pageFrom=='newIndex'){
                         store.state.weldingStatus=1
                       }
                     }else{
                        store.state.weldingStatus=0;
                        store.state.getWeldingInfoTimes=0;//重置
                     }
                 //3|过热
                     bean.hotStatus =buildArr[4]
                 //4|过流
                     bean.flowStatus =buildArr[3]
                 //5|空
                     bean.empty1 =buildArr[2]
                 //6|空
                    //  bean.empty2 =buildArr[1]
                    bean.isReadyFlag =buildArr[1] || 0;
                 //7|空
                     bean.empty3 =buildArr[0]
                    /***2222222 begin***/
                     //0|2t4t
                      bean.mode=secdArr[7];
                      bean.modeValue = bean.mode==1?'4T':'2T';
                    //1|acdc
                        bean.polatrity=secdArr[6];
                    //2|hf
                        bean.ifhf =secdArr[5]
                    //3|pulse
                        bean.ifpulse =secdArr[4]
                        bean.ifpulseValue =bean.ifpulse==1?'NOPULSE':'PULSE';
                    //4|空
                        bean.empty20 =secdArr[3]
                    //5|空
                        bean.empty21 =secdArr[2]
                    //6|空
                        bean.empty22 =secdArr[1]
                    //7|空
                        bean.empty23 =secdArr[0]
                        
                        bean.nowChooseModel=bean.modeValue+'_'+bean.ifpulseValue+'_DC';
                        console.log(bean.nowChooseModel)      
                     /***2222222 end***/
                 return bean;
            }
              //转成16进制转2进制 之后不足的位数补零 MMA
              function num16To2ArrSpecial03(num,len){
                var buildArr = ((Array(8).join(0) + parseInt(num,10).toString(2)).slice(-8)).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' ');
                // var buildArr = parseInt(num,10).toString(2);
                var bean ={};
                //钨丝直径
                bean.electrode= parseInt(buildArr[6]+buildArr[7],2);
                //校验结果
                if( bean.electrode>1){
                    bean.electrode=0;//默认值
                }
                bean.diameter= parseInt(buildArr[3]+buildArr[4]+buildArr[5],2);
                
                if( bean.diameter>3){
                    bean.diameter=0;//默认值
                }
                return bean;
            }
             //转成16进制转2进制 之后不足的位数补零 TIGSYN
            function num16To2ArrSpecial02(num,len){
                var buildArr = ((Array(8).join(0) + parseInt(num,10).toString(2)).slice(-8)).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' ');
                console.log(num,buildArr)
                // var buildArr = parseInt(num,10).toString(2);
                var bean ={};
                //钨丝直径
                bean.diameter= parseInt(buildArr[5]+buildArr[6]+buildArr[7],2);
                //校验结果
                if( bean.diamete>3){
                    bean.diamete=0;//默认值
                }
                bean.material= parseInt(buildArr[2]+buildArr[3]+buildArr[4],2);
                if( bean.material>2){
                    bean.material=0;//默认值
                }
                return bean;
            }
            //转成16进制转2进制 之后不足的位数补零
            function num16To2Arr(num,type,pageFrom){
                console.log(num)
                // return (Array(len).join('0') + parseInt(num,16).toString(2)).slice(-len);
                //直接返回切割后的数组
                // var buildArr = (Array(len).join('0') + parseInt(num,16).toString(2)).slice(-len).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' ');
                var buildArr = ((Array(8).join(0) + parseInt(num,10).toString(2)).slice(-8)).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' ');
                // var buildArr = parseInt(num,10).toString(2);
                // alert(num)
                console.log(buildArr)
                var bean ={};
                //0|单位
                    bean.unit=buildArr[7];
                //1|pfc
                    bean.pfc=buildArr[6];
                //2|焊接
                    bean.weldStatus =buildArr[5]
                    //焊接中状态赋值
                    // alert('焊接状态'+bean.weldStatus+'pageFrom:'+pageFrom);
                    if(bean.weldStatus==1){
                        if(pageFrom=='newIndex'){
                            store.state.weldingStatus=1
                        }
                    }else{
                        store.state.weldingStatus=0;
                        store.state.getWeldingInfoTimes=0;//重置
                     }
                    //  alert("getWeldingInfoTimes:"+ store.state.getWeldingInfoTimes+"weldingStatus:"+ store.state.weldingStatus)
                //3|过热
                    bean.hotStatus =buildArr[4]
                //4|过流
                    bean.flowStatus =buildArr[3]
                //5|空
                    bean.empty1 =buildArr[2]
                //6|空 1代表 准备焊接了
                    // bean.empty2 =buildArr[1]
                    bean.isReadyFlag =buildArr[1];
                //7|mode  AD/DC
                    if(type=='MMA'){
                        bean.acdc =buildArr[0]
                    }else{
                        bean.mode =buildArr[0]
                    }
                    
                return bean;
            }
            //crc16位数字处理 注意这里定义了两个相同的方法要改一起改 下
            Vue.prototype.crcModelBusClacQuery = function(data) {
                
                return crcModelBusClacQuery(data);
                    
            }
            //crc16位数字处理 注意这里定义了两个相同的方法要改一起改 下
             function crcModelBusClacQuery(data){   
                console.log('crcModelBusClacQuery开始')
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
                console.log('crcModelBusClacQuery结束')
                return CRC.ToModbusCRC16(data, true);
                
        }
            // Vue.prototype.getConfig = function(){
            //     return BASE_CONFIG
            // }
            
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
           
            // //公共 ：安卓蓝牙交互出入口 + 苹果20200817
            Vue.prototype.callSendDataToBleUtil = function(pageFrom,sendData,crc) {
                console.log(sendData)
                this.wtlLog(pageFrom,'sendData='+sendData+',crc='+crc);
                
                if(!this.GLOBAL_CONFIG.TESTFLAG){
                    // Toast({
                    //     message: this.GLOBAL_CONFIG.ENV_IOS_FLAG+sendData,
                    //     position: 'middle',
                    //     iconClass: 'icon icon-success',
                    //     duration: 2500
                    //   });
                    if(this.GLOBAL_CONFIG.ENV_IOS_FLAG){
                        //ios 逻辑需借鉴后端的
                        let directive =sendData.substring(2,4);
                        //0、初始化 开始定时器
                        if("FF"!=directive){//不是响应的需要开启定时器
                            // MainActivity.requestFromHtmlInit(pageFrom, data, crcCode);
                            checkPage[crc]= pageFrom;//页面来源
                            checkStatus[crc] =1;//默认请求还未成功 2:成功
                            checkData[crc] = sendData;//要发送的数据
                            checkTime[crc] = new Date().getTime();//时间戳
                            checkSendTimes[crc] =1;
                        }
                        //1、改写直接 发字符串
                        try {
                            store.state.nowPageFrom=pageFrom;
                            var message = {"method":"handleSendData","sendDt":sendData}
                            window.webkit.messageHandlers.interOp.postMessage(message);
                            if("FF"!=directive){//响应不需要开启定时器
                                // console.log('initTimer=========')
                                //异步操作
                                setTimeout(() => {
                                    initTimer();
                                }, 20);
                            }
                        } catch (error) {
                            Toast({
                                message: 'sendError:'+pageFrom,
                                position: 'middle',
                                iconClass: 'icon icon-success',
                                duration: 1500
                              });
                        }
                    }else{
                        store.state.nowPageFrom=pageFrom;
                        window.android.callSendDataToBle(pageFrom,sendData,crc);
                    }
                    
                }
            } 
            //公共 ：10机制数转成 高低位按规则变动的 16进制数
            Vue.prototype.jinzhiChangeFuc = function(num) {
               //规则1
                // var tempNum = ((Array(8).join(0) + parseInt(num,10).toString(2)).slice(-8));
                // parseInt(tempNum.substring(4,8),2).toString(16);//低位
                // parseInt(tempNum.substring(0,4),2).toString(16);//高位
            //   ((Array(2).join(0) + parseInt('00010001'.substring(0,4),2).toString(16)).slice(-2));
            //低+高    
            // return ((Array(2).join(0) + parseInt(tempNum.substring(4,8),2).toString(16)).slice(-2))
            //             +((Array(2).join(0) + parseInt(tempNum.substring(0,4),2).toString(16)).slice(-2));

                //规则2
                var tempNum = ((Array(4).join(0) + parseInt(num,10).toString(16)).slice(-4));
                tempNum= tempNum.substring(2,4)+tempNum.substring(0,2);
                return tempNum;
            } 
            //字符串首字母大写
            Vue.prototype.changeStrShowName = function(str) {
                // if(str.indexOf('-')>0){
                //     var tempStr =str.split('-');
                //     console.log(tempStr[0]);
                //     return tempStr[0];
                // }
                // alert(str.indexOf('-'))
                if(str=='HF'){//针对HF这种端的特殊处理
                    return str;
                }
                var array = str.toLowerCase().split(" ");
                for (var i = 0; i < array.length; i++){
                array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length);
                }
                var string = array.join(" ");
                return string;
            }
            //tigman 改为tig man加个空格
            Vue.prototype.changeStrEmptyName = function(str) {
                return str.substring(0,3) +' '+ str.substring(3,8);
            }
            function initTimer(){
               var shutDownFlag =false;//终止的标识
               
               	//检查是否需要重发
                for(let crcCode  in checkStatus){
                    // console.log(crcCode + '---' + checkStatus[crcCode]);
                    if(checkStatus[crcCode]!=1){
                        //没有数据停止
                        continue;
                    }
                    shutDownFlag =true;
                    //是否超出总的重发次数 10次
                    if(checkSendTimes[crcCode]<=10){
                        //是否大于四百ms
                        let nowTime =new Date().getTime();
                        if((nowTime -checkTime[crcCode])>1500){
                            //更新时间戳
                            checkTime[crcCode]=nowTime;
                            //更新重发次数
                            checkSendTimes[crcCode] = checkSendTimes[crcCode]+1;
                            //重发给蓝牙消息
                            var sendData = checkData[crcCode];
                            // target_chara.setValue(HexCommandtoByte(data.getBytes()));
                            // mBluetoothLeService.writeCharacteristic(target_chara);
                            console.log('sendData'+sendData);
                            var message = {"method":"handleSendData","sendDt":sendData}
                            window.webkit.messageHandlers.interOp.postMessage(message);
                        }
                    }else{
                        checkStatus[crcCode]=3;//强制置为成功
                    }
                }
                if(shutDownFlag){
                    //有未完成的任务开启
                    clearInterval(TimerTask);//清除旧的定时器！！会造成内存溢出
		    		TimerTask =setInterval(()=>{
                        initTimer();
                    },1500);
		    	}else{
                    clearInterval(TimerTask);
                }
            }
            //ios监听蓝牙返回数据 重要！！！ 
            // window['iosBleDataLayoutFuc']= (bleReponseData) => {
                // if(lastTimesReceiveData==bleReponseData){
                //     //返回响应
                //     //延迟一阵子再执行 机器上发频率0.5s
                //     delayTimer = setTimeout(() => {
                //         iosBleDataLayoutFuc(bleReponseData)
                //     }, 400);
                //     return;
                // }else{
                //     lastTimesReceiveData=bleReponseData;
                //     clearTimeout(delayTimer);
                //     iosBleDataLayoutFuc(bleReponseData)
                // }
                // iosBleDataLayoutFuc(bleReponseData)
            // }
            //ios监听蓝牙返回数据 重要！！！ 
            window['iosBleDataLayoutFuc']= (bleReponseData) => {
                console.log(store.state.rizhiListFlag)
                if(store.state.rizhiListFlag){
                    //记录日志
                    var oDay = new Date(); 
                    var bean = {
                        'sendTime':oDay.getFullYear()+'-'+(oDay.getMonth()+1)+'-'+oDay.getDate()+' '+oDay.getHours()+':'+oDay.getMinutes(),
                        'bleReponseData':bleReponseData
                    }
                    let aa =store.state.rizhiList;
                    if(aa.length>5000){
                        aa=[];//清空
                    }
                    aa.unshift(bean);
                    store.state.rizhiList = aa;
                }
                bleReponseData =(bleReponseData +"").replace(/\[/g,'').replace(/\]/g,'');
                bleReponseData=bleReponseData.split(',')
                try {
                    // Toast({
                    //     message:Array.isArray(bleReponseData),
                    //     position: 'middle',
                    //     iconClass: 'icon icon-success',
                    //     duration: 11000
                    // });
                    if(bleReponseData && bleReponseData.length>0){
                        let data='';
                        //1、处理
                        // [218, 225, 0, 0, 0, 0, 2, 0, 60, 0, 61, 0, 180, 0, 200, 0, 2, 9, 46, 119]
                        let tempByte ='';
                        bleReponseData.forEach(element => {
                            tempByte = parseInt(element,10).toString(16);
                            data += tempByte.length==2?tempByte:'0'+tempByte;//注意补位
                        });
                        //2、crc校验(注意最长的)     console.log(this.crcModelBusClacQuery('100000', true))//0570
                        let len =data.length;
                        data =data.toUpperCase();//大写
                        console.log(data)
                        //帧头+指令+crc校验daffaaaa aaaa
                        if(len>11 && data.indexOf('DA')==0){
                            //da 10 00 00 0750
                            // let value = data.substring(2,len-4);
                            let crc = data.substring(len-4,len);
                            if(data.indexOf("DAFF")==0){
                                //规则变更:(ff+接收到数据)+crc
                                if(data.length!=12){
                                    return;
                                }else{
                                    let oldcrc = data.substring(4, 8)
                //					data.substring(2, 8);//原来的crc
                //					data.substring(8, 12);//现在的crc
                                    let  tempMidData = "FF" +oldcrc.toString();//转字符串否则出错
                                    
                                    let newCrc = crcModelBusClacQuery(tempMidData, true);
                                    console.log(crc,oldcrc,newCrc)
                                    
                                    if(crc == newCrc){
                                        delete(checkData[oldcrc]);
                                        delete(checkPage[oldcrc]);
                                        delete(checkStatus[oldcrc]);
                                        delete(checkTime[oldcrc]);
                                        delete(checkSendTimes[oldcrc]);
                                    }
                                }
                                return;
                            //如果是返回焊接中的电流，电压
                            }else if(data.indexOf("DAB")==0){
                                window.tellVueWelding(data);
                                // mWebView.loadUrl("javascript:tellVueWelding('" + data +"')");
                                return;
                            //MEMORY
                            }else if(data.indexOf("DAD")==0){
                                window.broastMemoryFromAndroid(data);
                                // mWebView.loadUrl("javascript:broastMemoryFromAndroid('" + data +"')");
                                return;
                            }
                        //history
                            else if(data.indexOf("DAC")==0){
                                window.broastHistoryFromAndroid(data);
                                // mWebView.loadUrl("javascript:broastHistoryFromAndroid('" + data +"')");
                                return;
                            }//失败 重发
                            else if(data.indexOf("DA00")==0){
                                //重发
                                checkTime[crc] = new Date().getTime();
                                checkSendTimes[crc]=checkSendTimes[crc]+1;
                                let reSendData = checkData[crc];
                                var message = {"method":"handleSendData","sendDt":reSendData}
                                window.webkit.messageHandlers.interOp.postMessage(message);
                                return;
                            }
                            
                            //不是响应信息走正常路线
                            //1、截取数据进行切割校验   最后四位 作为crc校验值    查看是否正确
                            let midData ="";
                            if(data.length==8){
                                //结束 没有数据字段
                                midData="";
                            }else{
                                midData =data.substring(2, data.length-4);
                            }
                            // Toast({
                            //     message: 'midData'+midData,
                            //     position: 'middle',
                            //     iconClass: 'icon icon-success',
                            //     duration: 5000
                            // });
                            //查不到走这里
                            if(!checkData[crc] && midData){
                                console.log(midData)
                                let newCrc = crcModelBusClacQuery(midData, true);
                                console.log(newCrc)
                                //取crc校验如果不一致则失败 发送crc校验失败的响应值
                                // Toast({
                                //     message: crc+'||'+newCrc,
                                //     position: 'middle',
                                //     iconClass: 'icon icon-success',
                                //     duration: 2000
                                // });
                                if(crc!=newCrc){
                                    //可能数据太长造成的
                                    doDataTooLongHeader(data);
                                    return;
                                }
                                if(!checkData[newCrc]){
                                    //应该是蓝牙传输过过来的数据 需要区分去哪
                                    //1、正确关闭 定时器
                                    if(mayTooLongList.length>0){
                                        clearDate();
                                    }
                                    //2、发送
                                    console.log(data,checkPage[crc])
                                    // Toast({
                                    //     message: 'broastFromAndroid||'+data+'||'+checkPage[crc],
                                    //     position: 'middle',
                                    //     iconClass: 'icon icon-success',
                                    //     duration: 6000
                                    // });
                                    window.broastFromAndroid(data,checkPage[crc]);
                                    delete(checkStatus[crc]);
                                    delete(checkData[crc]);
                                    delete(checkPage[crc]);
                                    delete(checkTime[crc]);
                                    delete(checkSendTimes[crc]);
                                }
                            }
                        
                        }else{
                            //可能是数据太长的尾巴
                            doDataTooLongLast(data);
                        }
            
                    }
                } catch (error) {
                    // Toast({
                    //     message: error,
                    //     position: 'middle',
                    //     iconClass: 'icon icon-success',
                    //     duration: 2000
                    // });
                }
                
            }
            function doDataTooLongHeader(data) {
                    //只存一个的目前
                    if(mayTooLongList.length>0){
                        //干掉旧的
                        clearDate();
                    }
                    let tmp ={            
                        times:0,
                        directive:data.substring(0,2),
                        value:data
                    }
                    mayTooLongList.push(tmp);  
            }
            function clearDate(){
                let value = mayTooLongList[0].value;
                let crc =value.substring(value.length-4, value.length);
                let newData1 = "DA00" + crc +crcModelBusClacQuery("00" + crc, true)
                var message = {"method":"handleSendData","sendDt":newData1}
                window.webkit.messageHandlers.interOp.postMessage(message);
                mayTooLongList =[];//清空
            }
            //数据太长造成的
            function doDataTooLongLast(data){
                // Toast({
                //     message: 'doDataTooLongLast'+data,
                //     position: 'middle',
                //     iconClass: 'icon icon-success',
                //     duration: 5000
                // });
                let templist = [];
                let midData ="";
                for (let index = 0; index < mayTooLongList.length; index++) {
                    const bean = mayTooLongList[index];
                    let tempData = bean.value+data;//组合判断
                    let crc = tempData.substring(tempData.length-4, tempData.length);
                    //校验
                    if(tempData.length==8){
                        //结束 没有数据字段
                        midData="";
                    }else{
                        midData =tempData.substring(2, tempData.length-4);
                    }
                    if (!checkData[crc]){
                        // 异常 crc错了啊
                        // return;
                        // 2、把数据转成crc 校验是否能取到职值
                        if (midData) {
                            
                            let tempMidData = midData;
                            let newCrc = crcModelBusClacQuery(tempMidData,true)
                            // 取crc校验如果不一致则失败 发送crc校验失败的响应值
                            if (newCrc!=crc) {
                                // 错误 应答
                                let newData1 = "DA00" + crc + crcModelBusClacQuery("00" + crc,true)
                                let message = {"method":"handleSendData","sendDt":newData1}
                                window.webkit.messageHandlers.interOp.postMessage(message);
                                return;
                            }
                            if (!checkData[newCrc]) {
                                // 应该是蓝牙传输过过来的数据 需要区分去哪
                                // 1、正确关闭 定时器
                                // timer.cancel();
                                // timer = null;
                                // 2、发送
                                window.broastFromAndroid(tempData,checkPage[crc]);
                                delete(checkStatus[crc]);
                                delete(checkData[crc]);
                                delete(checkPage[crc]);
                                delete(checkTime[crc]);
                                delete(checkSendTimes[crc]);
                              
                            }else{
                                // 错误 应答
                                let newData1 = "DA00" + crc + crcModelBusClacQuery("00" + crc,true)
                                let message = {"method":"handleSendData","sendDt":newData1}
                                window.webkit.messageHandlers.interOp.postMessage(message);
                            }
                        }
                    }else{
                        //通知错误
                    
                        
                    }
                    
                }
                //重新赋值
                mayTooLongList =templist;
            }
        }
    }
    
    