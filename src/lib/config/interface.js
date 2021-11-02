let SERVICE_CODE = {
    CUST_GET_PHONE_CODE:'ac010001',
    CUST_REGISTER:'ac010002'
};

let STATE_CODE = {
    CORRECT_CODE : '0000', // 正确码
    CORRECT_CODE_REG : /^[I]/, // 其它状态正确码 以I字母开头的状态信息
    ERROR_CODE : /^(9901|9902|9903|9999)$/, // 错误码 9901,9902,9903,9999 系统错误
    SESSION_TIMEOUT_CODE : '9801', // session超时状态码
    HAS_LOGIN_CODE : '9804' // 单点登录报错
}

export {SERVICE_CODE,STATE_CODE}; 