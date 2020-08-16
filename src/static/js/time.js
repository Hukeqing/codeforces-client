export function timeCycle(time) {
    let unixTimestamp = new Date(time * 1000);
    let Y = unixTimestamp.getFullYear(),
        M = ((unixTimestamp.getMonth() + 1) > 10 ? (unixTimestamp.getMonth() + 1) : '0' + (unixTimestamp.getMonth() + 1)),
        D = (unixTimestamp.getDate() > 10 ? unixTimestamp.getDate() : '0' + unixTimestamp.getDate()),
        h = (unixTimestamp.getHours() < 10) ? "0" + unixTimestamp.getHours() : unixTimestamp.getHours(),
        min = (unixTimestamp.getMinutes() < 10) ? "0" + unixTimestamp.getMinutes() : unixTimestamp.getMinutes(),
        s = (unixTimestamp.getSeconds() < 10) ? "0" + unixTimestamp.getSeconds() : unixTimestamp.getSeconds();
    return Y + '年' + M + '月' + D + "日 " + h + ":" + min + ":" + s;
}
