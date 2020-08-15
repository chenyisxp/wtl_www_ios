export default function venderProductStatus(status, type) {
    const allStatus = {
        online: {
            '2': '已上架'
        },
        offline: {
            '0': '待上架',
            '1': '已提交申请',
            '3': '申请被驳回',
            '4': '已下架',
        }
    }

    return type ? allStatus[type][status] : status
}