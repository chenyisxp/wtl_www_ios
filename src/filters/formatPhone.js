export default function formatPhone(str) {
    if(str) {
        return str.substr(0,1) + '****' + str.substr(7,10);
    };
}