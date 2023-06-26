import { ValidatorConstraint } from "class-validator";
import { _trim } from "src/utils/string.util";
import { Yup, YupSchema } from "src/utils/yup.util";

@ValidatorConstraint()
export class Valid {
    /**
     * 
     * @param val  {string} 必须，验证参数的值。不传递任何值将被调用代码覆盖。 不要 传递 null 或 undefined 将被调用代码覆盖。 参数名称不能为空字符串。
     * @param param1 
     * @description 通过constraints数组传递校验schema枚举， 默认每个校验只取第一个schema
     * @returns {boolean} 校验成功会返回 true， 否则会抛出异常
     */
    validate(val: string, { constraints: [schema] }: { constraints: YupSchema[] }) {
        if (typeof val === "string") {
            return Yup.valid(Yup.getSchema(schema), _trim(val));
        }
        return Yup.valid(Yup.getSchema(schema), val);
    }
}