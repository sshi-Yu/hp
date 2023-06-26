
/**
 * @description 生成一个随机的版本号，当数据量较大时不保证版本号的唯一性！！！
 */
export function generateVersionNum(): string {
    const timestamp = new Date().getTime().toString();
    const randomNum = Math.random().toString().substr(2, 4).padEnd(4, '0');
    let version = timestamp + '-' + randomNum; // 在 timestamp 和 randomNum 中加入分隔符 -

    const extraLen = Math.floor(Math.random() * 5) + 5;
    for (let i = 0; i < extraLen; i++) {
        const code = Math.floor(Math.random() * 74) + 48;
        if ((code >= 58 && code <= 64) || (code >= 91 && code <= 96)) {
            i--;
        } else {
            version += String.fromCharCode(code);
        }
        if (i === Math.floor(extraLen / 2)) {
            version += '-'; // 在 version 的中间位置插入分隔符 -
        }
    }

    return version;
}