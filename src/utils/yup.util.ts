
import { BadRequestException } from '@nestjs/common';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { GlobalException } from 'src/common/filters/exception.filter';
import * as yup from 'yup';
import { Schema } from 'yup';

export enum YupSchema {
    EMAIL = 'email',
    PHONE = 'phone',
    QQ = 'qq',
    NUMBER = 'number',
    URL = 'url',
    PASSWORD = 'password',
    ACCOUNT = 'account',
    SIGNATURE ='signature',
}

export class Yup {
    static getSchema(dataType: YupSchema): yup.Schema<any> {
        switch (dataType) {
            case YupSchema.EMAIL:
                return yup.string().email("Please provide a valid email address").lowercase();

            case YupSchema.PHONE:
                return yup.string().matches(/(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}/, { message: "Must be a valid mobile phone number" });

            case YupSchema.QQ:
                return yup.string().matches(/[1-9][0-9]{4,}/, "Please provide a valid QQ number");

            case YupSchema.NUMBER:
                return yup.number().typeError("Please provide values of numeric type that are greater than 0 and less than 29999").moreThan(0).lessThan(29999);

            case YupSchema.URL:
                return yup.string().url("Please provide a valid URL").max(200);

            case YupSchema.PASSWORD:
                return yup.string().matches(/[A-Z]\w{5,11}/, "The userPassword must start with a uppercase letter and contain only letters, digits, and underscores (_)");

            case YupSchema.ACCOUNT:
                return yup.string().matches(/[A-Z][a-zA-Z0-9_]{4,11}/, "The userAccount must start with a uppercase letter and contain 5 to 12 letters and digits and underscores");

            case YupSchema.SIGNATURE:
                return yup.string().min(6, "The signature must be no less than 6 characters").max(99, "The signature must be no more than 1000 characters");

            default:
                return yup.string().required();
        }
    }

    static valid(schema: Schema, val: unknown) {
        try {
            return schema.validateSync(val);
        } catch (error) {
            throw new BadRequestException(error.errors); // todo: better exception type? or todo: better message? or todo: better stack trace? 或者使
        }
    }
}
