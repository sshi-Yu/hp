import { Http2ServerRequest } from "http2"

export const getOS = (req: Http2ServerRequest) => {
    const { "user-agent": userAgent } = req.headers;
    if (userAgent.indexOf("Windows NT 10.0") !== -1) return "Windows 10";
    if (userAgent.indexOf("Windows NT 6.2") !== -1) return "Windows 8";
    if (userAgent.indexOf("Windows NT 6.1") !== -1) return "Windows 7";
    if (userAgent.indexOf("Windows NT 6.0") !== -1) return "Windows Vista";
    if (userAgent.indexOf("Windows NT 5.1") !== -1) return "Windows XP";
    if (userAgent.indexOf("Windows NT 5.0") !== -1) return "Windows 2000";
    if (userAgent.indexOf("Mac") !== -1) return "Mac/iOS";
    if (userAgent.indexOf("X11") !== -1) return "UNIX";
    if (userAgent.indexOf("Linux") !== -1) return "Linux";
    return "Other";
}

export const getEquipment = (req: Http2ServerRequest) => {
    const { "user-agent": userAgent } = req.headers;
    const ua = (userAgent as string).toLocaleLowerCase();
    if (ua.indexOf('android') !== -1) return "Android";
    if (ua.indexOf('windows') !== -1) return "PC";
    if (ua.indexOf('ios') !== -1) return "IOS";
    return "Other";
}

export const getBrowser = (req: Http2ServerRequest) => {
    const { "user-agent": userAgent } = req.headers;
    const ua = (userAgent as string).toLocaleLowerCase();

    let browserT = "Other"
    if (ua.match(/msie/) != null || ua.match(/trident/) != null) {
        browserT = 'IE'
    } else if (ua.match(/firefox/) != null) {
        browserT = 'firefox'
    } else if (ua.match(/ucbrowser/) != null) {
        browserT = 'UC'
    } else if (ua.match(/opera/) != null || ua.match(/opr/) != null) {
        browserT = 'opera'
    } else if (ua.match(/bidubrowser/) != null) {
        browserT = 'baidu'
    } else if (ua.match(/metasr/) != null) {
        browserT = 'sougou'
    } else if (ua.match(/tencenttraveler/) != null || ua.match(/qqbrowse/) != null) {
        browserT = 'QQ'
    } else if (ua.match(/maxthon/) != null) {
        browserT = 'maxthon'
    } else if (ua.match(/chrome/) != null) {
        browserT = 'chrome'
    } else if (ua.match(/safari/) != null) {
        browserT = 'Safari'
    } else {
        browserT = 'others'
    }
    return browserT

}