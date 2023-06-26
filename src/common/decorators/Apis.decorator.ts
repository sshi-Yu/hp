import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiBodyOptions, ApiOperation, ApiParam, ApiParamOptions, ApiQuery, ApiQueryOptions } from "@nestjs/swagger";
import { OperationObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export function Apis({
    params,
    options,
    bodys,
    querys
}: {
    params?: ApiParams,
    options?: Partial<OperationObject>
    bodys?: ApiBodys,
    querys?: ApiQuerys
}) {
    const _params = [];
    if (Array.isArray(params) && params.length > 0) params.forEach(param => {
        _params.push(ApiParam(param));
    });
    const _bodys = [];
    if (Array.isArray(bodys) && bodys.length > 0) bodys.forEach(body => {
        _bodys.push(ApiBody(body));
    });
    const _querys = [];
    if (Array.isArray(querys) && querys.length > 0) querys.forEach(body => {
        _querys.push(ApiQuery(body));
    });
    return applyDecorators(
        ApiOperation(options),
        ..._params,
        ..._bodys,
        ..._querys
    )
}

export type ApiParams = ApiParamOptions[];
export type ApiBodys = ApiBodyOptions[];
export type ApiQuerys = ApiQueryOptions[];