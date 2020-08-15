export default function stakeHolder(role) {
    switch (role) {
        case '00':
            role = '施工单位授权代表(指定收货人)';
            break;
        case '01':
            role = '施工单位项目经理';
            break;
        case '02':
            role = '施工单位印章管理员';
            break;
        case '10':
            role = '施工监理';
            break;
        case '11':
            role = '施工监理单位印章管理员';
            break;
        case '20':
            role = '项目部材料(设备)工程师';
            break;
        case '21':
            role = '收货方授权代表(项目公司项目经理)';
            break;
        case '22':
            role = '项目公司印章管理员';
            break;
        case '30':
            role = '供应商授权代表';
            break;
        default:
            break;
    }
    return role;
}