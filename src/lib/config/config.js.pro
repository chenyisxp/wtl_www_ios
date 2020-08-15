let ROOT_URL = 'https://appassess.greenlandfs.com/';
let BASE_CONFIG = {
    // 服务地址、页面地址
    ROOT_URL : 'https://appassess.greenlandfs.com',
    // 接口超时断开时间
    REQUEST_TIMEOUT : '32000',
    // 弹窗消息延时时间
    MESSAGE_DURATION : '1500',
    // autofocus延时时间
    AUTOFOCUS_DURATION : '500',
    // modal关闭延时时间
    CLOSE_MODAL_DURATION : '200',
    // Key
    CRYPTO_KEY : 'HOPERUNFHDXLLSLZ',
    CRYPTO_KEY_OPEN : true,
    // 图片验证码服务地址
    IMAGE_SERVLET : ROOT_URL + '/proxy/greenlandfs_front/imageServlet',
    // 主服务地址
    SERVICE_ADDRESS : ROOT_URL + '/front/mainactivity',
    // 产品附件服务地址
    ATTACH_SERVICE : ROOT_URL + '/proxy/greenlandfs_front/attachGet?path=',
    // 身份验证
    ID_SWITCH_OPEN : true
};
export {BASE_CONFIG};