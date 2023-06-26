
export const _trim = (str: string) => {
    if (!str) return;
    return str.replace(/\s*/g, "");
}
export const _trim_left = (str: string) => {
    if (!str) return;
    return str.replace(/^\s*/, "");
}
export const _trim_right = (str: string) => {
    if (!str) return;
    return str.replace(/(\s*$)/g, "")
}
export const _trim_around = (str: string) => {
    if (!str) return;
    return str.replace(/^\s*|\s*$/g, "");
}

export const isBool = (val: boolean | string): boolean => {
    if (typeof val === "boolean") return val;
    if (val === "true") return true;
    if (val === "false") return false;
    return !!val;
}