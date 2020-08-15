export default function stakeHolderSign(role) {
    switch (role) {
        case '00':
            role = '指定收货人签字';
            break;
        case '01':
            role = '施工单位项目经理签字';
            break;
        case '02':
            role = '施工单位盖项目部章';
            break;
        case '10':
            role = '施工监理签字';
            break;
        case '11':
            role = '监理公司项目部盖章';
            break;
        case '20':
            role = '项目部材料(设备)工程师签字';
            break;
        case '21':
            role = '项目经理签字';
            break;
        case '22':
            role = '项目部盖章';
            break;
        case '25':
            role = '项目部盖章';
            break;
        case '26':
            role = '合约经办人签字';
            break;
        case '27':
            role = '合约总监签字';
            break;
        case '30':
            role = '供应方签字';
            break;
        case '31':
            role = '供应方盖章';
            break;
        case '32':
            role = '供应方签字';
            break;
        case '33':
            role = '供应方盖章';
            break;
        case '43':
            role = '经办人签字';
            break;
        case '44':
            role = '材料公司盖章';
            break;
        default:
            break;
    }
    return role;
}