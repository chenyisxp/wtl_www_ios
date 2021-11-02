export default function supplierRank(level) {
    switch (level) {
        case 'N':
            level = '新进供应商';
            break;
        case 'A':
            level = 'A级供应商';
            break;
        case 'B':
            level = 'B级供应商';
            break;
        case 'C':
            level = 'C级供应商';
            break;
        case 'D':
            level = 'D级供应商';
            break;
        default:
            break;
    }
    return level;
}