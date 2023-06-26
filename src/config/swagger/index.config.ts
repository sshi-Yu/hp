import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from "fs";

/*** 创建swagger.json文件的实现 ***/
export const buildSwaggerConf = (app: INestApplication) => {
    const swaggerConf = new DocumentBuilder()
        .setTitle('My API') // Title of the swagger page/documentation. Defaults to "Nest Express JSON API"
        .setDescription('The description of my API') // Short description of the swagger page/documentation. Defaults to "Express JSON API"
        .setVersion('1.0.0') // Version of the swagger page/documentation. Defaults to "1.0.0"
        .addSecurity("token", {
            type: "apiKey",
            scheme: "basic",
            name: "access-token", // Name of the header. Defaults to "X-Token" (note: this is case-insensitive)
            description: "user token authentication",
            in: "headers"
        })
        .build();

        const document = SwaggerModule.createDocument(app, swaggerConf); // The swagger document is built from the configuration provided above. The result of this call is an object
        SwaggerModule.setup('api-docs', app, document); // The swagger page is displayed in the browser. The URL for the page can be requested with

        // 创建文件写入swagger.json的实现
        fs.writeFileSync('swagger.json', JSON.stringify(document, null, 2));
}