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
    import {InterfaceService} from '@/services/api'
    export default {
        install(Vue, options) {
            function S4() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            }
            function guid() {
                // return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
                return (S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());
            }
            Vue.prototype.creatUUID =function() {
                return guid();
            }
            Vue.prototype.GLOBAL_CONFIG = BASE_CONFIG;
            // modbus 相关
            var modbusLastReadData = "";
            var upLoadLastData = "";
            var  modbusCircleTimer={};//modbus循环请求时间器
            var newIndexDataVal="";
            var nowModalIdx ='';//当前模式
            var momeryDiKey = '';
            var longTimer ={};//接收那些太长的数据
            var ifLongFlag=false;
            var modbusGlobalReceiveList=[];
            var modbusGlobalReceiveInterval='';
            // var store.state.modbusIosReceiveTime=1;
            var modbusIsBeginWeld=0;//是否开始焊接了
            var modbusWeldLongTime=0;//是否开始焊接了
            var modbusBeginWeldTm='';//焊接开始时间
            var modbusBeginWeldInfo='';//焊接开始的参数
            var modbusBeginWeldCurVol='';//焊接电压电流等
            var weldingCur='';//电流
            var weldingVoltage ='';//电压
            var oldIsBeginWeld=0;//是否开始焊接了 老的四合一模式
            var oldWeldLongTime=0;//是否开始焊接了 老的四合一模式
            var oldBeginWeldTm='';//焊接开始时间 老的四合一模式
            var oldBeginWeldInfo='';//焊接开始的参数 老的四合一模式
            var oldBeginWeldCurVol='';//焊接电压电流等 老的四合一模式
            var oldWeldModel ='';//模式
            var oldWeldTimer={};
            var oldWeldIntervaler={};

            var oldGetData='';

            var checkDataModbus={};
            var checkPageModbus={};
            var checkStatusModbus={};
            var checkTimeModbus={};
            var checkSendTimesModbus={};
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
            var modbusTooLongList=[];
            let TimerTask ={};
            // 增加节流函数
            var delayTimer={};
            var lastTimesReceiveData='';
            // private static HashMap<String, String> checkPage=new HashMap<String, String>();
            // private static HashMap<String, Boolean> checkStatus=new HashMap<String, Boolean>();
            // private static HashMap<String, Long> checkTime=new HashMap<String, Long>();
            // private static HashMap<String, Integer> checkSendTimes=new HashMap<String, Integer>();
            // private static HashMap<String, Integer> mayTooLong=new HashMap<String, Integer>();
            // private static ArrayList<BleTooLongBean> mayTooLongList =new  ArrayList<BleTooLongBean>();

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
                ],
                /** CUT模式**/
                cutTypeList:[
                    {
                        typeName:'MODE',
                        chooseKey:'Grid',//默认选中
                        comList:[
                            {id:0,key:'Grid',value:'Grid'},{id:1,key:'Normal',value:'Normal'},
                            {id:2,key:'Gouging',value:'Gouging'},{id:3,key:'Marking',value:'Marking'}
                        ],
                        inchComList:[
                            {id:0,key:'Normal',value:'Normal'},{id:1,key:'Grid',value:'Grid'},
                            {id:2,key:'Gouging',value:'Gouging'},{id:3,key:'Marking',value:'Marking'}
                        ]
                    },{
                        typeName:'MATERIAL',
                        chooseKey:'FE',//默认选中
                        comList:[
                            {id:0,key:'Fe',value:'Fe'},{id:1,key:'Ss',value:'Ss'},{id:2,key:'AI',value:'AI'}
                        ],
                        inchComList:[
                            {id:0,key:'Fe',value:'Fe'},{id:1,key:'Ss',value:'Ss'},{id:2,key:'AI',value:'AI'}
                        ]
                    },{
                        // {"0.5mm ","1.0mm ","2.0mm ","3.0mm ","4.0mm ","5.0mm ","6.0mm ",
                        // "8.0mm ","10.0mm ","12.0mm ","15.0mm ","20.0mm ","11.0mm","12.7mm","      "},
                        // {"24Ga  ","18Ga  ","14Ga  ","12Ga  ","10Ga  ", "3/16\" ","1/4\"  ",
                        // "5/16\" ","3/8\"  ","1/2\"  ","5/8\"  ","3/4\"  ","3/4\"  ","1/2\"  ","      "},
                        typeName:'THICKNESS',
                        chooseKey:0,//默认选中
                        comList:[
                            {id:0,key:'5mm',value:'0.5mm'},{id:1,key:'10mm',value:'1.0mm'},{id:2,key:'20mm',value:'2.0mm'},
                            {id:3,key:'30mm',value:'3.0mm'},{id:4,key:'40mm',value:'4.0mm'},{id:5,key:'50mm',value:'5.0mm'},
                            {id:6,key:'60mm',value:'6.0mm'},{id:7,key:'80mm',value:'8.0mm'},{id:8,key:'100mm',value:'10.0mm'},
                            {id:9,key:'120mm',value:'12.0mm'},{id:10,key:'150mm',value:'15.0mm'},{id:11,key:'200mm',value:'20.0mm'}
                            
                        ],
                        //单位切换inch
                        inchComList:[
                            {id:0,key:'5mm',value:'24Ga'},{id:1,key:'10mm',value:'18Ga'},{id:2,key:'20mm',value:'14Ga'},
                            {id:3,key:'30mm',value:'12Ga'},{id:4,key:'40mm',value:'10Ga'},{id:5,key:'50mm',value:'3/16"'},
                            {id:6,key:'60mm',value:'1/4"'},{id:7,key:'80mm',value:'5/16"'},{id:8,key:'100mm',value:'3/8"'},
                            {id:9,key:'120mm',value:'1/2"'},{id:10,key:'150mm',value:'5/8"'},{id:11,key:'200mm',value:'3/4"'}
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
                    mma:'C572',
                    cut:'5573'
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
            const TIGMAN_DIRECTIVE_MAP =new Map([['TDCHFPULSE','D0'],['pre_gas','D1'],['start_cur_end','D2'], ['slop_up','D3'],['weld_cur','D4'],['base_cur','D5'],['pulse_fre','D6'],['pulse_duty','D7'],['slop_down','D8'],['crater_cur','D9'],['post_gas','DA'],['ac_fre','DB'],['ac_balance','DC'],['Getready','DE'],['Memory','DF']]);
            const CUT_DIRECTIVE_MAP =new Map([['MODE','F0'],['MATERIAL','F1'],['THICKNESS','F2'], ['WELDCUR','F3'], ['Getready','FD']]);
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
                        rstInfo.weldType='TIGSYN';
                        rstInfo.weldTypeNum=_this.GLOBAL_CONFIG.callWeldTypeData.tigsyn.newIndex;//这个和首页里的配对
                       //确认指令
                       console.log('arrayList.length'+arrayList.length)
                       if((arrayList[1]=='227'||arrayList[1]=='211'||arrayList[1]=='195') &&arrayList.length==11){
                           //赋值开始  ......
                           var byte1Bean = num16To2Arr(arrayList[2],'',pageFrom);
                           //拆解成
                           var  arrtwo= num16To2ArrSpecial02(arrayList[3]);
                           console.log(rstInfo,arrayList)
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
                            //新增
                            console.log(arrayList)
                            rstInfo.slowDownTime =arrayList[9];//缓降时间
                            rstInfo.sdTime_min=0;
                            rstInfo.sdTime_max=100;
                            rstInfo.postGasTime =arrayList[10] || '-';//后送气时间
                       }
                      break;
                    case weldDirctive.tigMan:
                        //假如有改动注意 changeToOldTigmanRealData也要考虑
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
                store.state.memoryInfo = rstInfo;
               }else{
                store.state.rstInfo = rstInfo;
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
                rstInfo.weldTypeNum=BASE_CONFIG.callWeldTypeData.tigman.newIndex;//这个和首页里的配对
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
                    rstInfo.nowChooseIndex =arrayList[4];
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
                if(reg){
                    return reg.test(str);
                }else{
                    return false;
                }
                
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
                        //CUT不知道为啥会解析到0A06
                        if(data.indexOf('0A06')>-1){
                            return;
                        }
                        // if(newIndexDataVal == data){
                        //     console.log('拦截相同的报文：'+data)
                        //     return;
                        // }
                        newIndexDataVal=data;
                        rstInfo =buidDataByPagefrom(pageFrom,dirctiveType,data,this);
                        break;
                    case 'memory':
                        console.log(dirctiveType+':ll22ll');
                        
                        // let temp =data.substring(0,5)+data.substring(8,data.length)
                        
                        rstInfo =buidDataByPagefrom(pageFrom,dirctiveType,data,this);
                        //  alert(JSON.stringify(rstInfo))
                        break;
                    case 'hisweldlist':
                        if(store.state.isModbusModal){
                            //hisweldlist modbus的历史模式比较特殊直接读取数据库的焊接记录，所以使用标准解析
                            rstInfo =buidDataByPagefrom('newIndex',dirctiveType,data,this);
                        }else{
                            rstInfo =buidDataByPagefrom('newIndex',dirctiveType,data,this);
                        }
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
                var rstInfo ={};
                oldBeginWeldInfo=data;
                //请求mig syn模式数据
                if(compareString(dirctiveType,weldDirctive.migSyn)){
                    if(store.state.isModbusModal){
                        //这里数据的处理像memory的处理方式，取全部进行分析
                        rstInfo = changeToOldMigsynRealData(data,pageFrom);
                    }else{
                        oldWeldModel='MIGSYN';
                        oldBeginWeldInfo=data;
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
                    }
                 //请求mig mma模式数据
                }else if(compareString(dirctiveType,weldDirctive.migMan)){
                    if(store.state.isModbusModal){
                        //这里数据的处理像memory的处理方式，取全部进行分析
                        rstInfo = changeToOldMigmanRealData(data,pageFrom);
                    }else{
                        oldWeldModel='MIGMAN';
                        
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
                    }
                }else if(compareString(dirctiveType,weldDirctive.tigSyn)){
                    if(store.state.isModbusModal){
                        //这里数据的处理像memory的处理方式，取全部进行分析
                        rstInfo = changeToOldTigsynRealData(data,pageFrom);
                    }else{
                        oldWeldModel='TIGSYN';
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
                    }
                }else if(compareString(dirctiveType,weldDirctive.mma)){
                    console.log('来到utils-mma')
                    if(store.state.isModbusModal){
                        //这里数据的处理像memory的处理方式，取全部进行分析
                        rstInfo = changeToOldMmaRealData(data,pageFrom);
                    }else{
                        oldWeldModel='MMA';
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
                    }
                }else if(compareString(dirctiveType,weldDirctive.tigMan) && pageFrom=='memory'){
                    if(store.state.isModbusModal){
                        //这里数据的处理像memory的处理方式，取全部进行分析
                        rstInfo = changeToOldTigmanRealData(data,pageFrom);
                    }else{
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
                    }
                    //&& pageFrom=='newIndex'
                }else if(compareString(dirctiveType,weldDirctive.tigMan)){
                    if(store.state.isModbusModal){
                        //这里数据的处理像memory的处理方式，取全部进行分析
                        rstInfo = changeToOldTigmanRealData(data,pageFrom);
                    }else{
                        oldWeldModel='TIGMAN';
                        //新规则
                        var strArr =data.split(' ');
                        var temp10 =[];
                        temp10.push(parseInt(("0x"+strArr[0]),16).toString(10));//头DA 218
                        temp10.push(parseInt(("0x"+strArr[1]),16).toString(10));//指令 228
                        temp10.push(parseInt(("0x"+strArr[2]),16).toString(10));//焊接状态等 66
                        temp10.push(parseInt(("0x"+strArr[3]),16).toString(10));//MODE+ADCD+2T4T+PULSE 2
                        temp10.push(parseInt(("0x"+strArr[4]),16).toString(10));//count 对应当前选中哪个参数 4
                        temp10.push(parseInt(("0x"+strArr[6]+strArr[5]),16).toString(10));//数值 0
                        // ["218", "228", "66", "2", "4", "0"]
                        //转成10进制
                        console.log(temp10)
                        rstInfo = newTigmanDataBuild(temp10,weldDirctive.tigMan,pageFrom,_this);
                       
                    }
                    console.log(rstInfo)
                }else if(compareString(dirctiveType,weldDirctive.cut)){
                    // console.log(data)
                    // var strArr =data.split(' ');
                    // DA E6 || 0A 03 12 00 00 00 00 00 00 00 00 00 3C 00 01 00 01 00 02 00 01 F8 04 ||55 73
                    // window.modbusBroastFromApp("0A 03 16 0000 0000 0033 0001 0000 0003 000B 0000 0032 0064 000A 54F5");
                    data=data.replace(/\s*/g,"");//.replaceAll(" ","");
                    let datas = "";
                    //旧的modbus histroy 切割电流前都不要
                    // DA C6 0A 03 68 00 0F 11 04 00 00 00 00 00 33 00 01 00 00 00 03 00 0B 00 00 00 32 00 64 00 0A 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 1D CC
                    if(pageFrom == 'memory' || pageFrom=='hisweldlist'){
                        datas = data.substring(18,data.length);
                    }else{
                        datas = data.substring(10,data.length);
                    }
                    
                    // console.log(data)
                    // console.log(datas)
                    var strArr = [];
                    for(var i=0;i<datas.length;i+=4){
                        strArr.push(datas.slice(i,i+4));
                    }
                    let byte0 =((Array(16).join(0) + parseInt(strArr[0],16).toString(2)).slice(-16)).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' '); 
                    var byte1Bean ={};
                    // console.log(byte0)
                        byte1Bean.isReadyFlag=`${byte0[5]}${byte0[6]}${byte0[7]}` == '011'?1:0,//7-9;
                        byte1Bean.weldStatus=byte0[15];//0:未焊接  1:在焊接
                        // alert(byte1Bean.weldStatus)
                        // alert(modbusIsBeginWeld)
                        // Toast(byte1Bean.weldStatus)
                        if(byte1Bean.weldStatus==1){
                            if(pageFrom=='newIndex'){
                                store.state.weldingStatus=1
                                if(store.state.isModbusModal){
                                    modbusBeginWeldInfo=data;
                                    weldingInfoQuery();// clearInterval(store.state.weldingInterval);
                                }
                            }
                        }else{
                            if(modbusIsBeginWeld==1){
                                
                                uploadAppWeldInfoList({
                                    BT_ADDRESS: store.state.btAddress, 
                                    APP_UUID:store.state.userUuid,
                                    MODEL_TYPE : 'CUT',
                                    WELD_CONTENT : modbusBeginWeldInfo,
                                    BEGIN_TM:modbusBeginWeldTm,
                                    END_TM :buidTm(),
                                    COST_TM : modbusWeldLongTime,
                                    WELD_DATA:modbusBeginWeldCurVol,//电压\电流
                                    WELD_CUR:weldingCur,
                                    WELD_VOL:weldingVoltage,
                                    RECORD_SECOND:new Date().getTime(),//ms 时间戳
                                    tenantID:BASE_CONFIG.tenantID
                                });
                                // upLoadDataFuc(receiveBleData,'util','weld_end',{weldTime:modbusWeldLongTime});
                            }
                            modbusBeginWeldTm="";
                            modbusIsBeginWeld=0;//重置
                            modbusWeldLongTime=0;
                            clearInterval(store.state.weldingInterval);
                            store.state.weldingInterval={};

                            store.state.weldingStatus=0;
                            store.state.getWeldingInfoTimes=0;//重置
                        }
                        byte1Bean.unit=byte0[5];//默认是0 ich单位是1 
                        byte1Bean.bitInfoList = {
                            cut01:byte0[15],//引弧成功
                            cut02:byte0[14],//切割电源准备状态
                            cut03:byte0[13],//切割电源故障
                            cut04:byte0[12],//枪开关状态
                            cut05:byte0[11],//小弧状态
                            cut06:byte0[10],//主弧状态
                            cut07:byte0[9],
                            cut08:`${byte0[6]}${byte0[7]}${byte0[8]}`,//9-7 焊接电源工作模式 110
                            cut09:byte0[5]//单位
                        };
                    //等离子新模式modbus
                    rstInfo.nowTypeList=JSON.parse(JSON.stringify(weldParam.cutTypeList))
                    rstInfo.weldType='CUT';
                    rstInfo.weldTypeNum=_this.GLOBAL_CONFIG.callWeldTypeData.cut.newIndex;//这个和首页里的配对
                    console.log(strArr)
                    rstInfo.nowTypeList.forEach(element => {
                        switch (element.typeName) {
                            case 'MODE':
                                let v1 = parseInt(strArr[3],16);
                                rstInfo.modeKey=v1;
                                // element.chooseKey=setWeldParams('MODE',byte1Bean.mode);
                                element.chooseKey=v1;
                                break;
                            case 'MATERIAL':
                                element.chooseKey=parseInt(strArr[4],16);
                                // element.chooseKey=setWeldParams('MATERIAL',arrayList[3]);
                                break; 
                            case 'THICKNESS':
                                element.chooseKey=parseInt(strArr[5],16);
                                // element.chooseKey=setWeldParams('THICKNESS',arrayList[6]);
                                break;
                            default:
                                break;
                        }
                    });
                    
                    rstInfo.PRESSUREKEY=0;//机器上发不能改 气压值    
                    //模式是normal的时候推荐值是3.5BAR，50PSI
                    // 其他两个模式是4.2BAR，61PSI
                    // 切割模式：
                    // 1：Normal
                    // 2：Grid
                    // 3：Gouging
                    // 4：Marking
                    // 气压模式：
                    // 1：BAR
                    // 2：MPA
                    // 3：PSI
                    if(rstInfo.modeKey>0){
                        if(rstInfo.PRESSUREKEY==0){
                            rstInfo.PRESSURSHOW='4.2BAR';
                        }else{
                            rstInfo.PRESSURSHOW='61PSI';
                        }
                        
                    }else{
                        if(rstInfo.PRESSUREKEY==0){
                            rstInfo.PRESSURSHOW='3.5BAR';
                        }else{
                            rstInfo.PRESSURSHOW='50PSI';
                        }
                    }
                    

                    //其他属性不需要 赋值直接赋值 到时再取
                    rstInfo.THINKNESS_VALUE = parseInt(strArr[5],16);
                    rstInfo.CUT_MIN_THICHNESS=parseInt(strArr[7],16);//最小厚度值
                    rstInfo.CUT_MAX_THICHNESS=parseInt(strArr[6],16);//最大厚度值
                    //mig_material 值 ==0 显示gas选项否则隐藏 
                    rstInfo.MIG_MATERIAL =0;
                    rstInfo.CUT_RECOMMEND_CURRENT =parseInt(strArr[8],16);//推荐电流
                    rstInfo.CUT_CURRENT_VAL=parseInt(strArr[2],16);
                    rstInfo.CUT_MIN_CUR=parseInt(strArr[10],16);
                    rstInfo.CUT_MAX_CUR=parseInt(strArr[9],16);
                    rstInfo.initBean=byte1Bean
                }
                if(pageFrom=='memory'){
                    //    alert(JSON.stringify(rstInfo))
                    store.state.memoryInfo = rstInfo;
                }else{
                    rstInfo.pageFrom = pageFrom;
                    rstInfo.dirctiveType = dirctiveType;
                    rstInfo.data = data;
                    store.state.rstInfo = rstInfo;
                }
                console.log(rstInfo)
                return rstInfo;
            }
            function   weldingInfoQuery(){
                let sendData    ="";
                let crc    ="";
                //记录每次焊接开始
                
                // clearInterval(store.state.modbusCircleTimer)//清除模式数据循环
                clearInterval(store.state.weldingInterval)//否则每次进来会从累机
                store.state.weldingInterval=setInterval(() => {
                    ++modbusWeldLongTime;//焊接时间 秒为单位
                    switch (nowModalIdx) {
                        case 'B1':
                            //MIG地址101 数量2                                                              
                            sendData='0A0300650002';
                            crc='6FD5';
                            break;
                        case 'B2':
                            //MIG地址101 数量2                                                              
                            sendData='0A0300650002';
                            crc='6FD5';
                            break;
                        case 'B3':
                            //TIG地址348 数量2                                                              
                            sendData='0A03015C0002';
                            crc='9E04';
                            break;
                        case 'B4':
                            //TIG地址348 数量2                                                              
                            sendData='0A03015C0002';
                            crc='9E04';
                            break;
                        case 'B5':
                            //MMA地址501 数量2                                                              
                            sendData='0A0301F50002';
                            crc='BED4';
                            break;
                        case 'B6':
                            //CUT地址711 数量2                                                              
                            sendData='0A0302C70002';
                            crc='3575';//3575 正向
                            break;
                        default:
                            break;
                    }
                    onlySendFuc(sendData+crc,'weldingInfoQuery',crc);
                    if(modbusIsBeginWeld===0){
                        
                        modbusIsBeginWeld=1;
                        modbusBeginWeldTm=buidTm();
                        modbusWeldLongTime=0;
                        upLoadDataFuc(sendData,'APP','weld_begin');
                    }
                }, 1000);
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
                    case 'CUT':
                        return CUT_DIRECTIVE_MAP.get(paramKey);
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
            function buidTm(){
                let time =new Date();
                let month = time.getMonth()+1;
                month=month<10?"0"+month:month;
                let day =time.getDate();
                day=day<10?"0"+day:day;
                let hour =time.getHours();
                hour=hour<10?"0"+hour:hour;
                let minutes =time.getMinutes();
                minutes=minutes<10?"0"+minutes:minutes;
                let seconds =time.getSeconds();
                seconds=seconds<10?"0"+seconds:seconds;
                return `${time.getFullYear()}-${month}-${day} ${hour}:${minutes}:${seconds}`
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
                        bean.ifpulseValue =bean.ifpulse==1?'PULSE':'NOPULSE';
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
                if( bean.diameter>3){
                    bean.diameter=0;//默认值
                }
                bean.material= parseInt(buildArr[2]+buildArr[3]+buildArr[4],2);
                if( bean.material>2){
                    bean.material=0;//默认值
                }
                return bean;
            }
            //转成16进制转2进制 之后不足的位数补零 74 ["0", "1", "0", "0", "1", "0", "1", "0"]
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
                            store.state.weldingStatus=1;
                        }
                    }else{
                        if(pageFrom=='newIndex'){
                            oldIsBeginWeld=0;//重置
                        }
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
            //旧逻辑crc校验不包含 da
             function crcModelBusClacQuery(data){   
                // console.log('crcModelBusClacQuery开始')
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
                // console.log('crcModelBusClacQuery结束')
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
                console.log(pageFrom,'sendData='+sendData+',crc='+crc)
                store.state.postDataList.push({type:'callSendDataToBleUtil',data:sendData});
                
                this.wtlLog(pageFrom,'sendData='+sendData+',crc='+crc);
                // modbusDataSendFuc(pageFrom,sendData,crc);
                if(!BASE_CONFIG.TESTFLAG){
                    // Toast({
                    //     message: BASE_CONFIG.ENV_IOS_FLAG+sendData,
                    //     position: 'middle',
                    //     iconClass: 'icon icon-success',
                    //     duration: 2500
                    //   });
                    if(BASE_CONFIG.ENV_IOS_FLAG){
                        
                        //ios 逻辑需借鉴后端的
                        let directive =sendData.substring(2,4);
                        // alert(directive+"="+store.state.isModbusModal+"="+sendData)
                        //新逻辑modbus新协议20210711
                        if("FF"!=directive && store.state.isModbusModal){
                            modbusDataSendFuc(pageFrom,sendData,crc);
                            return;
                        }else if("FF"==directive && store.state.isModbusModal){
                            return;
                        }
                        
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
                        let directive =sendData.substring(2,4);
                        store.state.nowPageFrom=pageFrom;
                        //新逻辑modbus西协议20210711
                        if("FF"!=directive && store.state.isModbusModal){
                            modbusDataSendFuc(pageFrom,sendData,crc);
                            return;
                        }
                        if(window.android && !store.state.isModbusModal){
                            window.android.callSendDataToBle(pageFrom,sendData,crc);
                        }else{
                            console.log('warn:',pageFrom,sendData,crc);
                        }
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
            Vue.prototype.jinzhiChange10jinzhiFuc = function(num) {
                 var tempNum = ((Array(4).join(0) + parseInt(num,10).toString(16)).slice(-4));
                 return tempNum;
             } 
            //公共 ：10机制数转成 高低位按规则变动的 16进制数
            Vue.prototype.jinzhiChange2jinzhiFuc = function(num) {
                console.log(num)
                //规则1
                 // var tempNum = ((Array(8).join(0) + parseInt(num,10).toString(2)).slice(-8));
                 // parseInt(tempNum.substring(4,8),2).toString(16);//低位
                 // parseInt(tempNum.substring(0,4),2).toString(16);//高位
             //   ((Array(2).join(0) + parseInt('00010001'.substring(0,4),2).toString(16)).slice(-2));
             //低+高    
             // return ((Array(2).join(0) + parseInt(tempNum.substring(4,8),2).toString(16)).slice(-2))
             //             +((Array(2).join(0) + parseInt(tempNum.substring(0,4),2).toString(16)).slice(-2));
 
                 
                 
                 var tempNum = ((Array(4).join(0) + parseInt(num,2).toString(16)).slice(-4));
                //  tempNum= tempNum.substring(2,4)+tempNum.substring(0,2);
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
            // self.theWebView!.evaluateJavaScript("iosBleDataLayoutFuc('\([UInt8](data))')",
//                                       completionHandler: nil)
//            20211010 modbus协议改造支持
            // self.theWebView!.evaluateJavaScript("iosModbusBleDataLayoutFuc('\([UInt8](data))')",
            // completionHandler: nil)
            //ios监听蓝牙返回数据 重要！！！ 非modbus协议版本用 
            window['iosBleDataLayoutFuc']= (bleReponseData) => {
                if(lastTimesReceiveData==bleReponseData){
                    //延迟一阵子再执行 机器上发频率0.5s
                    delayTimer = setTimeout(() => {
                        iosBleDataLayoutFuc(bleReponseData)
                    }, 400);
                    return;
                }else{
                    lastTimesReceiveData=bleReponseData;
                    clearTimeout(delayTimer);
                    iosBleDataLayoutFuc(bleReponseData)
                }
            }
            //ios监听蓝牙返回数据 重要！！！modbus协议版本app用 
            // self.theWebView!.evaluateJavaScript("iosModbusBleDataLayoutFuc('\([UInt8](data))')",
            window['iosModbusBleDataLayoutFuc']= (bleReponseData) => {
                let oldData = bleReponseData;
                bleReponseData =(bleReponseData +"").replace(/\[/g,'').replace(/\]/g,'');
                bleReponseData=bleReponseData.split(',');
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
                    //调用通用处理
                    //第一次是否是modbus版本
                    if(store.state.modbusIosReceiveTime==1){
                        store.state.modbusIosReceiveTime =store.state.modbusIosReceiveTime+1;
                        let firstHide = (data+"").substring(0,2);
                        if(firstHide == 'DA'){
                            store.state.isModbusModal=false;
                            store.state.machineModel='OLD'
                            //记录四合一机器数据
                            insertOldMachineInfo(data);
                            // window.modbusBroastFromApp(data);
                            // return;
                        }else{
                            store.state.isModbusModal=true;
                            // window.modbusBroastFromApp(data);
                        }
                    //第二次后是否是
                    }
                    // else if(store.state.isModbusModal){
                    //     window.modbusBroastFromApp(data);
                    // }else{
                    //     window.modbusBroastFromApp(data);
                    // }
                    if(store.state.isModbusModal){
                        //简化统一处理
                        window.modbusBroastFromApp(data);
                    }else{
                        //非modubs ios版本
                        window.iosBleDataLayoutFuc(oldData);
                    }
                    
                }
            }
            function insertOldMachineInfo(receiveBleData){
                 //记录四合一机器数据
                 let loginName = localStorage.getItem("wtl_login_email") || '';
                 InterfaceService.addMachineInfo({
                     patch:'OLD4',
                     email:loginName,
                     btAddress:BASE_CONFIG.btAddress || '四合一地址',
                     machineType:store.state.nowConnectMachine,
                     content:receiveBleData,
                     app_uuid:store.state.userUuid,
                     uuid:store.state.userUuid
                 },(data)=>{
                 },function(data){
                 });
            }
            //安卓统一接收 兼容四合一 五合一modbus版本
            window['andriodModbusBleDataLayoutFuc']= (bleReponseData) => {
                try {
                    bleReponseData = (bleReponseData +"").replace(/\s*/g,"");
                    bleReponseData=bleReponseData.toLocaleUpperCase();
                    //假如是四合一的安卓
                    if(store.state.modbusIosReceiveTime==1){
                        ++store.state.modbusIosReceiveTime;
                        modbusGlobalReceiveList=[];//清空 重置
                        let firstHide = (bleReponseData+"").substring(0,2);
                        if(firstHide != 'DA'){
                            store.state.isModbusModal=true;
                        }else{
                            store.state.machineModel='OLD'
                            insertOldMachineInfo(bleReponseData);
                            store.state.isModbusModal=false;
                        }
                    }
                    if(store.state.isModbusModal){
                        //简化统一处理
                        window.modbusBroastFromApp(bleReponseData);
                        return;
                    }
                    //继续旧四合一逻辑
                    // Toast({
                    //     message:Array.isArray(bleReponseData),
                    //     position: 'middle',
                    //     iconClass: 'icon icon-success',
                    //     duration: 11000
                    // });
                    
                        let data='';
                        //2、crc校验(注意最长的)     console.log(this.crcModelBusClacQuery('100000', true))//0570
                        let len =bleReponseData.length;
                        data =bleReponseData.toUpperCase();//大写
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
                //          data.substring(2, 8);//原来的crc
                //          data.substring(8, 12);//现在的crc
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
                                if(oldIsBeginWeld===0){
                                    oldIsBeginWeld=1;
                                    clearInterval(oldWeldIntervaler);
                                    oldWeldIntervaler =setInterval(() => {
                                        ++oldWeldLongTime;
                                    }, 1000);
                                    upLoadDataFuc(oldBeginWeldInfo+"||"+data,'APP','weld_begin');
                                }
                                // DAB1 0100 0200 8658 双字节
                                if(!store.state.isModbusModal){
                                    if(data.length>10){
                                        oldBeginWeldCurVol=data;
                                        weldingCur=data.substring(6,8)+data.substring(4,6);
                                        weldingVoltage=data.substring(10,12)+data.substring(8,10);
                                    }
                                    if(!oldBeginWeldTm){
                                        oldBeginWeldTm=buidTm();
                                    }
                                    clearTimeout(oldWeldTimer);
                                    oldWeldTimer= setTimeout(() => {
                                        clearInterval(oldWeldIntervaler);
                                        uploadAppWeldInfoList({
                                            BT_ADDRESS:  store.state.btAddress || BASE_CONFIG.btAddress || '四合一地址', 
                                            APP_UUID:store.state.userUuid,
                                            MODEL_TYPE : oldWeldModel,
                                            WELD_CONTENT : (oldBeginWeldInfo+"").replace(/\s*/g,""),
                                            BEGIN_TM:oldBeginWeldTm,
                                            END_TM :buidTm(),
                                            COST_TM : oldWeldLongTime,
                                            WELD_DATA:oldBeginWeldCurVol,//电压\电流
                                            WELD_CUR:weldingCur,
                                            WELD_VOL:weldingVoltage,
                                            RECORD_SECOND:new Date().getTime(),//ms 时间戳
                                            tenantID:BASE_CONFIG.tenantID
                                        });
                                        oldBeginWeldTm="";
                                        oldIsBeginWeld=0;
                                        oldWeldLongTime=0;
                                    }, 2500);
                                }
                                window.tellVueWelding(data);
                                // mWebView.loadUrl("javascript:tellVueWelding('" + data +"')");
                                return;
                            //MEMORY
                            }else if(data.indexOf("DAD")==0){
                                upLoadDataFuc(data,'APP','MEMORY');
                                window.broastMemoryFromAndroid(data);
                                // mWebView.loadUrl("javascript:broastMemoryFromAndroid('" + data +"')");
                                return;
                            }
                        //history
                            else if(data.indexOf("DAC")==0){
                                upLoadDataFuc(data,'APP','HISTORY');
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
                                    upLoadDataFuc(data,'APP','MODEDATA');
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
            
                    
                } catch (error) {
                    Toast({
                        message: error,
                        position: 'middle',
                        iconClass: 'icon icon-success',
                        duration: 2000
                    });
                }
            }
            // 
            function iosBleDataLayoutFuc(bleReponseData){
                // Toast({
                //     message: 'util'+'::'+bleReponseData,
                //     position: 'middle',
                //     iconClass: 'icon icon-success',
                //     duration: 1500
                // });
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
                //          data.substring(2, 8);//原来的crc
                //          data.substring(8, 12);//现在的crc
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
                                // DAB1 0100 0200 8658 双字节
                                if(oldIsBeginWeld===0){
                                    oldIsBeginWeld=1;
                                    clearInterval(oldWeldIntervaler);
                                    oldWeldIntervaler =setInterval(() => {
                                        ++oldWeldLongTime;
                                    }, 1000);
                                    upLoadDataFuc(oldBeginWeldInfo+"||"+data,'APP','weld_begin');
                                }
                                if(!store.state.isModbusModal){
                                    if(data.length>10){
                                        oldBeginWeldCurVol=data;
                                        weldingCur=data.substring(6,8)+data.substring(4,6);
                                        weldingVoltage=data.substring(10,12)+data.substring(8,10);
                                    }
                                    if(!oldBeginWeldTm){
                                        oldBeginWeldTm=buidTm();
                                    }
                                    clearTimeout(oldWeldTimer);
                                    oldWeldTimer= setTimeout(() => {
                                        clearInterval(oldWeldIntervaler);
                                        uploadAppWeldInfoList({
                                            BT_ADDRESS: store.state.btAddress || BASE_CONFIG.btAddress || '四合一地址',
                                            MODEL_TYPE : oldWeldModel,
                                            WELD_CONTENT :(oldBeginWeldInfo+"").replace(/\s*/g,""),
                                            BEGIN_TM:oldBeginWeldTm,
                                            END_TM :buidTm(),
                                            COST_TM : oldWeldLongTime,//减去延迟时间
                                            WELD_DATA:oldBeginWeldCurVol,//电压\电流
                                            WELD_CUR:weldingCur,
                                            WELD_VOL:weldingVoltage,
                                            RECORD_SECOND:new Date().getTime(),//ms 时间戳
                                            tenantID:BASE_CONFIG.tenantID
                                        });
                                        oldBeginWeldTm="";
                                        oldIsBeginWeld=0;
                                        oldWeldLongTime=0;
                                    }, 2500);
                                }
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
                                    upLoadDataFuc(data,'APP','MODEDATA');
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
                    Toast({
                        message: error,
                        position: 'middle',
                        iconClass: 'icon icon-success',
                        duration: 2000
                    });
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
                console.log(mayTooLongList)
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
                                upLoadDataFuc(tempData,'APP','MODEDATA_LONG');
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
            //通用处理有对modbus进行区分了
            //负责接收来自app的 新modbus版本ble信息 注意modbus的返回crc是反的 
            //安卓里是mWebView.loadUrl("javascript:modbusBroastFromApp('" + bleRespInfo.replaceAll(" ", "").toUpperCase() +"')");
            window['modbusBroastFromApp'] = (bleReponseOrignData)=>{
                bleReponseOrignData = (bleReponseOrignData +"").replace(/\s*/g,"");
                bleReponseOrignData=bleReponseOrignData.toLocaleUpperCase();
                //假如是四合一的安卓
                if(store.state.modbusIosReceiveTime==1){
                    ++store.state.modbusIosReceiveTime;
                    let firstHide = (bleReponseOrignData+"").substring(0,2);
                    if(firstHide != 'DA'){
                        store.state.isModbusModal=true;
                    }
                }
                // if(!store.state.isModbusModal){
                //     window.broastFromAndroid(bleReponseOrignData);
                //     return;
                // }
                
                store.state.postDataList.push({type:'receive',data:bleReponseOrignData})
                modbusGlobalReceiveList.push(bleReponseOrignData);//存储起来避免太快丢失
                console.log('modbusSendTimes:'+store.state.modbusSendTimes)
                console.log('****bleReponseOrignData****:'+bleReponseOrignData)
                console.log('****modbusGlobalReceiveList****:'+modbusGlobalReceiveList)
                if(!modbusGlobalReceiveInterval){
                    modbusGlobalReceiveInterval=setInterval(() =>{
                        let beginIdx=0;
                        let endIdx ='none';
                        let bleReponseData="";
                        let before4 ='';
                       //遍历处理数据
                       let tempMidData ='';
                       let newCrc ='';
                       let reverseCrc='';
                       for (let index = 0; index < modbusGlobalReceiveList.length; index++) {
                            const tempCenter = modbusGlobalReceiveList[index];
                            bleReponseData+=tempCenter;
                            let oldCrc = bleReponseData.substring(bleReponseData.length-4,bleReponseData.length);
                            console.log(store.state.isModbusModal)
                            if(store.state.isModbusModal){
                                tempMidData =bleReponseData.substring(0,bleReponseData.length-4);
                                newCrc = crcModelBusClacQuery(tempMidData, true);
                                reverseCrc = newCrc.substring(2,4)+newCrc.substring(0,2);
                            }else{
                                //老的报文
                                // DAE2003D00C800003535只对 E2003D00C80000进行crc校验
                                tempMidData =bleReponseData.substring(2,bleReponseData.length-4);
                                console.log(tempMidData)
                                newCrc = crcModelBusClacQuery(tempMidData, true);
                                reverseCrc=newCrc;
                            }
                            
                            console.log(oldCrc , reverseCrc)
                            if(oldCrc == reverseCrc){
                                endIdx=index;
                                before4=(bleReponseData+"").substring(0,4);//20211020补充去除
                                if(before4!='0A06'){
                                    modbusDataReceiveFuc(bleReponseData);
                                }
                                break;
                            }
                       }
                       if(endIdx!='none'){
                        modbusGlobalReceiveList =modbusGlobalReceiveList.slice(endIdx+1,modbusGlobalReceiveList.length);
                       } 
                    }, 500);
                }
                //间隔不到150ms是可以连续接收：节流、避免丢失
                // if(!ifLongFlag){
                //     ifLongFlag=true;
                //     clearTimeout(longTimer);
                //     if(modbusTooLongList.length==0){
                //         modbusDataReceiveBuild(bleReponseOrignData);
                //         console.log("===modbusTooLongList_1====",modbusTooLongList)
                //     }else{
                //         modbusTooLongList.push(bleReponseOrignData);
                //         longTimer = setTimeout(() =>{
                //             ifLongFlag=false;
                //             modbusDataReceiveBuild(bleReponseOrignData);
                //             console.log("===modbusTooLongList_2====",modbusTooLongList)
                //         }, 120);
                //     }
                    
                // }else{
                //    //可能是太长的
                //    modbusTooLongList.push(bleReponseOrignData);
                //    console.log("===modbusTooLongList_3====",modbusTooLongList)
                // }
                
            }
            function modbusDataReceiveBuild(bleReponseData){
                if(bleReponseData){
                    bleReponseData=bleReponseData.replace(/\s*/g,"");
                    bleReponseData=bleReponseData.toLocaleUpperCase();
                }
                let oldCrc = bleReponseData.substring(bleReponseData.length-4,bleReponseData.length);
                let tempMidData =bleReponseData.substring(0,bleReponseData.length-4);
                let newCrc = crcModelBusClacQuery(tempMidData, true);
                let reverseCrc = newCrc.substring(2,4)+newCrc.substring(0,2);
                let newData="";
                
                if(oldCrc != reverseCrc){
                    //可能是太长的
                    modbusTooLongList.push(bleReponseData);
                    //拼接是否crc校验一致
                    let temp = modbusTooLongList.join("");
                    let mid =temp.substring(0,temp.length-4);
                    let ncrc = crcModelBusClacQuery(mid, true);
                    let reverseNcrc =  ncrc.substring(2,4)+ncrc.substring(0,2);
                    let ocrc = temp.substring(temp.length-4,temp.length);
                   
                    if(reverseNcrc!=ocrc){
                        
                        //返回继续等待最后一个含crc校验数据的的到来
                        return;
                    }else{
                        modbusTooLongList=[];//清空
                        newData=temp;
                    }
                }else{
                    newData=bleReponseData;
                    modbusTooLongList=[];//清空
                }
                if(lastTimesReceiveData==newData){
                    //延迟一阵子再执行 机器上发频率0.5s
                    delayTimer = setTimeout(() => {
                        modbusDataReceiveFuc(newData);
                    }, 400);
                    return;
                }else{
                    lastTimesReceiveData=newData;
                    clearTimeout(delayTimer);
                    modbusDataReceiveFuc(newData);
                }
            }
            // modbus data build center  || iosBleDataLayoutFuc || callSendDataToBleUtil
            function modbusDataReceiveFuc(receiveBleData){
                //从机地址	功能码	数据起始地址	数据长度	CRC校验(前面全部数据)
                //migsyn模拟数据 31个数据=1f crc = 0C5D
                // receiveBleData = "0A 06 32 1F 0000 0028 0028 00 00 00 00 00 00 0000 0000 0000 005C 00BB 00a4 000f 0104 0064 0003 0000 0001 0000 0003 0000 000c 0000 003c 00b4 0000 0000 0000 0000 0000 0000 0C5D";
                //migman模拟数据 15个数据=0f crc = 23EE 总长74
                // receiveBleData = "0A 06 32 0F 0000 0028 0028 00 00 00 00 00 00 0000 0000 0000 005C 00BB 00a4 000f 0104 0064 23EE";
                receiveBleData = receiveBleData.toUpperCase();
                receiveBleData = receiveBleData.replace(/\s*/g,"");
                // upLoadDataFuc(sendData,pageFrom,type)
                if(receiveBleData && receiveBleData.length>=10){
                    upLoadDataFuc(receiveBleData,'APP','RECEIVE');
                    //注意modebus的crc是反的
                    let midData = receiveBleData.substring(0,receiveBleData.length-4);
                    let crcData = receiveBleData.substring(receiveBleData.length-4,receiveBleData.length);
                    receiveBleData=midData+crcData.substring(2,4)+crcData.substring(0,2);

                    let before4 = receiveBleData.substring(0,4);
                    let before6 = receiveBleData.substring(0,6);
                    // Toast({
                    //         message: 'before6:'+'::'+before6,
                    //         position: 'middle',
                    //         iconClass: 'icon icon-success',
                    //         duration: 3500
                    //     });
                    //不包含五个模式时长的
                    // if(before6 == '0A033C'){
                    if(before6 == '0A0350'){
                        //通信成功
                        store.state.modbusSendTimes=5;
                        store.state.isModbusModal=true;//是否是modbus协议模式
                    }else if(before4!='0A03'){
                        // Toast({
                        //     message: 'util旧'+'::'+receiveBleData,
                        //     position: 'middle',
                        //     iconClass: 'icon icon-success',
                        //     duration: 3500
                        // });
                        //不知道为什么会收到0a06de数据
                        // if(before4=='0A06'){
                        //     return;
                        // }
                        //进入旧的通信区
                        window.broastFromAndroid(receiveBleData);
                        return;
                    }
                    //处理
                    //不同模式数据、焊接中数据、存储、历史等数据 根据不同地址进行，区分
                    // 0a 03 0064 0014 0014 0014 0014 0014 6105
                    // 举个栗子
                    //mig:modbus:0a 03 0064 0014 0014 0014 0014 0014 6105 => crc:dae1 82 04 01 04 05 35 2800 2800 c800 c800 020a 204c
                    //还原成原来的数据格式，这样相对一个个重新赋值太难了，还能尝试兼容旧的。
                    //但是，部分数据结构需要沟通，让他不变尤其小字节部分
                    //拼接+根据地址、功能取值
                    //20210712 需要两个
                    let headKey = receiveBleData.substring(0,6);
                    let changeNewData ="";
                    switch (headKey) {
                        case '0A0350':
                            store.state.modbusSendDataTimes=5;//无需再发送了，手动停止
                        // case '0A033C':
                            //60长度
                            // window.modbusBroastFromApp("0A 03 3C 04 01 33 00 2C 34 34 31 42 2C 2C 35 41 42 34 2C 2C 31 37 39 4D 00 47 41 43 49 41 20 2F 43 43 44 50 2F 41 4C 4D 53 20 41 30 32 43 30 0A 0D 00 00 00 00 00 00 00 00 00 00 00 00 00 00 F8 78")
                            // 0A 03 3C 00 01 00 04 00 00 33 34 2C 31 34 2C 42 35 2C 42 41 2C 33 46 2C 39 33 0D 4D 41 47 49 43 20 41 43 2F 44 43 2F 50 4C 41 53 4D 41 20 32 30 30 43 0D 0A 00 00 00 00 00 00 00 00 00 00 00 E1 5C 
                            //          00 01 00 04 00 00 33 34 2C 31 34 2C 42 35 2C 42 41 2C 33 46 2C 39 33 0D 4D 41 47 49 43 20 41 43 2F 44 43 2F 50 4C 41 53 4D 41 20 32 30 30 43 0D 0A 00 00 00 00 00 00 00 00 00 00 00 E1 5C 
                            // 0		程序版本号version.major
                            // 1		version.minor
                            // 2		version.patch
                            // 3~11		蓝牙模块地址
                            // 12~29		机器型号
                            //发送机器信息
                            let recontent = receiveBleData.substring(6,receiveBleData.length);
                            let clength =recontent.length;
                            let idx = recontent.indexOf("0D0A");
                            idx=idx<0?recontent.length:idx;
                            if(receiveBleData.length>80){
                                let patch = recontent.substring(8,12);//厂商33
                                let btAddress=recontent.substring(12,48);;//蓝牙地址
                                // \u0050\u004c\u0041\u0053\u004d\u0041 504C41534D41 PLASMA
                                let machineType=recontent.substring(48,idx);;//机器型号 \u0050\u004c\u0041\u0053\u004d\u0041
                                if(machineType.indexOf('504C41534D41')>-1){
                                    store.state.machineModel = 'PLASMA';
                                }else{
                                    store.state.machineModel = 'OLD';
                                }
                                let migTm = recontent.substring(clength-24,clength-20);;//不同模式细腻
                                let tigAc = recontent.substring(clength-20,clength-16);;//不同模式细腻
                                let tigDc = recontent.substring(clength-16,clength-12);;//不同模式细腻
                                let mma = recontent.substring(clength-12,clength-8);;//不同模式细腻
                                let cut = recontent.substring(clength-8,clength-4);;//不同模式细腻

                                store.state.btAddress=btAddress;//放到store里
                                //机器信息
                                let loginName = localStorage.getItem("wtl_login_email") || '';
                                InterfaceService.addMachineInfo({
                                    patch:patch,
                                    email:loginName,
                                    btAddress:btAddress,
                                    machineType:machineType,
                                    content:receiveBleData,
                                    app_uuid:store.state.userUuid,
                                    uuid:store.state.userUuid
                                },(data)=>{
                                },function(data){
                                });
                                // `TIG_AC_WELD_TM` varchar(16)  DEFAULT NULL COMMENT 'TIGAC时长来自机器',
                                // `TIG_DC_WELD_TM` varchar(16)  DEFAULT NULL COMMENT 'TIGDC焊时长来自机器',
                                // `MMA_WELD_TM` varchar(16)  DEFAULT NULL COMMENT 'MMA焊时长来自机器',
                                // `CUT_WELD_TM` varchar(16)  DEFAULT NULL COMMENT 'CUT焊时长来自机器',
                                //机器上发的焊接信息
                                let params=[{
                                    BT_ADDRESS:btAddress,
                                    MIG_WELD_TM:migTm,
                                    TIG_AC_WELD_TM:tigAc,
                                    TIG_DC_WELD_TM:tigDc,
                                    MMA_WELD_TM:mma,
                                    CUT_WELD_TM:cut
                                }]
                                InterfaceService.batchInsertMachineWeld(params,(data)=>{
                                },function(data){
                                });
                            }
                            break;
                        case '0A033E'://migsyn 返回31(1F)个数据*2=62个字节
                            // changeNewData =changeToOldMigSynData(receiveBleData);
                            //假如不是同一个焊接中的数据返回
                            if(store.state.weldingStatus==1 && nowModalIdx!='B1'){
                                return;
                            }
                            nowModalIdx='B1'
                            changeNewData = 'DAE1'+receiveBleData+BASE_CONFIG.callWeldTypeData.migsyn.crcCode;
                            window.broastFromAndroid(changeNewData.toLocaleUpperCase());
                            break;
                        case '0A031E'://migman 返回15(0F)个数据*2=30个字节(16:1e)
                            // changeNewData =changeToOldMigManData(receiveBleData);
                            //假如不是同一个焊接中的数据返回
                            if(store.state.weldingStatus==1 && nowModalIdx!='B2'){
                                return;
                            }
                            nowModalIdx='B2'
                            changeNewData = 'DAE2'+receiveBleData+BASE_CONFIG.callWeldTypeData.migman.crcCode;
                            window.broastFromAndroid(changeNewData.toLocaleUpperCase());
                            break;
                        case '0A0322'://mma 返回17(11)个数据*2=34个字节 (16:22)
                            // changeNewData =changeToOldMmaData(receiveBleData);
                            //假如不是同一个焊接中的数据返回
                            if(store.state.weldingStatus==1 && nowModalIdx!='B5'){
                                return;
                            }
                            nowModalIdx='B5'
                            changeNewData ='DAE5'+receiveBleData+BASE_CONFIG.callWeldTypeData.mma.crcCode;
                            window.broastFromAndroid(changeNewData.toLocaleUpperCase());
                            break;
                        case '0A0358'://tigsyn 返回43(44个数据*2=88个字节 ）(16进制=58)
                            // changeNewData =changeToOldTigsynData(receiveBleData);
                            //假如不是同一个焊接中的数据返回
                            if(store.state.weldingStatus==1 && nowModalIdx!='B3'){
                                return;
                            }
                            nowModalIdx='B3'
                            changeNewData ='DAE3'+receiveBleData+BASE_CONFIG.callWeldTypeData.tigsyn.crcCode;
                            window.broastFromAndroid(changeNewData.toLocaleUpperCase());
                            break;
                        case '0A0360'://tigman 返回48(48个数据*2=96个字节 ）(16进制=60)
                            //假如不是同一个焊接中的数据返回
                            if(store.state.weldingStatus==1 && nowModalIdx!='B4'){
                                return;
                            }
                            nowModalIdx='B4'
                            changeNewData =changeToOldTigmanData(receiveBleData);
                            window.broastFromAndroid(changeNewData.toLocaleUpperCase());
                            break;
                        // case '0A032E'://cut 返回46个字节
                        case '0A0316'://cut 返回11(11)个*2 =22个字节(16:16)
                            //假如不是同一个焊接中的数据返回
                            if(store.state.weldingStatus==1 && nowModalIdx!='B6'){
                                return;
                            }
                            nowModalIdx='B6'
                            changeNewData ='DAE6'+receiveBleData+BASE_CONFIG.callWeldTypeData.cut.crcCode;
                            window.broastFromAndroid(changeNewData.toLocaleUpperCase());
                            break;
                        //统一焊接中数据处理 注意都是两个字节
                        case '0A0304':
                            // DAB1 0100 0200 8658 双字节
                            // 0A03 04 0032 0032 60E9 =receiveBleData cut模式                                          
                            modbusBeginWeldCurVol=receiveBleData;  
                            try {
                                weldingCur = parseInt(receiveBleData.substring(8,10),16);
                                weldingVoltage =parseInt(receiveBleData.substring(12,14),16);
                            } catch (error) {
                                
                            }       
                            let content =nowModalIdx+receiveBleData.substring(8,10)+receiveBleData.substring(6,8)+receiveBleData.substring(12,14)+receiveBleData.substring(10,12);
                            let crc =crcModelBusClacQuery(content,true);
                            changeNewData ='DA'+content+crc;
                            window.tellVueWelding(changeNewData);
                            break;
                        case '0A0368':
                            // 0:没有数据
                            // 1:按MIG数据结构
                            // 2:按TIG数据结构
                            // 3:按MMA数据结构
                            // 4:按CUT数据结构
                            //记忆模式是DAD开头 window['broastMemoryFromAndroid']   DAC是save
                            //20190611 新通道规则 byte 876543210 其中 0:是单位 7-1:通道 8位 2t4t
                            //0A 03 68+通道数+数据结构01+数据长度11
                            //0A 03 68 0001 1101 0000 0000 0000 0038 ..........
                            //1、mig 2、tig 3、mma 4、cut
                            
                            let poupNum = parseInt(receiveBleData.substring(8,10),16);//通道号  0001的01
                           
                            let beforeZui =poupNum>9?'C':'D';
                            
                            let mod = receiveBleData.substring(12,14);//1101的01
                            console.log('11111111',receiveBleData,mod,beforeZui)
                            let ddd ='';
                            let datas='';
                            let dataList = [];
                            
                            switch (parseInt(mod)) {
                                case 1:
                                    datas =receiveBleData.substring(14,receiveBleData.length);
                                    
                                    for(let i=0;i<datas.length;i+=4){
                                        dataList.push(datas.slice(i,i+4));
                                    }
                                    //index=8是数组
                                    console.log(dataList);
                                    let list =  ((Array(16).join(0) + parseInt(dataList[8],16).toString(2)).slice(-16)).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' ');
                                    let a = `${list[11]}${list[12]}${list[13]}`;
                                    if(a=='001'){
                                        //migman
                                        ddd='2';
                                    }else if(a=='011'){
                                        //migsyn
                                        ddd='1';
                                    }
                                    break;
                                case 2:
                                    datas =receiveBleData.substring(14,receiveBleData.length);
                                
                                    for(let i=0;i<datas.length;i+=4){
                                        dataList.push(datas.slice(i,i+4));
                                    }
                                    //index=8是数组
                                    console.log(dataList);
                                    let list1 =  ((Array(16).join(0) + parseInt(dataList[0],16).toString(2)).slice(-16)).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' ');
                                    let rsta = `${list1[4]}${list1[5]}${list1[6]}`;
                                    if(rsta=='001'){
                                        //tigman
                                        ddd='4';
                                    }else if(rsta=='011'){
                                        //tigsyn
                                        ddd='3';
                                    }
                                    break;
                                case 3:
                                    ddd='5'
                                    break;
                                case 4:
                                    ddd='6'
                                    break;
                                default:
                                    //空数据 补0
                                    ddd ='0'
                                    break;
                            }
                            changeNewData =`DA${beforeZui}${ddd}${receiveBleData}`;
                            console.log('momery和history返回：'+changeNewData)
                            if(beforeZui=='D'){
                                window.broastMemoryFromAndroid(changeNewData);
                            }else{
                                window.broastHistoryFromAndroid(changeNewData);
                            }
                            break;
                        default:
                            break;
                    }
                }else{
                    // alert("heeee:"+receiveBleData)
                }
            }
            //init 初始化请求
            //请求一个模式确认是不是modbus协议版本机器
            Vue.prototype.callSendModbusSystemData = (sendData,crc,pageFrom) =>{
                // Toast('modbusSendDataTimes='+store.state.modbusSendDataTimes+":"+store.state.getConnectStatus)
                if(store.state.getConnectStatus!='connected'){
                    return;
                }
                store.state.modbusSendDataTimes=store.state.modbusSendDataTimes+1;
                if(store.state.modbusSendDataTimes>4){
                    //达到验证上线不需要再重复发送
                    return;
                }else{
                    console.log('callSendModbusSystemData'+store.state.modbusSendDataTimes,store.state.modbusSendDataTimes>4);
                    onlySendFuc(sendData+crc,pageFrom,crc);
                }
                // var crc = crcModelBusClacQuery(sendData);
                // crc ='0105'//计算好
                
            }
            // callSendDataToBleUtil
            // modbus data build center  || iosBleDataLayoutFuc 
            //查询指令：地址 功能码 数据起始地址高位  数据起始地址低位  数据个数高位  数据个数低位  crc16高位 crc16低位
            //更新指令：地址 功能码 数据起始地址高位  数据起始地址低位  数据高位  数据低位  crc16高位 crc16低位
            function modbusDataSendFuc(pageFrom,sendData,crc){
                store.state.modbusSendDataTimes=store.state.modbusSendDataTimes+1;
                store.state.postDataList.push({type:'modbusDataSendFuc',data:sendData})
                
                if(store.state.modbusSendTimes==0 || !store.state.modbusSendTimes){
                    //通信验证失败
                    return;
                }
                let newVal ="";
                // DAB15c00E718 =12长 首页模式数据：DA 100000 0570
                // DA3001005F70 migsyn hisweldlist
                if(sendData && sendData.length>11){
                    let directive = sendData.substring(2,4);//指令值
                    let num = sendData.substring(4,8);//数值
                    let diKey = sendData.substring(4,6);//数值
                    //来自首页信息
                    if(directive == 10){
                        directive = sendData.substring(2,8);//指令值
                    }
                    let modbusInfo = BASE_CONFIG.callMobusEditDirect[directive] || '';
                    console.log('modbusInfo配置信息：',modbusInfo,directive);
                    //重新构建协议值
                    if(modbusInfo && modbusInfo.name){
                        let tempData='';
                        let crc ='';
                        let sData ='';
                        // 先来简单分析一条MODBUS-RTU报文，例如：01  06  00 01  00 17  98 04 只有一个从机所以地址一样
                        // 01             06            00 01           00 17          98 04 
                        // 从机地址        功能号          数据地址          数据         CRC校验
                        if(modbusInfo && modbusInfo.type && modbusInfo.type=='1'){
                            //来自主模式数据需要分成几段数据，循环请求
                            // let sendIndexList = [];
                            // Object.keys(modbusInfo.modbusAdrMap).forEach(pAdr => {
                            //     tempData =  pAdr+BASE_CONFIG.modbusWriteCode+'00'+pAdr+modbusInfo.modbusAdrMap[pAdr];
                            //     crc = crcModelBusClacQuery(tempData);
                            //     //放到 请求堆栈里
                            //     sendIndexList.push({
                            //         directive:directive,
                            //         pAdr:pAdr,
                            //         sendData:tempData,
                            //         crc:crc
                            //     });
                            // });
                            // //发送数据
                            // if(sendIndexList.length>0){
                            //     circleDataSendFuc(sendIndexList[0])
                            // }
                            tempData =  BASE_CONFIG.modbusSlave+BASE_CONFIG.modbusReadCode+modbusInfo.modbusAdr+modbusInfo.modbusNum;
                            crc = crcModelBusClacQuery(tempData);
                            clearInterval(store.state.modbusCircleTimer);//modbus循环请求时间器
                            sData = tempData+crc;
                            modbusLastReadData =sData;
                            //重新开启 什么时候清除呢
                
                            store.state.modbusCircleTimer = setInterval(() => {
                                console.log('modbusCircleTimer')
                                modbusGlobalReceiveList=[];//清空
                                onlySendFuc(modbusLastReadData,pageFrom,crc)
                                console.log('循环发送modebus协议数据：',modbusLastReadData,crc);
                            }, 3000);
                            console.log('modebus协议数据read：',sData,crc);
                        }else if(modbusInfo && modbusInfo.type && modbusInfo.type=='2'){
                            clearInterval(store.state.modbusCircleTimer);
                            //momery模式 原来的：DA2001009A71
                            console.log('momery和history模式数据：type='+modbusInfo.type,sData,num,diKey)
                            // 通道数	1-9对应焊机上的存储通道1-9
                            // 10~15分别对应history里的MIGSYN,MIGMAN,TIGSYN,TIGMAN,MMA,CUT
                            //写第几通道数据 800
                            tempData = BASE_CONFIG.modbusSlave+BASE_CONFIG.modbusWriteCode+modbusInfo.modbusWriteAdr+num;
                            crc = crcModelBusClacQuery(tempData);
                            sData = tempData+crc;//0A0603200200885F
                            momeryDiKey = diKey;
                            
                            //延迟500ms请求模式数据
                            setTimeout(() => {
                                //读数据
                                let td2 = BASE_CONFIG.modbusSlave+BASE_CONFIG.modbusReadCode+modbusInfo.modbusReadAdr+modbusInfo.modbusNum;
                                let crc2 = crcModelBusClacQuery(td2);
                                let sData2 = td2+crc;
                                modbusGlobalReceiveList=[];//清空
                                onlySendFuc(sData2,pageFrom,crc2);//0A03032A003464EA
                            }, 500);
                        }else if(modbusInfo && modbusInfo.type && modbusInfo.type=='3'){
                            //momery详情 应用
                            tempData = BASE_CONFIG.modbusSlave+BASE_CONFIG.modbusWriteCode+modbusInfo.modbusWriteAdr+num;
                            crc = crcModelBusClacQuery(tempData);
                            sData = tempData+crc;//0A 06 0321 0100 6FD9
                            clearInterval(store.state.modbusCircleTimer);
                            
                            //延迟500ms请求模式数据
                            setTimeout(() => {
                                //读数据
                                store.state.modbusCircleTimer = setInterval(() => {
                                    // 0A03UNDEFINED000F3307
                                    // let td2 = BASE_CONFIG.modbusSlave+BASE_CONFIG.modbusReadCode+modbusMainInfo.modbusAdr+modbusMainInfo.modbusNum;
                                    // let crc2 = crcModelBusClacQuery(td2);
                                    // let sData2 = td2+crc;
                                    // modbusGlobalReceiveList=[];//清空
                                    // onlySendFuc(sData2,'newIndex',crc2);//0A03032A003464EA
                                    let modbusMainInfo ='';
                                    let aaaa= store.state.momeryApplyModel;
                                    console.log(aaaa)
                                    switch (aaaa) {
                                        case 'MIG SYN':
                                            modbusMainInfo = BASE_CONFIG.callMobusEditDirect['100000'];//MIGSYN
                                            break;
                                        case 'MIG MAN':
                                            modbusMainInfo = BASE_CONFIG.callMobusEditDirect['100100'];//MIGMAN
                                            break;
                                        case 'TIG SYN':
                                            modbusMainInfo = BASE_CONFIG.callMobusEditDirect['100200'];//
                                            break;
                                        case 'TIG MAN':
                                            modbusMainInfo = BASE_CONFIG.callMobusEditDirect['100300'];//
                                            break;
                                        case 'MMA':
                                            modbusMainInfo = BASE_CONFIG.callMobusEditDirect['100400'];//
                                            break;
                                        case 'CUT':
                                            modbusMainInfo = BASE_CONFIG.callMobusEditDirect['100500'];//
                                            break;
                                        default:
                                            break;
                                    }
                                    let td2 = BASE_CONFIG.modbusSlave+BASE_CONFIG.modbusReadCode+modbusMainInfo.modbusAdr+modbusMainInfo.modbusNum;
                                    let crc2 = crcModelBusClacQuery(td2);
                                    let sData2 = td2+crc;
                                    modbusGlobalReceiveList=[];//清空
                                    onlySendFuc(sData2,'newIndex',crc2);//0A03032A003464EA
                                },3000)
                            }, 500);
                        }else if(modbusInfo && modbusInfo.type && modbusInfo.type=='4'){
                            //history模式
                            clearInterval(store.state.modbusCircleTimer);
                            //history模式 DA3005009F72
                            console.log('momery和history模式数据：type='+modbusInfo.type,sData,num,diKey)
                            // 10~15分别对应history里的MIGSYN,MIGMAN,TIGSYN,TIGMAN,MMA,CUT
                            let newNum ='';
                            switch (parseInt(diKey)) {
                                case 0:
                                    newNum ='000A'
                                    break;
                                case 1:
                                    newNum ='000B'
                                    break;
                                case 2:
                                    newNum ='000C'
                                    break;
                                case 3:
                                    newNum ='000D'
                                    break;
                                case 4:
                                    newNum ='000E'
                                    break;
                                case 5:
                                    newNum ='000F'
                                    break;
                                default:
                                    break;
                            }
                            // 通道数	1-9对应焊机上的存储通道1-9
                            // 10~15分别对应history里的MIGSYN,MIGMAN,TIGSYN,TIGMAN,MMA,CUT
                            //写第几通道数据 800
                            tempData = BASE_CONFIG.modbusSlave+BASE_CONFIG.modbusWriteCode+modbusInfo.modbusWriteAdr+newNum;
                            crc = crcModelBusClacQuery(tempData);
                            sData = tempData+crc;//0A0603200200885F
                            momeryDiKey = diKey;
                            //延迟500ms请求模式数据
                            setTimeout(() => {
                                //读数据
                                let td2 = BASE_CONFIG.modbusSlave+BASE_CONFIG.modbusReadCode+modbusInfo.modbusReadAdr+modbusInfo.modbusNum;
                                let crc2 = crcModelBusClacQuery(td2);
                                let sData2 = td2+crc;
                                modbusGlobalReceiveList=[];//清空
                                onlySendFuc(sData2,pageFrom,crc2);//0A03032A003464EA
                            }, 500);
                        }else if(modbusInfo && modbusInfo.type && modbusInfo.type=='5'){
                            //history详情 应用
                            // 10~15分别对应history里的MIGSYN,MIGMAN,TIGSYN,TIGMAN,MMA,CUT
                            let newNum ='';
                            let modbusMainInfo ={};
                            switch (parseInt(diKey)) {
                                case 0:
                                    newNum ='000A'
                                    modbusMainInfo = BASE_CONFIG.callMobusEditDirect['100000'];//MIGSYN
                                    break;
                                case 1:
                                    newNum ='000B'
                                    modbusMainInfo = BASE_CONFIG.callMobusEditDirect['100100'];
                                    break;
                                case 2:
                                    newNum ='000C'
                                    modbusMainInfo = BASE_CONFIG.callMobusEditDirect['100200'];
                                    break;
                                case 3:
                                    newNum ='000D'
                                    modbusMainInfo = BASE_CONFIG.callMobusEditDirect['100300'];
                                    break;
                                case 4:
                                    newNum ='000E'
                                    modbusMainInfo = BASE_CONFIG.callMobusEditDirect['100400'];
                                    break;
                                case 5:
                                    newNum ='000F'
                                    modbusMainInfo = BASE_CONFIG.callMobusEditDirect['100500'];
                                    break;
                                default:
                                    break;
                            }
                            
                            tempData = BASE_CONFIG.modbusSlave+BASE_CONFIG.modbusWriteCode+modbusInfo.modbusWriteAdr+newNum;
                            crc = crcModelBusClacQuery(tempData);
                            sData = tempData+crc;
                            clearInterval(store.state.modbusCircleTimer);
                            //延迟500ms请求模式数据
                            setTimeout(() => {
                                //读数据
                                store.state.modbusCircleTimer = setInterval(() => {
                                    // 0A03UNDEFINED000F3307
                                    let td2 = BASE_CONFIG.modbusSlave+BASE_CONFIG.modbusReadCode+modbusMainInfo.modbusAdr+modbusMainInfo.modbusNum;
                                    let crc2 = crcModelBusClacQuery(td2);
                                    let sData2 = td2+crc;
                                    modbusGlobalReceiveList=[];//清空
                                    onlySendFuc(sData2,'newIndex',crc2);//0A03032A003464EA
                                },3000)
                            }, 500);
                        }else if(modbusInfo && modbusInfo.type && modbusInfo.type=='6'){
                            //设置单位0000：mm   0001:inch
                            tempData = BASE_CONFIG.modbusSlave+BASE_CONFIG.modbusWriteCode+modbusInfo.modbusWriteAdr+num;
                            crc = crcModelBusClacQuery(tempData);
                            sData = tempData+crc;//DA400100D4B1
                           
                        }else if(modbusInfo && modbusInfo.type && modbusInfo.type=='7'){
                            //getready操作
                            tempData = BASE_CONFIG.modbusSlave+BASE_CONFIG.modbusWriteCode+modbusInfo.modbusAdr+num;
                            crc = crcModelBusClacQuery(tempData);
                            sData = tempData+crc;//DA400100D4B1
                        }else if(modbusInfo && modbusInfo.type && modbusInfo.type=='override'){
                            //save detail里的override操作
                            tempData = BASE_CONFIG.modbusSlave+BASE_CONFIG.modbusWriteCode+modbusInfo.modbusAdr+num;
                            crc = crcModelBusClacQuery(tempData);
                            sData = tempData+crc;
                        }else{
                            tempData = BASE_CONFIG.modbusSlave+BASE_CONFIG.modbusWriteCode+modbusInfo.modbusAdr+num[2]+num[3]+num[0]+num[1];
                            crc = crcModelBusClacQuery(tempData);
                            sData = tempData+crc;
                            
                        }
                        modbusTooLongList=[];//清空记录
                        console.log('modebus协议数据write：',sData,crc);
                        onlySendFuc(sData,pageFrom,crc)
                        
                        //发送

                    }else{
                        return;
                    }
                    
                }
            }
            function migByte0Special(num){
                let obj={
                    'weldingStatus':''
                }
                let list =  ((Array(16).join(0) + parseInt(num,16).toString(2)).slice(-16)).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' ');
                let data =list.join("");
                if(data.length>15){
                    // 0： 引弧失败/断弧1： 引弧成功/电弧连续
                    obj.weldingStatus = data.substring(0,1);//焊接状态
                }
                return obj;
            }
            function migByte8Special(num){
                let obj={
                    'migMan2T4T':'',
                    'migSyn2T4T':'',
                    'recommend_Inductance':'',
                    'induncance':''
                }
                //005c
                //0000000001011100 
                //["0", "0", "0", "0", "0", "0", "0", "0", "0", "1", "0", "1", "1", "1", "0", "0"]
                //13~16	电感量		MIGSYN,MIGMAN
               let list =  ((Array(16).join(0) + parseInt(num,16).toString(2)).slice(-16)).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' ');
               let data =list.join("");
                if(data.length>15){
                    let a = parseInt(data.substring(13,16),2).toString(16);//2进制
                    if(a.length==1){
                        a=`0${a}`;
                    }
                    obj.induncance=a;
                    let b = parseInt(data.substring(8,12),2).toString(16);//2进制
                    if(b.length==1){
                        a=`0${b}`;
                    }
                    obj.recommend_Inductance=b;//电感推荐值
                    //2t4t
                    if(data.substring(0,1) ==1){
                        obj.migMan2T4T="1"
                    }else{
                        obj.migMan2T4T="0"
                    }
                    if(data.substring(1,2) ==1){
                        obj.migSyn2T4T="1"
                    }else{
                        obj.migSyn2T4T="0"
                    }
                }
                return obj;
            }
            // migman数据转换机制
            function changeToOldMigManData(receiveBleData){
                // receiveBleData = "0A 06 0032 0F 0000 0028 0028 00 00 00 00 00 00 0000 0000 0000 005C 00BB 00a4 000f 0104 0064 43EA";
                // let head = receiveBleData.substring(0,8);//这是头从机地址+功能码+起始地址位
                // let nums = receiveBleData.substring(8,10);//这是数据量
                let datas =receiveBleData.substring(6,receiveBleData.length);
                var dataList = [];
                for(var i=0;i<datas.length;i+=4){
                    dataList.push(datas.slice(i,i+4));
                }
                // migman:{heade:'dae',headm:'dad',headc:'dac',data:'2 4A 5B00 BA00 0A 4B13'};//20201028真实焊机上发 正常
                let migOldHead1 ='da';
                let migOldHead2 ='e2';
                let byte0 ='';//集合字节 
                let byte0_2 ='';//各种焊接状态 
                let byte0_7 ='';//各种焊接状态 2T|4T :4A
                let byte12 ='';//送丝速度:5B00 高位在前？
                let byte34 ='';//电压 :BA00  高位在前？
                let byte5 ='';//电感量 :0A
                byte12 = dataList[9].substring(2,4)+dataList[9].substring(0,2);//0028转成高位在前
                byte34 = dataList[10].substring(2,4)+dataList[10].substring(0,2);//00BB转成高位在前
                let obj =migByte8Special(dataList[8]);//处理一些字节数据
                let obj2 =migByte0Special(dataList[0]);
                byte0_2=obj2.weldingStatus;//1焊接中
                byte0_7 =obj.migMan2T4T;//各种焊接状态 2T|4T :4A
                // 0	单位
                // 1	PFC
                // 2	焊接
                // 3	过热
                // 4	过流
                // 5
                // 6	空
                // 7	2T4T
                let tempByte0 = parseInt(`${byte0_7}0000${byte0_2}00`,2).toString(16);
                byte0 =tempByte0.length>1?tempByte0:`0${tempByte0}`;
                byte5 =obj.induncance;//电感量 :0A
                console.log('来自changeToOldMigManData：',migOldHead1+migOldHead2,byte0,byte12,byte34,byte5)
                let total =`${migOldHead2}${byte0}${byte12}${byte34}${byte5}`;
                let crc = crcModelBusClacQuery(total)
                return `${migOldHead1}${total}${crc}`;
            }
            // migsyn数据转换机制
            function changeToOldMigSynData(receiveBleData){
                // receiveBleData = "0A 06  1F 0000 0028 0028 00 00 00 00 00 00 0000 0000 0000 005C 00BB 00a4 000f 0104 0064 0003 0000 0001 0000 0003 0000 000c 0000 003c 00b4 0000 0000 0000 0000 0000 0000 0C5D";
                // let head = receiveBleData.substring(0,4);//这是头
                // let nums = receiveBleData.substring(4,6);//这是数据起始数据量
                // let datas =receiveBleData.substring(10,10+parseInt(parseInt(("0x"+nums),16).toString(10))*4);
                let datas =receiveBleData.substring(6,receiveBleData.length);
                var dataList = [];
                for(var i=0;i<datas.length;i+=4){
                    dataList.push(datas.slice(i,i+4));
                }
                // migman:{heade:'dae',headm:'dad',headc:'dac',data:'2 4A 5B00 BA00 0A 4B13'};//20201028真实焊机上发 正常
               
                //     0	单位		0：mm、1：inch
                //     1	PFC	PFC	
                //     2	焊接		0：非焊接、1：焊接
                //     3	过热		1：过热
                //     4	过流		1：过流
                //     5
                // 6	空		
                //     7	2T4T	MIG_2T_4T_mode	0：2T、1：4T
                // 1		材料	MIG_material	
                // 2		气体	MIG_gas	
                // 3		直径	MIG_diameter	
                // 4		板厚	MIG_thickness	
                // 5	0~3	电感量推荐值	recommend_Inductance	
                //     4~7	电感量	Inductance	
                // 6
                // 7		送丝速度推荐值	recommend_speed_display	
                // 8
                // 9		送丝速度	speed_display	
                // 10
                // 11		电压推荐值	recommend_V_wilding	
                // 12
                // 13		电压	V_welding	
                // 14		板厚最小值	MIG_min_thickness	
                // 15		板厚最大值	MIG_min_thickness	
                let migOldHead1 ='da';
                let migOldHead2 ='e1';
                let byte0 ='';//集合字节 
                let byte0_2 ='';//各种焊接状态 
                let byte0_7 ='';//各种焊接状态 2T|4T :4A
                let byte1 ='';//MIG_material
                let byte2 ='';//MIG_gas
                let byte3 ='';//MIG_diameter
                let byte4 ='';//MIG_thickness
                // let byte5_0_3="";//电感推荐值 recommend_Inductance
                // let byte5_4_7 ='';//电感量 :0A Inductance
                let byte5 ='';
                let byte67 ='';//recommend_speed_display
                let byte89 ='';//speed_display
                let byte1011 ='';//recommend_V_wilding
                let byte1213 ='';//V_welding
                let byte14 = "";//MIG_min_thickness
                let byte15 = '';//MIG_max_thickness
                //开始处理及赋值
                let obj =migByte8Special(dataList[8]);//处理一些字节数据
                let obj2 =migByte0Special(dataList[0]);
                byte0_2=obj2.weldingStatus;//1焊接中
                byte0_7 =obj.migSyn2T4T;//各种焊接状态 2T|4T :4A
                let tempByte0 = parseInt(`${byte0_7}0000${byte0_2}00`,2).toString(16);
                byte0 =tempByte0.length>1?tempByte0:`0${tempByte0}`;
                byte1=dataList[25].substring(2,4);//直接截取 2字节转一个字节
                byte2=dataList[26].substring(2,4);//直接截取 2字节转一个字节
                byte3=dataList[27].substring(2,4);//直接截取 2字节转一个字节
                byte4=dataList[28].substring(2,4);//直接截取 2字节转一个字节
                byte5 =dataList[8].substring(2,4);//直接截取 2字节转一个字节
                byte67=dataList[23].substring(2,4)+dataList[23].substring(0,2);//0028转成高位在前;
                byte89=dataList[29].substring(2,4)+dataList[29].substring(0,2);//0028转成高位在前;;
                byte1011=dataList[24].substring(2,4)+dataList[24].substring(0,2);//0028转成高位在前;;;
                byte1213=dataList[30].substring(2,4)+dataList[30].substring(0,2);//0028转成高位在前;;;
                byte14=dataList[22].substring(2,4);//直接截取 2字节转一个字节
                byte15=dataList[23].substring(2,4);//直接截取 2字节转一个字节
                //旧逻辑crc校验不包含 da
                let total =`${migOldHead2}${byte0}${byte1}${byte2}${byte3}${byte4}${byte5}${byte67}${byte89}${byte1011}${byte1213}${byte14}${byte15}`;
                let crc = crcModelBusClacQuery(total)
                console.log('来自changeToOldMigSynData：',migOldHead1+migOldHead2,byte0,byte1,byte2,byte3,byte4,byte5,byte67,byte89,byte1011,byte1213,byte14,byte15,crc)
                return `${migOldHead1}${total}${crc}`;
            }
            // tigman数据转换机制--去别的地方再做处理
            function changeToOldTigmanData(receiveBleData){
                let migOldHead1 ='da';
                let migOldHead2 ='e4';
                let total =migOldHead2+receiveBleData;
                let crc = crcModelBusClacQuery(total)
                return `${migOldHead1}${total}${crc}`;
            }
            
            //modbus用：改动时另一处记得一起
            function changeToOldMigsynRealData(receiveBleData,pageFrom){
                receiveBleData=receiveBleData.replace(/\s*/g,"");
                console.log(receiveBleData)
                let datas='';
                if(pageFrom=='memory' || pageFrom=='hisweldlist'){
                    datas =receiveBleData.substring(18,receiveBleData.length);
                }else{
                    datas =receiveBleData.substring(10,receiveBleData.length);
                }
                
                var dataList = [];
                for(var i=0;i<datas.length;i+=4){
                    dataList.push(datas.slice(i,i+4));
                }
                console.log(dataList)
                var rstInfo={};
                rstInfo.nowTypeList=weldParam.migsynTypeList;
                rstInfo.weldType='MIGSYN';
                rstInfo.weldTypeNum=BASE_CONFIG.callWeldTypeData.migsyn.newIndex;//这个和首页里的配对
                let t0List = ((Array(16).join(0) + parseInt(dataList[0],16).toString(2)).slice(-16)).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' '); 
                let t8List = ((Array(16).join(0) + parseInt(dataList[8],16).toString(2)).slice(-16)).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' '); 
                var byte1Bean ={};
                    byte1Bean.isReadyFlag=`${t8List[11]}${t8List[12]}${t8List[13]}` == '011'?1:0,//2-4;
                    byte1Bean.weldStatus=t0List[15];//0:未焊接  1:在焊接
                    if(byte1Bean.weldStatus==1){
                        if(pageFrom=='newIndex'){
                            store.state.weldingStatus=1;
                            if(store.state.isModbusModal){
                                modbusBeginWeldInfo=receiveBleData;
                                weldingInfoQuery();// clearInterval(store.state.weldingInterval);
                            }
                        }
                    }else{
                        if(modbusIsBeginWeld==1){
                            uploadAppWeldInfoList({
                                BT_ADDRESS: store.state.btAddress, 
                                MODEL_TYPE : rstInfo.weldType,
                                WELD_CONTENT : modbusBeginWeldInfo,
                                BEGIN_TM:modbusBeginWeldTm,
                                END_TM :buidTm(),
                                COST_TM : modbusWeldLongTime,
                                WELD_DATA:modbusBeginWeldCurVol,//电压\电流
                                WELD_CUR:weldingCur,
                                WELD_VOL:weldingVoltage,
                                RECORD_SECOND:new Date().getTime(),//ms 时间戳
                                tenantID:BASE_CONFIG.tenantID
                            });
                            // upLoadDataFuc(receiveBleData,'util','weld_end',{weldTime:modbusWeldLongTime});
                        }
                        modbusBeginWeldTm="";
                        modbusIsBeginWeld=0;//重置
                        modbusWeldLongTime=0;
                        clearInterval(store.state.weldingInterval);
                        store.state.weldingStatus=0;
                        store.state.getWeldingInfoTimes=0;//重置
                        
                    }
                    
                    byte1Bean.unit=t8List[10];//默认是0 ich单位是1 TODO
                    byte1Bean.bitInfoList={
                        l0:t0List,
                        l8:t8List
                    };
                    rstInfo.nowTypeList.forEach(element => {
                        switch (element.typeName) {
                            case 'MODE':
                                // element.chooseKey=setWeldParams('MODE',byte1Bean.mode);
                                element.chooseKey=t8List[14];
                                break;
                            case 'MATERIAL':
                                element.chooseKey=parseInt(dataList[25],16);
                                // element.chooseKey=setWeldParams('MATERIAL',arrayList[3]);
                                break;
                            case 'GAS':
                                // element.chooseKey=setWeldParams('GAS',arrayList[4]);
                                element.chooseKey=parseInt(dataList[26],16);
                                break;
                            case 'DIAMETER':
                                // element.chooseKey=setWeldParams('DIAMETER',arrayList[5]);
                                element.chooseKey=parseInt(dataList[27],16);
                                // alert(element.chooseKey);
                                break;
                            case 'THICKNESS':
                                element.chooseKey=parseInt(dataList[28],16);
                                // element.chooseKey=setWeldParams('THICKNESS',arrayList[6]);
                                break;
                            default:
                                break;
                        }
                    });
                    // console.log('//',t8List) 12~15
                    rstInfo.INDUCTANCE =parseInt(`${t8List[0]}${t8List[1]}${t8List[2]}${t8List[3]}}`,2).toString(10);//机器上发不能改 不知道干嘛的
                    //bit0-3 8~11
                    rstInfo.RECOMMEND_INDUCTANCE =parseInt(`${t8List[4]}${t8List[5]}${t8List[6]}${t8List[7]}`,2).toString(10);//机器上发不能改 不知道干嘛的

                    rstInfo.RECOMMEND_SPEED_DISPLAY=parseInt(dataList[23],16);;//推荐值
                    rstInfo.SPEED_DISPLAY =parseInt(dataList[29],16);//送丝速度
                    rstInfo.RECOMMEND_V_WELDING=parseInt(dataList[24],16);
                    rstInfo.V_WELDING=parseInt(dataList[30],16);
                    //其他属性不需要 赋值直接赋值 到时再取
                    rstInfo.THINKNESS_VALUE = parseInt(dataList[28],16);
                    rstInfo.MIG_MIN_THICHNESS=parseInt(dataList[22],16);//最小厚度值
                    rstInfo.MIG_MAX_THICHNESS=parseInt(dataList[21],16);//最大厚度值
                    rstInfo.initBean=byte1Bean;
                    //最大送丝速度
                    rstInfo.MAX_SPEED_DISPLAY=parseInt(dataList[11],16)/10;
                    //最小送丝速度
                    rstInfo.MIN_SPEED_DISPLAY=parseInt(dataList[12],16)/10;
                    //最大电压值
                    rstInfo.MAX_WELD_V_DISPLAY=parseInt(dataList[13],16)/10;
                    rstInfo.MIN_WELD_V_DISPLAY=parseInt(dataList[14],16)/10;
                    //mig_material 值 ==0 显示gas选项否则隐藏
                    rstInfo.MIG_MATERIAL =parseInt(dataList[25],16);
                    return rstInfo;
            }
            //modbus用：改动时另一处记得一起
            function changeToOldMigmanRealData(receiveBleData,pageFrom){
                
                receiveBleData=receiveBleData.replace(/\s*/g,"");
                let datas ='';
                if(pageFrom=='memory' || pageFrom=='hisweldlist'){
                    datas =receiveBleData.substring(18,receiveBleData.length);
                }else{
                    datas =receiveBleData.substring(10,receiveBleData.length);
                }
                
                var dataList = [];
                for(var i=0;i<datas.length;i+=4){
                    dataList.push(datas.slice(i,i+4));
                }
                console.log(dataList)
                var rstInfo={};
                rstInfo.nowTypeList=weldParam.migmanTypeList;
                rstInfo.weldType='MIGMAN';
                rstInfo.weldTypeNum=BASE_CONFIG.callWeldTypeData.migman.newIndex;//这个和首页里的配对
                let t0List = ((Array(16).join(0) + parseInt(dataList[0],16).toString(2)).slice(-16)).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' '); 
                
                let t8List = ((Array(16).join(0) + parseInt(dataList[8],16).toString(2)).slice(-16)).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' '); 
                console.log('++++++',t8List)
                var byte1Bean ={};
                    byte1Bean.isReadyFlag=`${t8List[11]}${t8List[12]}${t8List[13]}` == '001'?1:0,//2-4;
                    byte1Bean.weldStatus=t0List[15];//0:未焊接  1:在焊接
                    
                    if(byte1Bean.weldStatus==1){
                        if(pageFrom=='newIndex'){
                            store.state.weldingStatus=1
                            if(store.state.isModbusModal){
                                modbusBeginWeldInfo=receiveBleData;
                                weldingInfoQuery();// clearInterval(store.state.weldingInterval);
                            }
                        }
                    }else{
                        if(modbusIsBeginWeld==1){
                            uploadAppWeldInfoList({
                                BT_ADDRESS: store.state.btAddress, 
                                MODEL_TYPE : rstInfo.weldType,
                                WELD_CONTENT : modbusBeginWeldInfo,
                                BEGIN_TM:modbusBeginWeldTm,
                                END_TM :buidTm(),
                                COST_TM : modbusWeldLongTime,
                                WELD_DATA:modbusBeginWeldCurVol,//电压\电流
                                WELD_CUR:weldingCur,
                                WELD_VOL:weldingVoltage,
                                RECORD_SECOND:new Date().getTime(),//ms 时间戳
                                tenantID:BASE_CONFIG.tenantID
                            });
                            // upLoadDataFuc(receiveBleData,'util','weld_end',{weldTime:modbusWeldLongTime});
                        }
                        clearInterval(store.state.weldingInterval);
                        modbusBeginWeldTm="";
                        modbusIsBeginWeld=0;//重置
                        modbusWeldLongTime=0;
                        store.state.weldingStatus=0;
                        store.state.getWeldingInfoTimes=0;//重置
                    }
                    
                    byte1Bean.unit=t8List[10];// 5	单位	0:mm  1:inch	MIGSYN,MIGMAN
                    byte1Bean.bitInfoList={
                        l0:t0List,
                        l8:t8List,
                    };
                rstInfo.nowTypeList.forEach(element => {
                    if(element.typeName=='MODE'){
                        element.chooseKey=t8List[15];
                    }
                });
                rstInfo.SPEED_DISPLAY =parseInt(dataList[9],16);//送丝速度
                rstInfo.V_WELDING =parseInt(dataList[10],16);//电压
                // let obj =migByte8Special(dataList[8]);//处理一些字节数据
                
                rstInfo.INDUCTANCE =parseInt(`${t8List[0]}${t8List[1]}${t8List[2]}${t8List[3]}`,2).toString(10);//机器上发不能改 不知道干嘛的
                //bit0-3
                rstInfo.RECOMMEND_INDUCTANCE =parseInt(`${t8List[4]}${t8List[5]}${t8List[6]}${t8List[7]}`,2).toString(10);//机器上发不能改 不知道干嘛的
                rstInfo.initBean=byte1Bean;
                //最大送丝速度
                rstInfo.MAX_SPEED_DISPLAY=parseInt(dataList[11],16)/10;//maxSpeedBuild(byte1Bean.unit,byte1Bean.pfc);
                //最小送丝速度
                rstInfo.MIN_SPEED_DISPLAY=parseInt(dataList[12],16)/10;//1.5;
                //最小电压值
                rstInfo.MIN_WELD_V_DISPLAY=parseInt(dataList[14],16)/10;//minVWeldBuild(byte1Bean.pfc);
                //最大电压值
                rstInfo.MAX_WELD_V_DISPLAY=parseInt(dataList[13],16)/10;//maxVWeldBuild(byte1Bean.pfc);
                return rstInfo;
            }
            
            //modbus用：改动时另一处记得一起
            function changeToOldTigsynRealData(receiveBleData,pageFrom){
                receiveBleData=receiveBleData.replace(/\s*/g,"");
                let datas ='';
                if(pageFrom=='memory' || pageFrom=='hisweldlist'){
                    datas =receiveBleData.substring(18,receiveBleData.length);
                }else{
                    datas =receiveBleData.substring(10,receiveBleData.length);
                }
                var dataList = [];
                for(var i=0;i<datas.length;i+=4){
                    dataList.push(datas.slice(i,i+4));
                }
                console.log(dataList)
                var rstInfo={};
                rstInfo.nowTypeList=weldParam.tigsynList;
                rstInfo.weldType='TIGSYN';
                rstInfo.weldTypeNum=BASE_CONFIG.callWeldTypeData.tigsyn.newIndex;//这个和首页里的配对
                let t0List = ((Array(16).join(0) + parseInt(dataList[0],16).toString(2)).slice(-16)).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' '); 
                var byte1Bean ={};
                    byte1Bean.isReadyFlag=`${t0List[4]}${t0List[5]}${t0List[6]}` == '011'?1:0,//9-11;
                    byte1Bean.weldStatus=t0List[3];//0:未焊接  1:在焊接
                    // Toast('tigsyn:'+byte1Bean.weldStatus)
                    if(byte1Bean.weldStatus==1){
                        if(pageFrom=='newIndex'){
                            store.state.weldingStatus=1
                            if(store.state.isModbusModal){
                                modbusBeginWeldInfo=receiveBleData;
                                weldingInfoQuery();// clearInterval(store.state.weldingInterval);
                            }
                        }
                    }else{
                        if(modbusIsBeginWeld==1){
                            uploadAppWeldInfoList({
                                BT_ADDRESS: store.state.btAddress, 
                                MODEL_TYPE : rstInfo.weldType,
                                WELD_CONTENT : modbusBeginWeldInfo,
                                BEGIN_TM:modbusBeginWeldTm,
                                END_TM :buidTm(),
                                COST_TM : modbusWeldLongTime,
                                WELD_DATA:modbusBeginWeldCurVol,//电压\电流
                                WELD_CUR:weldingCur,
                                WELD_VOL:weldingVoltage,
                                RECORD_SECOND:new Date().getTime(),//ms 时间戳
                                tenantID:BASE_CONFIG.tenantID
                            });
                            // upLoadDataFuc(receiveBleData,'util','weld_end',{weldTime:modbusWeldLongTime});
                        }
                        modbusBeginWeldTm="";
                        modbusIsBeginWeld=0;//重置
                        modbusWeldLongTime=0;
                        store.state.weldingStatus=0;
                        store.state.getWeldingInfoTimes=0;//重置
                        clearInterval(store.state.weldingInterval);
                    }
                    
                    byte1Bean.unit=t0List[2];//13	单位	0:mm  1:inch
                    //焊接模式
                    // 0:短焊    1:长焊  2:点焊    3:重复
                    // 0:无高频   1:有高频
                    // 0:非脉冲   1:脉冲
                    // 0:气冷       1:水冷
                    // 0:交流       1:直流
                    // 0:短焊    1:长焊
                    // 焊接电源工作模式
                    // 引弧成功,焊接中
                    // 单位
                    byte1Bean.bitInfoList = {
                        tigmanWeldMode:`${t0List[14]}${t0List[15]}`,//0:短焊    1:长焊	2T4T
                        tigmanPinglv:t0List[13],//0:无高频   1:有高频	HF
                        tigmanMc:t0List[12],//0:非脉冲   1:脉冲	PULSE
                        tigmanGas:t0List[11],//0:无高频   1:有高频	HF
                        tigmanCurrent:`${t0List[8]}${t0List[9]}${t0List[10]}`,//5-7 0:交流       1:直流	ACDC
                        tigsynWeldMode:t0List[7],//5-7
                        tigMode:`${t0List[4]}${t0List[5]}${t0List[6]}`,//9-11
                        tigIsWeiding:t0List[3],
                        tigUnit:t0List[2]
                    };
                rstInfo.THINKNESS_VALUE = parseInt(dataList[17],16);
                rstInfo.nowTypeList.forEach(element => {
                    switch (element.typeName) {
                        case 'MODE':
                            element.chooseKey=t0List[7];//0:短焊    1:长焊
                            break;
                        case 'MATERIAL':
                            element.chooseKey=parseInt(dataList[16],16);
                            break;
                        case 'DIAMETER':
                            element.chooseKey=parseInt(dataList[15],16);
                            break;
                        case 'THICKNESS':
                            element.chooseKey=rstInfo.THINKNESS_VALUE;
                            break;
                        default:
                            break;
                    }
                });
                rstInfo.SYN_RECOMMEND_CUR=parseInt(dataList[21],16);//电流推荐值
                rstInfo.SYN_WELD_CUR =parseInt(dataList[20],16);//电流
                rstInfo.THINKNESS_VALUE = parseInt(dataList[17],16);
                rstInfo.TIG_MIN_THICHNESS =parseInt(dataList[27],16);//最小厚度值
                rstInfo.TIG_MAX_THICHNESS =parseInt(dataList[26],16);//最大厚度值
                rstInfo.TIGSYN_MIN_CUR=parseInt(dataList[37],16);//10;
                rstInfo.TIGSYN_MAX_CUR=parseInt(dataList[36],16);//byte1Bean.pfc==1?200:140;
               
                rstInfo.initBean=byte1Bean;//包含很多焊接状态和单位等
                
                rstInfo.slowDownTime =parseInt(dataList[18],16);//缓降时间
                rstInfo.sdTime_min=parseInt(dataList[35],16);//0
                rstInfo.sdTime_max=parseInt(dataList[34],16);//100
                rstInfo.postGasTime =parseInt(dataList[19],16);//后送气时间
                return  rstInfo;
            }
            //假如有改动注意  weldDirctive.mma 617行也要考虑
            function changeToOldMmaRealData(receiveBleData,pageFrom){
                receiveBleData=receiveBleData.replace(/\s*/g,"");
                let datas = '';
                if('memory' == pageFrom || pageFrom=='hisweldlist'){
                    datas =receiveBleData.substring(18,receiveBleData.length);
                }else{
                    datas =receiveBleData.substring(10,receiveBleData.length);
                }
                var dataList = [];
                for(var i=0;i<datas.length;i+=4){
                    dataList.push(datas.slice(i,i+4));
                }
                console.log(dataList)
                //直接开始赋值
                var rstInfo={};
                rstInfo.nowTypeList=weldParam.mmaTypeList;
                rstInfo.weldType='MMA';
                rstInfo.weldTypeNum=BASE_CONFIG.callWeldTypeData.mma.newIndex;//这个和首页里的配对
                // var byte1Bean = num16To2Arr(arrayList[2],'MMA',pageFrom);
                // //拆解成
                // var  arrthree= num16To2ArrSpecial03(arrayList[3]);
                
                let t0List = ((Array(16).join(0) + parseInt(dataList[0],16).toString(2)).slice(-16)).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' '); 
                var byte1Bean ={};
                    byte1Bean.isReadyFlag=`${t0List[8]}${t0List[9]}${t0List[10]}` == '011'?1:0,//5-7;
                    byte1Bean.weldStatus=t0List[7];//0:未焊接  1:在焊接
                    // Toast('mma:'+byte1Bean.weldStatus)
                    if(byte1Bean.weldStatus==1){
                        if(pageFrom=='newIndex'){
                            store.state.weldingStatus=1
                            if(store.state.isModbusModal){
                                modbusBeginWeldInfo=receiveBleData;
                                weldingInfoQuery();// clearInterval(store.state.weldingInterval);
                            }
                        }
                    }else{
                        if(modbusIsBeginWeld==1){
                            uploadAppWeldInfoList({
                                BT_ADDRESS: store.state.btAddress, 
                                MODEL_TYPE : rstInfo.weldType,
                                WELD_CONTENT : modbusBeginWeldInfo,
                                BEGIN_TM:modbusBeginWeldTm,
                                END_TM :buidTm(),
                                COST_TM : modbusWeldLongTime,
                                WELD_DATA:modbusBeginWeldCurVol,//电压\电流
                                WELD_CUR:weldingCur,
                                WELD_VOL:weldingVoltage,
                                RECORD_SECOND:new Date().getTime(),//ms 时间戳
                                tenantID:BASE_CONFIG.tenantID
                            });
                            // upLoadDataFuc(receiveBleData,'util','weld_end',{weldTime:modbusWeldLongTime});
                        }
                        modbusBeginWeldTm="";
                        modbusIsBeginWeld=0;//重置
                        modbusWeldLongTime=0;
                        store.state.weldingStatus=0;
                        store.state.getWeldingInfoTimes=0;//重置
                        clearInterval(store.state.weldingInterval);
                    }
                    
                    byte1Bean.unit=t0List[6];//默认是0 ich单位是1 
                    byte1Bean.bitInfoList = {
                        acdc:`${t0List[13]}${t0List[14]}${t0List[15]}`,//交流直流
                        ifvrd:t0List[12],
                        unname:t0List[11],
                        isReady:`${t0List[8]}${t0List[9]}${t0List[10]}`,//7-5
                        iswelding:t0List[7],
                        ichemm:t0List[6]//单位
                    };
                rstInfo.THINKNESS_VALUE=parseInt(dataList[7],16);
                rstInfo.nowTypeList.forEach(element => {
                    switch (element.typeName) {
                        case 'POLATRITY':
                            //直流DC 交流AC
                            element.chooseKey=t0List[15]<2?t0List[15]:0;
                            // alert(element.chooseKey)
                            break;
                        case 'ELECTRODE':
                            element.chooseKey=parseInt(dataList[5],16);
                            break;
                        case 'DIAMETER':
                            element.chooseKey=parseInt(dataList[6],16);
                            break;
                        case 'THICKNESS':
                            element.chooseKey=rstInfo.THINKNESS_VALUE;
                            break;
                        default:
                            break;
                    }
                });
                
                rstInfo.ARC_FORCE_VAL =parseInt(dataList[8],16);
                //    alert(  rstInfo.ARC_FORCE_VAL)
                rstInfo.MMA_RECOMMEND_CURRENT =parseInt(dataList[4],16);;//推荐电流
                rstInfo.MMA_CURRENT_VAL=parseInt(dataList[3],16);;

                // rstInfo.MMA_MIN_CUR=10;
                // rstInfo.MMA_MAX_CUR=byte1Bean.pfc==1?200:110;//2019.07.29
                // rstInfo.MMA_MIN_THICHNESS= arrayList[8] ||0;//板厚最小值
                // rstInfo.MMA_MAX_THICHNESS= arrayList[9] ||13;//板厚最大值
                rstInfo.MMA_MIN_CUR=parseInt(dataList[16],16);
                rstInfo.MMA_MAX_CUR=parseInt(dataList[15],16);//2019.07.29
                rstInfo.MMA_MIN_THICHNESS= parseInt(dataList[14] ||0,16);//板厚最小值
                rstInfo.MMA_MAX_THICHNESS= parseInt(dataList[13] || 13,16);//板厚最大值
                rstInfo.initBean=byte1Bean;//包含很多焊接状态和单位等
                return rstInfo;
            }
            //假如有改动注意  weldDirctive.tigMan 555行也要考虑
            // tigman数据转换机制--去别的地方再做处理
            function changeToOldTigmanRealData(receiveBleData,pageFrom){
                
                // DA E4 0A 03 60 00 00 00 00 00 00 00 00.................
                receiveBleData=receiveBleData.replace(/\s*/g,"");
                let datas ='';
                if(pageFrom=='memory' || pageFrom=='hisweldlist'){
                    datas =receiveBleData.substring(18,receiveBleData.length);
                }else{
                    datas =receiveBleData.substring(10,receiveBleData.length);
                }
                var dataList = [];
                for(var i=0;i<datas.length;i+=4){
                    dataList.push(datas.slice(i,i+4));
                }
                //直接开始赋值
                var rstInfo={};
                rstInfo.nowTypeList=JSON.parse(JSON.stringify(weldParam.tigmanList));
                rstInfo.weldType='TIGMAN';
                rstInfo.weldTypeNum=BASE_CONFIG.callWeldTypeData.tigman.newIndex;//这个和首页里的配对
                let byte0 =((Array(16).join(0) + parseInt(dataList[0],16).toString(2)).slice(-16)).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' '); 
                console.log(byte0,dataList[0])
                //基础数据赋值
                let mode =  parseInt(byte0[14]+byte0[15],2);
                let ifpulse = parseInt(byte0[12],2);
                let modeValue = mode==1?'4T':'2T';
                let ifpulseValue = ifpulse==1?'PULSE':'NOPULSE';
                rstInfo.initBean ={
                    unit:byte0[2],//13	单位	0:mm  1:inch
                    pfc:0, //干嘛的
                    weldStatus:byte0[3],//0:未焊接  1:在焊接,
                    hotStatus:0,
                    flowStatus:0,
                    empty1:0,
                    isReadyFlag:`${byte0[4]}${byte0[5]}${byte0[6]}` == '001'?1:0,//9-11
                    ifhf:parseInt(byte0[13],2),
                    ifpulse:ifpulse,
                    polatrity:parseInt(byte0[8]+byte0[9]+byte0[10],2),
                    mode:mode,
                    nowChooseModel:modeValue+'_'+ifpulseValue+'_DC',//bean.nowChooseModel=bean.modeValue+'_'+bean.ifpulseValue+'_DC';
                    //焊接模式
                    // 0:短焊    1:长焊  2:点焊    3:重复
                    // 0:无高频   1:有高频
                    // 0:非脉冲   1:脉冲
                    // 0:气冷       1:水冷
                    // 0:交流       1:直流
                    // 0:短焊    1:长焊
                    // 焊接电源工作模式
                    // 引弧成功,焊接中
                    // 单位
                    bitInfoList : {
                        tigmanWeldMode:`${byte0[14]}${byte0[15]}`,
                        tigmanPinglv:byte0[13],
                        tigmanMc:byte0[12],
                        tigmanGas:byte0[11],
                        tigmanCurrent:`${byte0[8]}${byte0[9]}${byte0[10]}`,//5-7
                        tigsynWeldMode:byte0[7],//5-7
                        tigMode:`${byte0[4]}${byte0[5]}${byte0[6]}`,//9-11
                        tigIsWeiding:byte0[3],
                        tigUnit:byte0[2]
                    }
                }
                // Toast(pageFrom+'tigman:'+rstInfo.initBean.weldStatus+'isModbusModal='+store.state.isModbusModal)
                if(rstInfo.initBean.weldStatus==1){
                    if(pageFrom=='newIndex'){
                        store.state.weldingStatus=1
                        if(store.state.isModbusModal){
                            modbusBeginWeldInfo=receiveBleData;
                            weldingInfoQuery();// clearInterval(store.state.weldingInterval);
                        }
                    }
                }else{
                    if(modbusIsBeginWeld==1){
                        uploadAppWeldInfoList({
                            BT_ADDRESS: store.state.btAddress, 
                            MODEL_TYPE : rstInfo.weldType,
                            WELD_CONTENT : modbusBeginWeldInfo,
                            BEGIN_TM:modbusBeginWeldTm,
                            END_TM :buidTm(),
                            COST_TM : modbusWeldLongTime,
                            WELD_DATA:modbusBeginWeldCurVol,//电压\电流
                            WELD_CUR:weldingCur,
                            WELD_VOL:weldingVoltage,
                            RECORD_SECOND:new Date().getTime(),//ms 时间戳
                            tenantID:BASE_CONFIG.tenantID
                        });
                        // upLoadDataFuc(receiveBleData,'util','weld_end',{weldTime:modbusWeldLongTime});
                    }
                    modbusBeginWeldTm="";
                    modbusIsBeginWeld=0;//重置
                    modbusWeldLongTime=0;
                    store.state.weldingStatus=0;
                    store.state.getWeldingInfoTimes=0;//重置
                    clearInterval(store.state.weldingInterval);
                }
                rstInfo.nowTypeList.forEach(element => {
                    switch (element.typeName) {
                        case 'MODE':
                            element.chooseKey =rstInfo.initBean.mode;//0:短焊    1:长焊
                            break;
                        case 'POLATRITY':// POLATRITY 20201024 不对应啊 所以值没改
                            element.chooseKey=rstInfo.initBean.polatrity;
                            break;
                        case 'Pulse'://"Pulse" Pluse 20201024 不对应啊 所以值没改
                            element.chooseKey=rstInfo.initBean.ifpulse;//0:非脉冲   1:脉冲
                            break;
                        case 'HF':
                            element.chooseKey=rstInfo.initBean.ifhf//0:无高频   1:有高频
                            break;
                        default:
                            break;
                    }
                });
                //赋值开始  ......
                rstInfo.PRE_GAS_VAL =parseInt(dataList[1],16);//pre_gas
                rstInfo.START_CUR_VAL =parseInt(dataList[3],16);//start_cur_end ?????????????
                rstInfo.STOP_UP_VAL =parseInt(dataList[4],16);//slop_up 缓升时间
                rstInfo.WELD_CUR_VAL =parseInt(dataList[5],16);//weld_cur 焊接电流
                rstInfo.BASE_CUR_VAL =parseInt(dataList[8],16);//base_cur 脉冲基值电流
                rstInfo.PULSE_FRE_VAL =parseInt(dataList[7],16);//pulse_fre 脉冲频率
                rstInfo.DUTY_VAL =parseInt(dataList[6],16);//pulse_duty 脉冲占空比
                rstInfo.SLOP_DOWN_VAL =parseInt(dataList[9],16);//slop_down 缓降时间
                rstInfo.CRATER_CUR_VAL =parseInt(dataList[10],16);//crater_cur ????????? 收弧电流 ?????
                rstInfo.POST_GAS_VAL=parseInt(dataList[11],16);//post_gas 后送气时间
                rstInfo.AC_FRE_VAL =parseInt(dataList[12],16);//ac_fre 交流频率
                rstInfo.AC_DUTY_VAL =parseInt(dataList[13],16);//ac_balance 交流占空比
                //选中
                //赋值开始  先默认第一个元素......
                rstInfo.nowChooseIndex = "0";
                rstInfo.nowChoosedKeyName = tigmanLineMap.get(parseInt('0'));
                rstInfo.paramValue = rstInfo.PRE_GAS_VAL;
                
                return rstInfo;
            }
            // tigsyn数据转换机制 
            function changeToOldTigsynData(receiveBleData){
                console.log(receiveBleData)
                let datas =receiveBleData.substring(6,receiveBleData.length);
                var dataList = [];
                for(var i=0;i<datas.length;i+=4){
                    dataList.push(datas.slice(i,i+4));
                }
                // 0	0	单位	
                //     1	PFC	
                //     2	焊接	
                //     3	过热	
                //     4	过流	
                //     5
                //     6	空	
                //     7	2T4T	
                // 	
                // 
                // 1-0,1,2	    钨棒直径	TIG_diameter
                //  -3,4,5      金属	TIG_material
                // 2		板厚	TIG_thickness
                // 3,4		电流推荐值	TIG_recommend_current
                // 5,6		电流	syn_weld_cur
                // 14		板厚最小值	TIG_min_thickness
                // 15		板厚最大值	TIG_min_thickness
                let migOldHead1 ='da';
                let migOldHead2 ='e3';
                let byte0 = "00";//先默认
                // 钨棒直径+金属
                let temp1 =((Array(3).join(0) + parseInt(dataList[15],16).toString(2)).slice(-3)).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' '); 
                let temp2 =((Array(3).join(0) + parseInt(dataList[16],16).toString(2)).slice(-3)).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' '); 
                let tempByte1 = parseInt(`00${temp2}${temp1}`,2).toString(16);
                let byte1 = (tempByte1+"").length==1?"0"+tempByte1:tempByte1;
                let byte2 = dataList[17].substring(2,4);//直接截取 2字节转一个字节 //板厚;
                let byte34 = dataList[21].substring(2,4)+dataList[21].substring(0,2);;//推荐电流
                let byte56 = dataList[20].substring(2,4)+dataList[20].substring(0,2);//电流;//文档少了，推荐电流
                let byte7 = dataList[27].substring(2,4);//板厚最小值
                let byte8 = dataList[26].substring(2,4);//板厚最大值
                let byte9 = dataList[18].substring(2,4);//缓降时间
                let byte10 = dataList[19].substring(2,4);//后送气时间
                let total =`${migOldHead2}${byte0}${byte1}${byte2}${byte34}${byte56}${byte7}${byte8}${byte9}${byte10}`;
                let crc = crcModelBusClacQuery(total)
                return `${migOldHead1}${total}${crc}`;
            }
            //TODO mma数据转换机制 废弃 直接赋值
            function changeToOldMmaData(receiveBleData){
                console.log(receiveBleData)
                // window.modbusBroastFromApp("0A 03 22 0000 0000 0000 0038 005a 0001 0001 0007 0005 0001 0000 0002 0000 000d 0004 00c8 0010 9ECE");
                let datas =receiveBleData.substring(6,receiveBleData.length);
                var dataList = [];
                for(var i=0;i<datas.length;i+=4){
                    dataList.push(datas.slice(i,i+4));
                }
                //旧
                // 字节
                // byte	位
                // bit	功能定义	
                // 0	0	单位	
                //     1	PFC	
                //     2	焊接	
                //     3	过热	
                //     4	过流	
                //     5~6	空	
                //     7	AC/DC	
                // 1	0
                // 1	焊条种类	MMA_electrode
                //     2
                // 
                // 4	焊条直径	MMA_diameter
                //         空	
                // 2		板厚	MMA_thickness
                // 3		电弧推力	arc_force_val
                // 
                // 5		电流推荐值	MMA_recommend_current
                // 
                // 7		电流	MMA_current_val
                let migOldHead1 ='da';
                let migOldHead2 ='e5';
                let t0List = ((Array(16).join(0) + parseInt(dataList[0],16).toString(2)).slice(-16)).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' '); 
                let tempByte0 = parseInt(`${t0List[15]}0000000`,2).toString(16);
                let byte0 =tempByte0.length>1?tempByte0:`0${tempByte0}`;//集合字节
                //焊条种类
                let tempByte1_0_1 = ((Array(2).join(0) + parseInt(dataList[5],16).toString(2)).slice(-2)).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' ');
                let tempByte1_2_4 = ((Array(3).join(0) + parseInt(dataList[6],16).toString(2)).slice(-3)).replace(/(.{1})/g,'$1 ').replace(/(^\s*)|(\s*$)/g, "").split(' ');
                //焊条种类(0,1) + 焊条直径(2,3,4)
                let temp01 =parseInt(`000${tempByte1_2_4}${tempByte1_0_1}`,2).toString(16);
                let byte1 = (temp01+"").length==1?"0"+temp01:temp01;
                let byte2 = dataList[7].substring(2,4);//直接截取 2字节转一个字节 //板厚
                let byte3 = dataList[8].substring(2,4);//直接截取 2字节转一个字节 //电弧推力
                let byte4 = dataList[4].substring(2,4)+dataList[4].substring(0,2);//电流推荐值
                let byte5 = dataList[3].substring(2,4)+dataList[3].substring(0,2);//电流
                let byte6 = dataList[14].substring(2,4);//板厚最小值
                let byte7 = dataList[13].substring(2,4);//板厚最大值
                let total =`${migOldHead2}${byte0}${byte1}${byte2}${byte3}${byte4}${byte5}${byte6}${byte7}`;
                let crc = crcModelBusClacQuery(total)
                return `${migOldHead1}${total}${crc}`;
            }
            function onlySendFuc(sendDt,pageFrom,crc){
                if(!BASE_CONFIG.TESTFLAG){
                    sendDt=sendDt.toLocaleUpperCase();
                    //对sendDt的crc进行反向操作
                    sendDt = sendDt.substring(0,sendDt.length-4);
                    sendDt=sendDt+crc.substring(2,4)+crc.substring(0,2);
                    if(BASE_CONFIG.ENV_IOS_FLAG){
                        
                        var message = {"method":"handleSendData","sendDt":sendDt};
                        if(window.webkit){
                            upLoadDataFuc(sendDt);
                            window.webkit.messageHandlers.interOp.postMessage(message);
                        }else{
                            console.log('onlySendFuc数据发送至APP失败：',sendDt,pageFrom,crc)
                        }
                    }else{
                        store.state.nowPageFrom=pageFrom?pageFrom:'';
                        if(window.android){
                            //注意这个modbuscrc是倒过来的
                            upLoadDataFuc(sendDt);
                            window.android.callSendDataToBle(pageFrom,sendDt,crc);
                        }else{
                            console.log('onlySendFuc数据发送至APP失败：',sendDt,pageFrom,crc)
                        }
                    }
                    // upLoadDataFuc(sendDt,pageFrom);
                }
            }
            //
            function uploadAppWeldInfoList(info){
                let loginName = localStorage.getItem("wtl_login_email") || '';
                info['EMAIL'] = loginName;//登录账户
                store.state.weldInfo3Days.push(info)
                let params =store.state.weldInfo3Days;
                
                //网络状态 判断
                if(store.state.netWorkStatus=='online'){
                    InterfaceService.batchInsertAppWeld(params,(data)=>{
                        store.state.weldInfo3Days=[];
                        //清空localstorage
                        localStorage.setItem("weldInfo3Days","")
                    },function(data){
                        
                    });  
                }else{
                    //更新localstrage
                    localStorage.setItem('weldInfo3Days',JSON.stringify(params))
                }
            }
            //核心上发函数 发送数据 、当前画面使用路由、类型 、weldTime:modbusWeldLongTime}
            function upLoadDataFuc(sendData,type,params){
                params = params?params:{};
                // Toast({
                //     message: upLoadLastData +"||"+sendData,
                //     position: 'middle',
                //     iconClass: 'icon icon-success',
                //     duration: 1000
                // });
                if(!upLoadLastData){
                    upLoadLastData = sendData
                }else if(upLoadLastData == sendData){
                    //相同的就不要重复记录
                    return;
                }else{
                    upLoadLastData=sendData;
                }
                
                // Toast({
                //     message: 'util:'+store.state.nowConnectAddress,
                //     position: 'middle',
                //     iconClass: 'icon icon-success',
                //     duration: 1500
                // });
                let pInfo ={
                    uuid:store.state.userUuid,
                    allData:sendData,
                    btAddress:store.state.btAddress || BASE_CONFIG.btAddress || '四合一地址',
                    pageName:store.state.nowRouter,
                    type:type?type:'默认Type',
                    commonContent:params.weldTime
                };
                //网络状态 判断
                
                if(store.state.netWorkStatus=='online'){
                    InterfaceService.upLoadData(pInfo,(data)=>{
                        
                    },function(data){
                        
                    });    
                }else if(type == 'weld_end'){
                    //假如是焊接时长 需记录本地三天数据
                    //取出旧的三个 pInfo 放到localstorage
                    store.state.weldInfo3Days.push(pInfo);
                    
                    // this.globalSendMsgToIos("handSaveWrite","weldInfo3Days",JSON.stringify(store.state.weldInfo3Days)); 
                }
            }
            function circleDataSendFuc(indexInfo){
                let sendDt = indexInfo.sendData+indexInfo.crc;
                if(!BASE_CONFIG.TESTFLAG){
                    if(BASE_CONFIG.ENV_IOS_FLAG){
                        var message = {"method":"handleSendData","sendDt":sendDt};
                        window.webkit.messageHandlers.interOp.postMessage(message);
                    }else{
                        store.state.nowPageFrom=pageFrom;
                        window.android.callSendDataToBle(pageFrom,sendDt,indexInfo.crc);
                    }
                    
                }
            }
        }
    }