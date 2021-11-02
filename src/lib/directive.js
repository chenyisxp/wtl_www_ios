/*
    *指令 自定义 
    *
    *
    *
*/ 

export default {
    install(Vue, options) {
    	//手机号码验证正则
        Vue.directive( 'numberOnly' ,{
        	bind: function(el) {
                el.handler = function() {
                    var formatVal = /^\+?[1-9][0-9]*$/;
                    var val = el.value;
                    if(!formatVal.test(val)){
                        var reg = new RegExp(val,'g');
                        el.value = val.replace(reg, 1);
                    }
                }
                el.addEventListener('input', el.handler)
            },
            unbind: function(el) {
                el.removeEventListener('input', el.handler)
            }
        });

        Vue.directive('focus',{
            inserted:function(el){
                el.focus()
            }
        })
     
    }
}

