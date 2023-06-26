import { Injectable, PlainLiteralObject } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ConfigService {
    private readonly config: PlainLiteralObject;

    constructor() {
        const configPath = path.join(__dirname, '../../conf.json');
        const configFile = fs.readFileSync(configPath, 'utf-8');
        this.config = JSON.parse(configFile);
    }

    get(key?: string): any {
        if (!key) {
            return this.config;
        }
        return this.config[key];
    }
}

export interface Conf {
    user: {
        superAdmin: {
            nickname: string,
            account: string,
            password: string
        }
    },
    role: {
        superAdmin: {
            rolename: string,
            rolekey: string,
            remark: string
        }
    },
    file: {
        image: {
            type: {
                [key: string]: string
            }
        }
    }
}