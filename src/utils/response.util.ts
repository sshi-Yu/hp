
import { HttpStatusCode } from '../common/enum/http-code.enum';

export class ApiResponse<T> {
    // 请求是否成功
    success: boolean;
    // 状态码
    code: HttpStatusCode;
    // 消息内容
    msg: string;
    // 响应数据
    data?: T;
    // 响应生成时间
    timestamp: number;
    // 响应元信息
    meta?: any;
    // 错误信息
    err?: Error | string

    constructor(success: boolean, code: HttpStatusCode, msg: string, data?: T, meta?: any, err?: Error | string) {
        this.success = success;
        this.code = code;
        if (!msg) {
            this.msg = success ? "success" : "error"
        } else this.msg = msg;
        this.data = data;
        this.timestamp = Date.now();
        this.meta = meta;
        this.err = err;
    }

    // 创建成功响应对象
    static ok<D>(data: D, msg: string = 'success', meta: any): ApiResponse<D> {
        return new ApiResponse(true, HttpStatusCode.OK, msg, data, meta, undefined);
    }

    // 创建服务器错误响应对象
    static error(msg: string = 'server error', data?: any): ApiResponse<null> {
        return new ApiResponse(false, HttpStatusCode.InternalServerError, msg, data, undefined, undefined);
    }

    // 判断响应对象是否为成功状态
    isOk(): boolean {
        return this.success === true;
    }

    // 判断响应对象是否为错误状态
    isError(): boolean {
        return this.success === false;
    }

    // 合并多个响应对象的数据和元信息
    merge(...responses: ApiResponse<T>[]): ApiResponse<T[]> {
        const data: T[] = [];
        const meta: any = {};

        responses.forEach(response => {
            if (response.data) {
                data.push(response.data);
            }
            if (response.meta) {
                Object.assign(meta, response.meta);
            }
        });

        return new ApiResponse(true, HttpStatusCode.OK, 'scuuess', data, meta, undefined);
    }
}